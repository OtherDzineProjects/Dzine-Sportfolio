import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Users, Shield, Settings, UserCheck, UserX } from "lucide-react";

interface UserApproval {
  id: number;
  userId: number;
  requestType: string;
  status: string;
  requestData: any;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
  };
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  approvalStatus: string;
  isActive: boolean;
  roleId?: number;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  level: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApproval, setSelectedApproval] = useState<UserApproval | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  // Fetch pending approvals
  const { data: approvals, isLoading: approvalsLoading } = useQuery({
    queryKey: ["/api/admin/approvals"],
  });

  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch roles
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["/api/admin/roles"],
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async ({ approvalId, comments }: { approvalId: number; comments?: string }) => {
      return await apiRequest("POST", `/api/admin/approvals/${approvalId}/approve`, { comments });
    },
    onSuccess: () => {
      toast({
        title: "User Approved",
        description: "User has been successfully approved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedApproval(null);
      setApprovalComments("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    },
  });

  // Reject user mutation
  const rejectUserMutation = useMutation({
    mutationFn: async ({ approvalId, reason }: { approvalId: number; reason: string }) => {
      return await apiRequest("POST", `/api/admin/approvals/${approvalId}/reject`, { reason });
    },
    onSuccess: () => {
      toast({
        title: "User Rejected",
        description: "User registration has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/approvals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedApproval(null);
      setRejectReason("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject user",
        variant: "destructive",
      });
    },
  });

  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status, reason }: { userId: number; status: string; reason?: string }) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}/status`, { status, reason });
    },
    onSuccess: () => {
      toast({
        title: "User Status Updated",
        description: "User status has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      return await apiRequest("POST", `/api/admin/users/${userId}/role`, { roleId });
    },
    onSuccess: () => {
      toast({
        title: "Role Assigned",
        description: "Role has been successfully assigned to user",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (approval: UserApproval) => {
    setSelectedApproval(approval);
  };

  const handleReject = (approval: UserApproval) => {
    setSelectedApproval(approval);
  };

  const confirmApproval = () => {
    if (selectedApproval) {
      approveUserMutation.mutate({
        approvalId: selectedApproval.id,
        comments: approvalComments,
      });
    }
  };

  const confirmRejection = () => {
    if (selectedApproval && rejectReason.trim()) {
      rejectUserMutation.mutate({
        approvalId: selectedApproval.id,
        reason: rejectReason,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      athlete: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      coach: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      facility_manager: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      organization: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    };
    return <Badge className={colors[userType as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{userType}</Badge>;
  };

  if (approvalsLoading || usersLoading || rolesLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage user approvals and system configuration</p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvals?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
            }}
          >
            <UserX className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="approvals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approvals" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Pending Approvals</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Role Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Approvals</CardTitle>
              <CardDescription>Review and approve or reject user registration requests</CardDescription>
            </CardHeader>
            <CardContent>
              {!approvals || approvals.length === 0 ? (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvals.map((approval: UserApproval) => (
                    <div key={approval.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {approval.requestData?.firstName} {approval.requestData?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{approval.requestData?.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getUserTypeBadge(approval.requestData?.userType)}
                          {getStatusBadge(approval.status)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <p><strong>Request Type:</strong> {approval.requestType}</p>
                        <p><strong>Submitted:</strong> {new Date(approval.createdAt).toLocaleDateString()}</p>
                      </div>
                      {approval.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(approval)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(approval)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              {!users || users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user: User) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getUserTypeBadge(user.userType)}
                          {getStatusBadge(user.approvalStatus)}
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          onValueChange={(status) => updateUserStatusMutation.mutate({ userId: user.id, status })}
                          defaultValue={user.approvalStatus}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(roleId) => assignRoleMutation.mutate({ userId: user.id, roleId: parseInt(roleId) })}
                          defaultValue={user.roleId?.toString()}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Assign role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles?.map((role: Role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Manage system roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {!roles || roles.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No roles configured</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roles.map((role: Role) => (
                    <Card key={role.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Level {role.level}</Badge>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedApproval?.status === 'pending' ? 'Process User Approval' : 'User Details'}
            </DialogTitle>
            <DialogDescription>
              Review the user registration request and provide your decision.
            </DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">User Information</h4>
                <p><strong>Name:</strong> {selectedApproval.requestData?.firstName} {selectedApproval.requestData?.lastName}</p>
                <p><strong>Email:</strong> {selectedApproval.requestData?.email}</p>
                <p><strong>User Type:</strong> {selectedApproval.requestData?.userType}</p>
              </div>
              {selectedApproval.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="comments">Approval Comments (Optional)</Label>
                    <Textarea
                      id="comments"
                      value={approvalComments}
                      onChange={(e) => setApprovalComments(e.target.value)}
                      placeholder="Add any comments for the user..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="reason">Rejection Reason (Required for rejection)</Label>
                    <Textarea
                      id="reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide reason for rejection..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedApproval?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={confirmRejection}
                  disabled={!rejectReason.trim() || rejectUserMutation.isPending}
                >
                  {rejectUserMutation.isPending ? "Rejecting..." : "Reject"}
                </Button>
                <Button
                  onClick={confirmApproval}
                  disabled={approveUserMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {approveUserMutation.isPending ? "Approving..." : "Approve"}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setSelectedApproval(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}