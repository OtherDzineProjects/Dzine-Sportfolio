import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Target, 
  Activity, 
  Award, 
  Building, 
  BookOpen,
  Heart,
  GraduationCap,
  DollarSign,
  ShoppingBag,
  Megaphone,
  ChevronRight,
  Play,
  Home
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  type: string;
  district?: string;
  sportsInterests?: string[];
  membershipFee?: number;
}

interface Event {
  id: number;
  name: string;
  description?: string;
  organizationName: string;
  registrationFee?: number;
  startDate: string;
  endDate: string;
  location?: string;
}

// Age-specific benefits data
const ageBenefits = {
  children: {
    title: "Children (5-12 years)",
    health: ["Physical development", "Motor skills improvement", "Healthy growth", "Immune system boost"],
    education: ["Teamwork skills", "Discipline", "Focus improvement", "Leadership basics"],
    financial: ["Scholarship opportunities", "Talent identification programs", "Equipment subsidies"]
  },
  teens: {
    title: "Teenagers (13-18 years)",
    health: ["Fitness maintenance", "Mental health", "Stress management", "Injury prevention"],
    education: ["Academic balance", "Career opportunities", "College scholarships", "Professional coaching"],
    financial: ["State level competitions", "National team selection", "Sponsorship opportunities"]
  },
  adults: {
    title: "Adults (19-35 years)",
    health: ["Fitness maintenance", "Weight management", "Cardiovascular health", "Stress relief"],
    education: ["Coaching certifications", "Sports management", "Referee training", "Fitness education"],
    financial: ["Career opportunities", "Sports business", "Coaching income", "Event management"]
  },
  seniors: {
    title: "Seniors (35+ years)",
    health: ["Joint health", "Flexibility", "Balance improvement", "Chronic disease prevention"],
    education: ["Mentoring opportunities", "Sports administration", "Experience sharing", "Volunteer roles"],
    financial: ["Masters competitions", "Coaching opportunities", "Sports consultancy", "Event organization"]
  }
};

