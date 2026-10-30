import { http } from "@/lib/http-auth-client";
import type {
  MentorProfileDetailDto,
  MentorServiceDto,
} from "./mentorService";
import type { PagedResult } from "./common.types";

export interface UpdateMentorProfileInput {
  headline: string;
  bio: string;
  hourlyRate: number;
  currency: string;
  timezone: string;
  isAcceptingMentees: boolean;
  avatarUrl?: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  serviceType: "Tier1_ReviewCV" | "Tier2_MockInterview" | "Tier3_Roadmap";
  durationMinutes: number;
  price: number;
  currency: string;
  totalSessions: number;
  deliverables: string;
  isActive: boolean;
}

export const mentorStudioService = {
  getMyProfile: async (): Promise<MentorProfileDetailDto> => {
    return http.get<MentorProfileDetailDto>("/api/v1/profiles/mentors/me");
  },

  updateMyProfile: async (
    data: UpdateMentorProfileInput,
  ): Promise<void> => {
    await http.put("/api/v1/profiles/mentors/me", data);
  },

  addSkill: async (
    skillId: string,
    proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert",
    yearsOfExperience: number,
  ): Promise<void> => {
    await http.post("/api/v1/profiles/mentors/me/skills", {
      skillId,
      proficiencyLevel,
      yearsOfExperience,
    });
  },

  removeSkill: async (skillId: string): Promise<void> => {
    await http.delete(`/api/v1/profiles/mentors/me/skills/${skillId}`);
  },

  addExperience: async (data: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string | null;
    description: string;
    isCurrent: boolean;
  }): Promise<void> => {
    await http.post("/api/v1/profiles/mentors/me/experiences", data);
  },

  updateExperience: async (
    experienceId: string,
    data: {
      company: string;
      position: string;
      startDate: string;
      endDate?: string | null;
      description: string;
      isCurrent: boolean;
    },
  ): Promise<void> => {
    await http.put(
      `/api/v1/profiles/mentors/me/experiences/${experienceId}`,
      data,
    );
  },

  removeExperience: async (experienceId: string): Promise<void> => {
    await http.delete(
      `/api/v1/profiles/mentors/me/experiences/${experienceId}`,
    );
  },

  addCertification: async (data: {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expiryDate?: string | null;
    credentialUrl?: string;
    credentialId?: string;
  }): Promise<void> => {
    await http.post("/api/v1/profiles/mentors/me/certifications", data);
  },

  removeCertification: async (certificationId: string): Promise<void> => {
    await http.delete(
      `/api/v1/profiles/mentors/me/certifications/${certificationId}`,
    );
  },

  getMyServices: async (
    page = 1,
    pageSize = 10,
  ): Promise<PagedResult<MentorServiceDto>> => {
    return http.get<PagedResult<MentorServiceDto>>(
      "/api/v1/catalog/services/me",
      {
        params: { page, pageSize },
      },
    );
  },

  createService: async (
    data: CreateServiceInput,
  ): Promise<MentorServiceDto> => {
    return http.post<MentorServiceDto>("/api/v1/catalog/services", data);
  },

  updateService: async (
    serviceId: string,
    version: number,
    data: CreateServiceInput,
  ): Promise<MentorServiceDto> => {
    return http.put<MentorServiceDto>(
      `/api/v1/catalog/services/${serviceId}`,
      data,
      {
        headers: { "If-Match": `"${version}"` },
      },
    );
  },

  deleteService: async (
    serviceId: string,
    version: number,
  ): Promise<void> => {
    await http.delete(`/api/v1/catalog/services/${serviceId}`, {
      headers: { "If-Match": `"${version}"` },
    });
  },
};
