/**
 * Payments API service — calls BFF proxy `/api/v1/payments/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  CreatePaymentRequest,
  CreatePaymentResponse,
  WalletResponse,
  WalletTransactionResponse,
  EscrowResponse,
  WithdrawRequest,
} from "@/types/api";

const BASE = "/api/v1/payments";

function generateIdempotencyKey(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getWallet() {
  return http.get<WalletResponse>(`${BASE}/wallet`);
}

export function getWalletTransactions(params?: {
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<WalletTransactionResponse>>(
    `${BASE}/wallet/transactions`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function createPayment(
  data: CreatePaymentRequest,
  idempotencyKey?: string,
) {
  const key = idempotencyKey || generateIdempotencyKey();
  return http.post<CreatePaymentResponse>(`${BASE}/create-payment`, data, {
    headers: { "Idempotency-Key": key },
  });
}

export function getBookingEscrow(bookingId: string) {
  return http.get<EscrowResponse>(`${BASE}/bookings/${bookingId}/escrow`);
}

/**
 * Notice: Server currently enforces DisbursementLocked and will return HTTP 409.
 */
export function requestWithdraw(data: WithdrawRequest) {
  return http.post<void>(`${BASE}/withdraw`, data);
}

export function getPayouts(params?: { page?: number; pageSize?: number }) {
  return http.get<PagedResult<object>>(`${BASE}/payouts`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
