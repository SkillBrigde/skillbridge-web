/**
 * Payments Module DTOs — `/api/v1/payments`
 *
 * Maps to .NET `SkillBridge.Modules.Payments` response shapes.
 * Disbursement is currently locked by policy.
 */

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export type PaymentGateway = "PayOS" | "VnPay";

export interface CreatePaymentRequest {
  bookingId: string;
  gateway: PaymentGateway;
  /** Optional — server uses the snapshot price; this is for client-side verification only. */
  amount?: number;
  returnUrl: string;
  cancelUrl: string;
  description?: string;
}

export interface WithdrawRequest {
  amount: number;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
}

/* ------------------------------------------------------------------ */
/*  Responses                                                         */
/* ------------------------------------------------------------------ */

export interface CreatePaymentResponse {
  paymentId: string;
  orderCode: number;
  gateway: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  /** PayOS only — Base64 QR code image. */
  qrCode?: string;
  /** PayOS only — bank account number for manual transfer. */
  accountNumber?: string;
  /** PayOS only — account holder name. */
  accountName?: string;
  /** PayOS only — bank BIN code. */
  bin?: string;
  expiresAtUtc: string;
}

export interface WalletResponse {
  balance: number;
  availableBalance: number;
  heldBalance: number;
  disbursementLocked: boolean;
}

export interface WalletTransactionResponse {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  bookingId?: string;
  createdAtUtc: string;
}

export interface EscrowResponse {
  bookingId: string;
  status: "Holding" | "Released" | "Refunded" | "ReviewRequired";
  heldAmount: number;
  currency: string;
  /** null until disbursement policy is finalized. */
  platformFeeAmount?: number | null;
  /** null until disbursement policy is finalized. */
  mentorNetAmount?: number | null;
  /** null until disbursement policy is finalized. */
  releasedAtUtc?: string | null;
  createdAtUtc: string;
}
