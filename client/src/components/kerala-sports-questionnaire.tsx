import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  KERALA_DISTRICTS, 
  KERALA_SPORTS_CATEGORIES, 
  SKILL_LEVELS, 
  SPORTS_GOALS, 
  PREFERRED_VENUES,
  generateRecommendationText
} from "@/lib/kerala-sports";
import { MapPin, Trophy, Target, Calendar } from "lucide-react";

interface KeralaQuestionnaire {
  name?: string;
  district: string;
  ageGroup: string;
  primaryCategories: string[];
  trackAndFieldSubcategories: string[];
  skillLevel: string;
  goal: string;
  preferredVenue: string;
}

interface Props {
  onSubmit: (data: KeralaQuestionnaire) => void;
  onClose: () => void;
  initialData?: Partial<KeralaQuestionnaire>;
}

export default function KeralasSportsQuestionnaire({ onSubmit, onClose, initialData }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<KeralaQuestionnaire>({
    name: initialData?.name || "",
    district: initialData?.district || "",
    ageGroup: initialData?.ageGroup || "",
    primaryCategories: initialData?.primaryCategories || [],
    trackAndFieldSubcategories: initialData?.trackAndFieldSubcategories || [],
    skillLevel: initialData?.skillLevel || "",
    goal: initialData?.goal || "",
    preferredVenue: initialData?.preferredVenue || ""
  });

  const [showTrackAndField, setShowTrackAndField] = useState(false);

  const handlePrimaryCategoryToggle = (category: string) => {
    const isTrackAndField = category === "Track & Field (Athletics)";
    
    if (formData.primaryCategories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        primaryCategories: prev.primaryCategories.filter(c => c !== category),
        trackAndFieldSubcategories: isTrackAndField ? [] : prev.trackAndFieldSubcategories
      }));
      if (isTrackAndField) setShowTrackAndField(false);
    } else if (formData.primaryCategories.length < 3) {
      setFormData(prev => ({
        ...prev,
        primaryCategories: [...prev.primaryCategories, category]
      }));
      if (isTrackAndField) setShowTrackAndField(true);
    }
  };

  const handleTrackFieldSubcategoryToggle = (subcategory: string) => {
    if (formData.trackAndFieldSubcategories.includes(subcategory)) {
      setFormData(prev => ({
        ...prev,
        trackAndFieldSubcategories: prev.trackAndFieldSubcategories.filter(s => s !== subcategory)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        trackAndFieldSubcategories: [...prev.trackAndFieldSubcategories, subcategory]
      }));
    }
  };

  const canProceedToStep2 = formData.district && formData.ageGroup && formData.primaryCategories.length >= 1;
  const canProceedToStep3 = formData.primaryCategories.length >= 1 && 
    (!showTrackAndField || formData.trackAndFieldSubcategories.length > 0);
  const canSubmit = formData.skillLevel && formData.goal;

  const generateRecommendations = () => {
    if (!formData.district || formData.primaryCategories.length === 0) return "";
    
    const allSelectedSports = [
      ...formData.primaryCategories,
      ...formData.trackAndFieldSubcategories
    ];
    
    return generateRecommendationText(
      formData.district,
      allSelectedSports,
      formData.skillLevel,
      formData.preferredVenue
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Basic Profile</h3>
        <p className="text-gray-600 dark:text-gray-400">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name (Optional)</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="district">District *</Label>
          <Select value={formData.district} onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent>
              {KERALA_DISTRICTS.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ageGroup">Age Group *</Label>
          <Select value={formData.ageGroup} onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under_18">Under 18</SelectItem>
              <SelectItem value="18_35">18-35</SelectItem>
              <SelectItem value="36_plus">36+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
          Next: Sports Selection
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Sports Interest Selection</h3>
        <p className="text-gray-600 dark:text-gray-400">Select up to 3 primary categories</p>
        <Badge variant="secondary" className="mt-2">
          {formData.primaryCategories.length}/3 selected
        </Badge>
      </div>

      <div className="grid gap-4">
        {Object.entries(KERALA_SPORTS_CATEGORIES).map(([key, category]) => (
          <Card key={key} className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.sports.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport}
                    checked={formData.primaryCategories.includes(sport)}
                    onCheckedChange={() => handlePrimaryCategoryToggle(sport)}
                    disabled={!formData.primaryCategories.includes(sport) && formData.primaryCategories.length >= 3}
                  />
                  <Label htmlFor={sport} className="text-sm font-medium">{sport}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Track & Field Subcategories */}
      {showTrackAndField && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
              Track & Field Details
            </CardTitle>
            <CardDescription>Select specific events you're interested in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(KERALA_SPORTS_CATEGORIES.trackAndField.subcategories!).map(([key, subcat]) => (
              <div key={key}>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{subcat.name}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {subcat.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={formData.trackAndFieldSubcategories.includes(option)}
                        onCheckedChange={() => handleTrackFieldSubcategoryToggle(option)}
                      />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
        <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
          Next: Preferences
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Skill & Goals</h3>
        <p className="text-gray-600 dark:text-gray-400">Tell us about your experience and objectives</p>
      </div>

      <div className="grid gap-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Training Level *</Label>
          <div className="grid gap-3">
            {SKILL_LEVELS.map((level) => (
              <div 
                key={level.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.skillLevel === level.value 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, skillLevel: level.value }))}
              >
                <div className="flex items-center space-x-3">
                  <Trophy className={`h-5 w-5 ${formData.skillLevel === level.value ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{level.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Goal *</Label>
          <div className="grid gap-3">
            {SPORTS_GOALS.map((goal) => (
              <div 
                key={goal.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.goal === goal.value 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, goal: goal.value }))}
              >
                <div className="flex items-center space-x-3">
                  <Target className={`h-5 w-5 ${formData.goal === goal.value ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium">{goal.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Preferred Venue</Label>
          <div className="grid gap-3">
            {PREFERRED_VENUES.map((venue) => (
              <div 
                key={venue.value}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.preferredVenue === venue.value 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, preferredVenue: venue.value }))}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className={`h-5 w-5 ${formData.preferredVenue === venue.value ? 'text-purple-500' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium">{venue.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{venue.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Preview */}
      {canSubmit && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Your Recommendations:</div>
            <pre className="text-sm whitespace-pre-wrap">{generateRecommendations()}</pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
        <Button onClick={() => onSubmit(formData)} disabled={!canSubmit}>
          Complete Setup
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex space-x-1">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          Kerala Sports Interest Profile
        </CardTitle>
        <CardDescription>
          Help us find the perfect sports organizations and events for you in Kerala
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
}