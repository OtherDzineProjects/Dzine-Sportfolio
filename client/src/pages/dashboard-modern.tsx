import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Building2, 
  UserCheck,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoPath from "@assets/Sportfolio_logo with white back ground_1751832551423.png";

export default function DashboardModern() {
  // Sample data - in real app this would come from your API
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Events",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Facilities",
      value: "89",
      change: "+3%",
      trend: "up",
      icon: Building2,
      color: "text-purple-600"
    },
    {
      title: "Certificates",
      value: "1,234",
      change: "+15%",
      trend: "up",
      icon: Trophy,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: "Rahul Sharma",
      action: "registered for Basketball Tournament",
      time: "2 hours ago",
      avatar: "RS"
    },
    {
      id: 2,
      user: "Priya Patel",
      action: "completed facility booking",
      time: "4 hours ago",
      avatar: "PP"
    },
    {
      id: 3,
      user: "Mumbai Sports Club",
      action: "created new event",
      time: "6 hours ago",
      avatar: "MS"
    },
    {
      id: 4,
      user: "Vikram Singh",
      action: "earned achievement certificate",
      time: "1 day ago",
      avatar: "VS"
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      name: "Ankit Kumar",
      type: "Athlete Registration",
      submitted: "2 days ago",
      status: "pending"
    },
    {
      id: 2,
      name: "Chennai Cricket Academy",
      type: "Organization Registration",
      submitted: "3 days ago",
      status: "pending"
    },
    {
      id: 3,
      name: "Sports Complex Bangalore",
      type: "Facility Registration",
      submitted: "1 week ago",
      status: "pending"
    }
  ];

  const quickActions = [
    {
      title: "Add Event",
      description: "Create new sports event",
      icon: Plus,
      action: "/events/create",
      color: "bg-blue-500"
    },
    {
      title: "User Management",
      description: "Manage user approvals",
      icon: UserCheck,
      action: "/admin",
      color: "bg-green-500"
    },
    {
      title: "Facility Booking",
      description: "Book sports facilities",
      icon: Building2,
      action: "/facilities",
      color: "bg-purple-500"
    },
    {
      title: "Live Scoring",
      description: "Start live match scoring",
      icon: Activity,
      action: "/live-scoring",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={logoPath} alt="Sportfolio" className="h-10" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className={`p-2 rounded ${action.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        {" "}
                        <span className="text-gray-600">{activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Pending Approvals</span>
                </div>
                <Badge variant="secondary">{pendingApprovals.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{approval.name}</p>
                      <p className="text-sm text-gray-500">{approval.type}</p>
                      <p className="text-xs text-gray-400">{approval.submitted}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Approvals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events & Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Inter-State Basketball Championship</p>
                    <p className="text-sm text-gray-500">Mumbai • March 15-20, 2025</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Registration Open</Badge>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">National Swimming Meet</p>
                    <p className="text-sm text-gray-500">Delhi • April 5-10, 2025</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">Upcoming</Badge>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Youth Cricket Tournament</p>
                    <p className="text-sm text-gray-500">Bangalore • April 20-25, 2025</p>
                    <Badge className="mt-2 bg-orange-100 text-orange-800">Planning</Badge>
                  </div>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">User Registrations</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Event Completion</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Facility Utilization</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Certificate Issuance</span>
                    <span className="font-medium">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}