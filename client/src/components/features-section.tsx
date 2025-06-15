import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, MapPin, Trophy, Check } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold section-title text-gray-900 mb-4">
            Comprehensive <span className="text-saffron">Sports Ecosystem</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to manage, participate, and excel in Indian sports
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="font-poppins font-bold text-3xl text-gray-900 mb-6">
              Blockchain-Verified <span className="text-blockchain-blue">Digital Certificates</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Immutable, verifiable achievements and certifications that can never be forged. Build trust in Indian sports with blockchain technology.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blockchain-blue/10 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="text-blockchain-blue" size={16} />
                </div>
                <span className="text-gray-700">Tamper-proof achievement records</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blockchain-blue/10 rounded-lg flex items-center justify-center mr-4">
                  <Trophy className="text-blockchain-blue" size={16} />
                </div>
                <span className="text-gray-700">Instant certificate verification</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blockchain-blue/10 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="text-blockchain-blue" size={16} />
                </div>
                <span className="text-gray-700">Internationally recognized credentials</span>
              </div>
            </div>
          </div>
          <Card className="shadow-xl border border-gray-200">
            <CardContent className="p-8">
              <div className="gradient-blue-blockchain text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">Achievement Certificate</h4>
                  <div className="flex items-center text-sm">
                    <Shield className="mr-1" size={16} />
                    Verified
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2">Athlete Name</div>
                <div className="text-blue-100">1st Place - State Level Championship</div>
                <div className="text-xs text-blue-200 mt-4">Blockchain Hash: 0x8a2b...c4d5</div>
              </div>
              <Button className="w-full bg-blockchain-blue text-white hover:bg-blue-700">
                Verify Certificate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-saffron/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-2xl text-saffron" size={32} />
              </div>
              <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                Multi-Stakeholder Platform
              </h3>
              <p className="text-gray-600 mb-6">
                Connect athletes, coaches, facilities, and organizations in one unified ecosystem.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Athlete profiles and portfolios
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Coach certification tracking
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Organization management tools
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-indian-green/10 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="text-2xl text-indian-green" size={32} />
              </div>
              <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                All-India Facility Network
              </h3>
              <p className="text-gray-600 mb-6">
                Access 500+ registered sports facilities across India with real-time booking capabilities.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Real-time availability checking
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Integrated payment system
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Facility ratings and reviews
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-deep-blue/10 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="text-2xl text-deep-blue" size={32} />
              </div>
              <h3 className="font-poppins font-bold text-xl text-gray-900 mb-4">
                Complete Event Management
              </h3>
              <p className="text-gray-600 mb-6">
                From local competitions to national championships, manage every aspect of sports events.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Tournament bracket generation
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Live scoring and results
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-2" size={12} />
                  Automated scheduling
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
