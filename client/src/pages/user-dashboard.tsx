import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Trophy,
  Building2,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  Star,
  Plus,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  FileText,
  Award
} from "lucide-react";

// Sports categories for questionnaire
const SPORTS_CATEGORIES = {
  athletics: {
    name: "Athletics",
    subcategories: {
      track: {
        name: "Track Events",
        events: ["100m", "200m", "400m", "800m", "1500m", "5000m", "10000m", "Marathon", "110m Hurdles", "400m Hurdles", "3000m Steeplechase", "4x100m Relay", "4x400m Relay"]
      },
      field: {
        name: "Field Events", 
        events: ["Long Jump", "High Jump", "Pole Vault", "Triple Jump", "Shot Put", "Discus Throw", "Hammer Throw", "Javelin Throw"]
      }
    }
  },
  combat: {
    name: "Combat Sports",
    subcategories: {
      martial_arts: {
        name: "Martial Arts",
        events: ["Karate", "Taekwondo", "Judo", "Boxing", "Wrestling", "MMA", "Kendo", "Aikido"]
      }
    }
  },
  indoor: {
    name: "Indoor Sports",
    subcategories: {
      court: {
        name: "Court Sports",
        events: ["Basketball", "Volleyball", "Badminton", "Table Tennis", "Squash", "Handball"]
      },
      other: {
        name: "Other Indoor",
        events: ["Chess", "Carrom", "Billiards", "Snooker", "Darts"]
      }
    }
  },
  outdoor: {
    name: "Outdoor Sports",
    subcategories: {
      team: {
        name: "Team Sports",
        events: ["Football", "Cricket", "Hockey", "Rugby", "Baseball", "Softball"]
      },
      individual: {
        name: "Individual Sports",
        events: ["Tennis", "Golf", "Swimming", "Cycling", "Archery", "Shooting", "Rowing"]
      }
    }
  },
  water: {
    name: "Water Sports",
    subcategories: {
      swimming: {
        name: "Swimming",
        events: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley", "Relay"]
      },
      other_water: {
        name: "Other Water Sports",
        events: ["Water Polo", "Diving", "Synchronized Swimming", "Sailing", "Surfing", "Kayaking"]
      }
    }
  }
};

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  educationQualification: z.string().optional(),
  institution: z.string().optional(),
  graduationYear: z.number().optional(),
  currentPosition: z.string().optional(),
  currentOrganization: z.string().optional(),
  workExperience: z.number().optional()
});

