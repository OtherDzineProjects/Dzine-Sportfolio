import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Camera, Upload, CheckCircle2, Clock, AlertCircle, Shield,
  User, Calendar, Eye, Star, Award
} from "lucide-react";

interface ProfilePhotoSectionProps {
  userId: number;
  profileImage?: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected' | 'unverified';
  lastVerificationDate?: string;
  nextVerificationDue?: string;
  onUpdate?: () => void;
}

export function ProfilePhotoSection({ 
  userId, 
  profileImage, 
  verificationStatus = 'unverified',
  lastVerificationDate,
  nextVerificationDue,
  onUpdate 
}: ProfilePhotoSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      const result = await apiRequest("POST", "/api/auth/profile-photo", formData);
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully! It will be reviewed for verification.",
      });
      setShowUploadDialog(false);
      onUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile photo",
        variant: "destructive",
      });
    },
  });

  const requestVerificationMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", "/api/auth/request-photo-verification");
      return result.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification Requested",
        description: "Your photo verification request has been submitted for admin review.",
      });
      onUpdate?.();
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request verification",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a photo smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }
      
      uploadPhotoMutation.mutate(file);
    }
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified Photo
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Verification Pending
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
            <User className="h-3 w-3 mr-1" />
            Not Verified
          </Badge>
        );
    }
  };

  const isVerificationDue = () => {
    if (!nextVerificationDue) return false;
    return new Date(nextVerificationDue) <= new Date();
  };

  const getVerificationTick = () => {
    switch (verificationStatus) {
      case 'verified':
        if (isVerificationDue()) {
          return (
            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
              <Clock className="h-3 w-3 text-white" />
            </div>
          );
        }
        return (
          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
            <CheckCircle2 className="h-3 w-3 text-white" />
          </div>
        );
      case 'pending':
        return (
          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
            <Clock className="h-3 w-3 text-white" />
          </div>
        );
      case 'rejected':
        return (
          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
            <AlertCircle className="h-3 w-3 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>
          Upload a passport-size photo for verification. Photos are verified every 3 years for security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-6">
          {/* Photo Display */}
          <div className="relative">
            <div className="w-32 h-40 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Camera className="h-8 w-8" />
                </div>
              )}
            </div>
            {getVerificationTick()}
          </div>

          {/* Photo Actions */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-2">
              {getVerificationBadge()}
              {verificationStatus === 'verified' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  <Shield className="h-3 w-3 mr-1" />
                  Blockchain Secured
                </Badge>
              )}
            </div>

            {/* Verification Details */}
            {verificationStatus === 'verified' && lastVerificationDate && (
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Last verified: {new Date(lastVerificationDate).toLocaleDateString()}
                </p>
                {nextVerificationDue && (
                  <p className={isVerificationDue() ? "text-yellow-600 font-medium" : ""}>
                    <Clock className="h-3 w-3 inline mr-1" />
                    Next verification: {new Date(nextVerificationDue).toLocaleDateString()}
                    {isVerificationDue() && " (Due for renewal)"}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button variant={profileImage ? "outline" : "default"}>
                    <Upload className="h-4 w-4 mr-2" />
                    {profileImage ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Profile Photo</DialogTitle>
                    <DialogDescription>
                      Upload a passport-size photo (3.5cm x 4.5cm). Clear front-facing photos work best for verification.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Select a passport-size photo</p>
                      <p className="text-xs text-gray-500 mb-3">
                        Requirements: Clear, front-facing, passport-size format<br/>
                        JPG, PNG up to 2MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={uploadPhotoMutation.isPending}
                      />
                    </div>
                    {uploadPhotoMutation.isPending && (
                      <div className="text-center">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="text-sm text-gray-600 mt-2">Uploading and processing...</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {profileImage && verificationStatus !== 'verified' && verificationStatus !== 'pending' && (
                <Button 
                  variant="outline" 
                  onClick={() => requestVerificationMutation.mutate()}
                  disabled={requestVerificationMutation.isPending}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {requestVerificationMutation.isPending ? "Requesting..." : "Request Verification"}
                </Button>
              )}
            </div>

            {/* Verification Requirements */}
            {verificationStatus === 'rejected' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Verification Failed</p>
                <p className="text-xs text-red-600 mt-1">
                  Please upload a clear, front-facing passport-size photo and try again.
                </p>
              </div>
            )}

            {!profileImage && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Photo Required</p>
                <p className="text-xs text-blue-600 mt-1">
                  A verified profile photo is required for event participation and organization membership.
                </p>
              </div>
            )}

            {isVerificationDue() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium">Verification Due</p>
                <p className="text-xs text-yellow-600 mt-1">
                  Your photo verification has expired. Please upload a new photo to maintain verified status.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}