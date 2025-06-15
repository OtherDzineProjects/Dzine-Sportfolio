import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Calendar, Timer, CheckCircle, Wrench, TrendingUp } from "lucide-react";

export default function ToolShowcase() {
  const [activeTab, setActiveTab] = useState("facility");

  const tabs = [
    { id: "facility", label: "Facility Management", icon: Building },
    { id: "fixtures", label: "Fixtures Management", icon: Calendar },
    { id: "scoring", label: "Live Scoring", icon: Timer },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold section-title text-gray-900 mb-4">
            Professional <span className="text-saffron">Management Tools</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced tools for sports professionals and organizations
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                className={`px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-saffron text-saffron"
                    : "border-transparent text-gray-600 hover:text-saffron"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="mr-2" size={16} />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Facility Management Tool */}
        {activeTab === "facility" && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-poppins font-bold text-3xl text-gray-900 mb-6">
                Comprehensive <span className="text-blue-600">Facility Management</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Streamline facility operations with booking management, maintenance tracking, and revenue analytics.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Booking System</h4>
                    <p className="text-gray-600">Real-time availability, automated scheduling, and conflict resolution.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Wrench className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Maintenance Tracking</h4>
                    <p className="text-gray-600">Schedule and track facility maintenance with automated reminders.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <TrendingUp className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Revenue Analytics</h4>
                    <p className="text-gray-600">Detailed financial reporting and utilization analytics.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              {/* Facility Management Dashboard Mock */}
              <Card className="shadow-lg">
                <div className="bg-blue-600 text-white p-4 rounded-t-xl">
                  <h4 className="font-semibold">Facility Dashboard</h4>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-gray-600">Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹2.4L</div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-gray-600">Pending Bookings</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">Court A</span>
                      <span className="text-green-600 text-sm">Available</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">Court B</span>
                      <span className="text-red-600 text-sm">Booked (10:00-12:00)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Swimming Pool</span>
                      <span className="text-yellow-600 text-sm">Maintenance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Fixtures Management Tool */}
        {activeTab === "fixtures" && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-poppins font-bold text-3xl text-gray-900 mb-6">
                Advanced <span className="text-green-600">Tournament Scheduling</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Automated bracket generation, scheduling optimization, and comprehensive tournament management.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Calendar className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Automated Bracket Generation</h4>
                    <p className="text-gray-600">AI-powered tournament brackets with seeding and optimization.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Conflict Resolution</h4>
                    <p className="text-gray-600">Automatic detection and resolution of scheduling conflicts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <TrendingUp className="text-green-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Multi-Sport Support</h4>
                    <p className="text-gray-600">Support for all Olympic and traditional Indian sports formats.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <Card className="shadow-lg">
                <div className="bg-green-600 text-white p-4 rounded-t-xl">
                  <h4 className="font-semibold">Tournament Bracket</h4>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center font-semibold text-gray-900 mb-4">Badminton Championship - Quarterfinals</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="font-medium">Match 1</div>
                        <div className="text-sm text-gray-600">Player A vs Player B</div>
                        <div className="text-xs text-green-600 mt-1">Court 1 - 10:00 AM</div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="font-medium">Match 2</div>
                        <div className="text-sm text-gray-600">Player C vs Player D</div>
                        <div className="text-xs text-green-600 mt-1">Court 2 - 10:00 AM</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="font-medium">Match 3</div>
                        <div className="text-sm text-gray-600">Player E vs Player F</div>
                        <div className="text-xs text-orange-600 mt-1">Court 1 - 11:30 AM</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-center">
                        <div className="font-medium">Match 4</div>
                        <div className="text-sm text-gray-600">Player G vs Player H</div>
                        <div className="text-xs text-orange-600 mt-1">Court 2 - 11:30 AM</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Live Scoring Tool */}
        {activeTab === "scoring" && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-poppins font-bold text-3xl text-gray-900 mb-6">
                Real-time <span className="text-red-600">Live Scoring</span>
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Professional live scoring system with real-time updates, leaderboards, and instant result publishing.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Timer className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Real-time Score Updates</h4>
                    <p className="text-gray-600">Instant score updates with live commentary and statistics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <TrendingUp className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Live Leaderboards</h4>
                    <p className="text-gray-600">Dynamic leaderboards with ranking changes and statistics.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="text-red-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Instant Results</h4>
                    <p className="text-gray-600">Automated result calculation and certificate generation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <Card className="shadow-lg">
                <div className="bg-red-600 text-white p-4 rounded-t-xl">
                  <h4 className="font-semibold">Live Match Scoring</h4>
                </div>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      Badminton Singles Final
                    </div>
                    <div className="text-sm text-gray-600">Court 1 - Live Now</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="font-semibold">Player A</div>
                      <div className="text-2xl font-bold text-blue-600">21</div>
                      <div className="text-sm text-gray-600">Set 1 Winner</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Player B</div>
                      <div className="text-2xl font-bold text-gray-600">18</div>
                      <div className="text-sm text-gray-600">Set 1</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Set 2 in Progress: 15-12
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
