import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Settings, Trophy, Calendar, Bell, Star, MapPin, 
  CreditCard, ShoppingCart, Users, Building, Target,
  Eye, EyeOff, CheckCircle, Clock, XCircle, Upload,
  Award, Medal, FileText, Download, Play, Image,
  MessageSquare, ThumbsUp, Filter, Search, Plus
} from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  verificationStatus: 'verified' | 'pending' | 'rejected' | 'unverified';
  category: string;
  certificate?: string;
}

interface DashboardProps {
  userType: 'user' | 'organization' | 'facility' | 'event';
  userId: number;
}

export default function ComprehensiveDashboard({ userType = 'user', userId }: DashboardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profilePublic, setProfilePublic] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [newAchievement, setNewAchievement] = useState({
    title: '', description: '', category: '', certificate: ''
  });

  // Profile data query
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: [`/api/${userType}-profile`, userId],
    enabled: !!userId
  });

  // Achievements query
  const { data: achievements } = useQuery({
    queryKey: [`/api/${userType}-achievements`, userId],
    enabled: !!userId,
    select: (data: Achievement[]) => data?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []
  });

  // Events query
  const { data: events } = useQuery({
    queryKey: [`/api/${userType}-events`, userId],
    enabled: !!userId
  });

  // Notifications query
  const { data: notifications } = useQuery({
    queryKey: [`/api/${userType}-notifications`, userId],
    enabled: !!userId,
    select: (data: any[]) => data?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || []
  });

  // Reviews and ratings query
  const { data: reviews } = useQuery({
    queryKey: [`/api/${userType}-reviews`, userId],
    enabled: !!userId
  });

  // Pending requests query
  const { data: pendingRequests } = useQuery({
    queryKey: [`/api/${userType}-requests`, userId],
    enabled: !!userId
  });

  // Advertisements query
  const { data: advertisements } = useQuery({
    queryKey: [`/api/${userType}-advertisements`, userId],
    enabled: !!userId
  });

  // Add achievement mutation
  const addAchievementMutation = useMutation({
    mutationFn: async (achievement: any) => {
      return await apiRequest('POST', `/api/${userType}-achievements`, achievement);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${userType}-achievements`, userId] });
      toast({ title: "Achievement added successfully", description: "Waiting for verification" });
      setNewAchievement({ title: '', description: '', category: '', certificate: '' });
    }
  });

  // Profile visibility mutation
  const updateVisibilityMutation = useMutation({
    mutationFn: async (isPublic: boolean) => {
      return await apiRequest('PATCH', `/api/${userType}-profile/${userId}`, { isPublic });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${userType}-profile`, userId] });
      toast({ title: "Profile visibility updated" });
    }
  });

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      profile?.firstName, profile?.lastName, profile?.email, profile?.phone,
      profile?.address, profile?.city, profile?.district, profile?.ward,
      profile?.profileImage, achievements?.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <img 
                  src="/assets/sportfolio-logo.png" 
                  alt="Sportfolio Logo" 
                  className="h-8 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard
              </h1>
              <Badge variant={profilePublic ? "default" : "secondary"}>
                {profilePublic ? "Public Profile" : "Private Profile"}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setProfilePublic(!profilePublic);
                  updateVisibilityMutation.mutate(!profilePublic);
                }}
              >
                {profilePublic ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {profilePublic ? "Make Private" : "Make Public"}
              </Button>
              <Link href="/subscription">
                <Button size="sm">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscription
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-lg font-semibold">{getCompletionPercentage()}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Complete your profile to get verified and unlock all features
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Awards
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Advertisements
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal information and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <Input value={profile?.firstName || ''} placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <Input value={profile?.lastName || ''} placeholder="Enter last name" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input value={profile?.email || ''} placeholder="Enter email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <Input value={profile?.phone || ''} placeholder="Enter phone number" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Textarea value={profile?.address || ''} placeholder="Enter complete address" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ward</label>
                      <Input value={profile?.ward || ''} placeholder="Ward number/name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">District</label>
                      <Select value={profile?.district || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thiruvananthapuram">Thiruvananthapuram</SelectItem>
                          <SelectItem value="kollam">Kollam</SelectItem>
                          <SelectItem value="pathanamthitta">Pathanamthitta</SelectItem>
                          <SelectItem value="alappuzha">Alappuzha</SelectItem>
                          <SelectItem value="kottayam">Kottayam</SelectItem>
                          <SelectItem value="idukki">Idukki</SelectItem>
                          <SelectItem value="ernakulam">Ernakulam</SelectItem>
                          <SelectItem value="thrissur">Thrissur</SelectItem>
                          <SelectItem value="palakkad">Palakkad</SelectItem>
                          <SelectItem value="malappuram">Malappuram</SelectItem>
                          <SelectItem value="kozhikode">Kozhikode</SelectItem>
                          <SelectItem value="wayanad">Wayanad</SelectItem>
                          <SelectItem value="kannur">Kannur</SelectItem>
                          <SelectItem value="kasaragod">Kasaragod</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">State</label>
                      <Input value="Kerala" disabled />
                    </div>
                  </div>

                  <Button className="w-full">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Upload and verify your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      {profile?.profileImage ? (
                        <img 
                          src={profile.profileImage} 
                          alt="Profile" 
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      {getVerificationIcon(profile?.photoVerificationStatus || 'unverified')}
                      <span className="text-sm text-gray-600">
                        {profile?.photoVerificationStatus || 'Unverified'}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Photos are verified every 3 years for authenticity
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Awards & Achievements</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Achievement</DialogTitle>
                    <DialogDescription>
                      Add your sports achievements and awards for verification
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input 
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                        placeholder="Achievement title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={newAchievement.description}
                        onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                        placeholder="Describe your achievement"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select 
                        value={newAchievement.category}
                        onValueChange={(value) => setNewAchievement({...newAchievement, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tournament">Tournament</SelectItem>
                          <SelectItem value="league">League</SelectItem>
                          <SelectItem value="championship">Championship</SelectItem>
                          <SelectItem value="certification">Certification</SelectItem>
                          <SelectItem value="award">Award</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => addAchievementMutation.mutate(newAchievement)}
                      disabled={addAchievementMutation.isPending}
                      className="w-full"
                    >
                      {addAchievementMutation.isPending ? "Adding..." : "Add Achievement"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {achievements?.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {getVerificationIcon(achievement.verificationStatus)}
                          <Badge variant="outline">{achievement.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{achievement.description}</p>
                        <p className="text-sm text-gray-500">{achievement.date}</p>
                      </div>
                      <div className="flex gap-2">
                        {achievement.certificate && (
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Certificate
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events?.filter((event: any) => new Date(event.startDate) > new Date()).map((event: any) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <h5 className="font-semibold">{event.name}</h5>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Completed Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events?.filter((event: any) => new Date(event.endDate) < new Date()).map((event: any) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <h5 className="font-semibold">{event.name}</h5>
                        <p className="text-sm text-gray-600">{event.location}</p>
                        <p className="text-sm text-gray-500">{new Date(event.endDate).toLocaleDateString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            PDF Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Excel Data
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Review and approve requests from other users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingRequests?.map((request: any) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">{request.title}</h5>
                          <p className="text-sm text-gray-600">{request.description}</p>
                          <p className="text-sm text-gray-500">From: {request.requesterName}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Your recent notifications in chronological order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications?.map((notification: any) => (
                    <div key={notification.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold">{notification.title}</h5>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleDateString()}</p>
                        </div>
                        {notification.hasLink && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>Feedback from the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews?.map((review: any) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">by {review.reviewerName}</span>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advertisements Tab */}
          <TabsContent value="ads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sponsor Advertisements</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Ad Campaign
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advertisements?.map((ad: any) => (
                <Card key={ad.id}>
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      {ad.imageUrl ? (
                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover rounded-lg" />
                      ) : ad.videoUrl ? (
                        <div className="flex items-center gap-2">
                          <Play className="w-6 h-6" />
                          <span>Video Ad</span>
                        </div>
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <h5 className="font-semibold mb-2">{ad.title}</h5>
                    <p className="text-sm text-gray-600 mb-4">{ad.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                        {ad.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}