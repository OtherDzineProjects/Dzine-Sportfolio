import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginData>>({});

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Check if user needs to complete sports questionnaire
        const shouldShowQuestionnaire = !data.user.sportsInterests?.length || !data.user.completedQuestionnaire;
        
        toast({
          title: "Welcome back! 🎉",
          description: shouldShowQuestionnaire 
            ? "Complete your sports profile to get started!" 
            : `Welcome back, ${data.user.firstName}!`,
        });
        
        // Invalidate queries to refresh user data
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        // Navigate to dashboard
        navigate("/user-dashboard-clean");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <img 
              src="/assets/sportfolio-logo.png" 
              alt="Sportfolio Logo" 
              className="h-16 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back!
          </CardTitle>
          <CardDescription>
            Sign in to your Sportfolio account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Login Helper */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 text-sm mb-3">🔑 Quick Test Accounts:</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button 
                type="button"
                onClick={() => setFormData({ email: "superadmin@sportfolio.com", password: "SportfolioAdmin123" })}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-blue-700">Super Admin</div>
                <div className="text-gray-600">superadmin@sportfolio.com</div>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ email: "mysportfolioindia@gmail.com", password: "SportfolioIndia" })}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-green-700">Admin (Ahammed Sukarno)</div>
                <div className="text-gray-600">mysportfolioindia@gmail.com</div>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ email: "emailcslkerala@gmail.com", password: "CSLKerala" })}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-purple-700">Sports Director</div>
                <div className="text-gray-600">emailcslkerala@gmail.com</div>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({ email: "ahammedsukarno@gmail.com", password: "test123" })}
                className="text-left p-2 bg-white rounded border hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-orange-700">Approved Athlete</div>
                <div className="text-gray-600">ahammedsukarno@gmail.com</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up here
              </Link>
            </div>

            {/* Demo Accounts Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts for Testing:</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">Super Admin</div>
                  <div>Email: superadmin@sportfolio.com</div>
                  <div>Password: SportfolioAdmin123</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">Admin</div>
                  <div>Email: mysportfolioindia@gmail.com</div>
                  <div>Password: SportfolioIndia</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">Sports Director</div>
                  <div>Email: emailcslkerala@gmail.com</div>
                  <div>Password: CSLKerala</div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}