export default function ComprehensiveHome() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  // Data queries
  const { data: featuredOrganizations = [] } = useQuery({
    queryKey: ["/api/organizations"],
    select: (data: any[]) => Array.isArray(data) ? data.slice(0, 6) : [],
  });

  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ["/api/events"],
    select: (data: any[]) => Array.isArray(data) ? data.slice(0, 4) : [],
  });

  const { data: sportsCategories = [] } = useQuery({
    queryKey: ["/api/sport-categories"],
    select: (data: any[]) => Array.isArray(data) ? data : [],
  });

  const sportsStats = [
    { label: "Active Organizations", value: "206+", icon: Building },
    { label: "Sports Categories", value: "25+", icon: Trophy },
    { label: "Active Athletes", value: "50K+", icon: Users },
    { label: "Championships", value: "150+", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Sportfolio
                  </span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/sports-guide">
                  <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Sports Guide
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="ghost" className="text-gray-600 hover:text-green-600">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Marketplace
                  </Button>
                </Link>
                <Link href="/live-scoring">
                  <Button variant="ghost" className="text-gray-600 hover:text-red-600">
                    <Play className="h-4 w-4 mr-2" />
                    Live Scoring
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user?.firstName}</span>
                  {user?.userType === 'athlete' && (
                    <Link href="/athlete-dashboard">
                      <Button size="sm">Dashboard</Button>
                    </Link>
                  )}
                  {user?.userType === 'organization' && (
                    <Link href="/organization-admin-dashboard">
                      <Button size="sm">Dashboard</Button>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Advertisement Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-3">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center space-x-4">
            <Megaphone className="h-5 w-5" />
            <span className="font-semibold">🎯 Special Offer: Join Kerala Sports League 2025-2026 - Early Bird Registration Now Open!</span>
            <Button size="sm" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              Register Now
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Kerala's Premier Sports Ecosystem
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect with 206+ sports organizations across Kerala. Join championships, find coaching, 
          access facilities, and build your sports career with blockchain-verified achievements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-5 w-5 mr-2" />
              Join as Athlete
            </Button>
          </Link>
          <Link href="/create-organization">
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              <Building className="h-5 w-5 mr-2" />
              Register Organization
            </Button>
          </Link>
        </div>
      </section>

      {/* Sports Statistics */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sportsStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Age-Specific Benefits */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Benefits Across All Ages</h2>
          <p className="text-gray-600">Discover how sports can transform your life at any age</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(ageBenefits).map((ageGroup, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg text-center">{ageGroup.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-sm">Health Benefits</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    {ageGroup.health.slice(0, 2).map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">Education</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    {ageGroup.education.slice(0, 2).map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Financial</span>
                  </div>
                  <ul className="text-xs space-y-1 text-gray-600">
                    {ageGroup.financial.slice(0, 2).map((benefit, idx) => (
                      <li key={idx}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Sports Categories */}
      <section className="container mx-auto px-6 py-16 bg-white rounded-2xl mx-6 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Sports</h2>
          <Link href="/sports-categories">
            <Button variant="outline">
              View All Sports <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Football", icon: "⚽", organizations: 42 },
            { name: "Cricket", icon: "🏏", organizations: 38 },
            { name: "Basketball", icon: "🏀", organizations: 25 },
            { name: "Swimming", icon: "🏊", organizations: 18 },
            { name: "Athletics", icon: "🏃", organizations: 35 },
            { name: "Volleyball", icon: "🏐", organizations: 22 },
            { name: "Badminton", icon: "🏸", organizations: 28 },
            { name: "Table Tennis", icon: "🏓", organizations: 20 },
            { name: "Tennis", icon: "🎾", organizations: 15 },
            { name: "Hockey", icon: "🏑", organizations: 12 },
            { name: "Wrestling", icon: "🤼", organizations: 8 },
            { name: "Boxing", icon: "🥊", organizations: 6 },
          ].map((sport, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-3xl mb-2">{sport.icon}</div>
                <div className="font-semibold text-sm">{sport.name}</div>
                <div className="text-xs text-gray-500">{sport.organizations} orgs</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Organizations */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Organizations</h2>
          <Link href="/organizations">
            <Button variant="outline">
              View All <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(featuredOrganizations) ? featuredOrganizations : []).slice(0, 6).map((org: Organization) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>{org.type}</CardDescription>
                  </div>
                  <Badge variant="secondary">{org.district}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {org.membershipFee && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      ₹{org.membershipFee} membership
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {org.sportsInterests?.slice(0, 3).map((sport, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full">
                    <Users className="h-3 w-3 mr-2" />
                    Join Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mx-6 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Upcoming Championships</h2>
          <p className="text-blue-100">Join exciting competitions across Kerala</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Kerala College Sports League 2025-2026",
              organization: "College Sports League Kerala",
              date: "March 2025",
              location: "Various Venues",
              fee: "5000",
              participants: "500+"
            },
            {
              name: "State Basketball Championship",
              organization: "Kerala Basketball Association",
              date: "February 2025",
              location: "Kochi",
              fee: "1500",
              participants: "200+"
            },
            {
              name: "Inter-District Football League",
              organization: "Kerala Football Association",
              date: "April 2025",
              location: "Thiruvananthapuram",
              fee: "2000",
              participants: "300+"
            },
            {
              name: "Swimming Championship",
              organization: "Kerala Aquatic Association",
              date: "May 2025",
              location: "Kozhikode",
              fee: "800",
              participants: "150+"
            }
          ].map((event, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm text-white border-white/20">
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="text-blue-100">{event.organization}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3" />
                    ₹{event.fee} registration
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    {event.participants} participants
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100">
                  <Trophy className="h-3 w-3 mr-2" />
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* eCommerce Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Sports Marketplace</h2>
          <p className="text-gray-600">Equipment, coaching, and services from verified providers</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Sports Equipment", icon: "🏀", description: "Quality gear for all sports" },
            { name: "Coaching Services", icon: "👨‍🏫", description: "Expert training sessions" },
            { name: "Nutrition Plans", icon: "🥗", description: "Sports nutrition guidance" },
            { name: "Fitness Programs", icon: "💪", description: "Customized workout plans" }
          ].map((item, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-semibold mb-2">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <Button size="sm" className="w-full mt-3">
                  <ShoppingBag className="h-3 w-3 mr-2" />
                  Browse
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16 text-center bg-gray-50 rounded-2xl mx-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Sports Journey?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of athletes and organizations building Kerala's sports future. 
          Get verified achievements, access premium facilities, and compete at the highest level.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">
              <Trophy className="h-5 w-5 mr-2" />
              Start Free Today
            </Button>
          </Link>
          <Link href="/live-scoring">
            <Button size="lg" variant="outline">
              <Activity className="h-5 w-5 mr-2" />
              Watch Live Matches
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-16 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Sportfolio</span>
            </div>
            <p className="text-sm text-gray-600">
              Kerala's comprehensive sports ecosystem platform connecting athletes, coaches, and organizations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Athletes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/signup">Join as Athlete</Link></li>
              <li><Link href="/organizations">Find Organizations</Link></li>
              <li><Link href="/events">Browse Events</Link></li>
              <li><Link href="/achievements">Track Achievements</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Organizations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/create-organization">Register Organization</Link></li>
              <li><Link href="/event-management">Event Management</Link></li>
              <li><Link href="/member-management">Member Management</Link></li>
              <li><Link href="/analytics">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/sports-guide">Sports Guide</Link></li>
              <li><Link href="/marketplace">Marketplace</Link></li>
              <li><Link href="/live-scoring">Live Scoring</Link></li>
              <li><Link href="/support">Support</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2025 Sportfolio. All rights reserved. Building Kerala's sports future.</p>
        </div>
      </footer>
    </div>
  );
}