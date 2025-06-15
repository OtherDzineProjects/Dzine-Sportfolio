import { Trophy, Users, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative gradient-blue-blockchain text-white py-20">
      {/* Traditional Indian sports pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-float">🏃‍♂️</div>
        <div className="absolute top-32 right-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>🏓</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-float" style={{ animationDelay: '2s' }}>🏐</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>🏅</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h1 className="font-poppins font-bold hero-title mb-6">
            Empowering <span className="text-saffron">Indian Sports</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Revolutionary blockchain-secured platform connecting athletes, coaches, facilities, and organizations across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-saffron hover:bg-orange-600 text-white font-semibold text-lg px-8 py-4">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-deep-blue font-semibold text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-saffron mb-2">28+</div>
            <div className="text-sm text-blue-100 flex items-center justify-center">
              <Trophy className="mr-1" size={16} />
              Olympic Sports
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-saffron mb-2">500+</div>
            <div className="text-sm text-blue-100 flex items-center justify-center">
              <MapPin className="mr-1" size={16} />
              Registered Facilities
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-saffron mb-2">10K+</div>
            <div className="text-sm text-blue-100 flex items-center justify-center">
              <Users className="mr-1" size={16} />
              Active Athletes
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-saffron mb-2">1000+</div>
            <div className="text-sm text-blue-100 flex items-center justify-center">
              <Calendar className="mr-1" size={16} />
              Events Managed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
