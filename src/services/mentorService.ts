import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";

export interface MentorListItemDto {
  id: string;
  fullName?: string;
  headline: string;
  hourlyRate: number;
  currency: string;
  ratingAverage: number;
  totalReviews: number;
  verificationStatus: "Unverified" | "Pending" | "Verified";
  avatarUrl?: string;
  isAcceptingMentees?: boolean;
}

export interface MentorSkillItemDto {
  id: string;
  skillId: string;
  name?: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: number;
}

export interface MentorExperienceItemDto {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  isCurrent: boolean;
}

export interface MentorCertificationItemDto {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string;
  credentialId?: string;
}

export interface MentorProfileDetailDto {
  id: string;
  fullName?: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  currency: string;
  timezone: string;
  ratingAverage: number;
  totalReviews: number;
  totalSessions: number;
  verificationStatus: "Unverified" | "Pending" | "Verified";
  isAcceptingMentees: boolean;
  avatarUrl?: string;
  skills: MentorSkillItemDto[];
  experiences: MentorExperienceItemDto[];
  certifications: MentorCertificationItemDto[];
}

export interface MentorServiceDto {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  serviceType: "Tier1_ReviewCV" | "Tier2_MockInterview" | "Tier3_Roadmap";
  durationMinutes: number;
  price: number;
  currency: string;
  totalSessions: number;
  deliverables: string;
  isActive: boolean;
  version?: number;
}

export interface SearchMentorsParams {
  searchTerm?: string;
  skillId?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  verificationStatus?: string;
  sortBy?: "rating" | "rate" | "reviews";
  sortDesc?: boolean;
  page?: number;
  pageSize?: number;
}

export const mentorService = {
  searchMentors: async (
    params: SearchMentorsParams = {},
  ): Promise<PagedResult<MentorListItemDto>> => {
    return http.get<PagedResult<MentorListItemDto>>("/api/v1/profiles/mentors", {
      params: {
        searchTerm: params.searchTerm,
        skillId: params.skillId,
        minRate: params.minRate,
        maxRate: params.maxRate,
        minRating: params.minRating,
        verificationStatus: params.verificationStatus,
        sortBy: params.sortBy || "rating",
        sortDesc: params.sortDesc ?? true,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      },
    });
  },

  getPublicMentorProfile: async (
    mentorId: string,
  ): Promise<MentorProfileDetailDto> => {
    return http.get<MentorProfileDetailDto>(
      `/api/v1/profiles/mentors/${mentorId}`,
    );
  },

  getMentorServices: async (
    mentorId: string,
  ): Promise<PagedResult<MentorServiceDto>> => {
    return http.get<PagedResult<MentorServiceDto>>(
      `/api/v1/catalog/mentors/${mentorId}/services`,
      {
        params: { page: 1, pageSize: 20 },
      },
    );
  },

  recordInteraction: async (
    mentorId: string,
    skillId?: string,
    interactionType: "Click" | "ViewProfile" = "ViewProfile",
  ): Promise<void> => {
    try {
      await http.post("/api/v1/recommendations/interactions", {
        mentorId,
        skillId,
        interactionType,
      });
    } catch {
      // Best-effort recording
    }
  },
};
