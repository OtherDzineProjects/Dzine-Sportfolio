import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { authService, useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Clock,
  Users,
  DollarSign,
  Calendar as CalendarIcon,
  ArrowLeft,
  Phone,
  Mail,
  Wifi,
  Car,
  Coffee,
  Shield,
  Dumbbell
} from "lucide-react";
import { format } from "date-fns";

export default function Facilities() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { data: facilities, isLoading } = useQuery({
    queryKey: ["/api/facilities", selectedCity],
  });

  const { data: facilityBookings } = useQuery({
    queryKey: ["/api/facilities", selectedFacility?.id, "bookings"],
    enabled: !!selectedFacility && !!selectedDate,
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/facility-bookings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facility-bookings/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", selectedFacility?.id, "bookings"] });
      setShowBookingForm(false);
      setSelectedFacility(null);
      toast({
        title: "Booking confirmed",
        description: "Your facility booking has been successfully created.",
      });
    },
  });

  const [bookingForm, setBookingForm] = useState({
    startTime: "",
    endTime: "",
    purpose: "",
    notes: "",
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility || !auth.isAuthenticated) return;

    const bookingData = {
      facilityId: selectedFacility.id,
      startTime: new Date(bookingForm.startTime),
      endTime: new Date(bookingForm.endTime),
      purpose: bookingForm.purpose,
      notes: bookingForm.notes,
      totalAmount: calculateBookingCost(),
    };

    createBookingMutation.mutate(bookingData);
  };

  const calculateBookingCost = () => {
    if (!selectedFacility || !bookingForm.startTime || !bookingForm.endTime) return 0;
    
    const start = new Date(bookingForm.startTime);
    const end = new Date(bookingForm.endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    return hours * (parseFloat(selectedFacility.hourlyRate) || 0);
  };

  const filteredFacilities = facilities?.filter((facility: any) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) || [];

  const cities = [...new Set(facilities?.map((f: any) => f.city) || [])];

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      parking: Car,
      wifi: Wifi,
      cafe: Coffee,
      security: Shield,
      gym: Dumbbell,
    };
    return icons[amenity] || MapPin;
  };

  const isTimeSlotAvailable = (date: Date, startTime: string, endTime: string) => {
    if (!facilityBookings) return true;
    
    const start = new Date(`${date.toISOString().split('T')[0]}T${startTime}`);
    const end = new Date(`${date.toISOString().split('T')[0]}T${endTime}`);
    
    return !facilityBookings.some((booking: any) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      return (start < bookingEnd && end > bookingStart);
    });
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to browse and book facilities</p>
            <Button onClick={() => setLocation("/auth")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
                <ArrowLeft size={20} />
              </Button>
              <div className="flex items-center space-x-2">
                <MapPin className="text-green-600" size={24} />
                <h1 className="font-poppins font-bold text-xl text-gray-900">
                  Sports Facilities
                </h1>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-indian-green/10 text-indian-green">
              {filteredFacilities.length} facilities available
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Facilities</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <Input
                    id="search"
                    className="pl-10"
                    placeholder="Search by name, location, or sport..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="city">Filter by City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button variant="outline">
                  <Filter size={16} className="mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility: any) => (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">
                      {facility.type === 'court' ? '🏸' : 
                       facility.type === 'pool' ? '🏊‍♀️' : 
                       facility.type === 'field' ? '⚽' : 
                       facility.type === 'gym' ? '🏋️‍♀️' : '🏟️'}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90">
                      {facility.type}
                    </Badge>
                  </div>
                  {facility.rating && (
                    <div className="absolute bottom-4 left-4 flex items-center bg-white/90 rounded-full px-2 py-1">
                      <Star className="text-yellow-500 mr-1" size={14} fill="currentColor" />
                      <span className="text-sm font-medium">{facility.rating}</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-indian-green transition-colors">
                    {facility.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="mr-1" size={14} />
                    <span className="text-sm">{facility.city}, {facility.state}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-600">
                      <Users className="mr-1" size={14} />
                      <span className="text-sm">
                        {facility.capacity ? `Up to ${facility.capacity}` : "No limit"}
                      </span>
                    </div>
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="mr-1" size={14} />
                      <span className="text-sm">₹{facility.hourlyRate}/hr</span>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  {facility.amenities && facility.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {facility.amenities.slice(0, 4).map((amenity: string, index: number) => {
                        const IconComponent = getAmenityIcon(amenity);
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            <IconComponent className="mr-1" size={10} />
                            {amenity}
                          </Badge>
                        );
                      })}
                      {facility.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => {
                        setSelectedFacility(facility);
                        setShowBookingForm(true);
                      }}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedFacility(facility)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredFacilities.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No facilities found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new facilities.
            </p>
          </div>
        )}

        {/* Facility Details Modal */}
        {selectedFacility && !showBookingForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedFacility.name}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="mr-1" size={16} />
                      <span>{selectedFacility.address}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedFacility(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Facility Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="mx-auto text-blue-600 mb-1" size={20} />
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="font-semibold">₹{selectedFacility.hourlyRate}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Users className="mx-auto text-green-600 mb-1" size={20} />
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold">{selectedFacility.capacity || "No limit"}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <Star className="mx-auto text-yellow-600 mb-1" size={20} />
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{selectedFacility.rating || "New"}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <CalendarIcon className="mx-auto text-purple-600 mb-1" size={20} />
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="font-semibold">{selectedFacility.totalBookings || 0}</p>
                  </div>
                </div>

                {/* Amenities */}
                {selectedFacility.amenities && selectedFacility.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedFacility.amenities.map((amenity: string, index: number) => {
                        const IconComponent = getAmenityIcon(amenity);
                        return (
                          <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                            <IconComponent className="text-gray-600 mr-2" size={16} />
                            <span className="capitalize">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Operating Hours */}
                {selectedFacility.operatingHours && (
                  <div>
                    <h3 className="font-semibold mb-3">Operating Hours</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">
                        {JSON.stringify(selectedFacility.operatingHours) !== '{}' 
                          ? JSON.stringify(selectedFacility.operatingHours)
                          : "Hours not specified - Please contact facility"
                        }
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={() => setShowBookingForm(true)}
                  >
                    <CalendarIcon className="mr-2" size={16} />
                    Book This Facility
                  </Button>
                  <Button variant="outline">
                    <Phone className="mr-2" size={16} />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedFacility && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Book {selectedFacility.name}</CardTitle>
                  <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2" size={16} />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={bookingForm.startTime}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, startTime: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={bookingForm.endTime}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, endTime: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select 
                      value={bookingForm.purpose}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, purpose: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="match">Match/Competition</SelectItem>
                        <SelectItem value="practice">Practice Session</SelectItem>
                        <SelectItem value="event">Event/Tournament</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                    />
                  </div>

                  {/* Cost Calculation */}
                  {bookingForm.startTime && bookingForm.endTime && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Estimated Cost:</span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{calculateBookingCost().toFixed(2)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Based on {selectedFacility.hourlyRate}/hour rate
                      </p>
                    </div>
                  )}

                  {/* Availability Check */}
                  {selectedDate && bookingForm.startTime && bookingForm.endTime && (
                    <div className={`rounded-lg p-3 ${
                      isTimeSlotAvailable(selectedDate, bookingForm.startTime, bookingForm.endTime)
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center">
                        {isTimeSlotAvailable(selectedDate, bookingForm.startTime, bookingForm.endTime) ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-800 font-medium">Time slot available</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-800 font-medium">Time slot unavailable</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={
                      createBookingMutation.isPending || 
                      !selectedDate || 
                      !bookingForm.startTime || 
                      !bookingForm.endTime ||
                      !isTimeSlotAvailable(selectedDate, bookingForm.startTime, bookingForm.endTime)
                    }
                  >
                    {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
