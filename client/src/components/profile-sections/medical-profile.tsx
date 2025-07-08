import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Edit, Save, X, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { MedicalProfile, MedicalCondition, Injury } from "@shared/profile-types";

interface MedicalProfileSectionProps {
  profile: Partial<MedicalProfile>;
  onUpdate: (updates: Partial<MedicalProfile>) => void;
  isLoading?: boolean;
}

export function MedicalProfileSection({ profile, onUpdate, isLoading }: MedicalProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<MedicalProfile>>({
    ...profile,
    allergies: profile.allergies || [],
    medicalConditions: profile.medicalConditions || [],
    injuries: profile.injuries || []
  });

  // Calculate BMI automatically
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      setFormData(prev => ({ ...prev, bmi: Math.round(bmi * 100) / 100 }));
    }
  }, [formData.height, formData.weight]);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      ...profile,
      allergies: profile.allergies || [],
      medicalConditions: profile.medicalConditions || [],
      injuries: profile.injuries || []
    });
    setIsEditing(false);
  };

  const addAllergy = (allergy: string) => {
    if (allergy && !formData.allergies?.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), allergy]
      });
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData({
      ...formData,
      allergies: (formData.allergies || []).filter(a => a !== allergy)
    });
  };

  const addMedicalCondition = () => {
    const newCondition: MedicalCondition = {
      condition: '',
      severity: 'mild',
      medications: [],
      doctorNotes: ''
    };
    setFormData({
      ...formData,
      medicalConditions: [...(formData.medicalConditions || []), newCondition]
    });
  };

  const updateMedicalCondition = (index: number, updates: Partial<MedicalCondition>) => {
    const updatedConditions = [...(formData.medicalConditions || [])];
    updatedConditions[index] = { ...updatedConditions[index], ...updates };
    setFormData({ ...formData, medicalConditions: updatedConditions });
  };

  const removeMedicalCondition = (index: number) => {
    const updatedConditions = (formData.medicalConditions || []).filter((_, i) => i !== index);
    setFormData({ ...formData, medicalConditions: updatedConditions });
  };

  const addInjury = () => {
    const newInjury: Injury = {
      injury: '',
      date: '',
      recovered: false,
      restrictions: []
    };
    setFormData({
      ...formData,
      injuries: [...(formData.injuries || []), newInjury]
    });
  };

  const updateInjury = (index: number, updates: Partial<Injury>) => {
    const updatedInjuries = [...(formData.injuries || [])];
    updatedInjuries[index] = { ...updatedInjuries[index], ...updates };
    setFormData({ ...formData, injuries: updatedInjuries });
  };

  const removeInjury = (index: number) => {
    const updatedInjuries = (formData.injuries || []).filter((_, i) => i !== index);
    setFormData({ ...formData, injuries: updatedInjuries });
  };

  const getBMICategory = (bmi?: number) => {
    if (!bmi) return { category: 'Unknown', color: 'gray' };
    if (bmi < 18.5) return { category: 'Underweight', color: 'blue' };
    if (bmi < 25) return { category: 'Normal', color: 'green' };
    if (bmi < 30) return { category: 'Overweight', color: 'yellow' };
    return { category: 'Obese', color: 'red' };
  };

  const bmiInfo = getBMICategory(formData.bmi);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-600" />
          <div>
            <CardTitle>Medical Profile</CardTitle>
            <CardDescription>Health information for event safety and medical emergencies</CardDescription>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Measurements */}
        <div className="space-y-4">
          <h4 className="font-medium">Physical Measurements</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) })}
                disabled={!isEditing}
                min="50"
                max="250"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                disabled={!isEditing}
                min="20"
                max="200"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="bmi"
                  value={formData.bmi || ''}
                  disabled
                  className="bg-gray-50"
                />
                {formData.bmi && (
                  <Badge variant={bmiInfo.color === 'green' ? 'default' : 'secondary'}>
                    {bmiInfo.category}
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={formData.bloodGroup || ''}
                onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-4">
          <h4 className="font-medium">Allergies</h4>
          <div className="flex flex-wrap gap-2">
            {(formData.allergies || []).map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center gap-1">
                {allergy}
                {isEditing && (
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <Input
                placeholder="Add allergy (e.g., Peanuts, Shellfish)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addAllergy(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value) {
                    addAllergy(input.value);
                    input.value = '';
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Medical Conditions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Medical Conditions</h4>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addMedicalCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            )}
          </div>
          
          {(formData.medicalConditions || []).map((condition, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <div>
                    <Label>Condition</Label>
                    <Input
                      value={condition.condition}
                      onChange={(e) => updateMedicalCondition(index, { condition: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Select
                      value={condition.severity}
                      onValueChange={(value: any) => updateMedicalCondition(index, { severity: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMedicalCondition(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {condition.doctorNotes && (
                <div>
                  <Label>Doctor's Notes</Label>
                  <Textarea
                    value={condition.doctorNotes}
                    onChange={(e) => updateMedicalCondition(index, { doctorNotes: e.target.value })}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Injuries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Past Injuries</h4>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={addInjury}>
                <Plus className="h-4 w-4 mr-2" />
                Add Injury
              </Button>
            )}
          </div>
          
          {(formData.injuries || []).map((injury, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                  <div>
                    <Label>Injury</Label>
                    <Input
                      value={injury.injury}
                      onChange={(e) => updateInjury(index, { injury: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Ankle sprain, Knee injury"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={injury.date}
                      onChange={(e) => updateInjury(index, { date: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id={`recovered-${index}`}
                      checked={injury.recovered}
                      onCheckedChange={(checked) => updateInjury(index, { recovered: !!checked })}
                      disabled={!isEditing}
                    />
                    <Label htmlFor={`recovered-${index}`}>Fully Recovered</Label>
                    {injury.recovered ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeInjury(index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Medical Clearance */}
        <div className="space-y-4">
          <h4 className="font-medium">Medical Clearance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastMedicalCheckup">Last Medical Checkup</Label>
              <Input
                id="lastMedicalCheckup"
                type="date"
                value={formData.lastMedicalCheckup || ''}
                onChange={(e) => setFormData({ ...formData, lastMedicalCheckup: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Checkbox
                id="medicalClearance"
                checked={formData.medicalClearance || false}
                onCheckedChange={(checked) => setFormData({ ...formData, medicalClearance: !!checked })}
                disabled={!isEditing}
              />
              <Label htmlFor="medicalClearance">Medical clearance for sports activities</Label>
              {formData.medicalClearance ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">Important Notice</p>
              <p className="text-blue-700 dark:text-blue-300">
                This medical information will be shared with event organizers and facility managers for safety purposes. 
                Always consult with medical professionals before participating in sports activities.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}