/**
 * Profiles API service — calls BFF proxy `/api/v1/profiles/*`
 */
import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "@/types/api";
import type {
  MentorProfileResponse,
  PublicMentorProfileResponse,
  PublicMentorListItem,
  MenteeProfileResponse,
  UpdateMentorProfileRequest,
  UpdateMenteeProfileRequest,
  AddMentorSkillRequest,
  MentorSkillResponse,
  AddMentorExperienceRequest,
  UpdateMentorExperienceRequest,
  MentorExperienceResponse,
  AddMentorCertificationRequest,
  MentorCertificationResponse,
  UpdateMentorVerificationRequest,
} from "@/types/api";

const BASE = "/api/v1/profiles";

/* ---- Mentor Profile ---- */

export function getMentorProfile() {
  return http.get<MentorProfileResponse>(`${BASE}/mentors/me`);
}

export function updateMentorProfile(data: UpdateMentorProfileRequest) {
  return http.put<void>(`${BASE}/mentors/me`, data);
}

export function getPublicMentorProfile(mentorId: string) {
  return http.get<PublicMentorProfileResponse>(`${BASE}/mentors/${mentorId}`);
}

export function searchPublicMentors(params: {
  searchTerm?: string;
  skillId?: string;
  minRate?: number;
  maxRate?: number;
  verificationStatus?: string;
  minRating?: number;
  sortBy?: string;
  sortDesc?: boolean;
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<PublicMentorListItem>>(`${BASE}/mentors`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

/* ---- Mentor Skills ---- */

export function addMentorSkill(data: AddMentorSkillRequest) {
  return http.post<MentorSkillResponse>(`${BASE}/mentors/me/skills`, data);
}

export function removeMentorSkill(skillId: string) {
  return http.delete<void>(`${BASE}/mentors/me/skills/${skillId}`);
}

/* ---- Mentor Experiences ---- */

export function addMentorExperience(data: AddMentorExperienceRequest) {
  return http.post<MentorExperienceResponse>(`${BASE}/mentors/me/experiences`, data);
}

export function updateMentorExperience(experienceId: string, data: UpdateMentorExperienceRequest) {
  return http.put<void>(`${BASE}/mentors/me/experiences/${experienceId}`, data);
}

export function removeMentorExperience(experienceId: string) {
  return http.delete<void>(`${BASE}/mentors/me/experiences/${experienceId}`);
}

/* ---- Mentor Certifications ---- */

export function addMentorCertification(data: AddMentorCertificationRequest) {
  return http.post<MentorCertificationResponse>(`${BASE}/mentors/me/certifications`, data);
}

export function removeMentorCertification(certificationId: string) {
  return http.delete<void>(`${BASE}/mentors/me/certifications/${certificationId}`);
}

/* ---- Mentee Profile ---- */

export function getMenteeProfile() {
  return http.get<MenteeProfileResponse>(`${BASE}/mentees/me`);
}

export function updateMenteeProfile(data: UpdateMenteeProfileRequest) {
  return http.put<void>(`${BASE}/mentees/me`, data);
}

/* ---- Admin ---- */

export function updateMentorVerification(mentorId: string, data: UpdateMentorVerificationRequest) {
  return http.put<void>(`${BASE}/mentors/${mentorId}/verification`, data);
}
