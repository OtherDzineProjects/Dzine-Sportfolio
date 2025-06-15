import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authService } from "@/lib/auth";
import { Shield, User, Building, Briefcase, Dumbbell, MapPin } from "lucide-react";
import logoImage from "@assets/Sportfolio Logo with out background_1750012724737.png";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    userType: "athlete"
  });

  const userTypes = [
    { value: "athlete", label: "Athlete", icon: User, description: "Individual sports person" },
    { value: "coach", label: "Coach", icon: Dumbbell, description: "Sports trainer or mentor" },
    { value: "organization", label: "Organization", icon: Building, description: "Sports club or institution" },
    { value: "facility_manager", label: "Facility Manager", icon: Briefcase, description: "Sports facility operator" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await apiRequest("POST", endpoint, formData);
      const data = await response.json();

      authService.setAuth(data.user, data.token);
      
      toast({
        title: isLogin ? "Welcome back!" : "Account created successfully!",
        description: isLogin ? "You have been signed in." : "Your account has been created and you are now signed in.",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-blue-600 to-blockchain-blue flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-float">🏆</div>
        <div className="absolute top-32 right-20 text-4xl animate-float" style={{ animationDelay: '1s' }}>🏅</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-float" style={{ animationDelay: '2s' }}>🎯</div>
        <div className="absolute bottom-10 right-10 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>⚽</div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src={logoImage} 
              alt="Sportfolio Logo" 
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full flex items-center">
              <Shield className="mr-1" size={14} />
              Blockchain Secured Platform
            </span>
          </div>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-poppins font-bold text-center text-gray-900">
              {isLogin ? "Welcome Back" : "Join Sportfolio"}
            </CardTitle>
            <p className="text-center text-gray-600">
              {isLogin 
                ? "Sign in to access your sports ecosystem" 
                : "Create your account to start your sports journey"
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType">I am a...</Label>
                    <Select 
                      value={formData.userType} 
                      onValueChange={(value) => handleInputChange("userType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2" size={16} />
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-gray-500">{type.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-saffron-green text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-600 hover:text-saffron transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            {/* Features highlight */}
            <div className="border-t pt-6">
              <div className="text-center text-sm text-gray-600 mb-4">
                What you get with Sportfolio:
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center justify-center">
                  <Shield className="mr-2 text-blockchain-blue" size={12} />
                  Blockchain-verified achievements
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="mr-2 text-saffron" size={12} />
                  Access to 500+ sports facilities
                </div>
                <div className="flex items-center justify-center">
                  <User className="mr-2 text-indian-green" size={12} />
                  Connect with athletes & coaches
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
