import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService, useAuth } from "@/lib/auth";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Shield, 
  Building, 
  Timer,
  TrendingUp,
  Award,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import logoImage from "@assets/Sportfolio Logo with out background_1750012724737.png";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

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

  const { data: userBookings } = useQuery({
    queryKey: ["/api/facility-bookings/my"],
    enabled: auth.isAuthenticated,
  });

  const { data: userCertificates } = useQuery({
    queryKey: ["/api/certificates/my"],
    enabled: auth.isAuthenticated,
  });

  const { data: facilities } = useQuery({
    queryKey: ["/api/facilities"],
    enabled: auth.isAuthenticated,
  });

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
    enabled: auth.isAuthenticated,
  });

  const handleLogout = () => {
    authService.clearAuth();
    setLocation("/");
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

  const getToolAccess = () => {
    const hasSubscription = authService.isSubscriptionActive();
    const subscriptionLevel = authService.getSubscriptionLevel();
    
    return {
      facility: hasSubscription && (subscriptionLevel === 'pro' || subscriptionLevel === 'enterprise'),
      fixtures: hasSubscription && (subscriptionLevel === 'pro' || subscriptionLevel === 'enterprise'),
      scoring: hasSubscription && (subscriptionLevel === 'pro' || subscriptionLevel === 'enterprise'),
    };
  };

  const toolAccess = getToolAccess();

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
              <img 
                src={logoImage} 
                alt="Sportfolio Logo" 
                className="h-10 w-auto"
              />
              <h1 className="font-poppins font-bold text-xl text-gray-900">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className="bg-blockchain-blue/10 text-blockchain-blue border-blockchain-blue/20"
              >
                <Shield className="mr-1" size={12} />
                {auth.user?.subscriptionTier?.toUpperCase()}
              </Badge>
              <Button variant="ghost" size="sm">
                <Bell size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1" size={16} />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-2">
            Welcome back, {auth.user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your sports journey from your personalized dashboard
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="tools">Management Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">My Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userBookings?.length || 0}
                      </p>
                    </div>
                    <Calendar className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Certificates</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userCertificates?.length || 0}
                      </p>
                    </div>
                    <Award className="text-saffron" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Facilities Available</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {facilities?.length || 0}
                      </p>
                    </div>
                    <MapPin className="text-indian-green" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Events</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {events?.filter(e => e.status === 'upcoming').length || 0}
                      </p>
                    </div>
                    <Calendar className="text-deep-blue" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 text-blue-600" size={20} />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userBookings && userBookings.length > 0 ? (
                    <div className="space-y-3">
                      {userBookings.slice(0, 3).map((booking: any) => (
                        <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">Facility #{booking.facilityId}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.startTime).toLocaleDateString()}
                          </div>
                          <Badge 
                            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bookings yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 text-saffron" size={20} />
                    My Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userCertificates && userCertificates.length > 0 ? (
                    <div className="space-y-3">
                      {userCertificates.slice(0, 3).map((cert: any) => (
                        <div key={cert.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium">{cert.title}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(cert.issuedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mt-2">
                            <Shield className="text-blockchain-blue mr-1" size={12} />
                            <span className="text-xs text-blockchain-blue">Blockchain Verified</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No certificates yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Facility Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {userBookings && userBookings.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking: any) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">Facility #{booking.facilityId}</h3>
                            <p className="text-gray-600">{booking.purpose}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.startTime).toLocaleString()} - 
                              {new Date(booking.endTime).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                            {booking.totalAmount && (
                              <p className="text-sm mt-1">₹{booking.totalAmount}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No bookings found</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setLocation("/facilities")}
                    >
                      Browse Facilities
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events && events.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {events.slice(0, 6).map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(event.startDate).toLocaleDateString()}
                          </span>
                          <Badge variant="outline">{event.eventType}</Badge>
                        </div>
                        {event.entryFee && event.entryFee > 0 && (
                          <p className="text-sm mt-2">Entry Fee: ₹{event.entryFee}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No events available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Facility Management Tool */}
              <Card className={!toolAccess.facility ? "opacity-60" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 text-blue-600" size={20} />
                    Facility Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Manage bookings, maintenance, and revenue for sports facilities.
                  </p>
                  {toolAccess.facility ? (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setLocation("/facility-management")}
                    >
                      Open Tool
                    </Button>
                  ) : (
                    <div>
                      <Badge variant="secondary" className="mb-2">Pro Plan Required</Badge>
                      <Button variant="outline" className="w-full" disabled>
                        Upgrade to Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fixtures Management Tool */}
              <Card className={!toolAccess.fixtures ? "opacity-60" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 text-green-600" size={20} />
                    Fixtures Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Create tournaments, generate brackets, and schedule matches.
                  </p>
                  {toolAccess.fixtures ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setLocation("/fixtures-management")}
                    >
                      Open Tool
                    </Button>
                  ) : (
                    <div>
                      <Badge variant="secondary" className="mb-2">Pro Plan Required</Badge>
                      <Button variant="outline" className="w-full" disabled>
                        Upgrade to Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Scoring Tool */}
              <Card className={!toolAccess.scoring ? "opacity-60" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Timer className="mr-2 text-red-600" size={20} />
                    Live Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Real-time match scoring, leaderboards, and result publishing.
                  </p>
                  {toolAccess.scoring ? (
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => setLocation("/live-scoring")}
                    >
                      Open Tool
                    </Button>
                  ) : (
                    <div>
                      <Badge variant="secondary" className="mb-2">Pro Plan Required</Badge>
                      <Button variant="outline" className="w-full" disabled>
                        Upgrade to Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Subscription Status */}
            <Card className="bg-gradient-to-r from-saffron to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Current Plan: {auth.user?.subscriptionTier?.toUpperCase()}
                    </h3>
                    <p className="opacity-90">
                      {authService.isSubscriptionActive() 
                        ? "Your subscription is active"
                        : "Upgrade to access professional tools"
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <Button variant="secondary" className="text-saffron">
                      {authService.isSubscriptionActive() ? "Manage Plan" : "Upgrade Now"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