export default function UserDashboard() {
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Get user organizations
  const { data: ownedOrganizations = [] } = useQuery({
    queryKey: ["/api/user/organizations"],
    enabled: !!user
  });

  // Get user memberships
  const { data: memberships = [] } = useQuery({
    queryKey: ["/api/user/memberships"], 
    enabled: !!user
  });

  // Get user achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/user/achievements"],
    enabled: !!user
  });

  // Get pending approvals
  const { data: approvals = [] } = useQuery({
    queryKey: ["/api/user/approvals"],
    enabled: !!user
  });

  // Check if questionnaire is completed
  useEffect(() => {
    if (user && !user.completedQuestionnaire) {
      setQuestionnaireOpen(true);
    }
    if (user?.sportsInterests) {
      setSelectedSports(user.sportsInterests);
    }
  }, [user]);

  // Profile form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      pincode: user?.pincode || "",
      dateOfBirth: user?.dateOfBirth || "",
      educationQualification: user?.educationQualification || "",
      institution: user?.institution || "",
      graduationYear: user?.graduationYear || undefined,
      currentPosition: user?.currentPosition || "",
      currentOrganization: user?.currentOrganization || "",
      workExperience: user?.workExperience || undefined
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      await apiRequest("PUT", "/api/user/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setProfileEditOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Questionnaire submission
  const submitQuestionnaireMutation = useMutation({
    mutationFn: async (sports: string[]) => {
      await apiRequest("POST", "/api/user/sports-interests", { interests: sports });
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Sports interests saved successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setQuestionnaireOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleSportsToggle = (sport: string) => {
    setSelectedSports(prev => 
      prev.includes(sport) 
        ? prev.filter(s => s !== sport)
        : [...prev, sport]
    );
  };

  const submitQuestionnaire = () => {
    submitQuestionnaireMutation.mutate(selectedSports);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-500">Sportfolio ID: #{user?.id}</p>
                <Badge variant={user?.approvalStatus === "approved" ? "default" : "secondary"}>
                  {user?.approvalStatus}
                </Badge>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setProfileEditOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button onClick={() => setQuestionnaireOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Sports Interests
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Contact Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        <div>{user.address}</div>
                        {(user.city || user.state) && (
                          <div className="text-gray-500">
                            {user.city}{user.city && user.state && ", "}{user.state} {user.pincode}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Education</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.educationQualification && (
                    <div>
                      <p className="font-medium text-sm">{user.educationQualification}</p>
                      {user.institution && (
                        <p className="text-sm text-gray-500">{user.institution}</p>
                      )}
                      {user.graduationYear && (
                        <p className="text-xs text-gray-400">Graduated: {user.graduationYear}</p>
                      )}
                    </div>
                  )}
                  {!user?.educationQualification && (
                    <p className="text-sm text-gray-500">No education details added</p>
                  )}
                </CardContent>
              </Card>

              {/* Career */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Career</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.currentPosition && (
                    <div>
                      <p className="font-medium text-sm">{user.currentPosition}</p>
                      {user.currentOrganization && (
                        <p className="text-sm text-gray-500">{user.currentOrganization}</p>
                      )}
                      {user.workExperience && (
                        <p className="text-xs text-gray-400">
                          {user.workExperience} years experience
                        </p>
                      )}
                    </div>
                  )}
                  {!user?.currentPosition && (
                    <p className="text-sm text-gray-500">No career details added</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sports Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Sports Interests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.sportsInterests && user.sportsInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.sportsInterests.map((sport, index) => (
                      <Badge key={index} variant="secondary">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No sports interests selected. Click "Sports Interests" to add some.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sports Achievements</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.length > 0 ? (
                achievements.map((achievement: any) => (
                  <Card key={achievement.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-lg">{achievement.title}</span>
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <Badge variant="outline">{achievement.sport}</Badge>
                        {achievement.position && (
                          <Badge variant="secondary">{achievement.position}</Badge>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-1">
                            {achievement.isVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-xs">
                              {achievement.isVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          {achievement.blockchainHash && (
                            <Badge variant="outline" className="text-xs">
                              Blockchain Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No achievements yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start adding your sports achievements to build your portfolio
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Achievement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Organizations</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedOrganizations.length > 0 ? (
                ownedOrganizations.map((org: any) => (
                  <Card key={org.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{org.name}</span>
                        <Building2 className="h-5 w-5 text-blue-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{org.description}</p>
                        <Badge variant="outline">{org.organizationType}</Badge>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">Owner</span>
                          </div>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No organizations yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Create your first organization to manage teams and events
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Organization
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="memberships" className="space-y-6">
            <h2 className="text-xl font-semibold">Organization Memberships</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.length > 0 ? (
                memberships.map((membership: any) => (
                  <Card key={membership.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{membership.organization.name}</span>
                        <Users className="h-5 w-5 text-green-500" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{membership.organization.description}</p>
                        <Badge variant="outline">{membership.role}</Badge>
                        <div className="text-xs text-gray-400">
                          Joined: {new Date(membership.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No memberships yet
                    </h3>
                    <p className="text-gray-500">
                      You haven't joined any organizations yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <h2 className="text-xl font-semibold">Approval Status</h2>
            
            <div className="grid grid-cols-1 gap-4">
              {approvals.length > 0 ? (
                approvals.map((approval: any) => (
                  <Card key={approval.id}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {approval.status === "approved" && (
                            <CheckCircle className="h-8 w-8 text-green-500" />
                          )}
                          {approval.status === "pending" && (
                            <Clock className="h-8 w-8 text-yellow-500" />
                          )}
                          {approval.status === "rejected" && (
                            <XCircle className="h-8 w-8 text-red-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{approval.requestType}</h3>
                          <p className="text-sm text-gray-500">{approval.description}</p>
                          <p className="text-xs text-gray-400">
                            Submitted: {new Date(approval.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          approval.status === "approved" ? "default" :
                          approval.status === "pending" ? "secondary" : 
                          "destructive"
                        }
                      >
                        {approval.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No approval requests
                    </h3>
                    <p className="text-gray-500">
                      You don't have any pending approval requests
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sports Questionnaire Modal */}
      <Dialog open={questionnaireOpen} onOpenChange={setQuestionnaireOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sports Interest Questionnaire</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Select the Olympic sports events you are interested in. This helps us provide 
              relevant opportunities and analytics for College Sports League Kerala and sponsors.
            </p>
            
            {Object.entries(SPORTS_CATEGORIES).map(([categoryKey, category]) => (
              <div key={categoryKey} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                
                {Object.entries(category.subcategories).map(([subKey, subcategory]) => (
                  <div key={subKey} className="ml-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      {subcategory.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 ml-4">
                      {subcategory.events.map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <Checkbox
                            id={event}
                            checked={selectedSports.includes(event)}
                            onCheckedChange={() => handleSportsToggle(event)}
                          />
                          <Label htmlFor={event} className="text-sm">
                            {event}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            <div className="flex justify-end space-x-3 pt-6">
              <Button 
                variant="outline" 
                onClick={() => setQuestionnaireOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={submitQuestionnaire}
                disabled={submitQuestionnaireMutation.isPending}
              >
                {submitQuestionnaireMutation.isPending ? "Saving..." : "Save Interests"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Edit Modal */}
      <Dialog open={profileEditOpen} onOpenChange={setProfileEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateProfileMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="educationQualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education Qualification</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Position</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currentOrganization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Organization</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setProfileEditOpen(false)}
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
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}