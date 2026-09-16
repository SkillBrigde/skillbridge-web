export type PaymentGateway = "PayOS" | "VNPAY";

export type EscrowStatus = "Holding" | "Released" | "Refunded" | "Disputed";

export interface EscrowContract {
  id: string;
  bookingId: string;
  bookingCode: string;
  menteeId: string;
  mentorId: string;
  totalAmountVnd: number;
  platformFeeVnd: number;
  mentorNetAmountVnd: number;
  status: EscrowStatus;
  holdExpiresAtUtc: string;
  releasedAtUtc?: string;
  createdAtUtc: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  gateway: PaymentGateway;
  gatewayTxnId: string;
  amountVnd: number;
  status: "Pending" | "Completed" | "Failed";
  accountNumber?: string;
  beneficiaryName?: string;
  transferContent?: string;
  createdAt: string;
}
