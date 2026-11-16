import { http } from "@/lib/http-auth-client";
import { generateIdempotencyKey, type PagedResult } from "./common.types";

export interface WalletDto {
  balance: number;
  availableBalance: number;
  heldBalance: number;
  currency: string;
  disbursementLocked: boolean;
}

export interface WalletTransactionDto {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAtUtc: string;
}

export interface CreatePaymentInput {
  bookingId: string;
  gateway: "PayOS" | "VnPay";
  amount?: number;
  returnUrl?: string;
  cancelUrl?: string;
  description?: string;
}

export interface PaymentResponseDto {
  paymentId: string;
  orderCode: number | string;
  gateway: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  qrCode?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  bin?: string | null;
  expiresAtUtc: string;
}

export interface EscrowDetailDto {
  id: string;
  bookingId: string;
  totalAmount: number;
  heldAmount: number;
  status: string;
  platformFeeAmount?: number | null;
  mentorNetAmount?: number | null;
  releasedAtUtc?: string | null;
}

export const paymentService = {
  getWallet: async (): Promise<WalletDto> => {
    return http.get<WalletDto>("/api/v1/payments/wallet");
  },

  getTransactions: async (
    page = 1,
    pageSize = 10,
  ): Promise<PagedResult<WalletTransactionDto>> => {
    return http.get<PagedResult<WalletTransactionDto>>(
      "/api/v1/payments/wallet/transactions",
      {
        params: { page, pageSize },
      },
    );
  },

  createPayment: async (
    input: CreatePaymentInput,
    idempotencyKey?: string,
  ): Promise<PaymentResponseDto> => {
    const key = idempotencyKey || generateIdempotencyKey("pay");
    return http.post<PaymentResponseDto>(
      "/api/v1/payments/create-payment",
      input,
      {
        headers: { "Idempotency-Key": key },
      },
    );
  },

  getBookingEscrow: async (bookingId: string): Promise<EscrowDetailDto> => {
    return http.get<EscrowDetailDto>(
      `/api/v1/payments/bookings/${bookingId}/escrow`,
    );
  },

  requestWithdraw: async (data: {
    amount: number;
    bankAccount: string;
    bankCode: string;
  }): Promise<void> => {
    await http.post("/api/v1/payments/withdraw", data);
  },
};
