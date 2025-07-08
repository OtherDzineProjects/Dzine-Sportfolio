import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, Edit, Save, Award, Building, Users, FileText, Download, 
  Calendar, MapPin, Phone, Mail, GraduationCap, Briefcase,
  Shield, Star, Trophy, Globe, Plus, ExternalLink, CheckCircle,
  Clock, X, Eye, Settings, BarChart3, CalendarDays
} from "lucide-react";
import { User as UserType } from "@shared/schema";

interface Organization {
  id: number;
  name: string;
  description?: string;
  type: string;
  city?: string;
  state?: string;
  sportsInterests?: string[];
  establishedYear?: number;
  facilityCount?: number;
  memberCount?: number;
  website?: string;
  email?: string;
  phone?: string;
  status: string;
  ownerId: number;
  createdAt: string;
}

interface Achievement {
  id: number;
  title: string;
  description?: string;
  category: string;
  achievementDate: string;
  verificationStatus: string;
  blockchainHash?: string;
  issuedBy?: string;
  metadata?: any;
}

interface OrganizationMember {
  id: number;
  organizationId: number;
  userId: number;
  role: string;
  status: string;
  joinedAt: string;
  organization: Organization;
}

interface UserApproval {
  id: number;
  requestType: string;
  status: string;
  requestedAt: string;
  reviewedAt?: string;
  reviewerId?: number;
  comments?: string;
  metadata?: any;
}

// Olympic Sports Categories
const OLYMPIC_SPORTS = {
  field: [
    'Shot Put', 'Discus Throw', 'Hammer Throw', 'Javelin Throw', 
    'High Jump', 'Pole Vault', 'Long Jump', 'Triple Jump'
  ],
  track: [
    '100m', '200m', '400m', '800m', '1500m', '5000m', '10000m', 'Marathon',
    '110m Hurdles', '400m Hurdles', '3000m Steeplechase', 
    '4x100m Relay', '4x400m Relay', 'Race Walking'
  ],
  combat: [
    'Boxing', 'Wrestling (Freestyle)', 'Wrestling (Greco-Roman)', 'Judo',
    'Taekwondo', 'Karate', 'Fencing'
  ],
  indoor: [
    'Gymnastics (Artistic)', 'Gymnastics (Rhythmic)', 'Weightlifting',
    'Swimming', 'Diving', 'Water Polo', 'Basketball', 'Volleyball',
    'Badminton', 'Table Tennis', 'Tennis', 'Handball', 'Hockey'
  ]
};

