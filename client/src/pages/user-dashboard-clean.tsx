import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, Award, Building, Users, FileText, Download, 
  Calendar, MapPin, Phone, Mail, 
  Shield, Star, Trophy, Globe, Plus, ExternalLink, CheckCircle, Check,
  Clock, X, Eye, Settings, BarChart3, CalendarDays
} from "lucide-react";
import { User as UserType } from "@shared/schema";
import OrganizationFormEnhanced from "@/components/organization-form-enhanced";
import { PersonalProfile, CareerProfile, MedicalProfile, GuardianProfile } from "@shared/profile-types";
import { PersonalProfileSection } from "@/components/profile-sections/personal-profile";
import { CareerProfileSection } from "@/components/profile-sections/career-profile";
import { MedicalProfileSection } from "@/components/profile-sections/medical-profile";
import { GuardianProfileSection } from "@/components/profile-sections/guardian-profile";
import { ProfilePhotoSection } from "@/components/profile-photo-section";
import { OrganizationDetailView } from "@/components/organization-detail-view";
import { calculateProfileCompletion, getCompletionColor, getCompletionBadgeVariant } from "@/utils/profile-completion";
import { Progress } from "@/components/ui/progress";
import ComprehensiveSportsSelector from "@/components/comprehensive-sports-selector";

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
  verificationStatus?: string;
  organizationType?: string;
  district?: string;
  lsgd?: string;
  facilityAvailability?: string[];
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

