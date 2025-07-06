import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Download, Plus, Building, Users, Trophy, Target, BarChart3, FileText } from "lucide-react";
import ComprehensiveSportsSelector from "@/components/comprehensive-sports-selector";
import OrganizationFormEnhanced from "@/components/organization-form-enhanced";
import * as XLSX from "xlsx";

export default function ComprehensiveSportsManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [userSportsDialogOpen, setUserSportsDialogOpen] = useState(false);
  const [orgDialogOpen, setOrgDialogOpen] = useState(false);
  const [selectedUserSports, setSelectedUserSports] = useState<string[]>([]);

  // Fetch current user
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false
  });

  // Fetch comprehensive analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/comprehensive"],
    retry: false
  });

  // Update user sports interests
  const updateUserSportsMutation = useMutation({
    mutationFn: async (sports: string[]) => {
      return await apiRequest("PUT", "/api/user/sports-interests", { interests: sports });
    },
    onSuccess: () => {
      toast({
        title: "Sports Updated",
        description: "Your sports interests have been updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/comprehensive"] });
      setUserSportsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update sports interests",
        variant: "destructive"
      });
    }
  });

  // Create organization
  const createOrganizationMutation = useMutation({
    mutationFn: async (orgData: any) => {
      return await apiRequest("POST", "/api/organizations", orgData);
    },
    onSuccess: () => {
      toast({
        title: "Organization Created",
        description: "Your organization has been created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/comprehensive"] });
      setOrgDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive"
      });
    }
  });

  // Export comprehensive analytics for College Sports League Kerala
  const exportComprehensiveAnalytics = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Overview sheet
      const overviewData = [
        ['College Sports League Kerala 2025-2026 - Comprehensive Report'],
        ['Generated on:', new Date().toLocaleDateString()],
        [''],
        ['Summary Statistics:'],
        ['Total Users:', analytics?.totalUsers || 0],
        ['Total Organizations:', analytics?.totalOrganizations || 0],
        ['Sports Categories Covered:', Object.keys(analytics?.usersBySports || {}).length],
        ['Districts Covered:', Object.keys(analytics?.districtAnalytics || {}).length]
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overviewData), 'Overview');

      // Users by sports (all 9 categories)
      const usersSportsData = [
        ['🌊 Water Sports', '', '', ''],
        ['Sport', 'Participating Users', 'Organizations', 'Organizations with Facilities'],
        ...Object.entries(analytics?.usersBySports || {})
          .filter(([sport]) => sport.includes('Water') || sport.includes('Swimming') || sport.includes('Vallam'))
          .map(([sport, users]) => [
            sport,
            users,
            analytics?.organizationsBySports?.[sport] || 0,
            analytics?.organizationsWithFacilities?.[sport] || 0
          ]),
        [''],
        ['🏠 Indoor Sports', '', '', ''],
        ['Sport', 'Participating Users', 'Organizations', 'Organizations with Facilities'],
        ...Object.entries(analytics?.usersBySports || {})
          .filter(([sport]) => ['Badminton', 'Basketball', 'Boxing', 'Carrom', 'Chess', 'Futsal', 'Judo', 'Karate', 'Snooker', 'Billiards', 'Table Tennis', 'Volleyball (Indoor)'].some(indoor => sport.includes(indoor)))
          .map(([sport, users]) => [
            sport,
            users,
            analytics?.organizationsBySports?.[sport] || 0,
            analytics?.organizationsWithFacilities?.[sport] || 0
          ]),
        [''],
        ['🌳 Outdoor Field Sports', '', '', ''],
        ['Sport', 'Participating Users', 'Organizations', 'Organizations with Facilities'],
        ...Object.entries(analytics?.usersBySports || {})
          .filter(([sport]) => ['Football', 'Cricket', 'Athletics', 'Archery', 'Baseball 5', 'Softball', 'Handball', 'Kabaddi', 'Kho-Kho', 'Tug of War'].some(outdoor => sport.includes(outdoor)))
          .map(([sport, users]) => [
            sport,
            users,
            analytics?.organizationsBySports?.[sport] || 0,
            analytics?.organizationsWithFacilities?.[sport] || 0
          ]),
        [''],
        ['🛶 Traditional Kerala Sports', '', '', ''],
        ['Sport', 'Participating Users', 'Organizations', 'Organizations with Facilities'],
        ...Object.entries(analytics?.usersBySports || {})
          .filter(([sport]) => sport.includes('Vallam') || sport.includes('Kalaripayattu') || sport.includes('Kuttiyum') || sport.includes('Onathallu'))
          .map(([sport, users]) => [
            sport,
            users,
            analytics?.organizationsBySports?.[sport] || 0,
            analytics?.organizationsWithFacilities?.[sport] || 0
          ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(usersSportsData), 'Sports Participation');

      // League readiness report
      const leagueData = [
        ['College Sports League Kerala 2025-2026 - League Readiness'],
        ['Sport', 'Ready Organizations', 'Total Capacity', 'Maintenance Score (%)', 'Booking Notice (days)', 'League Viability'],
        ...(analytics?.leagueReadiness || []).map(item => [
          item.sport,
          item.readyOrganizations,
          item.totalCapacity,
          item.maintenanceScore,
          item.averageBookingNotice,
          item.readyOrganizations >= 8 ? 'HIGH' : item.readyOrganizations >= 4 ? 'MEDIUM' : 'LOW'
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(leagueData), 'League Readiness');

      // Sponsor ROI Analysis
      const sponsorData = [
        ['Sponsor ROI Analysis for College Sports League Kerala'],
        ['Sport', 'Participating Users', 'Estimated Audience', 'Organizations with Facilities', 'Total Facility Capacity', 'Avg Ticket Revenue (₹)', 'Sponsor Value Rating'],
        ...(analytics?.sponsorROIData || []).map(item => [
          item.sport,
          item.participatingUsers,
          item.estimatedAudience,
          item.organizationsWithFacilities,
          item.facilityCapacity,
          item.averageTicketRevenue,
          item.estimatedAudience > 200 ? 'HIGH VALUE' : item.estimatedAudience > 100 ? 'MEDIUM VALUE' : 'EMERGING'
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sponsorData), 'Sponsor ROI');

      // District Analysis
      const districtData = [
        ['District-wise Sports Analysis'],
        ['District', 'Total Users', 'Total Organizations', 'Top Sport 1', 'Top Sport 2', 'Top Sport 3', 'League Hosting Potential'],
        ...Object.entries(analytics?.districtAnalytics || {}).map(([district, data]) => [
          district,
          data.users,
          data.organizations,
          data.topSports[0] || '',
          data.topSports[1] || '',
          data.topSports[2] || '',
          data.organizations >= 5 ? 'HIGH' : data.organizations >= 2 ? 'MEDIUM' : 'LOW'
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(districtData), 'District Analysis');

      // Facility Infrastructure Report
      const facilitiesData = [
        ['Facility Infrastructure Report'],
        ['Sport', 'Total Organizations', 'Owned Facilities', 'Rented Facilities', 'Partnership Facilities', 'Total Capacity', 'Avg Hourly Rate (₹)', 'Facilities Needing Repair', 'Infrastructure Score'],
        ...Object.entries(analytics?.facilitiesReport || {}).map(([sport, report]) => [
          sport,
          report.totalOrganizations,
          report.ownedFacilities,
          report.rentedFacilities,
          report.partnershipFacilities,
          report.totalCapacity,
          report.averageHourlyRate,
          report.facilitiesNeedingRepair,
          Math.round(((report.ownedFacilities + report.rentedFacilities + report.partnershipFacilities) / Math.max(1, report.totalOrganizations)) * 100)
        ])
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(facilitiesData), 'Facility Infrastructure');

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `College_Sports_League_Kerala_2025-2026_Report_${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Export Successful",
        description: `Comprehensive report exported as ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export comprehensive analytics data",
        variant: "destructive",
      });
    }
  };

  if (analyticsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprehensive Sports Management System</h1>
            <p className="text-gray-600 mt-2">
              9-Category sports system with facility management for College Sports League Kerala 2025-2026
            </p>
          </div>
          <div className="flex gap-4">
            <Dialog open={userSportsDialogOpen} onOpenChange={setUserSportsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Update My Sports
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Your Sports Interests</DialogTitle>
                </DialogHeader>
                <ComprehensiveSportsSelector
                  selectedSports={selectedUserSports}
                  onSportsChange={setSelectedUserSports}
                  maxSelections={10}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setUserSportsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => updateUserSportsMutation.mutate(selectedUserSports)}
                    disabled={updateUserSportsMutation.isPending}
                  >
                    {updateUserSportsMutation.isPending ? "Updating..." : "Update Sports"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={orgDialogOpen} onOpenChange={setOrgDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Sports Organization</DialogTitle>
                </DialogHeader>
                <OrganizationFormEnhanced
                  onSubmit={(data) => createOrganizationMutation.mutate(data)}
                  onCancel={() => setOrgDialogOpen(false)}
                  isLoading={createOrganizationMutation.isPending}
                />
              </DialogContent>
            </Dialog>

            <Button onClick={exportComprehensiveAnalytics} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Kerala League Report
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Sports Categories</TabsTrigger>
            <TabsTrigger value="facilities">Facility Management</TabsTrigger>
            <TabsTrigger value="league">League Readiness</TabsTrigger>
            <TabsTrigger value="sponsors">Sponsor ROI</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered athletes and coaches
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalOrganizations || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Sports clubs and academies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sports Categories</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">9</div>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive sport categories
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kerala Districts</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Object.keys(analytics?.districtAnalytics || {}).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Districts with participation
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Sports by Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics?.usersBySports || {})
                      .sort(([,a], [,b]) => (b as number) - (a as number))
                      .slice(0, 5)
                      .map(([sport, users]) => (
                        <div key={sport} className="flex justify-between items-center">
                          <span className="text-sm">{sport}</span>
                          <Badge variant="secondary">{users as number} users</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Districts by Organizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(analytics?.districtAnalytics || {})
                      .sort(([,a], [,b]) => (b as any).organizations - (a as any).organizations)
                      .slice(0, 5)
                      .map(([district, data]) => (
                        <div key={district} className="flex justify-between items-center">
                          <span className="text-sm">{district}</span>
                          <Badge variant="secondary">{(data as any).organizations} orgs</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sports Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>9-Category Sports Classification System</CardTitle>
                <CardDescription>
                  Comprehensive categorization covering traditional Kerala sports, emerging sports, and Olympic events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: "🌊", name: "Water Sports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Water') || sport.includes('Swimming') || sport.includes('Vallam')).length },
                    { icon: "🏠", name: "Indoor Sports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => ['Badminton', 'Basketball', 'Chess'].some(indoor => sport.includes(indoor))).length },
                    { icon: "🌳", name: "Outdoor Field Sports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => ['Football', 'Cricket', 'Athletics'].some(outdoor => sport.includes(outdoor))).length },
                    { icon: "🤸", name: "Gymnastics & Fitness", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Gymnastics') || sport.includes('Yoga')).length },
                    { icon: "🚴", name: "Cycling", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Cycling') || sport.includes('BMX')).length },
                    { icon: "🎯", name: "Precision Sports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Archery') || sport.includes('Shooting')).length },
                    { icon: "🥋", name: "Combat Sports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Boxing') || sport.includes('Karate') || sport.includes('Kalaripayattu')).length },
                    { icon: "🛶", name: "Traditional Kerala", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Vallam') || sport.includes('Kalaripayattu')).length },
                    { icon: "🎮", name: "Mind Games & Esports", count: Object.entries(analytics?.usersBySports || {}).filter(([sport]) => sport.includes('Chess') || sport.includes('Esports')).length }
                  ].map((category) => (
                    <Card key={category.name} className="border-l-4 border-l-primary/30">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <div className="font-semibold">{category.name}</div>
                              <div className="text-sm text-gray-600">{category.count} active sports</div>
                            </div>
                          </div>
                          <Badge variant="outline">{category.count}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Facility Infrastructure Report</CardTitle>
                <CardDescription>
                  Facility availability and readiness for competitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics?.facilitiesReport || {}).map(([sport, report]) => (
                    <div key={sport} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{sport}</h4>
                        <Badge variant={report.totalCapacity > 200 ? "default" : "secondary"}>
                          {report.totalCapacity} capacity
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Total Organizations</div>
                          <div className="font-semibold">{report.totalOrganizations}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">With Facilities</div>
                          <div className="font-semibold">{report.ownedFacilities + report.rentedFacilities + report.partnershipFacilities}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Rate/Hour</div>
                          <div className="font-semibold">₹{report.averageHourlyRate}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Need Repair</div>
                          <div className="font-semibold text-red-600">{report.facilitiesNeedingRepair}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* League Readiness Tab */}
          <TabsContent value="league" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>College Sports League Kerala 2025-2026 Readiness</CardTitle>
                <CardDescription>
                  Assessment of sports readiness for league competitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analytics?.leagueReadiness || []).map((item) => (
                    <div key={item.sport} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">{item.sport}</h4>
                        <Badge variant={
                          item.readyOrganizations >= 8 ? "default" :
                          item.readyOrganizations >= 4 ? "secondary" : "destructive"
                        }>
                          {item.readyOrganizations >= 8 ? "HIGH" :
                           item.readyOrganizations >= 4 ? "MEDIUM" : "LOW"} VIABILITY
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Ready Organizations</div>
                          <div className="font-semibold">{item.readyOrganizations}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Total Capacity</div>
                          <div className="font-semibold">{item.totalCapacity}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Maintenance Score</div>
                          <div className="font-semibold">{item.maintenanceScore}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Booking Notice</div>
                          <div className="font-semibold">{item.averageBookingNotice} days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sponsor ROI Tab */}
          <TabsContent value="sponsors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sponsor ROI Analysis</CardTitle>
                <CardDescription>
                  Revenue and audience potential for sponsor partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analytics?.sponsorROIData || []).map((item) => (
                    <div key={item.sport} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">{item.sport}</h4>
                        <Badge variant={
                          item.estimatedAudience > 200 ? "default" :
                          item.estimatedAudience > 100 ? "secondary" : "outline"
                        }>
                          {item.estimatedAudience > 200 ? "HIGH VALUE" :
                           item.estimatedAudience > 100 ? "MEDIUM VALUE" : "EMERGING"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Participants</div>
                          <div className="font-semibold">{item.participatingUsers}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Est. Audience</div>
                          <div className="font-semibold">{item.estimatedAudience}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Orgs with Facilities</div>
                          <div className="font-semibold">{item.organizationsWithFacilities}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Facility Capacity</div>
                          <div className="font-semibold">{item.facilityCapacity}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Avg Ticket Revenue</div>
                          <div className="font-semibold">₹{item.averageTicketRevenue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}