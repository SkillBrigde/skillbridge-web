/**
 * Scheduling Module DTOs — `/api/v1/scheduling`
 *
 * Maps to .NET `SkillBridge.Modules.Scheduling` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Settings                                                          */
/* ------------------------------------------------------------------ */

export interface SchedulingSettingsResponse {
  id: string;
  mentorId: string;
  sessionDurationMinutes: number;
  bufferTimeMinutes: number;
  leadTimeHours: number;
  maxDaysInAdvance: number;
  timezone: string;
}

export interface UpdateSettingsRequest {
  sessionDurationMinutes: number;
  bufferTimeMinutes: number;
  leadTimeHours: number;
  maxDaysInAdvance: number;
  timezone: string;
}

/* ------------------------------------------------------------------ */
/*  Availability Rules                                                */
/* ------------------------------------------------------------------ */

export interface AvailabilityRuleResponse {
  id: string;
  mentorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface CreateAvailabilityRuleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityRuleRequest {
  startTime: string;
  endTime: string;
  isActive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Slots (public)                                                    */
/* ------------------------------------------------------------------ */

export type SlotStatus = "Available" | "Held" | "Booked" | "Locked";

export interface AvailabilitySlotResponse {
  id: string;
  mentorId: string;
  startUtc: string;
  endUtc: string;
  status: SlotStatus;
  durationMinutes: number;
}

/* ------------------------------------------------------------------ */
/*  Time-Offs                                                         */
/* ------------------------------------------------------------------ */

export interface TimeOffResponse {
  id: string;
  mentorId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  createdAtUtc: string;
}

export interface TimeOffRequest {
  startDate: string;
  endDate: string;
  reason?: string;
}
