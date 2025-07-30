import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, User, Trophy, Target, Brain, Heart, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const skillCategories = {
  football: {
    technical: ["Ball Control", "Passing", "Shooting", "Dribbling", "First Touch", "Crossing", "Set Pieces"],
    physical: ["Speed", "Strength", "Endurance", "Agility", "Balance", "Jumping", "Flexibility"],
    mental: ["Decision Making", "Concentration", "Confidence", "Composure", "Game Intelligence", "Creativity", "Work Rate"]
  },
  basketball: {
    technical: ["Shooting", "Ball Handling", "Passing", "Rebounding", "Defense", "Post Moves", "Free Throws"],
    physical: ["Height", "Athleticism", "Speed", "Strength", "Vertical Jump", "Coordination", "Endurance"],
    mental: ["Court Vision", "Basketball IQ", "Leadership", "Clutch Performance", "Focus", "Adaptability", "Competitiveness"]
  },
  cricket: {
    technical: ["Batting", "Bowling", "Fielding", "Wicket Keeping", "Footwork", "Timing", "Technique"],
    physical: ["Hand-Eye Coordination", "Reflexes", "Fitness", "Flexibility", "Strength", "Stamina", "Balance"],
    mental: ["Match Awareness", "Patience", "Concentration", "Pressure Handling", "Strategic Thinking", "Confidence", "Mental Toughness"]
  }
};

const potentialLevels = [
  { value: "beginner", label: "Beginner", color: "bg-gray-500" },
  { value: "intermediate", label: "Intermediate", color: "bg-blue-500" },
  { value: "advanced", label: "Advanced", color: "bg-green-500" },
  { value: "professional", label: "Professional", color: "bg-yellow-500" },
  { value: "elite", label: "Elite", color: "bg-purple-500" }
];

