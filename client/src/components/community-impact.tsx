import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Sprout } from "lucide-react";

export default function CommunityImpact() {
  return (
    <section className="py-20 bg-white" id="community">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-poppins font-bold section-title text-gray-900 mb-6">
              Building a <span className="text-indian-green">Healthier India</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our mission extends beyond sports management. We're creating a platform that steers youth away from unhealthy habits and towards a life of fitness, discipline, and achievement.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-indian-green/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Heart className="text-indian-green" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Youth Engagement Programs</h4>
                  <p className="text-gray-600">Initiatives to attract young people to sports and away from harmful substances.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-indian-green/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Users className="text-indian-green" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Building</h4>
                  <p className="text-gray-600">Forums, mentorship programs, and social features that build lasting connections.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-indian-green/10 rounded-lg flex items-center justify-center mr-4 mt-1">
                  <Sprout className="text-indian-green" size={16} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Elderly Wellness (Coming 2025)</h4>
                  <p className="text-gray-600">Special programs for senior citizens including walking groups and health camps.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Community Stats */}
          <Card className="bg-gradient-to-br from-indian-green to-green-600 text-white">
            <CardContent className="p-8">
              <h3 className="font-poppins font-bold text-2xl text-center mb-8">Community Impact</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <div className="text-green-100">Active Athletes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-green-100">Sports Facilities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">1,200+</div>
                  <div className="text-green-100">Certified Coaches</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">250+</div>
                  <div className="text-green-100">Organizations</div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-4">Latest Community Achievement</h4>
                <p className="text-green-100 text-sm">
                  "Kerala State Swimming Championship successfully managed with 500+ participants across 28 events. Zero disputes, 100% verified results."
                </p>
                <div className="text-xs text-green-200 mt-2">- Kerala Swimming Association</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
