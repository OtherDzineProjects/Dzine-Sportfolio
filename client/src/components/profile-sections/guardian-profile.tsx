import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Edit, Save, X, Plus, Trash2, Shield, UserCheck, AlertCircle } from "lucide-react";
import { GuardianProfile, Dependent } from "@shared/profile-types";

interface GuardianProfileSectionProps {
  profile: Partial<GuardianProfile>;
  userAge: number;
  onUpdate: (updates: Partial<GuardianProfile>) => void;
  isLoading?: boolean;
}

export function GuardianProfileSection({ profile, userAge, onUpdate, isLoading }: GuardianProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<GuardianProfile>>({
    ...profile,
    dependents: profile.dependents || []
  });

  const isMinor = userAge < 18;
  const isElderly = userAge >= 60;

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({...profile, dependents: profile.dependents || []});
    setIsEditing(false);
  };

  const addDependent = () => {
    const newDependent: Dependent = {
      id: Date.now(), // Temporary ID
      name: '',
      relation: 'child',
      dateOfBirth: '',
      needsSupport: false,
      profileAccess: false
    };
    setFormData({
      ...formData,
      dependents: [...(formData.dependents || []), newDependent]
    });
  };

  const updateDependent = (index: number, updates: Partial<Dependent>) => {
    const updatedDependents = [...(formData.dependents || [])];
    updatedDependents[index] = { ...updatedDependents[index], ...updates };
    setFormData({ ...formData, dependents: updatedDependents });
  };

  const removeDependent = (index: number) => {
    const updatedDependents = (formData.dependents || []).filter((_, i) => i !== index);
    setFormData({ ...formData, dependents: updatedDependents });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-purple-600" />
          <div>
            <CardTitle>Guardian & Family Management</CardTitle>
            <CardDescription>
              {isMinor 
                ? "Guardian supervision for under-18 users" 
                : "Manage dependents and family member access"}
            </CardDescription>
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
        {/* Minor Status Alert */}
        {isMinor && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Minor Account Protection</p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  As a user under 18, your account requires guardian supervision. Your guardian can manage 
                  your profile, event registrations, and sports activities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Guardian Information (for minors) */}
        {isMinor && (
          <div className="space-y-4">
            <h4 className="font-medium">Guardian Information</h4>
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
              {formData.guardianId ? (
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Guardian assigned (ID: {formData.guardianId})</span>
                  <Badge variant="default">Active</Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span>No guardian assigned. Please contact support to assign a guardian.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dependents Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {isMinor ? "Family Members" : "Dependents & Family Support"}
            </h4>
            {isEditing && !isMinor && (
              <Button variant="outline" size="sm" onClick={addDependent}>
                <Plus className="h-4 w-4 mr-2" />
                Add Dependent
              </Button>
            )}
          </div>

          {/* Instructions */}
          {!isMinor && (
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
              <p>
                You can add children under 18 or elderly parents who need assistance managing their 
                Sportfolio accounts. This allows you to help them with event registrations and sports activities.
              </p>
            </div>
          )}

          {/* Dependents List */}
          <div className="space-y-3">
            {(formData.dependents || []).map((dependent, index) => {
              const age = calculateAge(dependent.dateOfBirth);
              const isChildDependent = age < 18;
              const isElderlyDependent = age >= 60;
              
              return (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">
                        {dependent.name || 'New Dependent'}
                      </span>
                      {age > 0 && (
                        <Badge variant={isChildDependent ? "secondary" : isElderlyDependent ? "outline" : "default"}>
                          {age} years old
                        </Badge>
                      )}
                      <Badge variant="outline">{dependent.relation}</Badge>
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDependent(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={dependent.name}
                        onChange={(e) => updateDependent(index, { name: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Select
                        value={dependent.relation}
                        onValueChange={(value: any) => updateDependent(index, { relation: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="elderly_parent">Elderly Parent</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={dependent.dateOfBirth}
                        onChange={(e) => updateDependent(index, { dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`needsSupport-${index}`}
                        checked={dependent.needsSupport}
                        onCheckedChange={(checked) => updateDependent(index, { needsSupport: !!checked })}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`needsSupport-${index}`} className="text-sm">
                        Needs assistance with digital activities
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`profileAccess-${index}`}
                        checked={dependent.profileAccess}
                        onCheckedChange={(checked) => updateDependent(index, { profileAccess: !!checked })}
                        disabled={!isEditing}
                      />
                      <Label htmlFor={`profileAccess-${index}`} className="text-sm">
                        Can access their own profile
                      </Label>
                    </div>
                  </div>

                  {/* Support indicators */}
                  <div className="flex flex-wrap gap-2">
                    {isChildDependent && (
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        Requires Guardian Approval
                      </Badge>
                    )}
                    {dependent.needsSupport && (
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        Assisted Account
                      </Badge>
                    )}
                    {isElderlyDependent && dependent.needsSupport && (
                      <Badge variant="outline">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Digital Support
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(!formData.dependents || formData.dependents.length === 0) && !isEditing && (
            <p className="text-gray-500 text-center py-8">
              {isMinor 
                ? "No family members added yet."
                : "No dependents added yet. Click Edit to add family members who need support."}
            </p>
          )}
        </div>

        {/* Elderly Support Notice */}
        {isElderly && (
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <UserCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200">Assisted Account Support</p>
                <p className="text-blue-700 dark:text-blue-300">
                  If you need help managing your Sportfolio account, you can grant access to family 
                  members to assist you with registrations and profile updates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Family Access Summary */}
        {(formData.dependents && formData.dependents.length > 0) && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Family Access Summary</h5>
            <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <p>• You are managing {formData.dependents.length} family member{formData.dependents.length > 1 ? 's' : ''}</p>
              <p>• {formData.dependents.filter(d => calculateAge(d.dateOfBirth) < 18).length} minor(s) requiring guardian approval</p>
              <p>• {formData.dependents.filter(d => d.needsSupport).length} family member(s) needing digital assistance</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}