export default function PlayerEvaluation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [activeTab, setActiveTab] = useState("technical");
  
  const [evaluation, setEvaluation] = useState({
    technicalSkills: {} as Record<string, number>,
    physicalAttributes: {} as Record<string, number>,
    mentalAttributes: {} as Record<string, number>,
    tacticalUnderstanding: 5,
    leadership: 5,
    teamwork: 5,
    overallRating: 5.0,
    strengths: "",
    weaknesses: "",
    recommendations: "",
    potentialLevel: "intermediate"
  });

  const { data: players } = useQuery({
    queryKey: ["/api/users", { userType: "athlete", approvalStatus: "approved" }]
  });

  const { data: sportsCategories } = useQuery({
    queryKey: ["/api/sports-categories"]
  });

  const { data: events } = useQuery({
    queryKey: ["/api/events"],
    enabled: !!selectedSport
  });

  const { data: matches } = useQuery({
    queryKey: ["/api/matches", selectedEvent],
    enabled: !!selectedEvent
  });

  const { data: evaluations } = useQuery({
    queryKey: ["/api/player-evaluations"]
  });

  const { data: myEvaluations } = useQuery({
    queryKey: ["/api/player-evaluations/my-evaluations"]
  });

  const createEvaluationMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/player-evaluations", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Player evaluation submitted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/player-evaluations"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit evaluation",
        variant: "destructive"
      });
    }
  });

  const approveEvaluationMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/player-evaluations/${id}/approve`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Evaluation approved successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/player-evaluations"] });
    }
  });

  const resetForm = () => {
    setSelectedPlayer("");
    setSelectedSport("");
    setSelectedEvent("");
    setSelectedMatch("");
    setEvaluation({
      technicalSkills: {},
      physicalAttributes: {},
      mentalAttributes: {},
      tacticalUnderstanding: 5,
      leadership: 5,
      teamwork: 5,
      overallRating: 5.0,
      strengths: "",
      weaknesses: "",
      recommendations: "",
      potentialLevel: "intermediate"
    });
  };

  const handleSkillRating = (category: string, skill: string, rating: number) => {
    setEvaluation(prev => ({
      ...prev,
      [`${category}Skills` as keyof typeof prev]: {
        ...prev[`${category}Skills` as keyof typeof prev],
        [skill]: rating
      }
    }));
    
    // Auto-calculate overall rating
    calculateOverallRating();
  };

  const calculateOverallRating = () => {
    const techAvg = Object.values(evaluation.technicalSkills).reduce((a, b) => a + b, 0) / Math.max(Object.values(evaluation.technicalSkills).length, 1);
    const physAvg = Object.values(evaluation.physicalAttributes).reduce((a, b) => a + b, 0) / Math.max(Object.values(evaluation.physicalAttributes).length, 1);
    const mentalAvg = Object.values(evaluation.mentalAttributes).reduce((a, b) => a + b, 0) / Math.max(Object.values(evaluation.mentalAttributes).length, 1);
    
    const overall = (techAvg + physAvg + mentalAvg + evaluation.tacticalUnderstanding + evaluation.leadership + evaluation.teamwork) / 6;
    
    setEvaluation(prev => ({
      ...prev,
      overallRating: parseFloat(overall.toFixed(1))
    }));
  };

  const handleSubmit = () => {
    if (!selectedPlayer || !selectedSport) {
      toast({
        title: "Error",
        description: "Please select a player and sport",
        variant: "destructive"
      });
      return;
    }

    const data = {
      playerId: parseInt(selectedPlayer),
      sportCategoryId: parseInt(selectedSport),
      eventId: selectedEvent ? parseInt(selectedEvent) : null,
      matchId: selectedMatch ? parseInt(selectedMatch) : null,
      ...evaluation
    };

    createEvaluationMutation.mutate(data);
  };

  const selectedSportData = sportsCategories?.find((s: any) => s.id.toString() === selectedSport);
  const sportKey = selectedSportData?.name.toLowerCase();
  const skills = skillCategories[sportKey as keyof typeof skillCategories] || skillCategories.football;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Evaluation Tool</h1>
        <p className="text-gray-600">
          Comprehensive player assessment system for coaches and approved evaluators
        </p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Evaluation</TabsTrigger>
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="history">Evaluation History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Selection Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Evaluation Setup
              </CardTitle>
              <CardDescription>
                Select the player and context for evaluation
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="player">Player</Label>
                <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players?.map((player: any) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.firstName} {player.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sport">Sport</Label>
                <Select value={selectedSport} onValueChange={setSelectedSport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sport" />
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

              <div>
                <Label htmlFor="event">Event (Optional)</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events?.map((event: any) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="match">Match (Optional)</Label>
                <Select value={selectedMatch} onValueChange={setSelectedMatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Match" />
                  </SelectTrigger>
                  <SelectContent>
                    {matches?.map((match: any) => (
                      <SelectItem key={match.id} value={match.id.toString()}>
                        Match #{match.matchNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {selectedPlayer && selectedSport && (
            <>
              {/* Skills Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills Assessment
                  </CardTitle>
                  <CardDescription>
                    Rate each skill on a scale of 1-10
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="technical" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Technical
                      </TabsTrigger>
                      <TabsTrigger value="physical" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Physical
                      </TabsTrigger>
                      <TabsTrigger value="mental" className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Mental
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="technical" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.technical.map((skill) => (
                          <div key={skill} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{skill}</Label>
                              <span className="text-sm font-medium">
                                {evaluation.technicalSkills[skill] || 5}/10
                              </span>
                            </div>
                            <Slider
                              value={[evaluation.technicalSkills[skill] || 5]}
                              onValueChange={(value) => handleSkillRating('technical', skill, value[0])}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="physical" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.physical.map((attribute) => (
                          <div key={attribute} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{attribute}</Label>
                              <span className="text-sm font-medium">
                                {evaluation.physicalAttributes[attribute] || 5}/10
                              </span>
                            </div>
                            <Slider
                              value={[evaluation.physicalAttributes[attribute] || 5]}
                              onValueChange={(value) => handleSkillRating('physical', attribute, value[0])}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="mental" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {skills.mental.map((attribute) => (
                          <div key={attribute} className="space-y-2">
                            <div className="flex justify-between">
                              <Label>{attribute}</Label>
                              <span className="text-sm font-medium">
                                {evaluation.mentalAttributes[attribute] || 5}/10
                              </span>
                            </div>
                            <Slider
                              value={[evaluation.mentalAttributes[attribute] || 5]}
                              onValueChange={(value) => handleSkillRating('mental', attribute, value[0])}
                              max={10}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Additional Attributes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Additional Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Tactical Understanding</Label>
                      <span className="text-sm font-medium">{evaluation.tacticalUnderstanding}/10</span>
                    </div>
                    <Slider
                      value={[evaluation.tacticalUnderstanding]}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, tacticalUnderstanding: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Leadership</Label>
                      <span className="text-sm font-medium">{evaluation.leadership}/10</span>
                    </div>
                    <Slider
                      value={[evaluation.leadership]}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, leadership: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Teamwork</Label>
                      <span className="text-sm font-medium">{evaluation.teamwork}/10</span>
                    </div>
                    <Slider
                      value={[evaluation.teamwork]}
                      onValueChange={(value) => setEvaluation(prev => ({ ...prev, teamwork: value[0] }))}
                      max={10}
                      min={1}
                      step={1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Overall Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Overall Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Overall Rating</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Slider
                            value={[evaluation.overallRating]}
                            onValueChange={(value) => setEvaluation(prev => ({ ...prev, overallRating: value[0] }))}
                            max={10}
                            min={1}
                            step={0.1}
                          />
                        </div>
                        <span className="text-lg font-bold w-12">{evaluation.overallRating}/10</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Potential Level</Label>
                      <Select 
                        value={evaluation.potentialLevel} 
                        onValueChange={(value) => setEvaluation(prev => ({ ...prev, potentialLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {potentialLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                                {level.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="strengths">Strengths</Label>
                      <Textarea
                        id="strengths"
                        placeholder="Key strengths and positive attributes..."
                        value={evaluation.strengths}
                        onChange={(e) => setEvaluation(prev => ({ ...prev, strengths: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weaknesses">Areas for Improvement</Label>
                      <Textarea
                        id="weaknesses"
                        placeholder="Areas that need development..."
                        value={evaluation.weaknesses}
                        onChange={(e) => setEvaluation(prev => ({ ...prev, weaknesses: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommendations">Recommendations</Label>
                      <Textarea
                        id="recommendations"
                        placeholder="Training recommendations and next steps..."
                        value={evaluation.recommendations}
                        onChange={(e) => setEvaluation(prev => ({ ...prev, recommendations: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={resetForm}>
                      Clear Form
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={createEvaluationMutation.isPending}
                    >
                      {createEvaluationMutation.isPending ? "Submitting..." : "Submit Evaluation"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Evaluations
              </CardTitle>
              <CardDescription>
                Evaluations awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluations?.filter((evalItem: any) => !evalItem.isApproved).map((evaluation: any) => (
                <Card key={evaluation.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          Player: {evaluation.player?.firstName} {evaluation.player?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sport: {evaluation.sportCategory?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Overall Rating: {evaluation.overallRating}/10
                        </p>
                        <Badge variant="outline">{evaluation.potentialLevel}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveEvaluationMutation.mutate(evaluation.id)}
                          disabled={approveEvaluationMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Evaluation History
              </CardTitle>
              <CardDescription>
                Your completed evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myEvaluations?.map((evaluation: any) => (
                <Card key={evaluation.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          {evaluation.player?.firstName} {evaluation.player?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {evaluation.sportCategory?.name} • {new Date(evaluation.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">{evaluation.overallRating}/10</span>
                          <Badge 
                            variant={evaluation.isApproved ? "default" : "secondary"}
                          >
                            {evaluation.isApproved ? "Approved" : "Pending"}
                          </Badge>
                          <Badge variant="outline">{evaluation.potentialLevel}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}