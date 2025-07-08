import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Edit, Save, X, Plus, Trash2, CheckCheck, Check, ExternalLink } from "lucide-react";
import { CareerProfile, Skill } from "@shared/profile-types";

interface CareerProfileSectionProps {
  profile: Partial<CareerProfile>;
  onUpdate: (updates: Partial<CareerProfile>) => void;
  isLoading?: boolean;
}

export function CareerProfileSection({ profile, onUpdate, isLoading }: CareerProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CareerProfile>>({
    ...profile,
    skills: profile.skills || []
  });
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: 'sports',
    level: 'beginner',
    isVerified: false
  });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({...profile, skills: profile.skills || []});
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.name && newSkill.category && newSkill.level) {
      const skillToAdd: Skill = {
        name: newSkill.name,
        category: newSkill.category as any,
        level: newSkill.level as any,
        isVerified: false,
        description: newSkill.description
      };
      
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillToAdd]
      });
      
      setNewSkill({
        name: '',
        category: 'sports',
        level: 'beginner',
        isVerified: false
      });
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = (formData.skills || []).filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const requestVerification = (skillIndex: number) => {
    // TODO: Implement verification request
    console.log('Requesting verification for skill:', formData.skills?.[skillIndex]);
  };

  const VerificationIcon = ({ skill }: { skill: Skill }) => {
    if (skill.isVerified) {
      return <CheckCheck className="h-4 w-4 text-blue-600" title="Verified by external authority" />;
    }
    return <Check className="h-4 w-4 text-gray-400" title="Self-declared, not verified" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-5 w-5 text-green-600" />
          <div>
            <CardTitle>Career Profile</CardTitle>
            <CardDescription>Education, work experience, and skills with verification</CardDescription>
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
        {/* Education */}
        <div className="space-y-4">
          <h4 className="font-medium">Education</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="educationQualification">Highest Qualification</Label>
              <Input
                id="educationQualification"
                value={formData.educationQualification || ''}
                onChange={(e) => setFormData({ ...formData, educationQualification: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., Bachelor's Degree, Master's Degree"
              />
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution || ''}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., University of Kerala"
              />
            </div>
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                value={formData.graduationYear || ''}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                disabled={!isEditing}
                min="1950"
                max="2030"
              />
            </div>
          </div>
        </div>

        {/* Current Position */}
        <div className="space-y-4">
          <h4 className="font-medium">Current Position</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentPosition">Job Title/Position</Label>
              <Input
                id="currentPosition"
                value={formData.currentPosition || ''}
                onChange={(e) => setFormData({ ...formData, currentPosition: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., Software Engineer, Coach, Student"
              />
            </div>
            <div>
              <Label htmlFor="currentOrganization">Organization</Label>
              <Input
                id="currentOrganization"
                value={formData.currentOrganization || ''}
                onChange={(e) => setFormData({ ...formData, currentOrganization: e.target.value })}
                disabled={!isEditing}
                placeholder="e.g., Tech Company, Sports Club"
              />
            </div>
            <div>
              <Label htmlFor="workExperience">Years of Experience</Label>
              <Input
                id="workExperience"
                type="number"
                value={formData.workExperience || ''}
                onChange={(e) => setFormData({ ...formData, workExperience: parseInt(e.target.value) })}
                disabled={!isEditing}
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h4 className="font-medium">Skills & Expertise</h4>
          
          {/* Existing Skills */}
          <div className="space-y-3">
            {(formData.skills || []).map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <VerificationIcon skill={skill} />
                    <span className="font-medium">{skill.name}</span>
                    <Badge variant={skill.isVerified ? "default" : "secondary"}>
                      {skill.category}
                    </Badge>
                    <Badge variant="outline">
                      {skill.level}
                    </Badge>
                  </div>
                  {skill.description && (
                    <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                  )}
                  {skill.isVerified && skill.verifiedBy && (
                    <p className="text-xs text-blue-600 mt-1">
                      Verified by {skill.verifiedBy} {skill.verificationDate && `on ${skill.verificationDate}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!skill.isVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestVerification(index)}
                      disabled={!isEditing}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Request Verification
                    </Button>
                  )}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Skill */}
          {isEditing && (
            <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h5 className="font-medium mb-3">Add New Skill</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div>
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={newSkill.name || ''}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g., Football, Python, Leadership"
                  />
                </div>
                <div>
                  <Label htmlFor="skillCategory">Category</Label>
                  <Select
                    value={newSkill.category || 'sports'}
                    onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="IT">Information Technology</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="arts">Arts & Creative</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skillLevel">Skill Level</Label>
                  <Select
                    value={newSkill.level || 'beginner'}
                    onValueChange={(value) => setNewSkill({ ...newSkill, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-3">
                <Label htmlFor="skillDescription">Description (Optional)</Label>
                <Textarea
                  id="skillDescription"
                  value={newSkill.description || ''}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  placeholder="Brief description of your skill and experience"
                  rows={2}
                />
              </div>
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          )}
          
          {(!formData.skills || formData.skills.length === 0) && !isEditing && (
            <p className="text-gray-500 text-center py-8">No skills added yet. Click Edit to add your skills.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}