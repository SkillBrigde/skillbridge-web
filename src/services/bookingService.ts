import { http } from "@/lib/http-auth-client";
import { generateIdempotencyKey, type PagedResult } from "./common.types";

export type BookingStatus =
  | "Holding"
  | "PendingPayment"
  | "AwaitingMentor"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "RefundReview";

export interface BookingSessionDto {
  id: string;
  sessionNumber: number;
  slotId?: string | null;
  startAtUtc?: string | null;
  endAtUtc?: string | null;
}

export interface ServiceSnapshotDto {
  title: string;
  serviceType: string;
  durationMinutes: number;
  price: number;
  currency: string;
  totalSessions: number;
  deliverables?: string;
  version?: number;
}

export interface IntakeFormDto {
  coreQuestion: string;
  attachedLinks: string;
  targetGoals: string;
}

export interface RescheduleRequestDto {
  id: string;
  bookingSessionId: string;
  oldSlotId: string;
  newSlotId: string;
  requestedByUserId: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Applying";
  responseNote?: string | null;
  createdAtUtc: string;
}

export interface BookingDetailDto {
  id: string;
  bookingCode: string;
  menteeUserId: string;
  mentorId: string;
  status: BookingStatus;
  serviceSnapshot: ServiceSnapshotDto;
  intakeForm: IntakeFormDto;
  totalAmount: number;
  currency: string;
  heldUntilUtc?: string | null;
  mentorNote?: string | null;
  cancellationReason?: string | null;
  cancelledBy?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string;
  sessions: BookingSessionDto[];
  rescheduleRequests?: RescheduleRequestDto[];
}

export interface CreateBookingInput {
  serviceId: string;
  serviceVersion: number;
  slotIds: string[];
  intakeForm: IntakeFormDto;
}

export interface ListBookingsParams {
  status?: BookingStatus | string;
  page?: number;
  pageSize?: number;
}

export const bookingService = {
  createBooking: async (
    input: CreateBookingInput,
    idempotencyKey?: string,
  ): Promise<BookingDetailDto> => {
    const key = idempotencyKey || generateIdempotencyKey("book");
    return http.post<BookingDetailDto>(
      "/api/v1/booking/bookings",
      input,
      {
        headers: { "Idempotency-Key": key },
      },
    );
  },

  getBooking: async (bookingId: string): Promise<BookingDetailDto> => {
    return http.get<BookingDetailDto>(`/api/v1/booking/bookings/${bookingId}`);
  },

  listBookings: async (
    params: ListBookingsParams = {},
  ): Promise<PagedResult<BookingDetailDto>> => {
    return http.get<PagedResult<BookingDetailDto>>("/api/v1/booking/bookings", {
      params: {
        status: params.status,
        page: params.page || 1,
        pageSize: params.pageSize || 10,
      },
    });
  },

  confirmBooking: async (
    bookingId: string,
    mentorNote?: string,
  ): Promise<void> => {
    await http.post(`/api/v1/booking/bookings/${bookingId}/confirm`, {
      mentorNote: mentorNote || "",
    });
  },

  cancelBooking: async (bookingId: string, reason: string): Promise<void> => {
    await http.post(`/api/v1/booking/bookings/${bookingId}/cancel`, {
      reason,
    });
  },

  rescheduleBooking: async (
    bookingId: string,
    input: {
      bookingSessionId: string;
      newSlotId: string;
      reason: string;
    },
  ): Promise<RescheduleRequestDto> => {
    return http.post<RescheduleRequestDto>(
      `/api/v1/booking/bookings/${bookingId}/reschedule`,
      input,
    );
  },

  respondReschedule: async (
    requestId: string,
    input: {
      isApproved: boolean;
      responseNote?: string;
    },
  ): Promise<void> => {
    await http.post(
      `/api/v1/booking/reschedule-requests/${requestId}/respond`,
      input,
    );
  },
};
