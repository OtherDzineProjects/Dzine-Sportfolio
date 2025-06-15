import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { authService, useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { blockchainService, generateCertificate, formatBlockchainHash } from "@/lib/blockchain";
import { 
  User, 
  Award, 
  Shield, 
  Edit, 
  Save,
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Dumbbell,
  Target,
  Star,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function AthleteProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setLocation("/auth");
      return;
    }
  }, [auth.isAuthenticated, setLocation]);

  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
    enabled: auth.isAuthenticated,
  });

  const { data: sportsCategories } = useQuery({
    queryKey: ["/api/sports-categories"],
  });

  const { data: organizations } = useQuery({
    queryKey: ["/api/organizations"],
  });

  const { data: userCertificates } = useQuery({
    queryKey: ["/api/certificates/my"],
    enabled: auth.isAuthenticated,
  });

  const { data: userBookings } = useQuery({
    queryKey: ["/api/facility-bookings/my"],
    enabled: auth.isAuthenticated,
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/user/athlete-profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setIsEditing(false);
      toast({
        title: "Profile updated successfully",
        description: "Your athlete profile has been saved.",
      });
    },
  });

  const [profileForm, setProfileForm] = useState({
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    primarySport: "",
    secondarySports: [] as number[],
    organizationId: "",
    bio: "",
    achievements: [] as string[],
  });

  useEffect(() => {
    if (userProfile?.athleteProfile) {
      const profile = userProfile.athleteProfile;
      setProfileForm({
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profile.gender || "",
        height: profile.height || "",
        weight: profile.weight || "",
        primarySport: profile.primarySport?.toString() || "",
        secondarySports: profile.secondarySports || [],
        organizationId: profile.organizationId?.toString() || "",
        bio: profile.bio || "",
        achievements: profile.achievements || [],
      });
    }
  }, [userProfile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      ...profileForm,
      dateOfBirth: profileForm.dateOfBirth ? new Date(profileForm.dateOfBirth) : undefined,
      height: profileForm.height ? parseFloat(profileForm.height) : undefined,
      weight: profileForm.weight ? parseFloat(profileForm.weight) : undefined,
      primarySport: profileForm.primarySport ? parseInt(profileForm.primarySport) : undefined,
      organizationId: profileForm.organizationId ? parseInt(profileForm.organizationId) : undefined,
    };

    createProfileMutation.mutate(profileData);
  };

  const addAchievement = () => {
    const achievement = prompt("Enter your achievement:");
    if (achievement) {
      setProfileForm(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievement]
      }));
    }
  };

  const removeAchievement = (index: number) => {
    setProfileForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const generateMockCertificate = async () => {
    try {
      const hash = await generateCertificate({
        recipientId: auth.user!.id,
        title: "Sample Achievement Certificate",
        issuedBy: "Sportfolio Platform",
        achievement: "Profile completion and verification"
      });

      toast({
        title: "Certificate generated",
        description: `Blockchain hash: ${formatBlockchainHash(hash)}`,
      });

      // Refresh certificates
      queryClient.invalidateQueries({ queryKey: ["/api/certificates/my"] });
    } catch (error) {
      toast({
        title: "Certificate generation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const verifyCertificate = async (blockchainHash: string) => {
    try {
      const certificate = await blockchainService.verifyCertificate(blockchainHash);
      if (certificate) {
        toast({
          title: "Certificate verified",
          description: `Valid certificate issued by ${certificate.issuedBy}`,
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Certificate not found or invalid",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification error",
        description: "Please check the hash and try again.",
        variant: "destructive",
      });
    }
  };

  const getProfileCompleteness = () => {
    if (!userProfile?.athleteProfile) return 0;
    
    const profile = userProfile.athleteProfile;
    const fields = [
      profile.dateOfBirth,
      profile.gender,
      profile.height,
      profile.weight,
      profile.primarySport,
      profile.bio,
      profile.achievements?.length > 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="text-blue-600" size={24} />
                <h1 className="font-poppins font-bold text-xl text-gray-900">
                  Athlete Profile
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blockchain-blue/10 text-blockchain-blue">
                <Shield className="mr-1" size={12} />
                Blockchain Verified
              </Badge>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save size={16} /> : <Edit size={16} />}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-r from-saffron to-orange-600 text-white">
                  {auth.user?.firstName?.[0]}{auth.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-2">
                  {auth.user?.firstName} {auth.user?.lastName}
                </h2>
                <p className="text-gray-600 mb-4">
                  {userProfile?.athleteProfile?.bio || "Aspiring athlete passionate about sports"}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="mr-1" size={14} />
                    {auth.user?.email}
                  </div>
                  {auth.user?.phone && (
                    <div className="flex items-center">
                      <Phone className="mr-1" size={14} />
                      {auth.user.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="mr-1" size={14} />
                    Joined {new Date(auth.user?.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">Profile Completeness</div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {getProfileCompleteness()}%
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-600 rounded-full transition-all duration-300"
                    style={{ width: `${getProfileCompleteness()}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile Details</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileForm.dateOfBirth}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={profileForm.gender}
                          onValueChange={(value) => setProfileForm(prev => ({ ...prev, gender: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          value={profileForm.height}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, height: e.target.value }))}
                          placeholder="e.g., 175.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={profileForm.weight}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="e.g., 70.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primarySport">Primary Sport</Label>
                        <Select 
                          value={profileForm.primarySport}
                          onValueChange={(value) => setProfileForm(prev => ({ ...prev, primarySport: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary sport" />
                          </SelectTrigger>
                          <SelectContent>
                            {sportsCategories?.map((sport: any) => (
                              <SelectItem key={sport.id} value={sport.id.toString()}>
                                {sport.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organizationId">Organization</Label>
                        <Select 
                          value={profileForm.organizationId}
                          onValueChange={(value) => setProfileForm(prev => ({ ...prev, organizationId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No organization</SelectItem>
                            {organizations?.map((org: any) => (
                              <SelectItem key={org.id} value={org.id.toString()}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself, your sports journey, and goals..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={createProfileMutation.isPending}
                      className="w-full"
                    >
                      {createProfileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Dumbbell className="mx-auto text-blue-600 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Primary Sport</p>
                        <p className="font-semibold">
                          {sportsCategories?.find((s: any) => s.id === userProfile?.athleteProfile?.primarySport)?.name || "Not specified"}
                        </p>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Target className="mx-auto text-green-600 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Height / Weight</p>
                        <p className="font-semibold">
                          {userProfile?.athleteProfile?.height || "—"} cm / {userProfile?.athleteProfile?.weight || "—"} kg
                        </p>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Calendar className="mx-auto text-purple-600 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-semibold">
                          {userProfile?.athleteProfile?.dateOfBirth 
                            ? Math.floor((Date.now() - new Date(userProfile.athleteProfile.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : "—"
                          } years
                        </p>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <MapPin className="mx-auto text-orange-600 mb-2" size={24} />
                        <p className="text-sm text-gray-600">Organization</p>
                        <p className="font-semibold">
                          {organizations?.find((o: any) => o.id === userProfile?.athleteProfile?.organizationId)?.name || "Independent"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-3">About Me</h3>
                      <p className="text-gray-700">
                        {userProfile?.athleteProfile?.bio || "No bio provided yet. Click edit to add your story!"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My Achievements
                  {isEditing && (
                    <Button onClick={addAchievement} size="sm">
                      <Trophy className="mr-1" size={16} />
                      Add Achievement
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileForm.achievements && profileForm.achievements.length > 0 ? (
                  <div className="space-y-3">
                    {profileForm.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                          <Star className="text-yellow-600 mr-3" size={20} />
                          <span>{achievement}</span>
                        </div>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeAchievement(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No achievements recorded yet</p>
                    <p className="text-sm text-gray-400">
                      Add your sports achievements to showcase your journey
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Blockchain Certificates
                  <Button onClick={generateMockCertificate} size="sm">
                    <Award className="mr-1" size={16} />
                    Generate Sample
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userCertificates && userCertificates.length > 0 ? (
                  <div className="space-y-4">
                    {userCertificates.map((cert: any) => (
                      <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{cert.title}</h3>
                            <p className="text-gray-600 mb-2">{cert.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="mr-1" size={14} />
                                {new Date(cert.issuedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Shield className="mr-1" size={14} />
                                {formatBlockchainHash(cert.blockchainHash)}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant="default" className="bg-blockchain-blue">
                              <CheckCircle className="mr-1" size={12} />
                              Verified
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyCertificate(cert.blockchainHash)}
                            >
                              <ExternalLink size={12} className="mr-1" />
                              Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No certificates earned yet</p>
                    <p className="text-sm text-gray-400">
                      Participate in events to earn blockchain-verified certificates
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {userBookings && userBookings.length > 0 ? (
                    <div className="space-y-3">
                      {userBookings.slice(0, 5).map((booking: any) => (
                        <div key={booking.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Facility #{booking.facilityId}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.startTime).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500">No recent bookings</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profile Views</span>
                      <span className="font-semibold">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Certificates Earned</span>
                      <span className="font-semibold">{userCertificates?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Facility Bookings</span>
                      <span className="font-semibold">{userBookings?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profile Completeness</span>
                      <span className="font-semibold">{getProfileCompleteness()}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
