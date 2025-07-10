import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Users, 
  Trophy,
  Building,
  Download,
  Settings,
  BarChart3,
  FileText,
  UserPlus,
  Target
} from "lucide-react";

// Sports Categories with Kerala focus
const sportsCategories = [
  "Football", "Cricket", "Basketball", "Volleyball", "Athletics", 
  "Swimming", "Tennis", "Badminton", "Hockey", "Kabaddi", 
  "Boxing", "Wrestling", "Weightlifting", "Table Tennis", "Martial Arts",
  "Gymnastics", "Cycling", "Running", "Javelin", "Discus Throw"
];

// Facility Types
const facilityTypes = [
  "Stadium", "Ground", "Court", "Pool", "Gym", "Track", 
  "Indoor Arena", "Outdoor Field", "Training Center", "Hostel",
  "Medical Center", "Equipment Storage", "Changing Rooms"
];

export default function OrganizationDashboard() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/organization/:id");
  const organizationId = params?.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Check if this is first time accessing organization dashboard
  const [showSportsDialog, setShowSportsDialog] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // Get user info
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Get organization data
  const { data: organizations, isLoading: orgLoading } = useQuery({
    queryKey: ["/api/organizations/owned"],
    enabled: !!user,
  });

  // Get organization members
  const { data: members } = useQuery({
    queryKey: ["/api/organizations/members", organizationId],
    enabled: !!organizationId,
  });

  const currentOrg = organizations?.find(org => org.id.toString() === organizationId) || organizations?.[0];

  // Check if organization needs sports/facility setup
  useEffect(() => {
    if (currentOrg && (!currentOrg.sportsOffered?.length || !currentOrg.facilitiesAvailable?.length)) {
      const hasShownSetup = sessionStorage.getItem(`org_setup_${currentOrg.id}`);
      if (!hasShownSetup) {
        setShowSportsDialog(true);
        setSelectedSports(currentOrg.sportsOffered || []);
        setSelectedFacilities(currentOrg.facilitiesAvailable || []);
      }
    }
  }, [currentOrg]);

  // Update organization sports and facilities
  const updateOrgMutation = useMutation({
    mutationFn: async (data: { sportsOffered: string[], facilitiesAvailable: string[] }) => {
      const result = await apiRequest("PUT", `/api/organizations/${currentOrg.id}`, data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization Updated",
        description: "Sports interests and facilities have been configured successfully.",
      });
      setShowSportsDialog(false);
      sessionStorage.setItem(`org_setup_${currentOrg.id}`, 'true');
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update organization",
        variant: "destructive",
      });
    }
  });

  // Export organization data
  const exportMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("GET", `/api/organizations/${currentOrg.id}/export`);
      return result.json();
    },
    onSuccess: (data) => {
      // Create CSV content
      const csvContent = `Organization Name,${currentOrg.name}
Organization Type,${currentOrg.type}
Sports Offered,"${(currentOrg.sportsOffered || []).join('; ')}"
Facilities Available,"${(currentOrg.facilitiesAvailable || []).join('; ')}"
Total Members,${members?.length || 0}
District,${currentOrg.district}
City,${currentOrg.city}

Member Details:
Name,Email,Role,Sports Interests,Joining Date
${(members || []).map(member => 
  `"${member.firstName} ${member.lastName}",${member.email},${member.role || 'Member'},"${(member.sportsInterests || []).join('; ')}",${member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}`
).join('\n')}`;

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentOrg.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Export Successful",
        description: "Organization data has been downloaded as CSV file.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export organization data",
        variant: "destructive",
      });
    }
  });

  const handleSportsToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleFacilityToggle = (facility: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  const handleSaveConfiguration = () => {
    if (selectedSports.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one sport for your organization.",
        variant: "destructive",
      });
      return;
    }

    updateOrgMutation.mutate({
      sportsOffered: selectedSports,
      facilitiesAvailable: selectedFacilities
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please log in to access your organization dashboard.</p>
            <Button 
              onClick={() => navigate("/login")} 
              className="w-full mt-4"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Organization Found</h3>
              <p className="text-gray-600 mb-4">You haven't created any organizations yet.</p>
              <Button 
                onClick={() => navigate("/create-organization")} 
                className="w-full"
              >
                Create Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentOrg.name}</h1>
                <p className="text-gray-600">{currentOrg.type} • {currentOrg.district}, {currentOrg.city}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {exportMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>Export Data</span>
              </Button>
              <Button
                onClick={() => setShowSportsDialog(true)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organization Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sports Offered */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Sports Offered</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrg.sportsOffered?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {currentOrg.sportsOffered.map(sport => (
                      <Badge key={sport} variant="secondary">{sport}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No sports configured yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Facilities Available */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Facilities Available</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrg.facilitiesAvailable?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {currentOrg.facilitiesAvailable.map(facility => (
                      <Badge key={facility} variant="outline">{facility}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No facilities configured yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Organization Members</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members?.length ? (
                  <div className="space-y-4">
                    {members.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{member.firstName} {member.lastName}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          {member.sportsInterests?.length && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.sportsInterests.slice(0, 3).map(sport => (
                                <Badge key={sport} variant="secondary" className="text-xs">{sport}</Badge>
                              ))}
                              {member.sportsInterests.length > 3 && (
                                <Badge variant="secondary" className="text-xs">+{member.sportsInterests.length - 3} more</Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">{member.role || 'Member'}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No members added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">{members?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sports Offered</span>
                  <span className="font-semibold">{currentOrg.sportsOffered?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Facilities</span>
                  <span className="font-semibold">{currentOrg.facilitiesAvailable?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Established</span>
                  <span className="font-semibold">{currentOrg.establishedYear || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Members
                </Button>
                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sports and Facilities Configuration Dialog */}
      <Dialog open={showSportsDialog} onOpenChange={setShowSportsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Organization Sports & Facilities</DialogTitle>
            <DialogDescription>
              Select the sports your organization offers and facilities available. This helps members and event organizers find suitable organizations.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Sports Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Sports Offered</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {sportsCategories.map(sport => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sport-${sport}`}
                      checked={selectedSports.includes(sport)}
                      onCheckedChange={() => handleSportsToggle(sport)}
                    />
                    <label htmlFor={`sport-${sport}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {sport}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedSports.length} sports
              </p>
            </div>

            {/* Facilities Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Facility className="h-5 w-5" />
                <span>Facilities Available</span>
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {facilityTypes.map(facility => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`facility-${facility}`}
                      checked={selectedFacilities.includes(facility)}
                      onCheckedChange={() => handleFacilityToggle(facility)}
                    />
                    <label htmlFor={`facility-${facility}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: {selectedFacilities.length} facilities
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSportsDialog(false);
                sessionStorage.setItem(`org_setup_${currentOrg.id}`, 'true');
              }}
            >
              Skip for now
            </Button>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={updateOrgMutation.isPending || selectedSports.length === 0}
            >
              {updateOrgMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}