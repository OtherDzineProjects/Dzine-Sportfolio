import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, Building, TrendingUp, Award, MapPin, FileText, Plus, Edit } from "lucide-react";
import * as XLSX from 'xlsx';

import KeralasSportsQuestionnaire from "@/components/kerala-sports-questionnaire";
import { KERALA_SPORTS_CATEGORIES, KERALA_DISTRICTS } from "@/lib/kerala-sports";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [keralaQuestionnaireOpen, setKeralaQuestionnaireOpen] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [questionnaireType, setQuestionnaireType] = useState<"user" | "organization">("user");
  const [organizationId, setOrganizationId] = useState<string>("");

  // Get current user
  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  // Get analytics data
  const { data: analytics = {
    usersBySports: {},
    organizationsBySports: {},
    organizationsWithFacilities: {},
    totalUsers: 0,
    totalOrganizations: 0
  }, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  }) as { 
    data: {
      usersBySports: Record<string, number>;
      organizationsBySports: Record<string, number>;
      organizationsWithFacilities: Record<string, number>;
      totalUsers: number;
      totalOrganizations: number;
    },
    isLoading: boolean 
  };

  // Get user organizations for organization questionnaire
  const { data: userOrgs = [] } = useQuery({
    queryKey: ["/api/user-organizations"],
    enabled: !!user,
  }) as { data: Array<{ id: number; name: string }> };

  // Get existing questionnaire response
  const { data: existingResponse = {} } = useQuery({
    queryKey: ["/api/questionnaire-response"],
    enabled: !!user,
  }) as { data: { responses?: { field?: string[], track?: string[], combat?: string[], indoor?: string[] } } };

  // Save questionnaire mutation
  const saveQuestionnaireMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/questionnaire", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sports questionnaire saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questionnaire-response"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setQuestionnaireOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save questionnaire",
        variant: "destructive",
      });
    },
  });

  // Update sports interests mutation
  const updateSportsInterestsMutation = useMutation({
    mutationFn: async (interests: string[]) => {
      return await apiRequest("PUT", "/api/user/sports-interests", { interests });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Sports interests updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sports interests",
        variant: "destructive",
      });
    },
  });

  // Update Kerala profile mutation
  const updateKeralaProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", "/api/user/kerala-profile", {
        district: data.district,
        ageGroup: data.ageGroup,
        sportCategories: {
          primary: data.primaryCategories,
          trackAndField: data.trackAndFieldSubcategories
        },
        skillLevel: data.skillLevel,
        sportsGoal: data.goal,
        preferredVenue: data.preferredVenue,
        sportsInterests: [...data.primaryCategories, ...data.trackAndFieldSubcategories]
      });
    },
    onSuccess: () => {
      toast({
        title: "Kerala Profile Updated!",
        description: "Your sports profile has been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setKeralaQuestionnaireOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update Kerala profile",
        variant: "destructive",
      });
    },
  });

  // Initialize selected sports from existing response
  useEffect(() => {
    if (existingResponse && existingResponse.responses) {
      const allSports = [
        ...(existingResponse.responses.field || []),
        ...(existingResponse.responses.track || []),
        ...(existingResponse.responses.combat || []),
        ...(existingResponse.responses.indoor || [])
      ];
      setSelectedSports(allSports);
    }
  }, [existingResponse]);

  const handleSportToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleQuestionnaireSubmit = () => {
    const categorizedSports = {
      field: selectedSports.filter(sport => OLYMPIC_SPORTS.field.includes(sport)),
      track: selectedSports.filter(sport => OLYMPIC_SPORTS.track.includes(sport)),
      combat: selectedSports.filter(sport => OLYMPIC_SPORTS.combat.includes(sport)),
      indoor: selectedSports.filter(sport => OLYMPIC_SPORTS.indoor.includes(sport))
    };

    const requestData = {
      responseType: questionnaireType,
      responses: categorizedSports,
      ...(questionnaireType === "organization" && organizationId && { organizationId: parseInt(organizationId) })
    };

    saveQuestionnaireMutation.mutate(requestData);
    
    // Also update user's sports interests
    updateSportsInterestsMutation.mutate(selectedSports);
  };

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      // Analytics Summary Sheet
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Users', analytics.totalUsers || 0],
        ['Total Organizations', analytics.totalOrganizations || 0],
        ['', ''],
        ['Users by Sports', ''],
        ...Object.entries(analytics.usersBySports || {}).map(([sport, count]) => [sport, count]),
        ['', ''],
        ['Organizations by Sports', ''],
        ...Object.entries(analytics.organizationsBySports || {}).map(([sport, count]) => [sport, count]),
        ['', ''],
        ['Organizations with Facilities', ''],
        ...Object.entries(analytics.organizationsWithFacilities || {}).map(([sport, count]) => [sport, count])
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Analytics Summary');
      
      // Kerala Committee Planning Sheet
      const keralaData = [
        ['Sports Category', 'Total Users', 'Total Organizations', 'Organizations with Facilities', 'League Potential'],
        ...Object.keys(analytics.usersBySports || {}).map(sport => [
          sport,
          analytics.usersBySports?.[sport] || 0,
          analytics.organizationsBySports?.[sport] || 0,
          analytics.organizationsWithFacilities?.[sport] || 0,
          (analytics.usersBySports?.[sport] || 0) >= 50 && (analytics.organizationsWithFacilities?.[sport] || 0) >= 3 ? 'High' : 
          (analytics.usersBySports?.[sport] || 0) >= 25 && (analytics.organizationsWithFacilities?.[sport] || 0) >= 2 ? 'Medium' : 'Low'
        ])
      ];
      
      const keralaWs = XLSX.utils.aoa_to_sheet(keralaData);
      XLSX.utils.book_append_sheet(wb, keralaWs, 'Kerala Committee Planning');
      
      // Sponsor ROI Analysis Sheet
      const sponsorData = [
        ['Sports Category', 'User Engagement Score', 'Facility Coverage', 'ROI Potential', 'Recommended Investment'],
        ...Object.keys(analytics.usersBySports || {}).map(sport => {
          const users = analytics.usersBySports?.[sport] || 0;
          const facilities = analytics.organizationsWithFacilities?.[sport] || 0;
          const engagementScore = Math.min(100, (users / 2));
          const coverageScore = Math.min(100, (facilities * 10));
          const roiScore = (engagementScore + coverageScore) / 2;
          
          return [
            sport,
            `${engagementScore.toFixed(1)}%`,
            `${coverageScore.toFixed(1)}%`,
            roiScore >= 70 ? 'High' : roiScore >= 40 ? 'Medium' : 'Low',
            roiScore >= 70 ? '₹5-10 Lakhs' : roiScore >= 40 ? '₹2-5 Lakhs' : '₹1-2 Lakhs'
          ];
        })
      ];
      
      const sponsorWs = XLSX.utils.aoa_to_sheet(sponsorData);
      XLSX.utils.book_append_sheet(wb, sponsorWs, 'Sponsor ROI Analysis');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Sportfolio_Analytics_${timestamp}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, filename);
      
      toast({
        title: "Export Successful",
        description: `Analytics data exported to ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access analytics.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const usersBySportsData = Object.entries(analytics.usersBySports || {}).map(([sport, count]) => ({
    sport,
    users: count
  }));

  const organizationsBySportsData = Object.entries(analytics.organizationsBySports || {}).map(([sport, count]) => ({
    sport,
    organizations: count
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sports Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive sports data analysis for Kerala committee planning and sponsor ROI</p>
          </div>
          <div className="flex gap-4">
            <Dialog open={keralaQuestionnaireOpen} onOpenChange={setKeralaQuestionnaireOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {user?.district ? "Update" : "Setup"} Kerala Sports Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <KeralasSportsQuestionnaire
                  onSubmit={(data) => updateKeralaProfileMutation.mutate(data)}
                  onClose={() => setKeralaQuestionnaireOpen(false)}
                  initialData={{
                    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
                    district: user?.district || "",
                    ageGroup: "", // Calculate from user data or ask
                    primaryCategories: user?.sportCategories?.primary || [],
                    trackAndFieldSubcategories: user?.sportCategories?.trackAndField || [],
                    skillLevel: user?.skillLevel || "",
                    goal: user?.sportsGoal || "",
                    preferredVenue: user?.preferredVenue || ""
                  }}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={questionnaireOpen} onOpenChange={setQuestionnaireOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {existingResponse ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {existingResponse ? "Update" : "Take"} Sports Questionnaire
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Olympic Sports Interest Questionnaire</DialogTitle>
                  <DialogDescription>
                    Select the sports you are interested in or involved with. This helps us provide better analytics and recommendations.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Questionnaire Type</Label>
                      <Select value={questionnaireType} onValueChange={(value: "user" | "organization") => setQuestionnaireType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Personal Interest</SelectItem>
                          <SelectItem value="organization">Organization Profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {questionnaireType === "organization" && (
                      <div>
                        <Label>Select Organization</Label>
                        <Select value={organizationId} onValueChange={setOrganizationId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose organization" />
                          </SelectTrigger>
                          <SelectContent>
                            {userOrgs.map((org: any) => (
                              <SelectItem key={org.id} value={org.id.toString()}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Tabs defaultValue="field" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="field">Field Events</TabsTrigger>
                      <TabsTrigger value="track">Track Events</TabsTrigger>
                      <TabsTrigger value="combat">Combat Sports</TabsTrigger>
                      <TabsTrigger value="indoor">Indoor Sports</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(OLYMPIC_SPORTS).map(([category, sports]) => (
                      <TabsContent key={category} value={category} className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          {sports.map((sport) => (
                            <div key={sport} className="flex items-center space-x-2">
                              <Checkbox
                                id={sport}
                                checked={selectedSports.includes(sport)}
                                onCheckedChange={() => handleSportToggle(sport)}
                              />
                              <Label htmlFor={sport} className="text-sm font-medium">
                                {sport}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">
                      Selected: {selectedSports.length} sports
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setQuestionnaireOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleQuestionnaireSubmit}
                        disabled={saveQuestionnaireMutation.isPending || selectedSports.length === 0}
                      >
                        {saveQuestionnaireMutation.isPending ? "Saving..." : "Save Questionnaire"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Excel Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered athletes & coaches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrganizations || 0}</div>
              <p className="text-xs text-muted-foreground">Sports organizations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sports Categories</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(analytics.usersBySports || {}).length}</div>
              <p className="text-xs text-muted-foreground">Active sports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facilities</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(analytics.organizationsWithFacilities || {}).reduce((a: number, b: number) => a + b, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Available facilities</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Users by Sports Category</CardTitle>
              <CardDescription>Distribution of users across different sports</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersBySportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sport" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizations by Sports</CardTitle>
              <CardDescription>Number of organizations per sport category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={organizationsBySportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sport" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="organizations" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Kerala Committee Planning Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Kerala Committee League Planning
            </CardTitle>
            <CardDescription>
              Analysis for identifying next level leagues and sports development opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.usersBySports || {}).map(([sport, userCount]) => {
                const orgCount = analytics.organizationsBySports?.[sport] || 0;
                const facilityCount = analytics.organizationsWithFacilities?.[sport] || 0;
                
                let leaguePotential = 'Low';
                let badgeColor = 'bg-red-100 text-red-800';
                
                if (userCount >= 50 && facilityCount >= 3) {
                  leaguePotential = 'High';
                  badgeColor = 'bg-green-100 text-green-800';
                } else if (userCount >= 25 && facilityCount >= 2) {
                  leaguePotential = 'Medium';
                  badgeColor = 'bg-yellow-100 text-yellow-800';
                }

                return (
                  <Card key={sport} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{sport}</h4>
                      <Badge className={badgeColor}>{leaguePotential}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Users: {userCount}</div>
                      <div>Organizations: {orgCount}</div>
                      <div>Facilities: {facilityCount}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sponsor ROI Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sponsor ROI Analysis
            </CardTitle>
            <CardDescription>
              Investment recommendations and ROI potential for sports categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left">Sport</th>
                    <th className="border border-gray-300 p-3 text-left">User Engagement</th>
                    <th className="border border-gray-300 p-3 text-left">Facility Coverage</th>
                    <th className="border border-gray-300 p-3 text-left">ROI Potential</th>
                    <th className="border border-gray-300 p-3 text-left">Recommended Investment</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analytics.usersBySports || {}).map(([sport, userCount]) => {
                    const facilityCount = analytics.organizationsWithFacilities?.[sport] || 0;
                    const engagementScore = Math.min(100, (userCount / 2));
                    const coverageScore = Math.min(100, (facilityCount * 10));
                    const roiScore = (engagementScore + coverageScore) / 2;
                    
                    let roiLevel = 'Low';
                    let roiBadgeColor = 'bg-red-100 text-red-800';
                    let investment = '₹1-2 Lakhs';
                    
                    if (roiScore >= 70) {
                      roiLevel = 'High';
                      roiBadgeColor = 'bg-green-100 text-green-800';
                      investment = '₹5-10 Lakhs';
                    } else if (roiScore >= 40) {
                      roiLevel = 'Medium';
                      roiBadgeColor = 'bg-yellow-100 text-yellow-800';
                      investment = '₹2-5 Lakhs';
                    }

                    return (
                      <tr key={sport}>
                        <td className="border border-gray-300 p-3 font-medium">{sport}</td>
                        <td className="border border-gray-300 p-3">{engagementScore.toFixed(1)}%</td>
                        <td className="border border-gray-300 p-3">{coverageScore.toFixed(1)}%</td>
                        <td className="border border-gray-300 p-3">
                          <Badge className={roiBadgeColor}>{roiLevel}</Badge>
                        </td>
                        <td className="border border-gray-300 p-3">{investment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}