export default function UserDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(false);
  const [showQuestionnaireDialog, setShowQuestionnaireDialog] = useState(false);
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  // Fetch user data
  const { data: userProfile, isLoading: userLoading } = useQuery<{ user: UserType; athleteProfile?: any }>({
    queryKey: ["/api/user/profile"],
    retry: false,
  });
  
  const user = userProfile?.user;

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements/user"],
    enabled: !!user,
  });

  // Fetch user organizations (owned)
  const { data: ownedOrganizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["/api/organizations/owned"],
    enabled: !!user,
  });

  // Fetch organization memberships
  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["/api/organizations/memberships"],
    enabled: !!user,
  });

  // Fetch pending approvals
  const { data: approvals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/approvals/user"],
    enabled: !!user,
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/sports"],
    enabled: !!user,
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    dateOfBirth: '',
    educationQualification: '',
    institution: '',
    graduationYear: '',
    currentPosition: '',
    currentOrganization: '',
    workExperience: '',
  });

  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    description: '',
    organizationType: '',
    city: '',
    state: '',
    establishedYear: '',
    website: '',
    email: '',
    phone: '',
    sportsInterests: [] as string[],
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    description: '',
    category: '',
    achievementDate: '',
    issuedBy: '',
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        educationQualification: user.educationQualification || '',
        institution: user.institution || '',
        graduationYear: user.graduationYear ? user.graduationYear.toString() : '',
        currentPosition: user.currentPosition || '',
        currentOrganization: user.currentOrganization || '',
        workExperience: user.workExperience?.toString() || '',
      });

      if (user.sportsInterests && Array.isArray(user.sportsInterests)) {
        setSelectedSports(user.sportsInterests);
      }
    }
  }, [user]);

  // Check if questionnaire is completed
  const questionnaireCompleted = user?.completedQuestionnaire;
  
  // Show questionnaire dialog if not completed
  useEffect(() => {
    if (user && !user.sportsInterests?.length && !questionnaireCompleted) {
      setShowQuestionnaireDialog(true);
    }
  }, [user, questionnaireCompleted]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileForm) => {
      const result = await apiRequest("PUT", "/api/auth/profile", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  // Sports interests mutation
  const updateSportsInterestsMutation = useMutation({
    mutationFn: async (sports: string[]) => {
      const result = await apiRequest("PUT", "/api/auth/sports-interests", { sportsInterests: sports });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Sports Interests Updated",
        description: "Your sports interests have been saved successfully.",
      });
      setShowQuestionnaireDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update sports interests.",
        variant: "destructive",
      });
    },
  });

  // Organization creation mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (data: typeof organizationForm) => {
      const result = await apiRequest("POST", "/api/organizations", {
        ...data,
        establishedYear: data.establishedYear ? parseInt(data.establishedYear) : null,
      });
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization Created",
        description: "Your organization has been created successfully.",
      });
      setShowOrganizationDialog(false);
      setOrganizationForm({
        name: '',
        description: '',
        type: '',
        city: '',
        state: '',
        establishedYear: '',
        website: '',
        email: '',
        phone: '',
        sportsInterests: [],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create organization.",
        variant: "destructive",
      });
    },
  });

  // Achievement creation mutation
  const createAchievementMutation = useMutation({
    mutationFn: async (data: typeof achievementForm) => {
      const result = await apiRequest("POST", "/api/achievements", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement Added",
        description: "Your achievement has been added successfully.",
      });
      setShowAchievementDialog(false);
      setAchievementForm({
        title: '',
        description: '',
        category: '',
        achievementDate: '',
        issuedBy: '',
      });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Add Failed",
        description: error.message || "Failed to add achievement.",
        variant: "destructive",
      });
    },
  });

  // Export analytics data
  const exportAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/export", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `sportfolio-analytics-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Export Successful",
          description: "Analytics data has been exported successfully.",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data.",
        variant: "destructive",
      });
    }
  };

  const handleSportsToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleSportsSubmit = () => {
    updateSportsInterestsMutation.mutate(selectedSports);
  };

  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrganizationMutation.mutate(organizationForm);
  };

  const handleAchievementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAchievementMutation.mutate(achievementForm);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Check if we have a token stored
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // No token, redirect to login
      window.location.href = '/auth-modern';
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Please log in to access your dashboard.</p>
          <button 
            onClick={() => window.location.href = '/auth-modern'}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome, {user.firstName || user.username}!
                </h1>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span>Sportfolio ID: SP{user.id.toString().padStart(6, '0')} | Status:</span>
                  {user.approvalStatus === 'approved' ? (
                    <Badge variant="default">Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/events'}
                className="flex-shrink-0"
              >
                <CalendarDays className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Browse Events</span>
                <span className="md:hidden">Events</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/analytics'}
                className="flex-shrink-0"
              >
                <BarChart3 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Analytics & Reports</span>
                <span className="md:hidden">Analytics</span>
              </Button>
              <Button variant="outline" size="sm" className="flex-shrink-0">
                <Settings className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => window.location.href = '/comprehensive-sports'}
                className="flex-shrink-0"
              >
                <Trophy className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">9-Category Sports System</span>
                <span className="md:hidden">Sports</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportAnalytics}
                disabled={analyticsLoading}
                className="flex-shrink-0"
              >
                <Download className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Export Data</span>
                <span className="md:hidden">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs md:text-sm">Achievements</TabsTrigger>
            <TabsTrigger value="organizations" className="text-xs md:text-sm">Organizations</TabsTrigger>
            <TabsTrigger value="memberships" className="text-xs md:text-sm">Memberships</TabsTrigger>
            <TabsTrigger value="approvals" className="text-xs md:text-sm">Approvals</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details and contact information</CardDescription>
                </div>
                <Button
                  variant={editingProfile ? "default" : "outline"}
                  onClick={() => setEditingProfile(!editingProfile)}
                >
                  {editingProfile ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {editingProfile ? "Save" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Contact Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter full address"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profileForm.state}
                          onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter state"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          value={profileForm.pincode}
                          onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter PIN code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileForm.dateOfBirth}
                          onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                          disabled={!editingProfile}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="educationQualification">Highest Qualification</Label>
                        <Input
                          id="educationQualification"
                          value={profileForm.educationQualification}
                          onChange={(e) => setProfileForm({ ...profileForm, educationQualification: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="e.g., Bachelor's, Master's, PhD"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          value={profileForm.institution}
                          onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter institution name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Graduation Year</Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          value={profileForm.graduationYear}
                          onChange={(e) => setProfileForm({ ...profileForm, graduationYear: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter year"
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Career Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" />
                      Career Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPosition">Current Position</Label>
                        <Input
                          id="currentPosition"
                          value={profileForm.currentPosition}
                          onChange={(e) => setProfileForm({ ...profileForm, currentPosition: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter current position"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentOrganization">Current Organization</Label>
                        <Input
                          id="currentOrganization"
                          value={profileForm.currentOrganization}
                          onChange={(e) => setProfileForm({ ...profileForm, currentOrganization: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Enter organization name"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="workExperience">Work Experience</Label>
                        <Textarea
                          id="workExperience"
                          value={profileForm.workExperience}
                          onChange={(e) => setProfileForm({ ...profileForm, workExperience: e.target.value })}
                          disabled={!editingProfile}
                          placeholder="Describe your work experience"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sports Interests */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Trophy className="h-5 w-5 mr-2" />
                      Sports Interests
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {user.sportsInterests && user.sportsInterests.length > 0 ? (
                        user.sportsInterests.map((sport: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {sport}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No sports interests added yet.</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowQuestionnaireDialog(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update Sports Interests
                    </Button>
                  </div>

                  {editingProfile && (
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sports Achievements</CardTitle>
                  <CardDescription>Track your sports achievements with blockchain verification</CardDescription>
                </div>
                <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Achievement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Achievement</DialogTitle>
                      <DialogDescription>
                        Add a new sports achievement to your profile
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAchievementSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="achievementTitle">Achievement Title</Label>
                        <Input
                          id="achievementTitle"
                          value={achievementForm.title}
                          onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                          placeholder="e.g., Gold Medal in 100m Sprint"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="achievementCategory">Category</Label>
                        <Select
                          value={achievementForm.category}
                          onValueChange={(value) => setAchievementForm({ ...achievementForm, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="field">Field Events</SelectItem>
                            <SelectItem value="track">Track Events</SelectItem>
                            <SelectItem value="combat">Combat Sports</SelectItem>
                            <SelectItem value="indoor">Indoor Sports</SelectItem>
                            <SelectItem value="team">Team Sports</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="achievementDate">Achievement Date</Label>
                        <Input
                          id="achievementDate"
                          type="date"
                          value={achievementForm.achievementDate}
                          onChange={(e) => setAchievementForm({ ...achievementForm, achievementDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuedBy">Issued By</Label>
                        <Input
                          id="issuedBy"
                          value={achievementForm.issuedBy}
                          onChange={(e) => setAchievementForm({ ...achievementForm, issuedBy: e.target.value })}
                          placeholder="e.g., National Athletics Federation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="achievementDescription">Description</Label>
                        <Textarea
                          id="achievementDescription"
                          value={achievementForm.description}
                          onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                          placeholder="Brief description of the achievement"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAchievementDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createAchievementMutation.isPending}
                        >
                          {createAchievementMutation.isPending ? "Adding..." : "Add Achievement"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {achievementsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : achievements && Array.isArray(achievements) && achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement: Achievement) => (
                      <Card key={achievement.id} className="relative">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            {achievement.verificationStatus === 'verified' && (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(achievement.achievementDate).toLocaleDateString()}
                            </span>
                            {achievement.issuedBy && (
                              <span className="flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                {achievement.issuedBy}
                              </span>
                            )}
                          </div>
                          {achievement.blockchainHash && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                                <Shield className="h-3 w-3 mr-1" />
                                Blockchain Verified: {achievement.blockchainHash.substring(0, 16)}...
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No achievements yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Start tracking your sports achievements</p>
                    <Button onClick={() => setShowAchievementDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Achievement
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Organizations</CardTitle>
                  <CardDescription>Organizations you own or manage</CardDescription>
                </div>
                <Dialog open={showOrganizationDialog} onOpenChange={setShowOrganizationDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Organization</DialogTitle>
                      <DialogDescription>
                        Create a new sports organization
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleOrganizationSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="orgName">Organization Name</Label>
                          <Input
                            id="orgName"
                            value={organizationForm.name}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, name: e.target.value })}
                            placeholder="Enter organization name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="orgType">Organization Type</Label>
                          <Select
                            value={organizationForm.organizationType}
                            onValueChange={(value) => setOrganizationForm({ ...organizationForm, organizationType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="club">Sports Club</SelectItem>
                              <SelectItem value="academy">Sports Academy</SelectItem>
                              <SelectItem value="federation">Sports Federation</SelectItem>
                              <SelectItem value="committee">Sports Committee</SelectItem>
                              <SelectItem value="association">Sports Association</SelectItem>
                              <SelectItem value="school">Educational Institution</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgDescription">Description</Label>
                        <Textarea
                          id="orgDescription"
                          value={organizationForm.description}
                          onChange={(e) => setOrganizationForm({ ...organizationForm, description: e.target.value })}
                          placeholder="Brief description of the organization"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="orgCity">City</Label>
                          <Input
                            id="orgCity"
                            value={organizationForm.city}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, city: e.target.value })}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="orgState">State</Label>
                          <Input
                            id="orgState"
                            value={organizationForm.state}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, state: e.target.value })}
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="establishedYear">Established Year</Label>
                          <Input
                            id="establishedYear"
                            type="number"
                            value={organizationForm.establishedYear}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, establishedYear: e.target.value })}
                            placeholder="Year"
                            min="1900"
                            max={new Date().getFullYear()}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="orgEmail">Email</Label>
                          <Input
                            id="orgEmail"
                            type="email"
                            value={organizationForm.email}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, email: e.target.value })}
                            placeholder="organization@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="orgPhone">Phone</Label>
                          <Input
                            id="orgPhone"
                            type="tel"
                            value={organizationForm.phone}
                            onChange={(e) => setOrganizationForm({ ...organizationForm, phone: e.target.value })}
                            placeholder="Phone number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgWebsite">Website (Optional)</Label>
                        <Input
                          id="orgWebsite"
                          type="url"
                          value={organizationForm.website}
                          onChange={(e) => setOrganizationForm({ ...organizationForm, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowOrganizationDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createOrganizationMutation.isPending}
                        >
                          {createOrganizationMutation.isPending ? "Creating..." : "Create Organization"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {orgsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : ownedOrganizations && Array.isArray(ownedOrganizations) && ownedOrganizations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ownedOrganizations.map((org: Organization) => (
                      <Card key={org.id} className="relative">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{org.name}</h4>
                            <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                              {org.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {org.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 mb-2">
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {org.type}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {org.city}, {org.state}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {org.memberCount || 0} members • {org.facilityCount || 0} facilities
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No organizations yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first sports organization</p>
                    <Button onClick={() => setShowOrganizationDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memberships Tab */}
          <TabsContent value="memberships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Memberships</CardTitle>
                <CardDescription>Organizations where you are a member</CardDescription>
              </CardHeader>
              <CardContent>
                {membershipsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : memberships && Array.isArray(memberships) && memberships.length > 0 ? (
                  <div className="space-y-4">
                    {memberships.map((membership: OrganizationMember) => (
                      <Card key={membership.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{membership.organization.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {membership.organization.description}
                              </p>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 mt-2">
                                <span className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  Role: {membership.role}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Joined: {new Date(membership.joinedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={membership.status === 'active' ? 'default' : 'secondary'}>
                                {membership.status}
                              </Badge>
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No memberships yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">You haven't joined any organizations yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Status</CardTitle>
                <CardDescription>Track your pending and approved requests</CardDescription>
              </CardHeader>
              <CardContent>
                {approvalsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : approvals && Array.isArray(approvals) && approvals.length > 0 ? (
                  <div className="space-y-4">
                    {approvals.map((approval: UserApproval) => (
                      <Card key={approval.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{approval.requestType}</h4>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 mt-2">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Requested: {new Date(approval.requestedAt).toLocaleDateString()}
                                </span>
                                {approval.reviewedAt && (
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Reviewed: {new Date(approval.reviewedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {approval.comments && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  {approval.comments}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                approval.status === 'approved' ? 'default' :
                                approval.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {approval.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {approval.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {approval.status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                              {approval.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No approval requests</h3>
                    <p className="text-gray-500 dark:text-gray-400">You haven't submitted any requests for approval</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sports Analytics Dashboard</CardTitle>
                  <CardDescription>Sports participation and facility analytics for Kerala</CardDescription>
                </div>
                <Button
                  onClick={exportAnalytics}
                  disabled={analyticsLoading}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : analytics ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <Users className="h-8 w-8 text-blue-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold">{analytics?.totalUsers || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <Building className="h-8 w-8 text-green-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Organizations</p>
                            <p className="text-2xl font-bold">{analytics?.totalOrganizations || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center">
                          <BarChart3 className="h-8 w-8 text-purple-500" />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sports Categories</p>
                            <p className="text-2xl font-bold">
                              {Object.keys(analytics.usersBySports || {}).length}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Sports Participation Breakdown */}
                    <Card className="md:col-span-2 lg:col-span-3">
                      <CardHeader>
                        <CardTitle>Sports Participation Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-4">Users by Sports</h4>
                            <div className="space-y-2">
                              {Object.entries(analytics.usersBySports || {}).map(([sport, count]) => (
                                <div key={sport} className="flex justify-between items-center">
                                  <span className="text-sm">{sport}</span>
                                  <Badge variant="secondary">{count as number}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-4">Organizations by Sports</h4>
                            <div className="space-y-2">
                              {Object.entries(analytics.organizationsBySports || {}).map(([sport, count]) => (
                                <div key={sport} className="flex justify-between items-center">
                                  <span className="text-sm">{sport}</span>
                                  <Badge variant="secondary">{count as number}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No analytics data</h3>
                    <p className="text-gray-500 dark:text-gray-400">Analytics data will appear here once available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sports Questionnaire Dialog */}
      <Dialog open={showQuestionnaireDialog} onOpenChange={setShowQuestionnaireDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sports Interest Questionnaire</DialogTitle>
            <DialogDescription>
              Select your sports interests to help us customize your experience and connect you with relevant opportunities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(OLYMPIC_SPORTS).map(([category, sports]) => (
              <div key={category}>
                <h4 className="font-semibold mb-3 capitalize">
                  {category} Events
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {sports.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox
                        id={sport}
                        checked={selectedSports.includes(sport)}
                        onCheckedChange={() => handleSportsToggle(sport)}
                      />
                      <Label htmlFor={sport} className="text-sm">
                        {sport}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowQuestionnaireDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSportsSubmit}
              disabled={updateSportsInterestsMutation.isPending || selectedSports.length === 0}
            >
              {updateSportsInterestsMutation.isPending ? "Saving..." : "Save Interests"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}