import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  Timer, 
  Play, 
  Pause, 
  Trophy, 
  TrendingUp,
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle,
  Clock,
  Users,
  Award
} from "lucide-react";

interface MatchScore {
  player1Score: number;
  player2Score: number;
  sets?: number[][];
  games?: number[];
  currentSet?: number;
  isComplete: boolean;
}

export default function LiveScoring() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("matches");
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [matchTimer, setMatchTimer] = useState(0);
  const [score, setScore] = useState<MatchScore>({
    player1Score: 0,
    player2Score: 0,
    sets: [],
    currentSet: 1,
    isComplete: false
  });

  useEffect(() => {
    if (!authService.hasToolAccess("scoring")) {
      toast({
        title: "Access Denied",
        description: "You need a Pro or Enterprise subscription to access this tool.",
        variant: "destructive",
      });
      setLocation("/dashboard");
      return;
    }
  }, [setLocation, toast]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive) {
      interval = setInterval(() => {
        setMatchTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: matches } = useQuery({
    queryKey: ["/api/events", selectedMatch, "matches"],
    enabled: !!selectedMatch,
  });

  const { data: liveMatches } = useQuery({
    queryKey: ["/api/matches/live"],
    refetchInterval: isLive ? 5000 : false,
  });

  const updateScoreMutation = useMutation({
    mutationFn: (data: { matchId: number; score: any; winnerId?: number }) => 
      apiRequest("POST", `/api/matches/${data.matchId}/score`, {
        score: data.score,
        winnerId: data.winnerId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events", selectedMatch, "matches"] });
      toast({
        title: "Score updated",
        description: "Match score has been updated successfully.",
      });
    },
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const updateScore = (player: 'player1' | 'player2', increment: number) => {
    setScore(prev => ({
      ...prev,
      [player === 'player1' ? 'player1Score' : 'player2Score']: 
        Math.max(0, prev[player === 'player1' ? 'player1Score' : 'player2Score'] + increment)
    }));
  };

  const resetScore = () => {
    setScore({
      player1Score: 0,
      player2Score: 0,
      sets: [],
      currentSet: 1,
      isComplete: false
    });
    setMatchTimer(0);
  };

  const endSet = () => {
    const newSets = [...(score.sets || [])];
    newSets.push([score.player1Score, score.player2Score]);
    
    setScore(prev => ({
      ...prev,
      sets: newSets,
      player1Score: 0,
      player2Score: 0,
      currentSet: (prev.currentSet || 1) + 1
    }));
  };

  const completeMatch = (winnerId?: number) => {
    const finalScore = {
      ...score,
      isComplete: true,
      winner: winnerId,
      duration: matchTimer,
      completedAt: new Date().toISOString()
    };

    if (selectedMatch) {
      updateScoreMutation.mutate({
        matchId: selectedMatch,
        score: finalScore,
        winnerId
      });
    }

    setScore(prev => ({ ...prev, isComplete: true }));
    setIsLive(false);
    
    toast({
      title: "Match completed",
      description: "Match has been marked as complete and results have been saved.",
    });
  };

  const getCurrentMatches = () => {
    if (!events) return [];
    
    const currentMatches = [];
    for (const event of events) {
      if (event.status === 'ongoing') {
        currentMatches.push({
          eventId: event.id,
          eventName: event.name,
          sport: event.sportId,
          status: 'live'
        });
      }
    }
    return currentMatches;
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
                <Timer className="text-red-600" size={24} />
                <h1 className="font-poppins font-bold text-xl text-gray-900">
                  Live Scoring
                </h1>
                {isLive && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    LIVE
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isLive && (
                <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                  {formatTime(matchTimer)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Match Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Live Matches</p>
                  <p className="text-2xl font-bold text-red-600">
                    {getCurrentMatches().length}
                  </p>
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Match Duration</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatTime(matchTimer)}
                  </p>
                </div>
                <Clock className="text-blue-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Set</p>
                  <p className="text-2xl font-bold text-green-600">
                    {score.currentSet || 1}
                  </p>
                </div>
                <Trophy className="text-green-600" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {events?.length || 0}
                  </p>
                </div>
                <Award className="text-purple-600" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matches">Live Matches</TabsTrigger>
            <TabsTrigger value="scorer">Score Board</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Matches</CardTitle>
              </CardHeader>
              <CardContent>
                {getCurrentMatches().length > 0 ? (
                  <div className="space-y-4">
                    {getCurrentMatches().map((match, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{match.eventName}</h3>
                            <p className="text-gray-600">Sport ID: {match.sport}</p>
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-green-600 text-sm font-medium">Live Now</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedMatch(match.eventId);
                                setActiveTab("scorer");
                              }}
                            >
                              Score Match
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Timer className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No live matches at the moment</p>
                    <p className="text-sm text-gray-400">
                      Start scoring when matches begin
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scorer" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Score Control Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Live Score Board
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={isLive ? "secondary" : "default"}
                        onClick={() => setIsLive(!isLive)}
                      >
                        {isLive ? <Pause size={16} /> : <Play size={16} />}
                        {isLive ? "Pause" : "Start"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetScore}>
                        <RotateCcw size={16} />
                        Reset
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Score Display */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Player 1</h3>
                        <div className="text-4xl font-bold text-blue-600 mb-4">
                          {score.player1Score}
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateScore('player1', 1)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateScore('player1', -1)}
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Player 2</h3>
                        <div className="text-4xl font-bold text-green-600 mb-4">
                          {score.player2Score}
                        </div>
                        <div className="flex justify-center space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateScore('player2', 1)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Plus size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateScore('player2', -1)}
                          >
                            <Minus size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <Badge variant="outline" className="text-lg px-4 py-1">
                        Set {score.currentSet || 1}
                      </Badge>
                    </div>
                  </div>

                  {/* Set History */}
                  {score.sets && score.sets.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Previous Sets</h4>
                      <div className="space-y-2">
                        {score.sets.map((set, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm">Set {index + 1}</span>
                            <span className="font-medium">{set[0]} - {set[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match Controls */}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={endSet}
                      disabled={!isLive}
                      className="flex-1"
                    >
                      End Set
                    </Button>
                    <Button 
                      onClick={() => completeMatch()}
                      disabled={!isLive}
                      variant="secondary"
                      className="flex-1"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Complete Match
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Match Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Match Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={isLive ? "default" : "secondary"}>
                        {isLive ? "Live" : "Not Started"}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-mono">{formatTime(matchTimer)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Set:</span>
                      <span className="font-semibold">{score.currentSet || 1}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sets Completed:</span>
                      <span className="font-semibold">{score.sets?.length || 0}</span>
                    </div>
                  </div>

                  {/* Live Updates Status */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-yellow-800 text-sm font-medium">
                        Live updates enabled
                      </span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Scores are being broadcast in real-time to all viewers
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        Timeout
                      </Button>
                      <Button size="sm" variant="outline">
                        Injury Break
                      </Button>
                      <Button size="sm" variant="outline">
                        Technical Issue
                      </Button>
                      <Button size="sm" variant="outline">
                        Weather Delay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tournament/Event Leaderboard */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4 text-center">Current Tournament Standings</h3>
                    
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((position) => (
                        <div key={position} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              position === 1 ? 'bg-yellow-500' :
                              position === 2 ? 'bg-gray-400' :
                              position === 3 ? 'bg-orange-600' : 'bg-gray-300'
                            }`}>
                              {position}
                            </div>
                            <div>
                              <p className="font-medium">Participant {position}</p>
                              <p className="text-sm text-gray-600">
                                {position <= 3 ? 'Advancing to finals' : 'Eliminated'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {Math.floor(Math.random() * 50) + 50} pts
                            </p>
                            <p className="text-sm text-gray-600">
                              {Math.floor(Math.random() * 5) + 1} matches
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Updates */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <TrendingUp className="mr-2 text-blue-600" size={20} />
                      Recent Score Updates
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>Player A defeats Player B</span>
                        <Badge variant="outline">2 min ago</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Match 3 completed</span>
                        <Badge variant="outline">5 min ago</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>New leader in Group A</span>
                        <Badge variant="outline">8 min ago</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                {matches && matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches
                      .filter((match: any) => match.status === 'completed')
                      .map((match: any) => (
                        <div key={match.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {match.round} - Match #{match.matchNumber}
                              </h3>
                              <p className="text-gray-600">
                                Participant {match.participant1Id} vs Participant {match.participant2Id}
                              </p>
                              {match.score && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium">
                                    Final Score: {JSON.stringify(match.score)}
                                  </p>
                                </div>
                              )}
                              {match.actualStartTime && match.actualEndTime && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Duration: {Math.round((new Date(match.actualEndTime).getTime() - new Date(match.actualStartTime).getTime()) / (1000 * 60))} minutes
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="default" className="mb-2">
                                Completed
                              </Badge>
                              {match.winnerId && (
                                <p className="text-sm text-green-600 font-medium">
                                  Winner: Participant {match.winnerId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No completed matches yet</p>
                    <p className="text-sm text-gray-400">
                      Results will appear here as matches are completed
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
