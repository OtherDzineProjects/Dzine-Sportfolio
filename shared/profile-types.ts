// Profile section types for enhanced user management
export interface PersonalProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  district?: string;
  lsgd?: string;
  pincode: string;
  dateOfBirth: string;
  profileImageUrl?: string;
  fatherName: string;
  motherName: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  emergencyContact: string;
  emergencyContactRelation: string;
}

export interface Skill {
  name: string;
  category: 'sports' | 'IT' | 'academic' | 'professional' | 'arts' | 'business';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  certificates?: string[];
  description?: string;
}

export interface CareerProfile {
  educationQualification: string;
  institution: string;
  graduationYear?: number;
  currentPosition: string;
  currentOrganization: string;
  workExperience?: number;
  skills: Skill[];
}

export interface MedicalCondition {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  medications?: string[];
  doctorNotes?: string;
}

export interface Injury {
  injury: string;
  date: string;
  recovered: boolean;
  restrictions?: string[];
}

export interface MedicalProfile {
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number;
  bloodGroup?: string;
  allergies: string[];
  medicalConditions: MedicalCondition[];
  injuries: Injury[];
  lastMedicalCheckup?: string;
  medicalClearance: boolean;
}

export interface Dependent {
  id: number;
  name: string;
  relation: 'child' | 'elderly_parent' | 'spouse' | 'sibling';
  dateOfBirth: string;
  needsSupport: boolean;
  profileAccess?: boolean;
}

export interface GuardianProfile {
  isMinor: boolean;
  guardianId?: number;
  dependents: Dependent[];
}

export interface CompleteUserProfile {
  personal: PersonalProfile;
  career: CareerProfile;
  medical: MedicalProfile;
  guardian: GuardianProfile;
}

// Verification status for skills
export interface SkillVerification {
  skillId: string;
  userId: number;
  verifierId: number;
  verifierName: string;
  verifierOrganization?: string;
  status: 'pending' | 'verified' | 'rejected';
  evidence?: string[];
  notes?: string;
  verifiedAt?: string;
  blockchainHash?: string;
}