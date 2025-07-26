import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Play, Pause, Square, Goal, UserPlus, UserMinus, AlertCircle } from "lucide-react";

interface Team {
  id: number;
  name: string;
  logo?: string;
  organizationId: number;
  sportCategoryId: number;
}

interface TeamMatch {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  eventId: number;
  scheduledDateTime: string;
  status: string;
  homeScore: number;
  awayScore: number;
  duration: number;
  venue?: string;
}

interface MatchEvent {
  id: number;
  matchId: number;
  eventType: string;
  eventTime: number;
  playerId?: number;
  teamId: number;
  description: string;
  createdBy: number;
  createdAt: string;
}

export default function LiveScoring() {
  const [selectedMatch, setSelectedMatch] = useState<TeamMatch | null>(null);
  const [newEvent, setNewEvent] = useState({
    eventType: '',
    eventTime: 0,
    playerId: '',
    teamId: '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live matches
  const { data: liveMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ["/api/matches/live"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch teams
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Fetch match events for selected match
  const { data: matchEvents = [] } = useQuery<MatchEvent[]>({
    queryKey: ["/api/matches", selectedMatch?.id, "events"],
    enabled: !!selectedMatch,
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  // Add match event mutation
  const addEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      return apiRequest("POST", `/api/matches/${selectedMatch?.id}/events`, eventData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Match event added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches", selectedMatch?.id, "events"] });
      setNewEvent({
        eventType: '',
        eventTime: 0,
        playerId: '',
        teamId: '',
        description: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add match event",
        variant: "destructive",
      });
    },
  });

  // Update match score mutation
  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, updates }: { matchId: number; updates: any }) => {
      return apiRequest("PUT", `/api/matches/${matchId}`, updates);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Match updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches/live"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update match",
        variant: "destructive",
      });
    },
  });

  const handleAddEvent = () => {
    if (!selectedMatch || !newEvent.eventType || !newEvent.teamId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addEventMutation.mutate({
      eventType: newEvent.eventType,
      eventTime: newEvent.eventTime,
      playerId: newEvent.playerId ? Number(newEvent.playerId) : undefined,
      teamId: Number(newEvent.teamId),
      description: newEvent.description
    });
  };

  const handleUpdateMatchStatus = (status: string) => {
    if (!selectedMatch) return;
    
    updateMatchMutation.mutate({
      matchId: selectedMatch.id,
      updates: { status }
    });
  };

  const handleUpdateScore = (type: 'home' | 'away', increment: boolean) => {
    if (!selectedMatch) return;
    
    const currentScore = type === 'home' ? selectedMatch.homeScore : selectedMatch.awayScore;
    const newScore = increment ? currentScore + 1 : Math.max(0, currentScore - 1);
    
    const updates = type === 'home' 
      ? { homeScore: newScore }
      : { awayScore: newScore };
    
    updateMatchMutation.mutate({
      matchId: selectedMatch.id,
      updates
    });
  };

  const getTeamName = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    return team?.name || `Team ${teamId}`;
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal': return <Goal className="w-4 h-4 text-green-600" />;
      case 'substitution': return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'red_card': return <Square className="w-4 h-4 text-red-600" />;
      case 'yellow_card': return <Square className="w-4 h-4 text-yellow-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (matchesLoading) {
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
      <div className="flex items-center gap-2">
        <Clock className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold">Live Scoring System</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Matches List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Live Matches</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {liveMatches.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No live matches currently
              </p>
            ) : (
              liveMatches.map((match: TeamMatch) => (
                <div
                  key={match.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMatch?.id === match.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)}
                      </div>
                      <div className="text-2xl font-bold">
                        {match.homeScore} - {match.awayScore}
                      </div>
                    </div>
                    <Badge variant={match.status === 'live' ? 'default' : 'secondary'}>
                      {match.status}
                    </Badge>
                  </div>
                  {match.venue && (
                    <div className="text-sm text-muted-foreground mt-2">
                      📍 {match.venue}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Match Control Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedMatch 
                ? `${getTeamName(selectedMatch.homeTeamId)} vs ${getTeamName(selectedMatch.awayTeamId)}`
                : "Select a Match"
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMatch ? (
              <div className="space-y-6">
                {/* Score Control */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-medium">{getTeamName(selectedMatch.homeTeamId)}</h3>
                    <div className="text-4xl font-bold">{selectedMatch.homeScore}</div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateScore('home', false)}
                      >
                        -1
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateScore('home', true)}
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-medium">{getTeamName(selectedMatch.awayTeamId)}</h3>
                    <div className="text-4xl font-bold">{selectedMatch.awayScore}</div>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateScore('away', false)}
                      >
                        -1
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleUpdateScore('away', true)}
                      >
                        +1
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Match Control Buttons */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateMatchStatus('live')}
                    disabled={selectedMatch.status === 'live'}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateMatchStatus('paused')}
                    disabled={selectedMatch.status !== 'live'}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleUpdateMatchStatus('finished')}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End
                  </Button>
                </div>

                {/* Add Event Form */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Add Match Event</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select value={newEvent.eventType} onValueChange={(value) => setNewEvent({...newEvent, eventType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="goal">Goal</SelectItem>
                          <SelectItem value="yellow_card">Yellow Card</SelectItem>
                          <SelectItem value="red_card">Red Card</SelectItem>
                          <SelectItem value="substitution">Substitution</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="free_kick">Free Kick</SelectItem>
                          <SelectItem value="corner">Corner</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="team">Team</Label>
                      <Select value={newEvent.teamId} onValueChange={(value) => setNewEvent({...newEvent, teamId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={selectedMatch.homeTeamId.toString()}>
                            {getTeamName(selectedMatch.homeTeamId)}
                          </SelectItem>
                          <SelectItem value={selectedMatch.awayTeamId.toString()}>
                            {getTeamName(selectedMatch.awayTeamId)}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventTime">Time (minutes)</Label>
                      <Input
                        id="eventTime"
                        type="number"
                        min="0"
                        value={newEvent.eventTime}
                        onChange={(e) => setNewEvent({...newEvent, eventTime: Number(e.target.value)})}
                        placeholder="Match time"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Event description"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddEvent}
                    disabled={addEventMutation.isPending}
                    className="mt-4"
                  >
                    {addEventMutation.isPending ? "Adding..." : "Add Event"}
                  </Button>
                </div>

                {/* Match Events Timeline */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Match Events</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {matchEvents.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No events recorded yet
                      </p>
                    ) : (
                      matchEvents.map((event: MatchEvent) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          {getEventIcon(event.eventType)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{event.eventTime}'</Badge>
                              <span className="font-medium capitalize">
                                {event.eventType.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                - {getTeamName(event.teamId)}
                              </span>
                            </div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a live match to start scoring
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}