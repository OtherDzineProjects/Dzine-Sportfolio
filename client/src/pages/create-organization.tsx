import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Trophy,
  Plus,
  X,
  Search,
  UserPlus,
  Loader2
} from "lucide-react";

// Kerala Districts
const keralDistricts = [
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", 
  "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", 
  "Thiruvananthapuram", "Thrissur", "Wayanad"
];

// Organization Types
const organizationTypes = [
  { value: "school", label: "School", description: "Educational institutions" },
  { value: "college", label: "College/University", description: "Higher education institutions" },
  { value: "club", label: "Sports Club", description: "Private sports clubs" },
  { value: "academy", label: "Sports Academy", description: "Training academies" },
  { value: "federation", label: "Sports Federation", description: "Governing bodies" },
  { value: "association", label: "Sports Association", description: "Regional associations" },
  { value: "facility", label: "Sports Facility", description: "Facility management" },
  { value: "corporate", label: "Corporate Team", description: "Company sports teams" }
];

// Sports Categories
const sportsCategories = [
  "Football", "Cricket", "Basketball", "Volleyball", "Athletics", 
  "Swimming", "Tennis", "Badminton", "Hockey", "Kabaddi", 
  "Boxing", "Wrestling", "Weightlifting", "Table Tennis", "Martial Arts"
];

// Facility Types
const facilityTypes = [
  "Stadium", "Ground", "Court", "Pool", "Gym", "Track", "Indoor Arena", "Outdoor Field"
];

interface FormData {
  name: string;
  type: string;
  description: string;
  registrationNumber: string;
  establishedYear: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  sportsOffered: string[];
  facilitiesAvailable: string[];
  memberTags: string[];
  newMemberTag: string;
}

