import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Check, 
  X,
  Clock,
  Bell,
  Calendar,
  Plus,
  Send,
  UserCheck,
  CreditCard,
  Settings
} from "lucide-react";

interface MembershipRequest {
  id: number;
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    userType: string;
  };
  organizationId: number;
  status: string;
  membershipFee?: number;
  requestedAt: string;
}

interface Event {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationFee?: number;
  maxParticipants?: number;
}

export default function OrganizationAdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("requests");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  // Get organization info
  const { data: organizationInfo } = useQuery({
    queryKey: ["/api/admin/organization-info"],
    retry: false,
  });

  // Fetch membership requests
  const { data: membershipRequests = [] } = useQuery({
    queryKey: ["/api/admin/membership-requests"],
    retry: false,
  });

  // Fetch approved members
  const { data: approvedMembers = [] } = useQuery({
    queryKey: ["/api/admin/members"],
    retry: false,
  });

  // Fetch organization events
  const { data: organizationEvents = [] } = useQuery({
    queryKey: ["/api/admin/events"],
    retry: false,
  });

  // Approve/reject membership
  const membershipActionMutation = useMutation({
    mutationFn: async ({ membershipId, action, membershipFee }: { 
      membershipId: number; 
      action: 'approve' | 'reject'; 
      membershipFee?: number;
    }) => {
      const response = await apiRequest("PUT", `/api/admin/membership-requests/${membershipId}`, {
        action,
        membershipFee
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.action === 'approve' ? "Member Approved! ✅" : "Request Rejected",
        description: variables.action === 'approve' 
          ? "The athlete has been added to your organization and will receive notifications." 
          : "The membership request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/membership-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/members"] });
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create event
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/admin/events", eventData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Created! 🎉",
        description: "Your event has been created and members will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      setEventDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Event Creation Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Send notification
  const sendNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      const response = await apiRequest("POST", "/api/admin/send-notification", notificationData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent! 📢",
        description: "All approved members will receive this notification.",
      });
      setNotificationDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Notification Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const pendingRequests = membershipRequests.filter((r: MembershipRequest) => r.status === 'pending');

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Organization Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {organizationInfo?.name} - {organizationInfo?.type}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Notification to Members</DialogTitle>
                <DialogDescription>
                  This will be sent to all approved members of your organization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                sendNotificationMutation.mutate({
                  title: formData.get('title'),
                  content: formData.get('content'),
                  type: formData.get('type') || 'announcement'
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" required />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <select id="type" name="type" className="w-full p-2 border rounded">
                      <option value="announcement">General Announcement</option>
                      <option value="event_notification">Event Notification</option>
                      <option value="championship_call">Championship Call</option>
                      <option value="course_announcement">Course/Seminar</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setNotificationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={sendNotificationMutation.isPending}>
                      {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Create an event or championship for your members
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createEventMutation.mutate({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  startDate: formData.get('startDate'),
                  endDate: formData.get('endDate'),
                  registrationFee: formData.get('registrationFee') ? Number(formData.get('registrationFee')) : null,
                  maxParticipants: formData.get('maxParticipants') ? Number(formData.get('maxParticipants')) : null,
                  location: formData.get('location')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Event Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input id="startDate" name="startDate" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input id="endDate" name="endDate" type="date" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="registrationFee">Registration Fee (₹)</Label>
                      <Input id="registrationFee" name="registrationFee" type="number" step="0.01" />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input id="maxParticipants" name="maxParticipants" type="number" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createEventMutation.isPending}>
                      {createEventMutation.isPending ? "Creating..." : "Create Event"}
                    </Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Approved athletes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizationEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Ongoing events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0</div>
            <p className="text-xs text-muted-foreground">
              From memberships & events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        {[
          { key: "requests", label: "Membership Requests", icon: Clock },
          { key: "members", label: "Members", icon: Users },
          { key: "events", label: "Events", icon: Calendar }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={selectedTab === tab.key ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab(tab.key)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.key === "requests" && pendingRequests.length > 0 && (
              <Badge className="ml-1">{pendingRequests.length}</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "requests" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Membership Requests</h3>
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request: MembershipRequest) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {request.user.firstName} {request.user.lastName}
                        </CardTitle>
                        <CardDescription>
                          {request.user.userType} • {request.user.email}
                        </CardDescription>
                        {request.user.phone && (
                          <p className="text-sm text-muted-foreground">{request.user.phone}</p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Requested: {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => membershipActionMutation.mutate({
                            membershipId: request.id,
                            action: 'reject'
                          })}
                          disabled={membershipActionMutation.isPending}
                        >
                          <X className="h-3 w-3 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => membershipActionMutation.mutate({
                            membershipId: request.id,
                            action: 'approve',
                            membershipFee: organizationInfo?.membershipFee || 0
                          })}
                          disabled={membershipActionMutation.isPending}
                        >
                          <Check className="h-3 w-3 mr-2" />
                          Approve
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

      {selectedTab === "members" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Approved Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedMembers.map((member: any) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {member.user.firstName} {member.user.lastName}
                  </CardTitle>
                  <CardDescription>
                    {member.user.userType} • Member since {new Date(member.approvedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{member.user.email}</p>
                    {member.user.phone && (
                      <p className="text-sm text-muted-foreground">{member.user.phone}</p>
                    )}
                    <Badge className="bg-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Active Member
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedTab === "events" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Organization Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizationEvents.map((event: Event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-base">{event.name}</CardTitle>
                  <CardDescription>
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    {event.registrationFee && (
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-3 w-3" />
                        ₹{event.registrationFee} registration fee
                      </div>
                    )}
                    {event.maxParticipants && (
                      <p className="text-sm text-muted-foreground">
                        Max participants: {event.maxParticipants}
                      </p>
                    )}
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}