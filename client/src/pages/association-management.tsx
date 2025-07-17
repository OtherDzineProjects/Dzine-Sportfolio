import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Target, 
  BarChart3, 
  Medal, 
  Clock, 
  MapPin,
  Plus,
  Eye,
  Edit,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AssociationManagement() {
  const [selectedTab, setSelectedTab] = useState("tournaments");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user to check if they're an association admin
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Fetch tournaments managed by user's organization
  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery({
    queryKey: ["/api/tournaments"],
    enabled: !!user,
  });

  // Fetch live fixtures
  const { data: liveFixtures = [], isLoading: fixturesLoading } = useQuery({
    queryKey: ["/api/fixtures/live"],
    enabled: !!user,
  });

  // Fetch player evaluations
  const { data: evaluations = [], isLoading: evaluationsLoading } = useQuery({
    queryKey: ["/api/player-evaluations"],
    enabled: !!user,
  });

  // Fetch scouting reports
  const { data: scoutingReports = [], isLoading: scoutingLoading } = useQuery({
    queryKey: ["/api/scouting-reports"],
    enabled: !!user,
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Required</h2>
            <p className="text-gray-600 mb-4">Please log in to access Association Management tools.</p>
            <Button onClick={() => window.location.href = "/api/login"} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Association Management</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive tools for managing tournaments, scoring, and player development
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-green-100 text-green-800">
                {user.firstName} - Association Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tournaments</p>
                  <p className="text-2xl font-bold text-primary">
                    {tournaments.filter((t: any) => t.status === 'ongoing' || t.status === 'registration_open').length}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Live Matches</p>
                  <p className="text-2xl font-bold text-green-600">
                    {liveFixtures.filter((f: any) => f.status === 'live').length}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Player Evaluations</p>
                  <p className="text-2xl font-bold text-blue-600">{evaluations.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scout Reports</p>
                  <p className="text-2xl font-bold text-purple-600">{scoutingReports.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Management Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures & Scoring</TabsTrigger>
            <TabsTrigger value="player-evaluation">Player Evaluation</TabsTrigger>
            <TabsTrigger value="scouting">Talent Scouting</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Tournament Management */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Tournament Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tournament
                  </Button>
                </DialogTrigger>
                <CreateTournamentDialog />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament: any) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
              
              {tournaments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Tournaments Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first tournament to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Fixtures & Live Scoring */}
          <TabsContent value="fixtures" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Fixtures & Live Scoring</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Match
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live Matches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    Live Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {liveFixtures.filter((f: any) => f.status === 'live').length > 0 ? (
                    <div className="space-y-4">
                      {liveFixtures.filter((f: any) => f.status === 'live').map((fixture: any) => (
                        <LiveMatchCard key={fixture.id} fixture={fixture} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No live matches at the moment</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Fixtures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Upcoming Fixtures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveFixtures.filter((f: any) => f.status === 'scheduled').slice(0, 5).map((fixture: any) => (
                      <UpcomingFixtureCard key={fixture.id} fixture={fixture} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Player Evaluation */}
          <TabsContent value="player-evaluation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Player Evaluation System</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Evaluate Player
                  </Button>
                </DialogTrigger>
                <PlayerEvaluationDialog />
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evaluation: any) => (
                <PlayerEvaluationCard key={evaluation.id} evaluation={evaluation} />
              ))}
              
              {evaluations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Player Evaluations</h3>
                  <p className="text-gray-500 mb-4">Start evaluating players to track their development</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Talent Scouting */}
          <TabsContent value="scouting" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Talent Scouting & State Selection</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Selection Trials
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scouting Report
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Scouting Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scoutingReports.slice(0, 5).map((report: any) => (
                      <ScoutingReportCard key={report.id} report={report} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>State Team Selection Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Nominated Players</p>
                        <p className="text-sm text-gray-600">Ready for trials</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">24</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Trial Scheduled</p>
                        <p className="text-sm text-gray-600">Awaiting selection</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">12</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Selected</p>
                        <p className="text-sm text-gray-600">State team members</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Performance Analytics</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tournament Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-lg font-bold text-green-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Player Development Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Rating Improvement</span>
                      <span className="text-lg font-bold text-blue-600">+1.2</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">15% improvement this season</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Tournament Card Component
const TournamentCard = ({ tournament }: { tournament: any }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{tournament.name}</CardTitle>
        <Badge className={
          tournament.status === 'ongoing' ? 'bg-green-100 text-green-800' :
          tournament.status === 'registration_open' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }>
          {tournament.status}
        </Badge>
      </div>
      <CardDescription>{tournament.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
          <span>{tournament.registeredTeams || 0} / {tournament.maxTeams} teams</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{tournament.venue}</span>
        </div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Live Match Card Component
const LiveMatchCard = ({ fixture }: { fixture: any }) => (
  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
    <div className="flex items-center justify-between mb-2">
      <Badge className="bg-red-500 text-white">LIVE</Badge>
      <span className="text-sm text-gray-600">{fixture.minute}'</span>
    </div>
    <div className="text-center">
      <div className="text-lg font-semibold">
        {fixture.homeTeam} {fixture.homeScore} - {fixture.awayScore} {fixture.awayTeam}
      </div>
    </div>
    <Button size="sm" className="w-full mt-2">
      <Play className="h-4 w-4 mr-1" />
      Live Scoring
    </Button>
  </div>
);

// Upcoming Fixture Card Component
const UpcomingFixtureCard = ({ fixture }: { fixture: any }) => (
  <div className="p-3 border rounded-lg">
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">
        {fixture.homeTeam} vs {fixture.awayTeam}
      </div>
      <span className="text-xs text-gray-500">
        {new Date(fixture.scheduledDate).toLocaleDateString()}
      </span>
    </div>
    <div className="text-xs text-gray-600 mt-1">
      {fixture.venue} • {fixture.round}
    </div>
  </div>
);

// Player Evaluation Card Component  
const PlayerEvaluationCard = ({ evaluation }: { evaluation: any }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{evaluation.playerName}</CardTitle>
      <CardDescription>
        Evaluated by {evaluation.evaluatorName} • {new Date(evaluation.evaluationDate).toLocaleDateString()}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Overall Rating</span>
          <span className="font-semibold">{evaluation.overallRating}/10</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Current Level</span>
          <Badge variant="outline">{evaluation.currentLevel}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">Potential</span>
          <Badge variant="outline">{evaluation.potential}</Badge>
        </div>
        {evaluation.recommendForSelection && (
          <Badge className="bg-green-100 text-green-800 mt-2">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Recommended for Selection
          </Badge>
        )}
      </div>
    </CardContent>
  </Card>
);

// Scouting Report Card Component
const ScoutingReportCard = ({ report }: { report: any }) => (
  <div className="p-3 border rounded-lg">
    <div className="flex items-center justify-between">
      <div className="font-medium">{report.playerName}</div>
      <Badge variant="outline">{report.sport}</Badge>
    </div>
    <div className="text-sm text-gray-600 mt-1">
      {report.scoutName} • {new Date(report.reportDate).toLocaleDateString()}
    </div>
    <div className="text-sm mt-2">{report.summary}</div>
  </div>
);

// Create Tournament Dialog Component
const CreateTournamentDialog = () => (
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Create New Tournament</DialogTitle>
      <DialogDescription>
        Set up a new tournament for your association
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tournament Name</label>
          <Input placeholder="Enter tournament name" />
        </div>
        <div>
          <label className="text-sm font-medium">Sport</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="volleyball">Volleyball</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" />
        </div>
        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input type="date" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea placeholder="Tournament description..." />
      </div>
      <Button className="w-full">Create Tournament</Button>
    </div>
  </DialogContent>
);

// Player Evaluation Dialog Component
const PlayerEvaluationDialog = () => (
  <DialogContent className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>Player Evaluation</DialogTitle>
      <DialogDescription>
        Comprehensive player assessment and development tracking
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Player Name</label>
          <Input placeholder="Select or enter player name" />
        </div>
        <div>
          <label className="text-sm font-medium">Evaluation Date</label>
          <Input type="date" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="font-medium">Technical Skills (1-10 scale)</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Ball Control</label>
            <Input type="number" min="1" max="10" step="0.1" />
          </div>
          <div>
            <label className="text-sm">Passing</label>
            <Input type="number" min="1" max="10" step="0.1" />
          </div>
          <div>
            <label className="text-sm">Shooting</label>
            <Input type="number" min="1" max="10" step="0.1" />
          </div>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Scouting Notes</label>
        <Textarea placeholder="Detailed observations and recommendations..." />
      </div>
      
      <Button className="w-full">Save Evaluation</Button>
    </div>
  </DialogContent>
);