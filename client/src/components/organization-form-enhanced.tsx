import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComprehensiveSportsSelector from "./comprehensive-sports-selector";
import OrganizationFacilitySelector from "./organization-facility-selector";
import { KERALA_DISTRICTS } from "@/lib/kerala-sports";

const organizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  description: z.string().optional(),
  organizationType: z.string().min(1, "Organization type is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().default("Kerala"),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  website: z.string().url("Valid website URL required").optional().or(z.literal("")),
  district: z.string().min(1, "District is required"),
  sportsInterests: z.array(z.string()).min(1, "Select at least one sport"),
  facilityAvailability: z.array(z.object({
    sport: z.string(),
    hasVenue: z.boolean(),
    venueType: z.enum(['owned', 'rented', 'partnership']).optional(),
    capacity: z.number().optional(),
    hourlyRate: z.number().optional(),
    availableHours: z.array(z.string()).optional(),
    equipment: z.array(z.string()).optional(),
    maintenanceStatus: z.enum(['excellent', 'good', 'fair', 'needs_repair']).optional(),
    bookingAdvanceNotice: z.number().optional(),
    specialFeatures: z.array(z.string()).optional()
  })).default([])
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationFormEnhancedProps {
  initialData?: Partial<OrganizationFormData>;
  onSubmit: (data: OrganizationFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function OrganizationFormEnhanced({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false
}: OrganizationFormEnhancedProps) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [selectedSports, setSelectedSports] = useState<string[]>(initialData?.sportsInterests || []);
  const [facilityData, setFacilityData] = useState(initialData?.facilityAvailability || []);

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationType: "",
      address: "",
      city: "",
      state: "Kerala",
      pincode: "",
      phone: "",
      email: "",
      website: "",
      district: "",
      sportsInterests: [],
      facilityAvailability: [],
      ...initialData
    }
  });

  const organizationTypes = [
    { value: "sports_club", label: "Sports Club" },
    { value: "academy", label: "Sports Academy" },
    { value: "school", label: "School" },
    { value: "college", label: "College/University" },
    { value: "coaching_center", label: "Coaching Center" },
    { value: "fitness_center", label: "Fitness Center" },
    { value: "community_center", label: "Community Center" },
    { value: "government", label: "Government Organization" },
    { value: "ngo", label: "NGO/Non-Profit" },
    { value: "other", label: "Other" }
  ];

  const handleFormSubmit = (data: OrganizationFormData) => {
    const formData = {
      ...data,
      sportsInterests: selectedSports,
      facilityAvailability: facilityData
    };
    onSubmit(formData);
  };

  const canProceedToSports = () => {
    const requiredFields = ['name', 'organizationType', 'district'];
    return requiredFields.every(field => form.getValues(field as keyof OrganizationFormData));
  };

  const canProceedToFacilities = () => {
    return canProceedToSports() && selectedSports.length > 0;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {isEditing ? "Edit Organization" : "Create New Organization"}
          </CardTitle>
          <CardDescription>
            Set up your organization profile and specify sports interests with facility availability for 
            College Sports League Kerala and other event organizers.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="sports" disabled={!canProceedToSports()}>
                Sports Selection
              </TabsTrigger>
              <TabsTrigger value="facilities" disabled={!canProceedToFacilities()}>
                Facility Details
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                  
                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Kerala Sports Club" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organizationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Type *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {organizationTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your organization's mission and activities"
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>District *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {KERALA_DISTRICTS.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Kochi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input placeholder="682001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Complete address of your organization"
                              {...field} 
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="contact@organization.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://organization.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setCurrentTab("sports")}
                        disabled={!canProceedToSports()}
                      >
                        Next: Select Sports
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Sports Selection Tab */}
                  <TabsContent value="sports" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sports Interests</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Select all sports your organization is involved in. This helps event organizers 
                        identify potential participants for competitions.
                      </p>
                    </div>

                    <ComprehensiveSportsSelector
                      selectedSports={selectedSports}
                      onSportsChange={setSelectedSports}
                      maxSelections={15}
                    />

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCurrentTab("basic")}
                      >
                        Back: Basic Info
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setCurrentTab("facilities")}
                        disabled={!canProceedToFacilities()}
                      >
                        Next: Facility Details
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Facility Details Tab */}
                  <TabsContent value="facilities" className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Facility Availability</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Configure facility details for each sport. This information helps event organizers 
                        plan competitions and assess venue requirements for College Sports League Kerala 2025-2026.
                      </p>
                    </div>

                    <OrganizationFacilitySelector
                      selectedSports={selectedSports}
                      facilities={facilityData}
                      onFacilitiesChange={setFacilityData}
                    />

                    <div className="flex justify-between pt-6">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setCurrentTab("sports")}
                      >
                        Back: Sports Selection
                      </Button>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={onCancel}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : (isEditing ? "Update Organization" : "Create Organization")}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                </form>
              </Form>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}