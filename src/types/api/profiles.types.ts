/**
 * Profiles Module DTOs — `/api/v1/profiles`
 *
 * Maps to .NET `SkillBridge.Modules.Profiles` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Mentor Profile                                                    */
/* ------------------------------------------------------------------ */

export interface MentorProfileResponse {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  currency: string;
  timezone: string;
  ratingAverage: number;
  totalReviews: number;
  totalSessions: number;
  verificationStatus: "Unverified" | "Pending" | "Verified" | "Rejected";
  isAcceptingMentees: boolean;
  skills: MentorSkillResponse[];
  experiences: MentorExperienceResponse[];
  certifications: MentorCertificationResponse[];
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface PublicMentorProfileResponse {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  currency: string;
  ratingAverage: number;
  totalReviews: number;
  totalSessions: number;
  verificationStatus: "Unverified" | "Pending" | "Verified" | "Rejected";
  skills: MentorSkillResponse[];
  experiences: MentorExperienceResponse[];
  certifications: MentorCertificationResponse[];
}

export interface MentorSkillResponse {
  id: string;
  skillId: string;
  skillName: string;
  proficiencyLevel: string;
}

export interface MentorExperienceResponse {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  isCurrent: boolean;
}

export interface MentorCertificationResponse {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface PublicMentorListItem {
  id: string;
  fullName?: string;
  headline: string;
  hourlyRate: number;
  currency: string;
  ratingAverage: number;
  totalReviews: number;
  verificationStatus: string;
  skills?: MentorSkillResponse[];
}

/* ------------------------------------------------------------------ */
/*  Mentee Profile                                                    */
/* ------------------------------------------------------------------ */

export interface MenteeProfileResponse {
  id: string;
  learningGoals: string;
  currentLevel: string;
  preferredLanguage: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export interface UpdateMentorProfileRequest {
  headline: string;
  bio: string;
  hourlyRate: number;
  currency?: string;
  timezone?: string;
  isAcceptingMentees?: boolean;
}

export interface UpdateMenteeProfileRequest {
  learningGoals: string;
  currentLevel: string;
  preferredLanguage?: string;
}

export interface AddMentorSkillRequest {
  skillId: string;
  proficiencyLevel: string;
}

export interface AddMentorExperienceRequest {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface UpdateMentorExperienceRequest {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface AddMentorCertificationRequest {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface UpdateMentorVerificationRequest {
  verificationStatus: "Pending" | "Verified" | "Rejected";
  adminNote?: string;
}
