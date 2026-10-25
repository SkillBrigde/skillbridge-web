/**
 * Booking API service — calls BFF proxy `/api/v1/booking/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  BookingResponse,
  CreateBookingRequest,
  ConfirmBookingRequest,
  CancelBookingRequest,
  CreateRescheduleRequest,
  RespondRescheduleRequest,
  BookingAuditLogResponse,
  RescheduleRequestResponse,
} from "@/types/api";

const BASE = "/api/v1/booking";

function generateIdempotencyKey(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/* ---- Bookings ---- */

export function createBooking(
  data: CreateBookingRequest,
  idempotencyKey?: string,
) {
  const key = idempotencyKey || generateIdempotencyKey();
  return http.post<BookingResponse>(`${BASE}/bookings`, data, {
    headers: { "Idempotency-Key": key },
  });
}

export function getBooking(bookingId: string) {
  return http.get<BookingResponse>(`${BASE}/bookings/${bookingId}`);
}

export function listBookings(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<BookingResponse>>(`${BASE}/bookings`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function confirmBooking(
  bookingId: string,
  data?: ConfirmBookingRequest,
) {
  return http.post<void>(`${BASE}/bookings/${bookingId}/confirm`, data ?? {});
}

export function cancelBooking(bookingId: string, data: CancelBookingRequest) {
  return http.post<void>(`${BASE}/bookings/${bookingId}/cancel`, data);
}

export function completeBooking(bookingId: string) {
  return http.post<void>(`${BASE}/bookings/${bookingId}/complete`);
}

export function getBookingAuditLogs(
  bookingId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<BookingAuditLogResponse>>(
    `${BASE}/bookings/${bookingId}/audit-logs`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

/* ---- Rescheduling ---- */

export function requestReschedule(
  bookingId: string,
  data: CreateRescheduleRequest,
) {
  return http.post<RescheduleRequestResponse>(
    `${BASE}/bookings/${bookingId}/reschedule`,
    data,
  );
}

export function respondReschedule(
  requestId: string,
  data: RespondRescheduleRequest,
) {
  return http.post<void>(
    `${BASE}/reschedule-requests/${requestId}/respond`,
    data,
  );
}
