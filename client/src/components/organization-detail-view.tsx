import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, Edit, Save, X, Upload, Shield, Check, Clock, 
  MapPin, Phone, Mail, Globe, Calendar, Users, FileText,
  CheckCircle2, AlertCircle, Star, Award
} from "lucide-react";
import { getDistrictOptions, getLSGDOptions } from "@shared/kerala-locations";

interface Organization {
  id: number;
  name: string;
  description?: string;
  type: string;
  organizationType?: string;
  city?: string;
  state?: string;
  district?: string;
  lsgd?: string;
  sportsInterests?: string[];
  establishedYear?: number;
  facilityCount?: number;
  memberCount?: number;
  website?: string;
  email?: string;
  phone?: string;
  status: string;
  ownerId: number;
  createdAt: string;
  verificationStatus?: string;
  facilityAvailability?: string[];
  registrationNumber?: string;
  licenseNumber?: string;
  logo?: string;
  verificationDocuments?: string[];
  lastVerificationDate?: string;
  nextVerificationDue?: string;
}

interface OrganizationDetailViewProps {
  organization: Organization;
  onUpdate?: () => void;
}

export function OrganizationDetailView({ organization, onUpdate }: OrganizationDetailViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoDialog, setShowLogoDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Organization>>(organization);

  const districtOptions = getDistrictOptions();
  const lsgdOptions = formData.district ? getLSGDOptions(formData.district) : [];

  const updateOrganizationMutation = useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const result = await apiRequest("PUT", `/api/organizations/${organization.id}`, data);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization updated successfully!",
      });
      setIsEditing(false);
      onUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update organization",
        variant: "destructive",
      });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      const result = await apiRequest("POST", `/api/organizations/${organization.id}/logo`, formData);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logo uploaded successfully!",
      });
      setShowLogoDialog(false);
      onUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/owned"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload logo",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateOrganizationMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(organization);
    setIsEditing(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogoMutation.mutate(file);
    }
  };

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Verification Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <FileText className="h-3 w-3 mr-1" />
            Not Verified
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Logo and Basic Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {organization.logo ? (
                  <img src={organization.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  organization.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{organization.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {organization.organizationType} • {organization.type}
                </CardDescription>
                <div className="flex items-center space-x-3 mt-2">
                  {getVerificationBadge(organization.verificationStatus)}
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    Est. {organization.establishedYear}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={showLogoDialog} onOpenChange={setShowLogoDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {organization.logo ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Organization Logo</DialogTitle>
                    <DialogDescription>
                      Upload a logo for your organization. Recommended size: 400x400px
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="mt-2"
                        disabled={uploadLogoMutation.isPending}
                      />
                    </div>
                    {uploadLogoMutation.isPending && (
                      <div className="text-center">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="text-sm text-gray-600 mt-2">Uploading...</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSave} size="sm" disabled={updateOrganizationMutation.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateOrganizationMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Organization Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type || ''}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Club">Club</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                    <SelectItem value="School">School</SelectItem>
                    <SelectItem value="Federation">Federation</SelectItem>
                    <SelectItem value="Facility">Facility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="organizationType">Organization Type</Label>
                <Select
                  value={formData.organizationType || ''}
                  onValueChange={(value) => setFormData({ ...formData, organizationType: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sports Club">Sports Club</SelectItem>
                    <SelectItem value="Training Academy">Training Academy</SelectItem>
                    <SelectItem value="Educational Institution">Educational Institution</SelectItem>
                    <SelectItem value="Sports Federation">Sports Federation</SelectItem>
                    <SelectItem value="Multi-Sport Complex">Multi-Sport Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                type="number"
                value={formData.establishedYear || ''}
                onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Registration Details */}
        <Card>
          <CardHeader>
            <CardTitle>Legal & Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter registration number"
              />
            </div>
            <div>
              <Label htmlFor="licenseNumber">Government License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter license number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facilityCount">Facility Count</Label>
                <Input
                  id="facilityCount"
                  type="number"
                  value={formData.facilityCount || ''}
                  onChange={(e) => setFormData({ ...formData, facilityCount: parseInt(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="memberCount">Member Count</Label>
                <Input
                  id="memberCount"
                  type="number"
                  value={formData.memberCount || ''}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {organization.verificationStatus === 'verified' && (
              <div className="space-y-2">
                <Label>Verification Details</Label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Verified Organization</span>
                  </div>
                  {organization.lastVerificationDate && (
                    <p className="text-sm text-green-600 mt-1">
                      Last verified: {new Date(organization.lastVerificationDate).toLocaleDateString()}
                    </p>
                  )}
                  {organization.nextVerificationDue && (
                    <p className="text-sm text-green-600">
                      Next verification due: {new Date(organization.nextVerificationDue).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state || 'Kerala'}
                  onValueChange={(value) => setFormData({ ...formData, state: value, district: '', lsgd: '' })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district || ''}
                  onValueChange={(value) => setFormData({ ...formData, district: value, lsgd: '' })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districtOptions.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lsgd">LSGD</Label>
                <Select
                  value={formData.lsgd || ''}
                  onValueChange={(value) => setFormData({ ...formData, lsgd: value })}
                  disabled={!isEditing || !formData.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select LSGD" />
                  </SelectTrigger>
                  <SelectContent>
                    {lsgdOptions.map((lsgd) => (
                      <SelectItem key={lsgd.value} value={lsgd.value}>
                        {lsgd.label} ({lsgd.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                disabled={!isEditing}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sports Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Sports Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {organization.sportsInterests?.map((sport) => (
              <Badge key={sport} variant="secondary">
                {sport}
              </Badge>
            )) || <p className="text-muted-foreground">No sports interests added</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}