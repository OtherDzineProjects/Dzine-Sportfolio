import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Trophy,
  Users,
  Building2,
  Shield,
  Star,
  ChevronRight,
  CheckCircle,
  BarChart3,
  Award,
  Target,
  Globe
} from "lucide-react";
import logoPath from "@assets/Sportfolio Logo - new one edited_1751235594062.jpg";

export default function Landing() {
  const features = [
    {
      icon: Trophy,
      title: "Achievement Tracking",
      description: "Track your sports achievements with blockchain verification for authenticity"
    },
    {
      icon: Users,
      title: "Organization Management",
      description: "Create and manage sports organizations with member roles and permissions"
    },
    {
      icon: Building2,
      title: "Facility Booking",
      description: "Book sports facilities and manage your training schedules efficiently"
    },
    {
      icon: Shield,
      title: "Secure Verification",
      description: "Blockchain-powered certificate verification ensures credibility"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics for sponsors and league committees"
    },
    {
      icon: Target,
      title: "Olympic Events Focus",
      description: "Specialized questionnaires covering all Olympic sports categories"
    }
  ];

  const benefits = [
    "College Sports League Kerala committee planning",
    "Sponsor ROI analysis and decision making",
    "User profile management with comprehensive data",
    "Sports interest questionnaires for event planning",
    "Organization facility availability tracking",
    "Excel export for analytical reporting"
  ];

  const stats = [
    { number: "2,500+", label: "Athletes" },
    { number: "150+", label: "Organizations" },
    { number: "85+", label: "Facilities" },
    { number: "500+", label: "Verified Achievements" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src={logoPath} alt="Sportfolio" className="h-20" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sportfolio
              <span className="block text-blue-600">Sports Ecosystem Platform</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive sports management platform for India featuring blockchain-verified achievements, 
              organization management, and analytics for College Sports League Kerala and sponsors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth-modern">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Sports Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From athlete profiles to organization management, Sportfolio provides 
              comprehensive tools for the entire sports ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Real-World Impact
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Sportfolio addresses genuine needs in the Indian sports ecosystem, 
                from committee planning to sponsor analytics.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-lg">Kerala Committee</CardTitle>
                      <p className="text-sm text-gray-500">League Planning</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Identify next-level leagues through comprehensive user and facility analytics
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div>
                      <CardTitle className="text-lg">Sponsor ROI</CardTitle>
                      <p className="text-sm text-gray-500">Analytics</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Data-driven insights for sponsors to make informed investment decisions
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg sm:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Trophy className="h-8 w-8 text-blue-600" />
                    <span>Blockchain Verification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Secure, immutable achievement verification ensuring the authenticity 
                    of sports credentials and certificates.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Sports Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of athletes, coaches, and organizations already using Sportfolio 
            to manage their sports ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth-modern">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Create Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <img src={logoPath} alt="Sportfolio" className="h-8" />
              <span className="text-white font-bold text-lg">Sportfolio</span>
            </div>
            
            <div className="flex space-x-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Sportfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}