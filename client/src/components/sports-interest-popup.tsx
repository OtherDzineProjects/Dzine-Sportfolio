import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Trophy, MapPin, Users } from "lucide-react";

// Kerala Sports Categories
const keralaSportsCategories = [
  { id: "football", name: "Football", emoji: "⚽", description: "Association Football" },
  { id: "volleyball", name: "Volleyball", emoji: "🏐", description: "Beach & Indoor Volleyball" },
  { id: "basketball", name: "Basketball", emoji: "🏀", description: "Court Basketball" },
  { id: "cricket", name: "Cricket", emoji: "🏏", description: "Cricket Matches" },
  { id: "athletics", name: "Athletics", emoji: "🏃", description: "Track & Field Events" },
  { id: "swimming", name: "Swimming", emoji: "🏊", description: "Swimming Competitions" },
  { id: "tennis", name: "Tennis", emoji: "🎾", description: "Tennis Tournaments" },
  { id: "badminton", name: "Badminton", emoji: "🏸", description: "Badminton Championships" },
  { id: "hockey", name: "Hockey", emoji: "🏑", description: "Field Hockey" },
  { id: "kabaddi", name: "Kabaddi", emoji: "🤼", description: "Traditional Kabaddi" },
  { id: "boxing", name: "Boxing", emoji: "🥊", description: "Boxing Competitions" },
  { id: "wrestling", name: "Wrestling", emoji: "🤼", description: "Wrestling Matches" },
  { id: "weightlifting", name: "Weightlifting", emoji: "🏋️", description: "Olympic Weightlifting" },
  { id: "table_tennis", name: "Table Tennis", emoji: "🏓", description: "Ping Pong" },
  { id: "martial_arts", name: "Martial Arts", emoji: "🥋", description: "Karate, Taekwondo, Judo" }
];

// Facility Types
const facilityTypes = [
  { id: "stadium", name: "Stadium", emoji: "🏟️", description: "Large sports complexes" },
  { id: "gym", name: "Gym", emoji: "💪", description: "Fitness centers & gyms" },
  { id: "pool", name: "Swimming Pool", emoji: "🏊", description: "Aquatic facilities" },
  { id: "court", name: "Sports Court", emoji: "⛹️", description: "Basketball, Tennis, Badminton courts" },
  { id: "ground", name: "Sports Ground", emoji: "🏃", description: "Football, Cricket grounds" },
  { id: "track", name: "Athletics Track", emoji: "🏃", description: "Running & field events" },
  { id: "indoor", name: "Indoor Arena", emoji: "🏢", description: "Covered sports halls" },
  { id: "outdoor", name: "Outdoor Fields", emoji: "🌱", description: "Open recreational spaces" }
];

interface SportsInterestPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

export default function SportsInterestPopup({ isOpen, onClose, isFirstTime = false }: SportsInterestPopupProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSportsInterestsMutation = useMutation({
    mutationFn: async (data: { sportsInterests: string[], facilityPreferences?: string[] }) => {
      const response = await apiRequest("PUT", "/api/auth/sports-interests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sports Profile Updated! 🎉",
        description: "Your sports interests and facility preferences have been saved successfully.",
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your sports profile",
        variant: "destructive",
      });
    },
  });

  const handleSportToggle = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };

  const handleFacilityToggle = (facilityId: string) => {
    setSelectedFacilities(prev => 
      prev.includes(facilityId) 
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleNextStep = () => {
    if (step === 1 && selectedSports.length >= 1) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (selectedSports.length < 1) {
      toast({
        title: "Selection Required",
        description: "Please select at least 1 sport interest to continue.",
        variant: "destructive",
      });
      return;
    }

    updateSportsInterestsMutation.mutate({
      sportsInterests: selectedSports,
      facilityPreferences: selectedFacilities
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>
              {step === 1 ? "🏆 Select Your Sports Interests" : "🏟️ Choose Your Facility Preferences"}
            </span>
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Choose the sports you're interested in to get personalized event recommendations and connect with the right organizations."
              : "Select the types of sports facilities you prefer or need access to for training and competitions."
            }
          </DialogDescription>
        </DialogHeader>

        {isFirstTime && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Welcome to Sportfolio!</strong> Complete your sports profile to unlock personalized features and connect with Kerala's sports ecosystem.
            </AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Kerala Sports Categories</h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {selectedSports.length} selected
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {keralaSportsCategories.map((sport) => (
                <Card 
                  key={sport.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedSports.includes(sport.id) 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                      : 'hover:shadow-md hover:scale-105'
                  }`}
                  onClick={() => handleSportToggle(sport.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedSports.includes(sport.id)}
                        onChange={() => {}} 
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{sport.emoji}</span>
                          <div>
                            <div className="font-medium text-sm">{sport.name}</div>
                            <div className="text-xs text-muted-foreground">{sport.description}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Select sports that match your interests or competitive goals
              </div>
              <Button 
                onClick={handleNextStep}
                disabled={selectedSports.length < 1}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Facility Preferences →
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Facility Preferences</h3>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {selectedFacilities.length} selected (optional)
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityTypes.map((facility) => (
                <Card 
                  key={facility.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFacilities.includes(facility.id) 
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-200' 
                      : 'hover:shadow-md hover:scale-105'
                  }`}
                  onClick={() => handleFacilityToggle(facility.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedFacilities.includes(facility.id)}
                        onChange={() => {}} 
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{facility.emoji}</span>
                          <div>
                            <div className="font-medium text-sm">{facility.name}</div>
                            <div className="text-xs text-muted-foreground">{facility.description}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                onClick={() => setStep(1)}
                variant="outline"
              >
                ← Back to Sports
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={updateSportsInterestsMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateSportsInterestsMutation.isPending ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Saving...
                  </>
                ) : (
                  "Complete Setup ✓"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 pt-4 border-t">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-8 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-xs text-muted-foreground ml-2">
            Step {step} of 2
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}