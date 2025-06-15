import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Wrench, 
  Plus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

export default function FacilityManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authService.hasToolAccess("facility")) {
      toast({
        title: "Access Denied",
        description: "You need a Pro or Enterprise subscription to access this tool.",
        variant: "destructive",
      });
      setLocation("/dashboard");
      return;
    }
  }, [setLocation, toast]);

  const { data: facilities } = useQuery({
    queryKey: ["/api/facilities"],
  });

  const { data: facilityBookings } = useQuery({
    queryKey: ["/api/facilities", selectedFacility, "bookings"],
    enabled: !!selectedFacility,
  });

  const { data: maintenanceRecords } = useQuery({
    queryKey: ["/api/facilities", selectedFacility, "maintenance"],
    enabled: !!selectedFacility,
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/facilities", selectedFacility, "revenue"],
    enabled: !!selectedFacility,
  });

  const createMaintenanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/facilities/${selectedFacility}/maintenance`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/facilities", selectedFacility, "maintenance"] });
      toast({
        title: "Maintenance request created",
        description: "The maintenance request has been successfully submitted.",
      });
    },
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    maintenanceType: "",
    description: "",
    priority: "medium",
    scheduledDate: "",
  });

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;

    createMaintenanceMutation.mutate(maintenanceForm);
    setMaintenanceForm({
      maintenanceType: "",
      description: "",
      priority: "medium",
      scheduledDate: "",
    });
  };

  const getUtilizationRate = () => {
    if (!facilityBookings || facilityBookings.length === 0) return 0;
    
    const today = new Date();
    const thisMonth = facilityBookings.filter((booking: any) => {
      const bookingDate = new Date(booking.startTime);
      return bookingDate.getMonth() === today.getMonth() && 
             bookingDate.getFullYear() === today.getFullYear();
    });
    
    // Assuming 8 hours per day, 30 days per month = 240 total hours
    const totalAvailableHours = 240;
    const bookedHours = thisMonth.reduce((total: number, booking: any) => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
    
    return Math.round((bookedHours / totalAvailableHours) * 100);
  };

  const getMonthlyRevenue = () => {
    if (!revenueData || revenueData.length === 0) return 0;
    
    const today = new Date();
    const thisMonthRevenue = revenueData.filter((record: any) => {
      const recordDate = new Date(record.transactionDate);
      return recordDate.getMonth() === today.getMonth() && 
             recordDate.getFullYear() === today.getFullYear();
    });
    
    return thisMonthRevenue.reduce((total: number, record: any) => {
      return total + parseFloat(record.amount);
    }, 0);
  };

  const getPendingMaintenance = () => {
    if (!maintenanceRecords) return 0;
    return maintenanceRecords.filter((record: any) => record.status === "pending").length;
  };

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
                <Building className="text-blue-600" size={24} />
                <h1 className="font-poppins font-bold text-xl text-gray-900">
                  Facility Management
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select 
                value={selectedFacility?.toString() || ""} 
                onValueChange={(value) => setSelectedFacility(parseInt(value))}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities?.map((facility: any) => (
                    <SelectItem key={facility.id} value={facility.id.toString()}>
                      {facility.name} - {facility.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedFacility ? (
          <div className="text-center py-12">
            <Building className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Select a Facility to Manage
            </h2>
            <p className="text-gray-600 mb-6">
              Choose a facility from the dropdown above to start managing bookings, maintenance, and revenue.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Facility Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {getUtilizationRate()}%
                      </p>
                    </div>
                    <TrendingUp className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{getMonthlyRevenue().toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Maintenance</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {getPendingMaintenance()}
                      </p>
                    </div>
                    <Wrench className="text-orange-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {facilityBookings?.length || 0}
                      </p>
                    </div>
                    <CalendarIcon className="text-purple-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Facility Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">Court A</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span className="font-medium">Court B</span>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Booked (10:00-12:00)
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Swimming Pool</span>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            Under Maintenance
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {facilityBookings && facilityBookings.length > 0 ? (
                        <div className="space-y-3">
                          {facilityBookings
                            .filter((booking: any) => {
                              const bookingDate = new Date(booking.startTime);
                              const today = new Date();
                              return bookingDate.toDateString() === today.toDateString();
                            })
                            .slice(0, 5)
                            .map((booking: any) => (
                              <div key={booking.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{booking.purpose || "General Booking"}</p>
                                    <p className="text-sm text-gray-600">
                                      {new Date(booking.startTime).toLocaleTimeString()} - 
                                      {new Date(booking.endTime).toLocaleTimeString()}
                                    </p>
                                  </div>
                                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {booking.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No bookings for today</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {facilityBookings && facilityBookings.length > 0 ? (
                      <div className="space-y-4">
                        {facilityBookings.map((booking: any) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{booking.purpose || "General Booking"}</h3>
                                <p className="text-gray-600">User ID: {booking.userId}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.startTime).toLocaleString()} - 
                                  {new Date(booking.endTime).toLocaleString()}
                                </p>
                                {booking.notes && (
                                  <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                  {booking.status}
                                </Badge>
                                {booking.totalAmount && (
                                  <p className="text-sm mt-1">₹{booking.totalAmount}</p>
                                )}
                                <Badge 
                                  variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}
                                  className="ml-2"
                                >
                                  {booking.paymentStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No bookings found for this facility</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Maintenance Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="maintenanceType">Maintenance Type</Label>
                          <Select 
                            value={maintenanceForm.maintenanceType}
                            onValueChange={(value) => setMaintenanceForm(prev => ({ ...prev, maintenanceType: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="routine">Routine Maintenance</SelectItem>
                              <SelectItem value="repair">Repair</SelectItem>
                              <SelectItem value="upgrade">Upgrade</SelectItem>
                              <SelectItem value="cleaning">Deep Cleaning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={maintenanceForm.description}
                            onChange={(e) => setMaintenanceForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the maintenance needed..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select 
                            value={maintenanceForm.priority}
                            onValueChange={(value) => setMaintenanceForm(prev => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="scheduledDate">Scheduled Date</Label>
                          <Input
                            id="scheduledDate"
                            type="datetime-local"
                            value={maintenanceForm.scheduledDate}
                            onChange={(e) => setMaintenanceForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={createMaintenanceMutation.isPending}
                        >
                          {createMaintenanceMutation.isPending ? "Creating..." : "Create Request"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Maintenance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {maintenanceRecords && maintenanceRecords.length > 0 ? (
                        <div className="space-y-3">
                          {maintenanceRecords.slice(0, 5).map((record: any) => (
                            <div key={record.id} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{record.maintenanceType}</p>
                                  <p className="text-sm text-gray-600">{record.description}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(record.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  <Badge 
                                    variant={
                                      record.status === 'completed' ? 'default' :
                                      record.status === 'in_progress' ? 'secondary' : 'outline'
                                    }
                                  >
                                    {record.status}
                                  </Badge>
                                  <Badge 
                                    variant={
                                      record.priority === 'urgent' ? 'destructive' :
                                      record.priority === 'high' ? 'secondary' : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {record.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Wrench className="mx-auto text-gray-400 mb-4" size={48} />
                          <p className="text-gray-500">No maintenance records</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueData && revenueData.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                              ₹{getMonthlyRevenue().toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">This Month</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                              {revenueData.length}
                            </p>
                            <p className="text-sm text-gray-600">Total Transactions</p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">
                              ₹{(revenueData.reduce((sum: number, record: any) => sum + parseFloat(record.amount), 0) / revenueData.length).toFixed(0)}
                            </p>
                            <p className="text-sm text-gray-600">Avg Transaction</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {revenueData.slice(0, 10).map((record: any) => (
                            <div key={record.id} className="flex justify-between items-center p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{record.description || record.source}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(record.transactionDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  +₹{parseFloat(record.amount).toLocaleString()}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {record.source}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No revenue data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
