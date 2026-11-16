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
    <div className="rounded-xl border border-[#e5e2de] bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#e5e2de] bg-[#fbfaf8]">
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">Mã GD</TableHead>
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">Loại</TableHead>
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">Mô tả giao dịch</TableHead>
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider text-right">Số tiền</TableHead>
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">Trạng thái</TableHead>
            <TableHead className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider text-right">Thời gian</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-sm text-[#5e5866]">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((tx) => {
              const isPositive = tx.type === "Deposit" || tx.type === "Refund";
              const isHold = tx.type === "EscrowHold";
              const amountColor = isPositive
                ? "text-[#1e7e45]"
                : isHold
                ? "text-[#946200]"
                : "text-[#5e5866]";
              const { label: statusLabel, variant: statusVariant } = getLedgerTypeInfo(tx.type);

              return (
                <TableRow key={tx.id} className="border-b border-[#f1efea] hover:bg-[#faf9f6]/80 transition-colors">
                  <TableCell className="font-mono text-xs text-[#5e5866]">
                    {tx.id}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#27252d]">
                    {tx.type}
                  </TableCell>
                  <TableCell className="text-xs max-w-[260px] truncate text-[#27252d]">
                    {tx.note}
                  </TableCell>
                  <TableCell className={`text-right font-mono font-semibold ${amountColor}`}>
                    {isPositive ? "+" : "-"}{vnd(tx.amountVnd)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs font-mono text-[#5e5866]">
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
