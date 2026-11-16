import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";

export interface SlotDto {
  id: string;
  mentorId: string;
  startAtUtc: string;
  endAtUtc: string;
  status: "Available" | "Held" | "Booked" | "Locked";
  bookingId?: string | null;
  createdAtUtc?: string;
}

export interface SchedulingSettingsDto {
  id?: string;
  mentorId: string;
  sessionDurationMinutes: number;
  bufferTimeMinutes: number;
  leadTimeHours: number;
  maxDaysInAdvance: number;
  timezone: string;
}

export interface AvailabilityRuleDto {
  id: string;
  mentorId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  startTime: string; // "HH:mm:ss"
  endTime: string;   // "HH:mm:ss"
  isActive: boolean;
}

export interface TimeOffDto {
  id: string;
  mentorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export const schedulingService = {
  getMentorSlots: async (
    mentorId: string,
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = 100,
  ): Promise<PagedResult<SlotDto>> => {
    return http.get<PagedResult<SlotDto>>(
      `/api/v1/scheduling/mentors/${mentorId}/slots`,
      {
        params: { startDate, endDate, page, pageSize },
      },
    );
  },

  getSettings: async (): Promise<SchedulingSettingsDto> => {
    return http.get<SchedulingSettingsDto>("/api/v1/scheduling/settings");
  },

  updateSettings: async (
    settings: Omit<SchedulingSettingsDto, "id" | "mentorId">,
  ): Promise<void> => {
    await http.put("/api/v1/scheduling/settings", settings);
  },

  getAvailabilityRules: async (): Promise<AvailabilityRuleDto[]> => {
    return http.get<AvailabilityRuleDto[]>("/api/v1/scheduling/availability-rules");
  },

  createAvailabilityRule: async (rule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }): Promise<AvailabilityRuleDto> => {
    return http.post<AvailabilityRuleDto>(
      "/api/v1/scheduling/availability-rules",
      rule,
    );
  },

  updateAvailabilityRule: async (
    ruleId: string,
    rule: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
    },
  ): Promise<void> => {
    await http.put(`/api/v1/scheduling/availability-rules/${ruleId}`, rule);
  },

  deleteAvailabilityRule: async (ruleId: string): Promise<void> => {
    await http.delete(`/api/v1/scheduling/availability-rules/${ruleId}`);
  },

  getTimeOffs: async (page = 1, pageSize = 50): Promise<PagedResult<TimeOffDto>> => {
    return http.get<PagedResult<TimeOffDto>>("/api/v1/scheduling/time-offs", {
      params: { page, pageSize },
    });
  },

  createTimeOff: async (data: {
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<TimeOffDto> => {
    return http.post<TimeOffDto>("/api/v1/scheduling/time-offs", data);
  },

  deleteTimeOff: async (timeOffId: string): Promise<void> => {
    await http.delete(`/api/v1/scheduling/time-offs/${timeOffId}`);
  },
};
