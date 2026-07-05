export interface Student {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  bio?: string;
  profilePictureUrl?: string;
  onboardingMethod: 'upload' | 'manual';
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  description?: string;
  location?: string;
  logoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Cv {
  _id: string;
  studentId: string;
  name: string;
  fileUrl: string;
  fileId?: string;
  extractedSkills: string[];
  improvementTips: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  _id: string;
  companyId: string | { _id: string; name: string; logoUrl?: string; location?: string };
  title: string;
  description: string;
  paymentType: 'paid' | 'unpaid';
  employmentType: 'full_time' | 'part_time' | 'remote' | 'hybrid';
  requiredSkills: string[];
  durationMonths?: number;
  location?: string;
  isActive: boolean;
  matchPercentage?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export interface Application {
  _id: string;
  studentId: string | Student;
  cvId: string | Cv;
  offerId: string | Offer;
  motivationLetter: string;
  matchPercentageSnapshot: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  student?: { id: string; fullName: string; email: string; role: string };
  company?: { id: string; name: string; email: string; status: string };
}

export interface MatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}