export default function UserDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for various dialogs and forms
  const [showQuestionnaireDialog, setShowQuestionnaireDialog] = useState(false);
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [showOrgDetailDialog, setShowOrgDetailDialog] = useState(false);

  // Helper function to calculate age
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Profile sections state
  const [personalProfile, setPersonalProfile] = useState<Partial<PersonalProfile>>({});
  const [careerProfile, setCareerProfile] = useState<Partial<CareerProfile>>({});
  const [medicalProfile, setMedicalProfile] = useState<Partial<MedicalProfile>>({});
  const [guardianProfile, setGuardianProfile] = useState<Partial<GuardianProfile>>({});

  // Calculate profile completion
  const completion = calculateProfileCompletion(personalProfile, careerProfile, medicalProfile, guardianProfile);

  // Organization form state
  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    description: '',
    type: 'Club',
    organizationType: 'Sports Club',
    city: '',
    state: 'Kerala',
    district: '',
    lsgd: '',
    establishedYear: new Date().getFullYear(),
    sportsInterests: [] as string[],
    website: '',
    email: '',
    phone: '',
  });

  // Fetch user profile data
  const { data: userProfile, isLoading: userLoading } = useQuery<{ user: UserType; athleteProfile?: any }>({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  const user = userProfile?.user;
  const userAge = user?.dateOfBirth ? calculateAge(user.dateOfBirth) : 0;

  // Fetch user achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["/api/achievements/user"],
    enabled: !!user,
  });

  // Fetch owned organizations
  const { data: ownedOrganizations, isLoading: ownedOrgsLoading } = useQuery({
    queryKey: ["/api/organizations/owned"],
    enabled: !!user,
  });

  // Fetch organization memberships
  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["/api/organizations/memberships"],
    enabled: !!user,
  });

  // Fetch user approvals
  const { data: approvals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/approvals/user"],
    enabled: !!user,
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics/sports"],
    enabled: !!user,
  });

  // Initialize profile data when user data loads
  useEffect(() => {
    if (user) {
      // Personal Profile
      setPersonalProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || 'Kerala',
        district: user.district || '',
        lsgd: user.lsgd || '',
        pincode: user.pincode || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        fatherName: user.fatherName || '',
        motherName: user.motherName || '',
        fatherOccupation: user.fatherOccupation || '',
        motherOccupation: user.motherOccupation || '',
        emergencyContact: user.emergencyContact || '',
        emergencyContactRelation: user.emergencyContactRelation || '',
      });

      // Career Profile
      setCareerProfile({
        educationQualification: user.educationQualification || '',
        institution: user.institution || '',
        graduationYear: user.graduationYear || undefined,
        currentPosition: user.currentPosition || '',
        currentOrganization: user.currentOrganization || '',
        workExperience: user.workExperience || undefined,
        skills: user.skills || [],
      });

      // Medical Profile
      setMedicalProfile({
        height: user.height ? parseFloat(user.height.toString()) : undefined,
        weight: user.weight ? parseFloat(user.weight.toString()) : undefined,
        bmi: user.bmi ? parseFloat(user.bmi.toString()) : undefined,
        bloodGroup: user.bloodGroup || '',
        allergies: user.allergies || [],
        medicalConditions: user.medicalConditions || [],
        injuries: user.injuries || [],
        lastMedicalCheckup: user.lastMedicalCheckup || '',
        medicalClearance: user.medicalClearance || false,
      });

      // Guardian Profile
      setGuardianProfile({
        isMinor: user.isMinor || false,
        guardianId: user.guardianId || undefined,
        dependents: user.dependents || [],
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

  // Profile update mutations for 4-section system
  const updatePersonalProfileMutation = useMutation({
    mutationFn: async (data: Partial<PersonalProfile>) => {
      const result = await apiRequest("PUT", "/api/auth/profile", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Personal profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update personal profile",
        variant: "destructive",
      });
    },
  });

  const updateCareerProfileMutation = useMutation({
    mutationFn: async (data: Partial<CareerProfile>) => {
      const result = await apiRequest("PUT", "/api/auth/profile", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Career profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update career profile",
        variant: "destructive",
      });
    },
  });

  const updateMedicalProfileMutation = useMutation({
    mutationFn: async (data: Partial<MedicalProfile>) => {
      const result = await apiRequest("PUT", "/api/auth/profile", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Medical profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update medical profile",
        variant: "destructive",
      });
    },
  });

  const updateGuardianProfileMutation = useMutation({
    mutationFn: async (data: Partial<GuardianProfile>) => {
      const result = await apiRequest("PUT", "/api/auth/profile", data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Guardian profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update guardian profile",
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
        description: "Your sports interests have been updated successfully.",
      });
      setShowQuestionnaireDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update sports interests",
        variant: "destructive",
      });
    },
  });

  const handleSportsSubmit = () => {
    updateSportsInterestsMutation.mutate(selectedSports);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <X className="h-4 w-4" />
          <AlertDescription>
            Unable to load user profile. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Gamified Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ring-4 ring-blue-200">
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              {completion.percentage >= 80 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Star className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎯 Welcome, {user.firstName} {user.lastName}!
              </h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Badge className="bg-blue-100 text-blue-800">{user.userType || 'Athlete'}</Badge>
                <span>•</span>
                <span>{user.email}</span>
                <span>•</span>
                <span>Age: {userAge}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span>{completion.percentage}% Complete</span>
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-1">
                {completion.percentage >= 90 ? '🌟' : 
                 completion.percentage >= 70 ? '🚀' : 
                 completion.percentage >= 50 ? '💪' : '🌱'}
              </div>
              <div className="text-sm font-medium">
                {completion.percentage >= 90 ? 'Sports Star' : 
                 completion.percentage >= 70 ? 'Rising Athlete' : 
                 completion.percentage >= 50 ? 'Growing Strong' : 'Getting Started'}
              </div>
              <Progress value={completion.percentage} className="w-24 h-2 mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs md:text-sm">Achievements</TabsTrigger>
          <TabsTrigger value="organizations" className="text-xs md:text-sm">Organizations</TabsTrigger>
          <TabsTrigger value="memberships" className="text-xs md:text-sm">Memberships</TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs md:text-sm">Approvals</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
        </TabsList>

        {/* Profile Tab - 4 Comprehensive Sections + Photo */}
        <TabsContent value="profile" className="space-y-6">
          <ProfilePhotoSection
            userId={user.id}
            profileImage={user.profileImageUrl}
            verificationStatus={user.photoVerificationStatus}
            lastVerificationDate={user.lastPhotoVerification}
            nextVerificationDue={user.nextPhotoVerificationDue}
            onUpdate={() => queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] })}
          />
          
          <PersonalProfileSection
            profile={personalProfile}
            onUpdate={(updates) => {
              setPersonalProfile({ ...personalProfile, ...updates });
              updatePersonalProfileMutation.mutate(updates);
            }}
            isLoading={updatePersonalProfileMutation.isPending}
          />
          
          <CareerProfileSection
            profile={careerProfile}
            onUpdate={(updates) => {
              setCareerProfile({ ...careerProfile, ...updates });
              updateCareerProfileMutation.mutate(updates);
            }}
            isLoading={updateCareerProfileMutation.isPending}
          />
          
          <MedicalProfileSection
            profile={medicalProfile}
            onUpdate={(updates) => {
              setMedicalProfile({ ...medicalProfile, ...updates });
              updateMedicalProfileMutation.mutate(updates);
            }}
            isLoading={updateMedicalProfileMutation.isPending}
          />
          
          <GuardianProfileSection
            profile={guardianProfile}
            userAge={userAge}
            onUpdate={(updates) => {
              setGuardianProfile({ ...guardianProfile, ...updates });
              updateGuardianProfileMutation.mutate(updates);
            }}
            isLoading={updateGuardianProfileMutation.isPending}
          />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sports Achievements</CardTitle>
              <CardDescription>Track your sports achievements with blockchain verification</CardDescription>
            </CardHeader>
            <CardContent>
              {achievementsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : achievements && Array.isArray(achievements) && achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement: Achievement) => (
                    <Card key={achievement.id} className="relative hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                              <h3 className="font-semibold">{achievement.title}</h3>
                              <span className="text-lg">🏆</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">{achievement.category}</Badge>
                              <span>•</span>
                              <span>{achievement.achievementDate}</span>
                              {achievement.issuedBy && (
                                <>
                                  <span>•</span>
                                  <span>{achievement.issuedBy}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex items-center space-x-1">
                              {achievement.verificationStatus === 'verified' && (
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  ✅ Verified
                                </Badge>
                              )}
                              {achievement.blockchainHash && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                                  <Shield className="h-3 w-3 mr-1" />
                                  🔗 Blockchain
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements found. Start tracking your sports accomplishments!</p>
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
                <CardDescription>Organizations you own and manage</CardDescription>
              </div>
              <Dialog open={showOrganizationDialog} onOpenChange={setShowOrganizationDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                    <DialogDescription>
                      Create a new sports organization, club, or facility
                    </DialogDescription>
                  </DialogHeader>
                  <OrganizationFormEnhanced 
                    onSuccess={() => {
                      setShowOrganizationDialog(false);
                      queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {ownedOrgsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : ownedOrganizations && Array.isArray(ownedOrganizations) && ownedOrganizations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ownedOrganizations.map((org: Organization) => (
                    <Card key={org.id} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1" onClick={() => {
                            setSelectedOrganization(org);
                            setShowOrgDetailDialog(true);
                          }}>
                            <h3 className="font-semibold">{org.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{org.description}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Badge variant="secondary">{org.type}</Badge>
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{org.city}, {org.state}</span>
                            </div>
                            {org.registrationNumber && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reg: {org.registrationNumber}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={org.verificationStatus === 'verified' ? 'default' : 'secondary'} 
                                   className={org.verificationStatus === 'verified' ? 'bg-green-100 text-green-800 border-green-300' : 
                                              org.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                                              'bg-red-100 text-red-800 border-red-300'}>
                              {org.verificationStatus === 'verified' ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  <span>✓ Verified</span>
                                </>
                              ) : org.verificationStatus === 'pending' ? (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>⏳ Pending</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  <span>❌ Unverified</span>
                                </>
                              )}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrganization(org);
                                setShowOrgDetailDialog(true);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
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
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No organizations found. Create your first organization!</p>
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
              <CardDescription>Organizations you are a member of</CardDescription>
            </CardHeader>
            <CardContent>
              {membershipsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : memberships && Array.isArray(memberships) && memberships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {memberships.map((membership: OrganizationMember) => (
                    <Card key={membership.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{membership.organization.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{membership.organization.description}</p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Badge variant="secondary">{membership.role}</Badge>
                              <span>•</span>
                              <span>Joined {new Date(membership.joinedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Badge variant={membership.status === 'active' ? 'default' : 'secondary'}>
                            {membership.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No memberships found. Join organizations to connect with the sports community!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Requests</CardTitle>
              <CardDescription>Track your submitted requests and their status</CardDescription>
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
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{approval.requestType}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Requested on {new Date(approval.requestedAt).toLocaleDateString()}
                            </p>
                            {approval.comments && (
                              <p className="text-sm text-muted-foreground">Comments: {approval.comments}</p>
                            )}
                          </div>
                          <Badge variant={
                            approval.status === 'approved' ? 'default' : 
                            approval.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }>
                            {approval.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No approval requests found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sports Analytics</CardTitle>
              <CardDescription>Insights into your sports activities and interests</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sports Questionnaire Dialog */}
      <Dialog open={showQuestionnaireDialog} onOpenChange={setShowQuestionnaireDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>🏆 Complete Your Sports Profile</span>
            </DialogTitle>
            <DialogDescription>
              Select your sports interests to unlock personalized features and connect with relevant opportunities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Build Your Sports Journey</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose from Kerala's comprehensive sports categories. Each selection helps us personalize your experience!
              </p>
            </div>
            
            <ComprehensiveSportsSelector
              selectedSports={selectedSports}
              onSportsChange={setSelectedSports}
              maxSelections={999}
              showCategoryDescriptions={true}
              allowSearch={true}
            />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowQuestionnaireDialog(false)}
                className="flex items-center space-x-2"
              >
                <Clock className="h-4 w-4" />
                <span>Skip for now</span>
              </Button>
              <Button 
                onClick={handleSportsSubmit}
                disabled={selectedSports.length === 0 || updateSportsInterestsMutation.isPending}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {updateSportsInterestsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Continue ({selectedSports.length} selected)</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Organization Detail Dialog */}
      <Dialog open={showOrgDetailDialog} onOpenChange={setShowOrgDetailDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>
              View and edit your organization information
            </DialogDescription>
          </DialogHeader>
          {selectedOrganization && (
            <OrganizationDetailView 
              organization={selectedOrganization}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
                setShowOrgDetailDialog(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}