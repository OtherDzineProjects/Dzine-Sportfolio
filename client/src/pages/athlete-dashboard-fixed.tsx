import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  CreditCard, 
  Bell, 
  Users, 
  Calendar, 
  Trophy,
  MapPin,
  Tag,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Target,
  Home
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  type: string;
  district?: string;
  sportsInterests?: string[];
  membershipFee?: number;
}

interface Membership {
  id: number;
  organizationId: number;
  organization: Organization;
  status: string;
  membershipFee?: number;
  paymentStatus: string;
  requestedAt: string;
}

interface Notification {
  id: number;
  title: string;
  content: string;
  type: string;
  organizationId?: number;
  eventId?: number;
  isRead: boolean;
  createdAt: string;
}

interface Event {
  id: number;
  name: string;
  description?: string;
  organizationName: string;
  registrationFee?: number;
  startDate: string;
  endDate: string;
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
}

export default function AthleteDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Data queries
  const { data: membershipData } = useQuery({
    queryKey: ["/api/athlete/membership"],
    retry: false,
  });

  const { data: organizationMemberships = [] } = useQuery({
    queryKey: ["/api/athlete/organization-memberships"],
    retry: false,
  });

  const { data: availableEvents = [] } = useQuery({
    queryKey: ["/api/athlete/events"],
    retry: false,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/athlete/notifications"],
    retry: false,
  });

  const { data: availableOrganizations = [] } = useQuery({
    queryKey: ["/api/organizations"],
    retry: false,
  });

  // Subscribe to membership
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/athlete/subscribe", {
        membershipType: "annual",
        paymentAmount: 268.80
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Successful! 🎉",
        description: "Welcome to Sportfolio! You now have access to all premium features.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/membership"] });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  // Tag organization
  const tagOrganizationMutation = useMutation({
    mutationFn: async (organizationId: number) => {
      const response = await apiRequest("POST", "/api/athlete/tag-organization", {
        organizationId
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Organization Tagged! ✨",
        description: "Your request has been sent for approval. You'll be notified once approved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/organization-memberships"] });
    },
    onError: (error: any) => {
      toast({
        title: "Tagging Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Register for event
  const registerEventMutation = useMutation({
    mutationFn: async ({ eventId, registrationFee }: { eventId: number; registrationFee?: number }) => {
      const response = await apiRequest("POST", "/api/athlete/register-event", {
        eventId,
        registrationFee
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful! 🏆",
        description: "You've been registered for the event. Check your notifications for updates.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/athlete/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const hasActiveMembership = (membershipData as any)?.subscriptionStatus === 'active';
  const unreadNotifications = Array.isArray(notifications) ? notifications.filter((n: Notification) => !n.isRead).length : 0;
  const membershipsList = Array.isArray(organizationMemberships) ? organizationMemberships : [];
  const eventsList = Array.isArray(availableEvents) ? availableEvents : [];
  const notificationsList = Array.isArray(notifications) ? notifications : [];
  const organizationsList = Array.isArray(availableOrganizations) ? availableOrganizations : [];

  const tabs = [
    { key: "overview", label: "Overview", icon: Target },
    { key: "organizations", label: "Organizations", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Athlete Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}!</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            className="relative"
            onClick={() => setSelectedTab("notifications")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Membership Status Alert */}
      {!hasActiveMembership && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">Get Started with Sportfolio</h3>
                <p className="text-blue-700">Subscribe now to access organization tagging and premium features</p>
                <p className="text-sm text-blue-600 mt-1">₹240 + GST per year</p>
              </div>
              <Button 
                onClick={() => subscribeMutation.mutate()}
                disabled={subscribeMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {subscribeMutation.isPending ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={selectedTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab(tab.key)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.key === "notifications" && unreadNotifications > 0 && (
              <Badge className="ml-1">{unreadNotifications}</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasActiveMembership ? "Active" : "Inactive"}
              </div>
              <Badge variant={hasActiveMembership ? "default" : "secondary"} className="mt-2">
                {hasActiveMembership ? "Premium Member" : "Free User"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tagged Organizations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{membershipsList.length}</div>
              <p className="text-xs text-muted-foreground">
                {membershipsList.filter((m: Membership) => m.status === 'approved').length} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsList.length}</div>
              <p className="text-xs text-muted-foreground">
                From your organizations
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === "organizations" && (
        <div className="space-y-6">
          {/* My Organization Memberships */}
          <div>
            <h3 className="text-lg font-semibold mb-4">My Organization Memberships</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipsList.map((membership: Membership) => (
                <Card key={membership.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{membership.organization.name}</CardTitle>
                        <CardDescription>{membership.organization.type}</CardDescription>
                      </div>
                      <Badge 
                        variant={
                          membership.status === 'approved' ? 'default' : 
                          membership.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {membership.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {membership.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {membership.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                        {membership.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {membership.organization.district}
                      </div>
                      {membership.membershipFee && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          ₹{membership.membershipFee} membership fee
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {membership.organization.sportsInterests?.slice(0, 3).map((sport, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {sport}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Organizations to Tag */}
          {hasActiveMembership && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Organizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {organizationsList
                  .filter((org: Organization) => 
                    !membershipsList.find((m: Membership) => m.organizationId === org.id)
                  )
                  .slice(0, 6)
                  .map((org: Organization) => (
                    <Card key={org.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-base">{org.name}</CardTitle>
                        <CardDescription>{org.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-3 w-3" />
                            {org.district}
                          </div>
                          {org.membershipFee && (
                            <div className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-3 w-3" />
                              ₹{org.membershipFee} membership fee
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {org.sportsInterests?.slice(0, 2).map((sport, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {sport}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => tagOrganizationMutation.mutate(org.id)}
                            disabled={tagOrganizationMutation.isPending}
                          >
                            <Tag className="h-3 w-3 mr-2" />
                            Tag Organization
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedTab === "events" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Events & Championships</h3>
          {!hasActiveMembership ? (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <p className="text-center text-orange-700">
                  Subscribe to Sportfolio to see events from your organizations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsList.map((event: Event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    <CardDescription>{event.organizationName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        )}
                        {event.registrationFee && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            ₹{event.registrationFee} registration fee
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {event.currentParticipants || 0}/{event.maxParticipants || "∞"} participants
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => registerEventMutation.mutate({
                            eventId: event.id,
                            registrationFee: event.registrationFee
                          })}
                          disabled={registerEventMutation.isPending}
                        >
                          <Trophy className="h-3 w-3 mr-2" />
                          Register
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === "notifications" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notifications & Updates</h3>
          {!hasActiveMembership ? (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <p className="text-center text-orange-700">
                  Subscribe to Sportfolio to receive notifications from your organizations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notificationsList.map((notification: Notification) => (
                <Card key={notification.id} className={`${!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      <Badge variant={notification.isRead ? "secondary" : "default"} className="text-xs">
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{notification.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                      {!notification.isRead && (
                        <Badge variant="outline" className="text-xs">
                          <Bell className="h-2 w-2 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}