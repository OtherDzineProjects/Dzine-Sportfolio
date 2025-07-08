import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Users, DollarSign, Star } from "lucide-react";
import { KERALA_DISTRICTS, getDistrictOptions, getLSGDOptions } from "@shared/kerala-locations";

interface FacilityAvailability {
  sport: string;
  hasVenue: boolean;
  venueType?: 'owned' | 'rented' | 'partnership';
  capacity?: number;
  hourlyRate?: number;
  availableHours?: string[];
  equipment?: string[];
  maintenanceStatus?: 'excellent' | 'good' | 'fair' | 'needs_repair';
  bookingAdvanceNotice?: number; // days
  specialFeatures?: string[];
  location?: {
    district?: string;
    lsgd?: string;
    address?: string;
  };
}

interface OrganizationFacilitySelectorProps {
  selectedSports: string[];
  facilities: FacilityAvailability[];
  onFacilitiesChange: (facilities: FacilityAvailability[]) => void;
}

export default function OrganizationFacilitySelector({
  selectedSports,
  facilities,
  onFacilitiesChange
}: OrganizationFacilitySelectorProps) {
  const [activeEditSport, setActiveEditSport] = useState<string | null>(null);

  const updateFacility = (sport: string, updates: Partial<FacilityAvailability>) => {
    const updatedFacilities = facilities.map(facility =>
      facility.sport === sport ? { ...facility, ...updates } : facility
    );
    
    // If facility doesn't exist, create new one
    if (!facilities.find(f => f.sport === sport)) {
      updatedFacilities.push({
        sport,
        hasVenue: false,
        ...updates
      });
    }
    
    onFacilitiesChange(updatedFacilities);
  };

  const getFacilityForSport = (sport: string): FacilityAvailability => {
    return facilities.find(f => f.sport === sport) || {
      sport,
      hasVenue: false,
      capacity: 0,
      hourlyRate: 0,
      availableHours: [],
      equipment: [],
      maintenanceStatus: 'good',
      bookingAdvanceNotice: 1,
      specialFeatures: []
    };
  };

  const timeSlots = [
    '06:00-08:00', '08:00-10:00', '10:00-12:00', '12:00-14:00',
    '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
  ];

  const getVenueIcon = (sport: string) => {
    if (sport.includes('Water') || sport.includes('Vallam') || sport.includes('Swimming')) {
      return '🌊';
    } else if (sport.includes('Indoor') || sport.includes('Chess') || sport.includes('Badminton')) {
      return '🏠';
    } else if (sport.includes('Combat') || sport.includes('Kalaripayattu')) {
      return '🥋';
    } else if (sport.includes('Cycling')) {
      return '🚴';
    } else if (sport.includes('Traditional')) {
      return '🛶';
    }
    return '🏟️';
  };

  if (selectedSports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            First select sports interests, then configure facility availability for each sport.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Facility Availability Configuration</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For each sport your organization offers, specify if you have facilities and their details. 
          This helps event organizers like College Sports League Kerala plan competitions.
        </p>
      </div>

      {selectedSports.map((sport) => {
        const facility = getFacilityForSport(sport);
        const isEditing = activeEditSport === sport;

        return (
          <Card key={sport} className="border-l-4 border-l-primary/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">{getVenueIcon(sport)}</span>
                  {sport}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {facility.hasVenue && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Facility Available
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveEditSport(isEditing ? null : sport)}
                  >
                    {isEditing ? 'Save' : 'Configure'}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* Basic Availability Toggle */}
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  checked={facility.hasVenue}
                  onCheckedChange={(checked) => 
                    updateFacility(sport, { hasVenue: checked as boolean })
                  }
                />
                <Label>We have facility/venue for {sport}</Label>
              </div>

              {/* Detailed Configuration (shown when editing or has venue) */}
              {(isEditing || facility.hasVenue) && facility.hasVenue && (
                <div className="space-y-4 border-t pt-4">
                  {/* Venue Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Venue Type</Label>
                      <Select
                        value={facility.venueType || 'owned'}
                        onValueChange={(value) => 
                          updateFacility(sport, { venueType: value as 'owned' | 'rented' | 'partnership' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owned">Owned Facility</SelectItem>
                          <SelectItem value="rented">Rented Facility</SelectItem>
                          <SelectItem value="partnership">Partnership/Shared</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Maintenance Status</Label>
                      <Select
                        value={facility.maintenanceStatus || 'good'}
                        onValueChange={(value) => 
                          updateFacility(sport, { maintenanceStatus: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">🌟 Excellent</SelectItem>
                          <SelectItem value="good">✅ Good</SelectItem>
                          <SelectItem value="fair">⚠️ Fair</SelectItem>
                          <SelectItem value="needs_repair">🔧 Needs Repair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Capacity and Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Capacity (people)
                      </Label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={facility.capacity || ''}
                        onChange={(e) => 
                          updateFacility(sport, { capacity: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Hourly Rate (₹)
                      </Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={facility.hourlyRate || ''}
                        onChange={(e) => 
                          updateFacility(sport, { hourlyRate: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Booking Notice (days)
                      </Label>
                      <Input
                        type="number"
                        placeholder="3"
                        value={facility.bookingAdvanceNotice || ''}
                        onChange={(e) => 
                          updateFacility(sport, { bookingAdvanceNotice: parseInt(e.target.value) || 1 })
                        }
                      />
                    </div>
                  </div>

                  {/* Facility Location */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Facility Location (if different from organization location)
                    </Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">District</Label>
                        <Select
                          value={facility.location?.district || ''}
                          onValueChange={(value) => 
                            updateFacility(sport, { 
                              location: { 
                                ...facility.location, 
                                district: value,
                                lsgd: '' // Reset LSGD when district changes
                              } 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Same as organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Same as organization</SelectItem>
                            {getDistrictOptions().map((district) => (
                              <SelectItem key={district.value} value={district.value}>
                                {district.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-gray-600">LSGD (Ward/Corporation/Municipality)</Label>
                        <Select
                          value={facility.location?.lsgd || ''}
                          onValueChange={(value) => 
                            updateFacility(sport, { 
                              location: { 
                                ...facility.location, 
                                lsgd: value 
                              } 
                            })
                          }
                          disabled={!facility.location?.district}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Same as organization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Same as organization</SelectItem>
                            {facility.location?.district && getLSGDOptions(facility.location.district).map((lsgd) => (
                              <SelectItem key={lsgd.value} value={lsgd.value}>
                                {lsgd.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-gray-600">Facility Address</Label>
                      <Textarea
                        placeholder="Specific facility address (if different from organization address)"
                        value={facility.location?.address || ''}
                        onChange={(e) => 
                          updateFacility(sport, { 
                            location: { 
                              ...facility.location, 
                              address: e.target.value 
                            } 
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Available Time Slots</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <div key={slot} className="flex items-center space-x-2">
                          <Checkbox
                            checked={facility.availableHours?.includes(slot) || false}
                            onCheckedChange={(checked) => {
                              const currentHours = facility.availableHours || [];
                              const newHours = checked
                                ? [...currentHours, slot]
                                : currentHours.filter(h => h !== slot);
                              updateFacility(sport, { availableHours: newHours });
                            }}
                          />
                          <Label className="text-xs">{slot}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment Available */}
                  <div>
                    <Label className="text-sm font-medium">Available Equipment</Label>
                    <Textarea
                      placeholder="List equipment available (e.g., mats, nets, balls, protective gear)"
                      value={facility.equipment?.join(', ') || ''}
                      onChange={(e) => {
                        const equipment = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                        updateFacility(sport, { equipment });
                      }}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {/* Special Features */}
                  <div>
                    <Label className="text-sm font-medium">Special Features</Label>
                    <Textarea
                      placeholder="Special amenities (e.g., air conditioning, parking, changing rooms, cafeteria)"
                      value={facility.specialFeatures?.join(', ') || ''}
                      onChange={(e) => {
                        const features = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                        updateFacility(sport, { specialFeatures: features });
                      }}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* Summary for completed facilities */}
              {!isEditing && facility.hasVenue && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{facility.capacity || 0} capacity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>₹{facility.hourlyRate || 0}/hr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{facility.availableHours?.length || 0} time slots</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span className="capitalize">{facility.maintenanceStatus}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Summary Statistics */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Facility Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {facilities.filter(f => f.hasVenue).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Sports with Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {facilities.reduce((sum, f) => sum + (f.capacity || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                ₹{facilities.reduce((sum, f) => sum + (f.hourlyRate || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Hourly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {facilities.reduce((sum, f) => sum + (f.availableHours?.length || 0), 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Available Time Slots</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}