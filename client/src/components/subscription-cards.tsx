import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Building, Calendar, Timer } from "lucide-react";

export default function SubscriptionCards() {
  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold section-title text-gray-900 mb-4">
            Choose Your <span className="text-saffron">Sports Journey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible subscription plans designed for every stakeholder in the Indian sports ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <Card className="border-2 border-gray-200 hover:border-saffron transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                Athlete Basic
              </CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹299<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Perfect for individual athletes</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-indian-green mr-3" size={16} />
                  <span>Personal profile with blockchain verification</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-3" size={16} />
                  <span>Event registration & participation tracking</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-3" size={16} />
                  <span>Facility booking (5 bookings/month)</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-3" size={16} />
                  <span>Achievement certificates</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-indian-green mr-3" size={16} />
                  <span>Community forum access</span>
                </li>
              </ul>
              
              <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                Start Basic Plan
              </Button>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card className="gradient-saffron-green text-white transform scale-105 shadow-2xl relative">
            <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indian-green text-white">
              Most Popular
            </Badge>
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-poppins font-bold text-2xl mb-2">
                Organization Pro
              </CardTitle>
              <div className="text-4xl font-bold mb-2">
                ₹2,999<span className="text-lg opacity-80">/month</span>
              </div>
              <p className="opacity-90">For clubs & organizations</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span>Everything in Basic plan</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span><strong>Facility Management Tool</strong> - Full access</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span><strong>Fixtures Management Tool</strong> - Tournament scheduling</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span><strong>Live Scoring Tool</strong> - Real-time match scoring</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span>Revenue analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span>Unlimited facility bookings</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-3" size={16} />
                  <span>Priority customer support</span>
                </li>
              </ul>
              
              <Button className="w-full bg-white text-saffron hover:bg-gray-100">
                Start Pro Plan
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 border-gray-200 hover:border-deep-blue transition-all hover:shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="font-poppins font-bold text-2xl text-gray-900 mb-2">
                Enterprise
              </CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₹9,999<span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">For state sports councils</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>Everything in Pro plan</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>Multi-organization management</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>Advanced blockchain verification</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>Custom branding & white-label options</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>API access for integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-deep-blue mr-3" size={16} />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              
              <Button className="w-full bg-deep-blue text-white hover:bg-blue-800">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tool-specific Add-ons */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="font-poppins font-bold text-2xl text-center text-gray-900 mb-8">
            Individual Tool Access
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building className="text-2xl text-blue-600" size={32} />
                </div>
                <h4 className="font-semibold text-lg mb-2">Facility Management</h4>
                <p className="text-gray-600 text-sm mb-4">Booking, maintenance, revenue tracking</p>
                <div className="text-2xl font-bold text-gray-900 mb-4">₹999/month</div>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Add Tool
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-2xl text-green-600" size={32} />
                </div>
                <h4 className="font-semibold text-lg mb-2">Fixtures Management</h4>
                <p className="text-gray-600 text-sm mb-4">Tournament scheduling, brackets</p>
                <div className="text-2xl font-bold text-gray-900 mb-4">₹799/month</div>
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                  Add Tool
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Timer className="text-2xl text-red-600" size={32} />
                </div>
                <h4 className="font-semibold text-lg mb-2">Live Scoring</h4>
                <p className="text-gray-600 text-sm mb-4">Real-time match scoring, leaderboards</p>
                <div className="text-2xl font-bold text-gray-900 mb-4">₹599/month</div>
                <Button className="w-full bg-red-600 text-white hover:bg-red-700">
                  Add Tool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
