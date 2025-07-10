import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SportsInterestPopup from "@/components/sports-interest-popup";
import Landing from "@/pages/landing";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Trophy, 
  Star, 
  Clock,
  ExternalLink,
  Filter,
  Search,
  LogIn,
  UserPlus,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showSportsPopup, setShowSportsPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Get current user to determine routing
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Get events data
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: sportsCategories } = useQuery({
    queryKey: ["/api/sports-categories"],
  });

  // Check if user needs to complete sports questionnaire
  useEffect(() => {
    if (user && (!user.sportsInterests?.length || !user.completedQuestionnaire)) {
      setShowSportsPopup(true);
    }
  }, [user]);

  // Filter events based on search and category
  const filteredEvents = events?.filter((event: any) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.eventType === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  // Show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is not logged in, show landing page
  if (!user) {
    return <Landing />;
  }

  // User is logged in - show events homepage
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏆 Sportfolio
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                Welcome, {user.firstName}!
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => setLocation("/user-dashboard-clean")} variant="outline">
                My Dashboard
              </Button>
              <Button onClick={() => setLocation("/organizations")} variant="outline">
                Organizations
              </Button>
              <Button onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setLocation("/");
              }} variant="ghost">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Kerala Sports Events 🌴
                  </h1>
                  <p className="text-blue-100">
                    Discover and register for Kerala's premier sports competitions and tournaments
                  </p>
                </div>
                <div className="text-6xl opacity-20">
                  🏆
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tournament">Tournaments</SelectItem>
              <SelectItem value="league">Leagues</SelectItem>
              <SelectItem value="championship">Championships</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {eventsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    <Badge className={
                      event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>Start: {new Date(event.startDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span>Reg: {new Date(event.registrationDeadline).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>Max: {event.maxParticipants || 'Unlimited'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span>Kerala</span>
                    </div>
                  </div>

                  {/* Entry Fee & Prize Pool */}
                  {(event.entryFee && parseFloat(event.entryFee) > 0) && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Entry Fee:</span>
                        <span className="text-lg font-bold text-green-700">
                          ₹{parseFloat(event.entryFee).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {(event.prizePool && parseFloat(event.prizePool) > 0) && (
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Prize Pool:</span>
                        <span className="text-lg font-bold text-purple-700">
                          ₹{parseFloat(event.prizePool).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Subscription Notice for Registration */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <Star className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <strong>Subscription Required:</strong> Upgrade to Pro or Enterprise to register for events and access premium features.
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="outline" className="text-xs">
                      {event.eventType}
                    </Badge>
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setLocation(`/events`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        disabled={event.status !== 'upcoming'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => setLocation('/user-dashboard-clean')}
                      >
                        {event.status === 'upcoming' ? 'Upgrade to Register' : 'Event Closed'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search filters" 
                : "No events are currently available"
              }
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">My Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your profile, organizations, and achievements
              </p>
              <Button onClick={() => setLocation("/user-dashboard-clean")} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">All Events</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse comprehensive event listings and details
              </p>
              <Button onClick={() => setLocation("/events")} variant="outline" className="w-full">
                View All Events
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Facilities</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find sports facilities and training centers near you
              </p>
              <Button onClick={() => setLocation("/facilities")} variant="outline" className="w-full">
                Find Facilities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sports Interest Popup */}
      <SportsInterestPopup
        isOpen={showSportsPopup}
        onClose={() => setShowSportsPopup(false)}
        isFirstTime={true}
      />
    </div>
  );
}
