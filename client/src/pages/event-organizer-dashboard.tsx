import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Download, 
  Calendar, 
  Users, 
  Building, 
  MapPin, 
  Phone, 
  Mail,
  Trophy,
  Target,
  Home,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

interface Organization {
  id: number;
  name: string;
  type: string;
  sportsOffered: string[];
  facilitiesAvailable: string[];
  memberCount: number;
  contactEmail: string;
  phone: string;
  district: string;
  city: string;
  status: string;
}

interface EventStats {
  eventName: string;
  eventSport: number;
  eligibleOrganizations: Organization[];
  sportsMatchingSummary: Record<string, number>;
  facilityRequirements: Record<string, number>;
}

interface ExportData {
  exportData: Array<{
    organizationId: number;
    organizationName: string;
    organizationType: string;
    district: string;
    city: string;
    sportsOffered: string[];
    facilitiesAvailable: string[];
    memberCount: number;
    membersSportsInterests: Array<{
      memberName: string;
      memberRole: string;
      sportsInterests: string[];
      facilityPreferences: string[];
    }>;
  }>;
  summary: {
    totalOrganizations: number;
    totalMembers: number;
    allSportsOffered: string[];
    allFacilitiesAvailable: string[];
  };
}

export default function EventOrganizerDashboard() {
  const { toast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Fetch events
  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  // Fetch event statistics
  const { data: eventStats, isLoading: statsLoading } = useQuery<EventStats>({
    queryKey: ["/api/admin/events", selectedEventId, "organization-stats"],
    enabled: !!selectedEventId,
  });

  // Export organization data
  const handleExportData = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/organizations/export");
      const data: ExportData = await response.json();
      
      // Create downloadable content
      const exportContent = {
        timestamp: new Date().toISOString(),
        event: selectedEventId ? events?.find((e: any) => e.id.toString() === selectedEventId)?.name : "All Events",
        ...data
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportContent, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `organizations_sports_facilities_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Downloaded data for ${data.summary.totalOrganizations} organizations with ${data.summary.totalMembers} total members.`,
      });
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export organization data",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
                    <Calendar className="h-8 w-8" />
                    <span>Event Organizer Dashboard</span>
                  </h1>
                  <p className="text-purple-100">
                    View organization data, sports interests, and facility availability for events
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleExportData}
                    className="bg-white text-purple-600 hover:bg-purple-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('auth_token');
                      window.location.href = '/login';
                    }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Selection */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Select Event for Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="w-[400px]">
                    <SelectValue placeholder="Choose an event to analyze organizations" />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((event: any) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.startDate).toLocaleDateString()} - {event.eventType}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedEventId && (
                  <Button 
                    onClick={handleExportData}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Export Event Data</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Statistics */}
        {selectedEventId && eventStats && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{eventStats.eligibleOrganizations.length}</div>
                      <div className="text-sm text-muted-foreground">Eligible Organizations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {eventStats.eligibleOrganizations.reduce((sum, org) => sum + org.memberCount, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {[...new Set(eventStats.eligibleOrganizations.flatMap(org => org.sportsOffered))].length}
                      </div>
                      <div className="text-sm text-muted-foreground">Sports Offered</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Home className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">
                        {[...new Set(eventStats.eligibleOrganizations.flatMap(org => org.facilitiesAvailable))].length}
                      </div>
                      <div className="text-sm text-muted-foreground">Facility Types</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Organization Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Eligible Organizations for {eventStats.eventName}</span>
                  </span>
                  <Badge variant="outline" className="bg-blue-50">
                    {eventStats.eligibleOrganizations.length} organizations
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Sports Offered</TableHead>
                        <TableHead>Facilities Available</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventStats.eligibleOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <div className="font-medium">{org.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{org.type.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{org.city}, {org.district}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{org.memberCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {org.sportsOffered.slice(0, 3).map((sport, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {sport}
                                </Badge>
                              ))}
                              {org.sportsOffered.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{org.sportsOffered.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {org.facilitiesAvailable.slice(0, 2).map((facility, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                              {org.facilitiesAvailable.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{org.facilitiesAvailable.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-xs">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate max-w-[120px]">{org.contactEmail}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span>{org.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(org.status)} flex items-center space-x-1`}>
                              {getStatusIcon(org.status)}
                              <span>{org.status}</span>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Dashboard</CardTitle>
            <CardDescription>Guidelines for event organizers to manage organization data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">Event Analysis</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Select an event to view eligible organizations</li>
                  <li>• Review sports offerings and facility availability</li>
                  <li>• Check member counts for capacity planning</li>
                  <li>• Verify contact information for communication</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Data Export</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Export comprehensive organization data</li>
                  <li>• Download member sports interests details</li>
                  <li>• Generate facility requirements summary</li>
                  <li>• Share data with event planning teams</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}