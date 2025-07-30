import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Building2, 
  Shield, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Loader2
} from "lucide-react";

interface UserApproval {
  id: number;
  userId: number;
  requestType: string;
  requestData: any;
  status: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    phone?: string;
    city?: string;
    district?: string;
    createdAt: string;
  };
}

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApproval, setSelectedApproval] = useState<UserApproval | null>(null);
  const [comments, setComments] = useState("");
  const [reason, setReason] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Get pending approvals
  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/admin/approvals"],
  });

  // Get all users
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Get current user
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async ({ approvalId, comments }: { approvalId: number; comments: string }) => {
      const response = await apiRequest("POST", `/api/admin/approvals/${approvalId}/approve`, { comments });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Approved Successfully! ✅",
        description: "The user has been approved and can now access the platform.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowApprovalModal(false);
      setComments("");
      setSelectedApproval(null);
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    },
  });

  // Reject user mutation
  const rejectUserMutation = useMutation({
    mutationFn: async ({ approvalId, reason }: { approvalId: number; reason: string }) => {
      const response = await apiRequest("POST", `/api/admin/approvals/${approvalId}/reject`, { reason });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Rejected",
        description: "The user registration has been rejected with the provided reason.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowRejectionModal(false);
      setReason("");
      setSelectedApproval(null);
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (approval: UserApproval) => {
    setSelectedApproval(approval);
    setShowApprovalModal(true);
  };

  const handleReject = (approval: UserApproval) => {
    setSelectedApproval(approval);
    setShowRejectionModal(true);
  };

  const handleViewDetails = (approval: UserApproval) => {
    setSelectedApproval(approval);
    setShowDetailsModal(true);
  };

  const confirmApproval = () => {
    if (selectedApproval) {
      approveUserMutation.mutate({
        approvalId: selectedApproval.id,
        comments: comments || "Approved by Super Admin"
      });
    }
  };

  const confirmRejection = () => {
    if (selectedApproval && reason.trim()) {
      rejectUserMutation.mutate({
        approvalId: selectedApproval.id,
        reason: reason.trim()
      });
    }
  };

  // Check if current user is super admin
  if (!currentUser || currentUser.userType !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              Super Admin access required to view this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Super Admin Dashboard 👑
                  </h1>
                  <p className="text-purple-100">
                    Welcome, {currentUser.firstName}! Manage user approvals and system administration.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('auth_token');
                      window.location.href = '/login';
                    }}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Shield className="h-16 w-16 opacity-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingApprovals?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {allUsers?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved Users</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allUsers?.filter((user: any) => user.approvalStatus === 'approved').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected Users</p>
                  <p className="text-2xl font-bold text-red-600">
                    {allUsers?.filter((user: any) => user.approvalStatus === 'rejected').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span>Pending User Approvals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {approvalsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : pendingApprovals?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((approval: UserApproval) => (
                        <TableRow key={approval.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {approval.user.firstName} {approval.user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{approval.user.username}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {approval.user.userType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{approval.user.email}</span>
                              </div>
                              {approval.user.phone && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{approval.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {approval.user.city && approval.user.district && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{approval.user.city}, {approval.user.district}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(approval.createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(approval)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(approval)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(approval)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                    <p className="text-muted-foreground">
                      No pending user approvals at the moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>All Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : allUsers?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User Details</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{user.username}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.userType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              user.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                              user.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {user.approvalStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-1 mt-1">
                                  <Phone className="h-3 w-3" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {user.city && user.district && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{user.city}, {user.district}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(user.createdAt).toLocaleDateString('en-GB')}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
                    <p className="text-muted-foreground">
                      No users have been registered yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Registration Details</DialogTitle>
              <DialogDescription>
                Review complete user information before making approval decision
              </DialogDescription>
            </DialogHeader>
            {selectedApproval && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="text-sm">{selectedApproval.user.firstName} {selectedApproval.user.lastName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="text-sm">@{selectedApproval.user.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedApproval.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">User Type</Label>
                    <Badge variant="outline">{selectedApproval.user.userType}</Badge>
                  </div>
                  {selectedApproval.user.phone && (
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm">{selectedApproval.user.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium">Registration Date</Label>
                    <p className="text-sm">{new Date(selectedApproval.user.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>
                
                {(selectedApproval.user.city || selectedApproval.user.district) && (
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{selectedApproval.user.city}, {selectedApproval.user.district}, Kerala</p>
                  </div>
                )}

                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Please review all information carefully before approving or rejecting this user registration.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleReject(selectedApproval);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleApprove(selectedApproval);
                    }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Approval Modal */}
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve User Registration</DialogTitle>
              <DialogDescription>
                You are about to approve {selectedApproval?.user.firstName} {selectedApproval?.user.lastName}'s registration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments about this approval..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={confirmApproval}
                  disabled={approveUserMutation.isPending}
                >
                  {approveUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    "Confirm Approval"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rejection Modal */}
        <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject User Registration</DialogTitle>
              <DialogDescription>
                You are about to reject {selectedApproval?.user.firstName} {selectedApproval?.user.lastName}'s registration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowRejectionModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={rejectUserMutation.isPending || !reason.trim()}
                >
                  {rejectUserMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}