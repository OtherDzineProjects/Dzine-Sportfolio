import { PersonalProfile, CareerProfile, MedicalProfile, GuardianProfile } from "@shared/profile-types";

export interface ProfileCompletionData {
  percentage: number;
  completedSections: number;
  totalSections: number;
  sectionsDetails: {
    personal: { completed: number; total: number; percentage: number };
    career: { completed: number; total: number; percentage: number };
    medical: { completed: number; total: number; percentage: number };
    guardian: { completed: number; total: number; percentage: number };
  };
}

export function calculateProfileCompletion(
  personal: Partial<PersonalProfile>,
  career: Partial<CareerProfile>,
  medical: Partial<MedicalProfile>,
  guardian: Partial<GuardianProfile>
): ProfileCompletionData {
  
  // Personal Profile fields (required fields)
  const personalFields = [
    'firstName', 'lastName', 'dateOfBirth', 'phone', 'address', 
    'city', 'state', 'pincode'
  ];
  const personalCompleted = personalFields.filter(field => 
    personal[field as keyof PersonalProfile] && 
    personal[field as keyof PersonalProfile] !== ''
  ).length;
  const personalPercentage = Math.round((personalCompleted / personalFields.length) * 100);

  // Career Profile fields
  const careerFields = [
    'educationQualification', 'institution', 'currentPosition', 
    'workExperience'
  ];
  const careerCompleted = careerFields.filter(field => 
    career[field as keyof CareerProfile] && 
    career[field as keyof CareerProfile] !== ''
  ).length;
  const careerPercentage = Math.round((careerCompleted / careerFields.length) * 100);

  // Medical Profile fields
  const medicalFields = [
    'height', 'weight', 'bloodGroup', 'lastMedicalCheckup'
  ];
  const medicalCompleted = medicalFields.filter(field => 
    medical[field as keyof MedicalProfile] && 
    medical[field as keyof MedicalProfile] !== ''
  ).length;
  const medicalPercentage = Math.round((medicalCompleted / medicalFields.length) * 100);

  // Guardian Profile fields (only count if user is minor or has dependents)
  const guardianFields = ['emergencyContact', 'emergencyContactRelation'];
  const guardianCompleted = guardianFields.filter(field => 
    guardian[field as keyof GuardianProfile] && 
    guardian[field as keyof GuardianProfile] !== ''
  ).length;
  const guardianPercentage = Math.round((guardianCompleted / guardianFields.length) * 100);

  // Overall completion
  const totalFields = personalFields.length + careerFields.length + medicalFields.length + guardianFields.length;
  const totalCompleted = personalCompleted + careerCompleted + medicalCompleted + guardianCompleted;
  const overallPercentage = Math.round((totalCompleted / totalFields) * 100);

  // Section completion count
  const sectionsCompleted = [
    personalPercentage >= 80,
    careerPercentage >= 50,
    medicalPercentage >= 50,
    guardianPercentage >= 50
  ].filter(Boolean).length;

  return {
    percentage: overallPercentage,
    completedSections: sectionsCompleted,
    totalSections: 4,
    sectionsDetails: {
      personal: { completed: personalCompleted, total: personalFields.length, percentage: personalPercentage },
      career: { completed: careerCompleted, total: careerFields.length, percentage: careerPercentage },
      medical: { completed: medicalCompleted, total: medicalFields.length, percentage: medicalPercentage },
      guardian: { completed: guardianCompleted, total: guardianFields.length, percentage: guardianPercentage }
    }
  };
}

export function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function getCompletionBadgeVariant(percentage: number): "default" | "secondary" | "destructive" {
  if (percentage >= 80) return "default";
  if (percentage >= 50) return "secondary";
  return "destructive";
}