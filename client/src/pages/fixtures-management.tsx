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
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, 
  Trophy, 
  Users, 
  ArrowLeft,
  Plus,
  Play,
  Clock,
  MapPin,
  Award
} from "lucide-react";

export default function FixturesManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  useEffect(() => {
    if (!authService.hasToolAccess("fixtures")) {
      toast({
        title: "Access Denied",
        description: "You need a Pro or Enterprise subscription to access this tool.",
        variant: "destructive",
      });
      setLocation("/dashboard");
      return;
    }
  }, [setLocation, toast]);

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: sportsCategories } = useQuery({
    queryKey: ["/api/sports-categories"],
  });

  const { data: facilities } = useQuery({
    queryKey: ["/api/facilities"],
  });

  const { data: eventParticipants } = useQuery({
    queryKey: ["/api/events", selectedEvent, "participants"],
    enabled: !!selectedEvent,
  });

  const { data: matches } = useQuery({
    queryKey: ["/api/events", selectedEvent, "matches"],
    enabled: !!selectedEvent,
  });

  const createEventMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/events", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event created successfully",
        description: "Your event has been created and is ready for participant registration.",
      });
      setActiveTab("events");
    },
  });

  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    sportId: "",
    facilityId: "",
    eventType: "tournament",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxParticipants: "",
    entryFee: "",
    prizePool: "",
  });

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...eventForm,
      sportId: parseInt(eventForm.sportId),
      facilityId: eventForm.facilityId ? parseInt(eventForm.facilityId) : undefined,
      maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : undefined,
      entryFee: eventForm.entryFee ? parseFloat(eventForm.entryFee) : 0,
      prizePool: eventForm.prizePool ? parseFloat(eventForm.prizePool) : 0,
      startDate: new Date(eventForm.startDate),
      endDate: new Date(eventForm.endDate),
      registrationDeadline: eventForm.registrationDeadline ? new Date(eventForm.registrationDeadline) : undefined,
    };

    createEventMutation.mutate(eventData);
  };

  const generateBracket = () => {
    if (!selectedEvent || !eventParticipants) return;

    // Simple single elimination bracket generation
    const participants = [...eventParticipants];
    const totalParticipants = participants.length;
    
    if (totalParticipants < 2) {
      toast({
        title: "Not enough participants",
        description: "At least 2 participants are required to generate a bracket.",
        variant: "destructive",
      });
      return;
    }

    // Shuffle participants for random seeding
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    toast({
      title: "Bracket generated",
      description: `Tournament bracket created for ${totalParticipants} participants.`,
    });
  };

  const getEventStats = () => {
    if (!events) return { total: 0, upcoming: 0, ongoing: 0, completed: 0 };
    
    return {
      total: events.length,
      upcoming: events.filter((e: any) => e.status === 'upcoming').length,
      ongoing: events.filter((e: any) => e.status === 'ongoing').length,
      completed: events.filter((e: any) => e.status === 'completed').length,
    };
  };

  const stats = getEventStats();

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
                <Calendar className="text-green-600" size={24} />
                <h1 className="font-poppins font-bold text-xl text-gray-900">
                  Fixtures Management
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="text-gray-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <Clock className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ongoing</p>
                  <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
                </div>
                <Play className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <Trophy className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="create">Create Event</TabsTrigger>
            <TabsTrigger value="bracket">Tournament Bracket</TabsTrigger>
            <TabsTrigger value="schedule">Match Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events && events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event: any) => (
                      <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.name}</h3>
                            <p className="text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="mr-1" size={14} />
                                {new Date(event.startDate).toLocaleDateString()}
                              </div>
                              {event.facilityId && (
                                <div className="flex items-center">
                                  <MapPin className="mr-1" size={14} />
                                  Facility #{event.facilityId}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Users className="mr-1" size={14} />
                                {event.maxParticipants ? `Max ${event.maxParticipants}` : "No limit"}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge 
                              variant={
                                event.status === 'upcoming' ? 'default' :
                                event.status === 'ongoing' ? 'secondary' : 'outline'
                              }
                            >
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{event.eventType}</Badge>
                            {event.entryFee > 0 && (
                              <span className="text-sm text-green-600">₹{event.entryFee}</span>
                            )}
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedEvent(event.id);
                                setActiveTab("bracket");
                              }}
                            >
                              Manage
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No events created yet</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab("create")}
                    >
                      Create Your First Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Event Name</Label>
                      <Input
                        id="name"
                        value={eventForm.name}
                        onChange={(e) => setEventForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., State Badminton Championship"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select 
                        value={eventForm.eventType}
                        onValueChange={(value) => setEventForm(prev => ({ ...prev, eventType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tournament">Tournament</SelectItem>
                          <SelectItem value="championship">Championship</SelectItem>
                          <SelectItem value="friendly">Friendly Match</SelectItem>
                          <SelectItem value="training">Training Camp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your event..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sportId">Sport</Label>
                      <Select 
                        value={eventForm.sportId}
                        onValueChange={(value) => setEventForm(prev => ({ ...prev, sportId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {sportsCategories?.map((sport: any) => (
                            <SelectItem key={sport.id} value={sport.id.toString()}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facilityId">Facility (Optional)</Label>
                      <Select 
                        value={eventForm.facilityId}
                        onValueChange={(value) => setEventForm(prev => ({ ...prev, facilityId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific facility</SelectItem>
                          {facilities?.map((facility: any) => (
                            <SelectItem key={facility.id} value={facility.id.toString()}>
                              {facility.name} - {facility.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationDeadline">Registration Deadline</Label>
                      <Input
                        id="registrationDeadline"
                        type="datetime-local"
                        value={eventForm.registrationDeadline}
                        onChange={(e) => setEventForm(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxParticipants: e.target.value }))}
                        placeholder="Leave empty for no limit"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entryFee">Entry Fee (₹)</Label>
                      <Input
                        id="entryFee"
                        type="number"
                        step="0.01"
                        value={eventForm.entryFee}
                        onChange={(e) => setEventForm(prev => ({ ...prev, entryFee: e.target.value }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prizePool">Prize Pool (₹)</Label>
                      <Input
                        id="prizePool"
                        type="number"
                        step="0.01"
                        value={eventForm.prizePool}
                        onChange={(e) => setEventForm(prev => ({ ...prev, prizePool: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createEventMutation.isPending}
                  >
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bracket" className="space-y-6">
            {selectedEvent ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Tournament Bracket
                      <div className="flex space-x-2">
                        <Button 
                          onClick={generateBracket}
                          disabled={!eventParticipants || eventParticipants.length < 2}
                        >
                          Generate Bracket
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {eventParticipants && eventParticipants.length > 0 ? (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <h3 className="text-lg font-semibold">
                            {eventParticipants.length} Participants Registered
                          </h3>
                        </div>

                        {/* Bracket visualization */}
                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="text-center mb-4">
                            <h4 className="font-semibold">Single Elimination Bracket</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            {/* Round 1 matches */}
                            {Array.from({ length: Math.ceil(eventParticipants.length / 2) }, (_, i) => (
                              <div key={i} className="bg-white p-3 rounded border">
                                <div className="text-center text-sm font-medium mb-2">
                                  Match {i + 1}
                                </div>
                                <div className="space-y-2">
                                  <div className="p-2 bg-blue-50 rounded text-center">
                                    {eventParticipants[i * 2]?.teamName || `Participant ${i * 2 + 1}`}
                                  </div>
                                  <div className="text-center text-xs text-gray-500">vs</div>
                                  <div className="p-2 bg-blue-50 rounded text-center">
                                    {eventParticipants[i * 2 + 1]?.teamName || `Participant ${i * 2 + 2}` || "BYE"}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Participants list */}
                        <div className="mt-6">
                          <h4 className="font-semibold mb-4">Registered Participants</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {eventParticipants.map((participant: any, index: number) => (
                              <div key={participant.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">
                                      {participant.teamName || `Participant ${index + 1}`}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      User ID: {participant.userId}
                                    </p>
                                  </div>
                                  <Badge variant={participant.status === 'confirmed' ? 'default' : 'secondary'}>
                                    {participant.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No participants registered yet</p>
                        <p className="text-sm text-gray-400">
                          Participants need to register for this event before you can generate a bracket.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">Select an event to manage its tournament bracket</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab("events")}
                  >
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {matches && matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match: any) => (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">
                              {match.round} - Match #{match.matchNumber}
                            </h3>
                            <p className="text-gray-600">
                              Participant {match.participant1Id} vs Participant {match.participant2Id}
                            </p>
                            {match.scheduledTime && (
                              <p className="text-sm text-gray-500">
                                {new Date(match.scheduledTime).toLocaleString()}
                              </p>
                            )}
                            {match.courtNumber && (
                              <p className="text-sm text-gray-500">
                                Court: {match.courtNumber}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant={
                              match.status === 'completed' ? 'default' :
                              match.status === 'ongoing' ? 'secondary' : 'outline'
                            }
                          >
                            {match.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No matches scheduled</p>
                    <p className="text-sm text-gray-400">
                      Generate a tournament bracket to create match schedules.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