export default function CreateOrganization() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    description: "",
    registrationNumber: "",
    establishedYear: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    address: "",
    city: "",
    district: "",
    state: "Kerala",
    pincode: "",
    sportsOffered: [],
    facilitiesAvailable: [],
    memberTags: [],
    newMemberTag: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [step, setStep] = useState(1);

  // Get current user
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (data: Omit<FormData, 'newMemberTag'>) => {
      const response = await apiRequest("POST", "/api/organizations", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Organization Created Successfully! 🎉",
        description: `${formData.name} has been created and is pending approval.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations"] });
      navigate("/user-dashboard-clean");
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    },
  });

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = "Organization name is required";
      if (!formData.type) newErrors.type = "Organization type is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.contactEmail.trim()) newErrors.contactEmail = "Contact email is required";
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required";
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email address";
      }
    }

    if (stepNumber === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.district) newErrors.district = "District is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      
      // Pincode validation
      if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }

    if (stepNumber === 3) {
      if (formData.sportsOffered.length === 0) {
        newErrors.sportsOffered = "Select at least one sport";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      const { newMemberTag, ...submitData } = formData;
      createOrganizationMutation.mutate(submitData);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleSport = (sport: string) => {
    const updated = formData.sportsOffered.includes(sport)
      ? formData.sportsOffered.filter(s => s !== sport)
      : [...formData.sportsOffered, sport];
    handleInputChange('sportsOffered', updated);
  };

  const toggleFacility = (facility: string) => {
    const updated = formData.facilitiesAvailable.includes(facility)
      ? formData.facilitiesAvailable.filter(f => f !== facility)
      : [...formData.facilitiesAvailable, facility];
    handleInputChange('facilitiesAvailable', updated);
  };

  const addMemberTag = () => {
    if (formData.newMemberTag.trim() && !formData.memberTags.includes(formData.newMemberTag.trim())) {
      const updated = [...formData.memberTags, formData.newMemberTag.trim()];
      handleInputChange('memberTags', updated);
      handleInputChange('newMemberTag', '');
    }
  };

  const removeMemberTag = (tag: string) => {
    const updated = formData.memberTags.filter(t => t !== tag);
    handleInputChange('memberTags', updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Create Organization 🏢
                  </h1>
                  <p className="text-blue-100">
                    Register your sports organization with Kerala's sports ecosystem
                  </p>
                </div>
                <Building2 className="h-16 w-16 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of 3: {
                step === 1 ? 'Basic Information' :
                step === 2 ? 'Location & Contact' :
                'Sports & Facilities'
              }
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold flex items-center space-x-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <span>Basic Information</span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={errors.name ? "border-red-500" : ""}
                        placeholder="Kerala Sports Academy"
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Organization Type *</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className={errors.description ? "border-red-500" : ""}
                      placeholder="Describe your organization's mission, activities, and goals..."
                      rows={4}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        placeholder="Official registration number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="establishedYear">Established Year</Label>
                      <Input
                        id="establishedYear"
                        type="number"
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className={errors.contactEmail ? "border-red-500" : ""}
                        placeholder="contact@organization.com"
                      />
                      {errors.contactEmail && <p className="text-sm text-red-500">{errors.contactEmail}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className={errors.contactPhone ? "border-red-500" : ""}
                        placeholder="+91 9876543210"
                      />
                      {errors.contactPhone && <p className="text-sm text-red-500">{errors.contactPhone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://www.organization.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next: Location & Contact →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Location & Contact */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold flex items-center space-x-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    <span>Location & Contact Details</span>
                  </h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? "border-red-500" : ""}
                      placeholder="Enter complete address including landmarks"
                      rows={3}
                    />
                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                        placeholder="Kochi"
                      />
                      {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                        <SelectTrigger className={errors.district ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {keralDistricts.map((district) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={errors.pincode ? "border-red-500" : ""}
                        placeholder="682001"
                      />
                      {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(1)} variant="outline">
                    ← Back
                  </Button>
                  <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next: Sports & Facilities →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Sports & Facilities */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-blue-600" />
                    <span>Sports & Facilities</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Sports Offered *</Label>
                      <p className="text-sm text-muted-foreground mb-3">Select the sports your organization offers or specializes in</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {sportsCategories.map((sport) => (
                          <div key={sport} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sport-${sport}`}
                              checked={formData.sportsOffered.includes(sport)}
                              onCheckedChange={() => toggleSport(sport)}
                            />
                            <Label htmlFor={`sport-${sport}`} className="text-sm">
                              {sport}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.sportsOffered && <p className="text-sm text-red-500 mt-2">{errors.sportsOffered}</p>}
                    </div>

                    <div>
                      <Label className="text-base font-medium">Facilities Available</Label>
                      <p className="text-sm text-muted-foreground mb-3">Select the facilities your organization has access to</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {facilityTypes.map((facility) => (
                          <div key={facility} className="flex items-center space-x-2">
                            <Checkbox
                              id={`facility-${facility}`}
                              checked={formData.facilitiesAvailable.includes(facility)}
                              onCheckedChange={() => toggleFacility(facility)}
                            />
                            <Label htmlFor={`facility-${facility}`} className="text-sm">
                              {facility}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Member Tags</Label>
                      <p className="text-sm text-muted-foreground mb-3">Create tags to categorize and organize your members</p>
                      
                      <div className="flex space-x-2 mb-3">
                        <Input
                          value={formData.newMemberTag}
                          onChange={(e) => handleInputChange('newMemberTag', e.target.value)}
                          placeholder="Enter member tag (e.g., U-18, Senior, Coach)"
                          onKeyPress={(e) => e.key === 'Enter' && addMemberTag()}
                        />
                        <Button onClick={addMemberTag} type="button" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.memberTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                            <span>{tag}</span>
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeMemberTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      
                      {formData.memberTags.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Add tags like "U-18", "Senior Team", "Coaching Staff", "Management" to organize members
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-200 bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Review Notice:</strong> Your organization will be reviewed by administrators before approval. 
                    Ensure all information is accurate and complete.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(2)} variant="outline">
                    ← Back
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={createOrganizationMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createOrganizationMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Organization...
                      </>
                    ) : (
                      "Create Organization ✓"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}