import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, Users, Star, Play, BookOpen, Heart, DollarSign, CreditCard, 
  MapPin, Search, Calendar, Building, ShoppingBag, Target, Clock,
  Activity, Brain, Shield, Medal, Zap, Flame
} from "lucide-react";

const sportsData = [
  {
    id: 1,
    name: "Football",
    category: "Team Sports",
    description: "The beautiful game that unites the world",
    rules: "11 players per team, 90-minute match, offside rule applies",
    court: "100-130 yards long, 50-100 yards wide grass field",
    equipment: "Ball, goalposts, cleats, shin guards",
    benefits: {
      "8-11": { health: "Improves coordination", education: "Teamwork skills", financial: "Youth leagues available" },
      "12-18": { health: "Builds endurance", education: "Leadership development", financial: "Scholarship opportunities" },
      "19-25": { health: "Peak fitness", education: "Strategic thinking", financial: "Professional career potential" },
      "26-35": { health: "Cardiovascular health", education: "Stress management", financial: "Coaching opportunities" },
      "36-50": { health: "Weight management", education: "Social connections", financial: "Business networking" },
      "50+": { health: "Joint mobility", education: "Mental agility", financial: "Senior leagues" }
    }
  },
  {
    id: 2,
    name: "Basketball",
    category: "Team Sports",
    description: "Fast-paced indoor sport requiring agility and precision",
    rules: "5 players per team, 4 quarters of 12 minutes each",
    court: "94 feet long, 50 feet wide hardwood court",
    equipment: "Ball, hoops, basketball shoes",
    benefits: {
      "8-11": { health: "Height development", education: "Hand-eye coordination", financial: "Local clubs" },
      "12-18": { health: "Muscle strength", education: "Quick decision making", financial: "College scholarships" },
      "19-25": { health: "Agility training", education: "Competitive spirit", financial: "Professional leagues" },
      "26-35": { health: "Cardio fitness", education: "Team building", financial: "Corporate leagues" },
      "36-50": { health: "Bone density", education: "Strategic planning", financial: "Coaching roles" },
      "50+": { health: "Balance improvement", education: "Social engagement", financial: "Recreation centers" }
    }
  },
  {
    id: 3,
    name: "Cricket",
    category: "Team Sports",
    description: "Traditional sport with rich heritage and strategy",
    rules: "11 players per team, various formats (Test, ODI, T20)",
    court: "22-yard pitch in oval field (minimum 150 yards diameter)",
    equipment: "Bat, ball, wickets, pads, helmet, gloves",
    benefits: {
      "8-11": { health: "Motor skills", education: "Patience and focus", financial: "Youth academies" },
      "12-18": { health: "Reflexes", education: "Mathematical thinking", financial: "State team selections" },
      "19-25": { health: "Stamina building", education: "Pressure handling", financial: "IPL opportunities" },
      "26-35": { health: "Mental fitness", education: "Leadership skills", financial: "Commentary careers" },
      "36-50": { health: "Active lifestyle", education: "Mentoring youth", financial: "Umpiring opportunities" },
      "50+": { health: "Gentle exercise", education: "Game analysis", financial: "Coaching positions" }
    }
  },
  {
    id: 4,
    name: "Tennis",
    category: "Individual Sports",
    description: "Precision sport requiring skill and mental strength",
    rules: "Singles or doubles, best of 3 or 5 sets",
    court: "78 feet long, 27 feet wide (36 feet for doubles)",
    equipment: "Racket, balls, tennis shoes, net",
    benefits: {
      "8-11": { health: "Coordination", education: "Discipline", financial: "Junior tournaments" },
      "12-18": { health: "Flexibility", education: "Mental toughness", financial: "Tennis scholarships" },
      "19-25": { health: "Full body workout", education: "Strategic thinking", financial: "Professional tours" },
      "26-35": { health: "Stress relief", education: "Goal setting", financial: "Teaching opportunities" },
      "36-50": { health: "Joint health", education: "Social networking", financial: "Club memberships" },
      "50+": { health: "Low impact exercise", education: "Cognitive function", financial: "Senior tournaments" }
    }
  },
  {
    id: 5,
    name: "Athletics",
    category: "Individual Sports",
    description: "Track and field events testing speed, strength, and endurance",
    rules: "Various events with specific rules (100m, marathon, high jump, etc.)",
    court: "400m track with field event areas",
    equipment: "Spikes, starting blocks, implements for field events",
    benefits: {
      "8-11": { health: "Basic fitness", education: "Goal achievement", financial: "School competitions" },
      "12-18": { health: "Physical development", education: "Self-improvement", financial: "State meets" },
      "19-25": { health: "Peak performance", education: "Dedication", financial: "Olympic potential" },
      "26-35": { health: "Endurance", education: "Time management", financial: "Marathon sponsorships" },
      "36-50": { health: "Cardiovascular health", education: "Personal challenges", financial: "Masters competitions" },
      "50+": { health: "Mobility", education: "Healthy aging", financial: "Walking clubs" }
    }
  },
  {
    id: 6,
    name: "Swimming",
    category: "Individual Sports",
    description: "Complete body exercise in water",
    rules: "Various strokes and distances, pool or open water",
    court: "25m or 50m pools, open water venues",
    equipment: "Swimwear, goggles, cap, training equipment",
    benefits: {
      "8-11": { health: "Water safety", education: "Breathing control", financial: "Swimming lessons" },
      "12-18": { health: "Lung capacity", education: "Time management", financial: "Competitive swimming" },
      "19-25": { health: "Full body fitness", education: "Mental resilience", financial: "Professional swimming" },
      "26-35": { health: "Low impact exercise", education: "Stress management", financial: "Coaching certification" },
      "36-50": { health: "Joint friendly", education: "Relaxation techniques", financial: "Aqua fitness instructor" },
      "50+": { health: "Therapeutic exercise", education: "Social swimming", financial: "Water therapy" }
    }
  }
];

