import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, Check, Star, Building, Calendar, 
  Users, MapPin, Trophy, ShoppingCart, Plus,
  DollarSign, Package, Truck, Gift
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    duration: "Free Forever",
    features: [
      "Profile creation and management",
      "Basic event browsing",
      "Community participation",
      "Achievement tracking"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 2999,
    duration: "per month",
    recommended: true,
    features: [
      "All Basic features",
      "Create and manage organizations",
      "Create and manage facilities", 
      "Event creation and management",
      "Advanced analytics",
      "Priority support",
      "Advertisement placement",
      "Team management tools"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 9999,
    duration: "per month",
    features: [
      "All Pro features",
      "Unlimited organizations",
      "Unlimited facilities",
      "Unlimited events",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced reporting",
      "eCommerce integration",
      "Sponsor management"
    ]
  }
];

export default function SubscriptionManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Current subscription query
  const { data: currentSubscription } = useQuery({
    queryKey: ["/api/user-subscription"],
  });

  // Payment methods query
  const { data: paymentMethods } = useQuery({
    queryKey: ["/api/payment-methods"],
  });

  // eCommerce products query
  const { data: ecommerceProducts } = useQuery({
    queryKey: ["/api/ecommerce-products"],
  });

  // Subscription upgrade mutation
  const upgradeMutation = useMutation({
    mutationFn: async (data: { planId: string, paymentMethod: string }) => {
      return await apiRequest('POST', '/api/subscription/upgrade', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-subscription"] });
      toast({ title: "Subscription upgraded successfully!" });
      setShowPaymentDialog(false);
    },
    onError: () => {
      toast({ title: "Payment failed", description: "Please try again", variant: "destructive" });
    }
  });

  // Create organization mutation (requires subscription)
  const createOrganizationMutation = useMutation({
    mutationFn: async (orgData: any) => {
      return await apiRequest('POST', '/api/organizations/create', orgData);
    },
    onSuccess: () => {
      toast({ title: "Organization created successfully!" });
    }
  });

  // Create facility mutation (requires subscription)
  const createFacilityMutation = useMutation({
    mutationFn: async (facilityData: any) => {
      return await apiRequest('POST', '/api/facilities/create', facilityData);
    },
    onSuccess: () => {
      toast({ title: "Facility created successfully!" });
    }
  });

  // Create event mutation (requires subscription)
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      return await apiRequest('POST', '/api/events/create', eventData);
    },
    onSuccess: () => {
      toast({ title: "Event created successfully!" });
    }
  });

  const handleSubscribe = (planId: string) => {
    if (planId === "basic") {
      // Free plan - immediate activation
      upgradeMutation.mutate({ planId, paymentMethod: "free" });
    } else {
      setSelectedPlan(planId);
      setShowPaymentDialog(true);
    }
  };

  const handlePayment = () => {
    upgradeMutation.mutate({ planId: selectedPlan, paymentMethod });
  };

  const getCurrentPlanName = () => {
    return currentSubscription?.planId ? 
      subscriptionPlans.find(p => p.id === currentSubscription.planId)?.name || "Unknown" : 
      "No active subscription";
  };

  const canCreateOrganization = () => {
    return currentSubscription?.planId === "pro" || currentSubscription?.planId === "enterprise";
  };

  const canCreateFacility = () => {
    return currentSubscription?.planId === "pro" || currentSubscription?.planId === "enterprise";
  };

  const canCreateEvent = () => {
    return currentSubscription?.planId === "pro" || currentSubscription?.planId === "enterprise";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sportfolio Subscription Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your sports management needs. Upgrade to unlock advanced features and create organizations, facilities, and events.
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{getCurrentPlanName()}</p>
                  <p className="text-gray-600">
                    {currentSubscription.expiresAt ? 
                      `Expires on ${new Date(currentSubscription.expiresAt).toLocaleDateString()}` :
                      "Active subscription"
                    }
                  </p>
                </div>
                <Badge variant={currentSubscription.status === "active" ? "default" : "secondary"}>
                  {currentSubscription.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="subscription" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
            <TabsTrigger value="organization">Create Organization</TabsTrigger>
            <TabsTrigger value="facility">Create Facility</TabsTrigger>
            <TabsTrigger value="ecommerce">eCommerce Store</TabsTrigger>
          </TabsList>

          {/* Subscription Plans Tab */}
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.recommended ? 'border-blue-500 shadow-lg' : ''}`}>
                  {plan.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500">Recommended</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      ₹{plan.price.toLocaleString()}
                      <span className="text-sm text-gray-600 font-normal">/{plan.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.recommended ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={currentSubscription?.planId === plan.id}
                    >
                      {currentSubscription?.planId === plan.id ? "Current Plan" : 
                       plan.price === 0 ? "Select Free Plan" : "Upgrade Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Organization Tab */}
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Create Sports Organization
                </CardTitle>
                <CardDescription>
                  Create and manage your sports organization. Requires Pro or Enterprise subscription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {canCreateOrganization() ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Organization Name</label>
                        <Input placeholder="Enter organization name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Organization Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="club">Sports Club</SelectItem>
                            <SelectItem value="academy">Sports Academy</SelectItem>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="college">College</SelectItem>
                            <SelectItem value="association">Association</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Fee</label>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-lg font-semibold">₹5,000</span>
                        <span className="text-gray-600">one-time setup fee</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      Create Organization (₹5,000)
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Subscription Required</h3>
                    <p className="text-gray-600 mb-4">
                      You need a Pro or Enterprise subscription to create organizations.
                    </p>
                    <Button onClick={() => handleSubscribe("pro")}>
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Facility Tab */}
          <TabsContent value="facility">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Create Sports Facility
                </CardTitle>
                <CardDescription>
                  Register and manage your sports facility. Requires Pro or Enterprise subscription.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {canCreateFacility() ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Facility Name</label>
                        <Input placeholder="Enter facility name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Sports Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="cricket">Cricket</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="badminton">Badminton</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Fee</label>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-lg font-semibold">₹8,000</span>
                        <span className="text-gray-600">one-time setup fee</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      Create Facility (₹8,000)
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Subscription Required</h3>
                    <p className="text-gray-600 mb-4">
                      You need a Pro or Enterprise subscription to create facilities.
                    </p>
                    <Button onClick={() => handleSubscribe("pro")}>
                      Upgrade to Pro
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* eCommerce Store Tab */}
          <TabsContent value="ecommerce">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Sportfolio eCommerce Store
                  </CardTitle>
                  <CardDescription>
                    Buy and sell sports merchandise through our integrated marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">Featured Products</h3>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      List Your Product
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ecommerceProducts?.map((product: any) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-200">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">₹{product.price?.toLocaleString()}</span>
                            <Button size="sm">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Seller Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Seller Dashboard
                  </CardTitle>
                  <CardDescription>
                    Manage your product listings and sales
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-semibold">Total Products</h4>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Truck className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-semibold">Orders Shipped</h4>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <h4 className="font-semibold">Total Revenue</h4>
                      <p className="text-2xl font-bold">₹1,23,450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Your Subscription</DialogTitle>
              <DialogDescription>
                Choose your payment method to upgrade to {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                  <Input placeholder="Cardholder Name" />
                </div>
              )}

              {paymentMethod === "upi" && (
                <Input placeholder="UPI ID (e.g., user@paytm)" />
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Plan: {subscriptionPlans.find(p => p.id === selectedPlan)?.name}</span>
                  <span className="font-semibold">
                    ₹{subscriptionPlans.find(p => p.id === selectedPlan)?.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={upgradeMutation.isPending}
              >
                {upgradeMutation.isPending ? "Processing..." : "Complete Payment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}