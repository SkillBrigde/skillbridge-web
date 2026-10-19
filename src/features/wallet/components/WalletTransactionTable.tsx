"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { vnd, slotDateLabel, getLedgerTypeInfo, type LedgerEntry } from "@/lib/domain";

interface WalletTransactionTableProps {
  entries: LedgerEntry[];
  emptyMessage?: string;
}

export function WalletTransactionTable({
  entries,
  emptyMessage = "Chưa có giao dịch nào trong sổ cái.",
}: WalletTransactionTableProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#14171D] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MÃ GD</TableHead>
            <TableHead>LOẠI</TableHead>
            <TableHead>MÔ TẢ GIAO DỊCH</TableHead>
            <TableHead className="text-right">SỐ TIỀN</TableHead>
            <TableHead>TRẠNG THÁI</TableHead>
            <TableHead className="text-right">THỜI GIAN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-xs text-[#5D6474]">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((tx) => {
              const isPositive = tx.type === "Deposit" || tx.type === "Refund";
              const isHold = tx.type === "EscrowHold";
              const amountColor = isPositive
                ? "text-[#27C98F]"
                : isHold
                ? "text-[#F5A623]"
                : "text-[#9BA1B0]";
              const { label: statusLabel, variant: statusVariant } = getLedgerTypeInfo(tx.type);

              return (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs text-[#5D6474]">
                    {tx.id}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {tx.type}
                  </TableCell>
                  <TableCell className="text-xs max-w-[240px] truncate text-[#E3E2E5]">
                    {tx.note}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-medium ${amountColor}`}>
                    {isPositive ? "+" : "-"}{vnd(tx.amountVnd)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-[#5D6474]">
                    {slotDateLabel(tx.ts)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
