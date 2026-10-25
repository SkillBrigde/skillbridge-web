/**
 * Scheduling API service — calls BFF proxy `/api/v1/scheduling/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  SchedulingSettingsResponse,
  UpdateSettingsRequest,
  AvailabilityRuleResponse,
  CreateAvailabilityRuleRequest,
  UpdateAvailabilityRuleRequest,
  AvailabilitySlotResponse,
  TimeOffResponse,
  TimeOffRequest,
} from "@/types/api";

const BASE = "/api/v1/scheduling";

/* ---- Settings ---- */

export function getSchedulingSettings() {
  return http.get<SchedulingSettingsResponse>(`${BASE}/settings`);
}

export function updateSchedulingSettings(data: UpdateSettingsRequest) {
  return http.put<void>(`${BASE}/settings`, data);
}

/* ---- Availability Rules ---- */

export function getAvailabilityRules(params?: { page?: number; pageSize?: number }) {
  return http.get<PagedResult<AvailabilityRuleResponse>>(`${BASE}/availability-rules`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function createAvailabilityRule(data: CreateAvailabilityRuleRequest) {
  return http.post<AvailabilityRuleResponse>(`${BASE}/availability-rules`, data);
}

export function updateAvailabilityRule(
  ruleId: string,
  data: UpdateAvailabilityRuleRequest,
) {
  return http.put<void>(`${BASE}/availability-rules/${ruleId}`, data);
}

export function deleteAvailabilityRule(ruleId: string) {
  return http.delete<void>(`${BASE}/availability-rules/${ruleId}`);
}

/* ---- Public Slots ---- */

export function getMentorSlots(
  mentorId: string,
  startDate: string,
  endDate: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<AvailabilitySlotResponse>>(
    `${BASE}/mentors/${mentorId}/slots`,
    {
      params: {
        startDate,
        endDate,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 100,
      },
    },
  );
}

/* ---- Time-Offs ---- */

export function getTimeOffs(params?: { page?: number; pageSize?: number }) {
  return http.get<PagedResult<TimeOffResponse>>(`${BASE}/time-offs`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function addTimeOff(data: TimeOffRequest) {
  return http.post<TimeOffResponse>(`${BASE}/time-offs`, data);
}

export function removeTimeOff(timeOffId: string) {
  return http.delete<void>(`${BASE}/time-offs/${timeOffId}`);
}
