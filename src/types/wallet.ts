import type {
  LedgerEntry,
  LedgerType,
  EscrowState,
  GatewayKind,
} from "@/lib/domain";

export type {
  LedgerEntry,
  LedgerType,
  EscrowState,
  GatewayKind,
  LedgerEntry as LedgerTransaction,
  LedgerEntry as WalletTransactionRecord,
  LedgerType as TransactionType,
  EscrowState as EscrowVaultState,
  GatewayKind as PaymentGatewayType,
};

export interface WalletBalance {
  availableBalanceVnd: number;
  escrowHoldingBalanceVnd: number;
  disputedBalanceVnd: number;
  totalSpentVnd?: number;
}
