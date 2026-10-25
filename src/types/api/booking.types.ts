/**
 * Booking Module DTOs — `/api/v1/booking`
 *
 * Maps to .NET `SkillBridge.Modules.Booking` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Booking Status (State Machine)                                    */
/* ------------------------------------------------------------------ */

export type BookingApiStatus =
  | "Holding"
  | "PendingPayment"
  | "AwaitingMentor"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "RefundReview";

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export interface IntakeFormRequest {
  coreQuestion: string;
  attachedLinks: string;
  targetGoals: string;
}

export interface CreateBookingRequest {
  serviceId: string;
  serviceVersion: number;
  slotIds: string[];
  intakeForm: IntakeFormRequest;
}

export interface ConfirmBookingRequest {
  mentorNote?: string;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface CreateRescheduleRequest {
  bookingSessionId: string;
  newSlotId: string;
  reason: string;
}

export interface RespondRescheduleRequest {
  accepted: boolean;
  responseNote?: string;
}

/* ------------------------------------------------------------------ */
/*  Responses                                                         */
/* ------------------------------------------------------------------ */

export interface ServiceSnapshotResponse {
  serviceId: string;
  title: string;
  description: string;
  totalPrice: number;
  currency: string;
  totalSessions: number;
  sessionDurationMinutes: number;
  serviceVersion: number;
}

export interface BookingSessionResponse {
  id: string;
  sessionNumber: number;
  slotId: string;
  startAtUtc: string;
  endAtUtc: string;
}

export interface RescheduleRequestResponse {
  id: string;
  bookingSessionId: string;
  oldSlotId: string;
  newSlotId: string;
  requestedByUserId: string;
  reason: string;
  status: "Pending" | "Accepted" | "Rejected";
  responseNote?: string;
  createdAtUtc: string;
}

export interface BookingResponse {
  id: string;
  bookingCode: string;
  menteeUserId: string;
  mentorId: string;
  status: BookingApiStatus;
  serviceSnapshot: ServiceSnapshotResponse;
  intakeForm: {
    coreQuestion: string;
    attachedLinks: string;
    targetGoals: string;
  };
  totalAmount: number;
  currency: string;
  heldUntilUtc?: string;
  mentorNote?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  sessions: BookingSessionResponse[];
  rescheduleRequests: RescheduleRequestResponse[];
}

export interface BookingAuditLogResponse {
  id: string;
  oldStatus: string;
  newStatus: string;
  changedByUserId?: string;
  reason?: string;
  createdAtUtc: string;
}