const ageGroups = [
  { id: "8-11", label: "Kids (8-11 years)", icon: "🧒", color: "bg-yellow-100 text-yellow-800" },
  { id: "12-18", label: "Teens (12-18 years)", icon: "👦", color: "bg-blue-100 text-blue-800" },
  { id: "19-25", label: "Young Adults (19-25 years)", icon: "🧑", color: "bg-green-100 text-green-800" },
  { id: "26-35", label: "Adults (26-35 years)", icon: "👨", color: "bg-purple-100 text-purple-800" },
  { id: "36-50", label: "Middle Age (36-50 years)", icon: "👱", color: "bg-orange-100 text-orange-800" },
  { id: "50+", label: "Seniors (50+ years)", icon: "👴", color: "bg-gray-100 text-gray-800" }
];

export default function SportsContentHome() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("19-25");
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: advertisements } = useQuery({
    queryKey: ["/api/advertisements"],
    select: (data: any[]) => data || []
  });

  const { data: ecommerceProducts } = useQuery({
    queryKey: ["/api/ecommerce-products"],
    select: (data: any[]) => data?.slice(0, 4) || []
  });

  const filteredSports = sportsData.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sport.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SPORTFOLIO</h1>
              <span className="text-sm text-gray-500">It's time to play</span>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About Us</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              <Link href="/downloads" className="text-gray-700 hover:text-blue-600">Downloads</Link>
              <Link href="/discipline" className="text-gray-700 hover:text-blue-600">Discipline Diary</Link>
              <Link href="/feedback" className="text-gray-700 hover:text-blue-600">Send Feedback</Link>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                LOGIN
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                REGISTER
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Stadium Background */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">Discover Your Sport</h2>
            <p className="text-xl mb-6">Explore comprehensive sports content, rules, benefits, and opportunities for every age group</p>
            <div className="flex space-x-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Play className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner */}
      {advertisements && advertisements.length > 0 && (
        <section className="bg-gradient-to-r from-orange-500 to-red-500 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{advertisements[0]?.title}</h3>
                <p className="text-sm opacity-90">{advertisements[0]?.content}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Age Group Selection */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sports for Every Age</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the perfect sport for your age group with detailed information about rules, benefits, and opportunities
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Age Group Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {ageGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedAgeGroup(group.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAgeGroup === group.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{group.icon}</div>
                <div className="text-sm font-medium text-gray-900">{group.label.split(' ')[0]}</div>
                <div className="text-xs text-gray-500">{group.label.split(' ').slice(1).join(' ')}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Content Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSports.map((sport) => (
              <Card key={sport.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{sport.name}</CardTitle>
                    <Badge variant="secondary">{sport.category}</Badge>
                  </div>
                  <CardDescription>{sport.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Rules & Basics</h4>
                      <p className="text-sm text-gray-600">{sport.rules}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Playing Area</h4>
                      <p className="text-sm text-gray-600">{sport.court}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Equipment</h4>
                      <p className="text-sm text-gray-600">{sport.equipment}</p>
                    </div>

                    {/* Age-Specific Benefits */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Benefits for {ageGroups.find(g => g.id === selectedAgeGroup)?.label}
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-start space-x-2">
                          <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-red-700">Health: </span>
                            <span className="text-xs text-gray-600">
                              {sport.benefits[selectedAgeGroup as keyof typeof sport.benefits]?.health}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-blue-700">Educational: </span>
                            <span className="text-xs text-gray-600">
                              {sport.benefits[selectedAgeGroup as keyof typeof sport.benefits]?.education}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-green-700">Financial: </span>
                            <span className="text-xs text-gray-600">
                              {sport.benefits[selectedAgeGroup as keyof typeof sport.benefits]?.financial}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* eCommerce Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sportfolio Marketplace</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Buy and sell sports merchandise through our platform. From equipment to team jerseys, find everything you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {ecommerceProducts?.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-green-600">₹{product.price}</span>
                    <Button size="sm">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/marketplace">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Visit Full Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/events" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-sm mb-1">EVENTS</h3>
                  <p className="text-xs text-gray-600">Find Sports Events</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/facilities" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6">
                  <MapPin className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold text-sm mb-1">FACILITIES</h3>
                  <p className="text-xs text-gray-600">Book Venues</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/teams" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold text-sm mb-1">TEAMS</h3>
                  <p className="text-xs text-gray-600">Join or Create</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/scoring" className="group">
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <CardContent className="p-6">
                  <Trophy className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold text-sm mb-1">SCORING</h3>
                  <p className="text-xs text-gray-600">Live Matches</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GENERAL LINKS</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/disclaimer" className="hover:text-blue-400">Disclaimer</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-400">Terms & Conditions</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400">Frequently Asked Questions</Link></li>
                <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400">Contact Us</Link></li>
                <li><Link href="/feedback" className="hover:text-blue-400">Send Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">REACH US</h3>
              <div className="text-sm space-y-2">
                <p>Email: hello@sportfolio.in</p>
                <p>Phone: 0471 4000000</p>
                <p>Address: TG 20/229(2), Ground Floor, Kuthiravatom</p>
                <p>Lane, Kusumgram, Trivandrum 695021</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/marketplace" className="hover:text-blue-400">Marketplace</Link></li>
                <li><Link href="/events" className="hover:text-blue-400">Events</Link></li>
                <li><Link href="/facilities" className="hover:text-blue-400">Facilities</Link></li>
                <li><Link href="/teams" className="hover:text-blue-400">Teams</Link></li>
                <li><Link href="/scoring" className="hover:text-blue-400">Live Scoring</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">FOLLOW US</h3>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Facebook
                </Button>
                <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  Instagram
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>© 2025 Sportfolio - All rights reserved | Powered by Ozine Technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
}