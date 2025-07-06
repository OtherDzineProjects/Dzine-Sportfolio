import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import logoImage from "@assets/Sportfolio_logo with white back ground_1751832551423.png";

export default function Navbar() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHindi, setIsHindi] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b-4 border-saffron sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src={logoImage} 
                alt="Sportfolio Logo" 
                className="h-20 w-auto cursor-pointer"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-1">
              <span className="px-2 py-1 bg-blockchain-blue text-white text-xs rounded-full flex items-center">
                <Shield className="mr-1" size={12} />
                Blockchain Secured
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-700 hover:text-saffron transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-saffron transition-colors">
              Pricing
            </Link>
            <Link href="#community" className="text-gray-700 hover:text-saffron transition-colors">
              Community
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-saffron transition-colors">
              Admin
            </Link>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">EN</span>
              <button
                onClick={() => setIsHindi(!isHindi)}
                className={`w-8 h-5 rounded-full p-1 transition-colors ${
                  isHindi ? 'bg-saffron' : 'bg-gray-200'
                }`}
              >
                <div 
                  className={`w-3 h-3 bg-white rounded-full shadow transform transition-transform ${
                    isHindi ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-gray-500">हि</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/auth" className="hidden md:block text-gray-700 hover:text-saffron transition-colors">
              Sign In
            </Link>
            <Link href="/auth">
              <Button className="gradient-saffron-green text-white hover:shadow-lg transition-all">
                Get Started
              </Button>
            </Link>
            
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link href="#features" className="block py-2 text-gray-700 hover:text-saffron">
                Features
              </Link>
              <Link href="#pricing" className="block py-2 text-gray-700 hover:text-saffron">
                Pricing
              </Link>
              <Link href="#community" className="block py-2 text-gray-700 hover:text-saffron">
                Community
              </Link>
              <Link href="/auth" className="block py-2 text-gray-700 hover:text-saffron">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
