import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import logoPath from "@assets/Sportfolio Logo - new one edited_1751235594062.jpg";

export default function AuthModern() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "",
    phoneNumber: "",
    city: "",
    state: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginForm) => {
      const result = await apiRequest("POST", "/api/auth/login", data);
      return result;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      queryClient.invalidateQueries();
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      setAlert({
        show: true,
        message: error.message || "Invalid credentials. Please try again.",
        type: "error"
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof registerForm) => {
      const result = await apiRequest("POST", "/api/auth/register", data);
      return result;
    },
    onSuccess: () => {
      setAlert({
        show: true,
        message: "Registration successful! Your account is pending approval. You will be notified once approved.",
        type: "success"
      });
      setRegisterForm({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        userType: "",
        phoneNumber: "",
        city: "",
        state: "",
      });
    },
    onError: (error: any) => {
      setAlert({
        show: true,
        message: error.message || "An error occurred during registration.",
        type: "error"
      });
    },
  });

  // Clear alert when form fields change
  useEffect(() => {
    setAlert({ show: false, message: "", type: "error" });
  }, [loginForm.email, loginForm.password, registerForm.email]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-10 flex-col justify-center">
        <div className="max-w-md mx-auto text-center">
          <img 
            src={logoPath} 
            alt="Sportfolio" 
            className="h-24 mx-auto mb-8 filter brightness-110"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            Start your
          </h1>
          <h1 className="text-4xl font-bold text-white mb-6">
            Journey with Us
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Discover India's most comprehensive sports management platform with innovative features for athletes, coaches, and organizations.
          </p>
          
          {/* Background decoration */}
          <div className="mt-16">
            <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full flex items-center justify-center">
                <div className="text-6xl">🏆</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex items-center justify-center p-6 lg:p-10 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src={logoPath} 
              alt="Sportfolio" 
              className="h-16 mx-auto mb-4"
            />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-sm font-medium">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium">Sign Up</TabsTrigger>
            </TabsList>

            {alert.show && (
              <Alert className={`mb-6 ${alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                <AlertDescription>
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="login">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sign In</h2>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12"
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0">
                      Problem signing in?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">Don't have an account yet? </span>
                    <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0">
                      Create One
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</h2>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10 h-11"
                          value={registerForm.firstName}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          className="pl-10 h-11"
                          value={registerForm.lastName}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        placeholder="Choose a username"
                        className="pl-10 h-11"
                        value={registerForm.username}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, username: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 h-11"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 h-11"
                        value={registerForm.phoneNumber}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, phoneNumber: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-sm font-medium">User Type</Label>
                    <Select
                      value={registerForm.userType}
                      onValueChange={(value) =>
                        setRegisterForm({ ...registerForm, userType: value })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="athlete">Athlete</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                        <SelectItem value="organization">Organization</SelectItem>
                        <SelectItem value="facility_manager">Facility Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="city"
                          placeholder="Your city"
                          className="pl-10 h-11"
                          value={registerForm.city}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, city: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-medium">State</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="state"
                          placeholder="Your state"
                          className="pl-10 h-11"
                          value={registerForm.state}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, state: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10 h-11"
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({ ...registerForm, password: e.target.value })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium mt-6"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center">
                    <span className="text-sm text-gray-600">Already have an account? </span>
                    <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 p-0">
                      Sign In
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}