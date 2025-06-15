import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import SubscriptionCards from "@/components/subscription-cards";
import FeaturesSection from "@/components/features-section";
import ToolShowcase from "@/components/tool-showcase";
import SportsCategories from "@/components/sports-categories";
import CommunityImpact from "@/components/community-impact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <SubscriptionCards />
      <FeaturesSection />
      <ToolShowcase />
      <SportsCategories />
      <CommunityImpact />
      
      {/* CTA Section */}
      <section className="py-20 gradient-blue-blockchain text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
            Ready to Transform Indian Sports?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes, coaches, and organizations already using Sportfolio to build a stronger sports ecosystem.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-saffron hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg">
              Start Free 30-Day Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-deep-blue px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Schedule Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-blue-200">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No setup fees
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              24/7 support
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
