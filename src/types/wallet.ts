export interface WalletBalance {
  availableBalanceVnd: number;
  escrowHoldingBalanceVnd: number;
  disputedBalanceVnd: number;
  totalSpentVnd?: number;
}

export type TransactionType =
  | "Deposit"
  | "EscrowHold"
  | "EscrowRelease"
  | "Payout"
  | "Refund"
  | "DisputeHold";

export interface LedgerTransaction {
  id: string;
  txid: string;
  type: TransactionType;
  amountVnd: number;
  balanceBeforeVnd: number;
  balanceAfterVnd: number;
  description: string;
  status: "Completed" | "Pending" | "Disputed";
  timestamp: string;
  auditHash?: string;
}
