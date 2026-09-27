import {
  Badge,
} from "@/components/ui";
import { StatCard } from "@/components/ui/stat-card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  CreditCard,
  Filter,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: "Tổng tiền đang giữ trong Escrow",
    value: "148.500.000 ₫",
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: "emerald" as const,
    sublabel: "Active: 124 bookings",
  },
  {
    label: "Doanh thu phí sàn lũy kế (10%)",
    value: "32.400.000 ₫",
    icon: <TrendingUp className="h-4 w-4" />,
    variant: "default" as const,
    sublabel: null,
  },
  {
    label: "Số dư tại Cổng PayOS",
    value: "85.200.000 ₫",
    icon: <CreditCard className="h-4 w-4" />,
    variant: "default" as const,
    sublabel: "VNPAY: 63.300.000 ₫",
  },
  {
    label: "Payout đang xử lý",
    value: "12.000.000 ₫",
    icon: <ArrowUpRight className="h-4 w-4" />,
    variant: "amber" as const,
    sublabel: "6 mentors",
  },
];

const LEDGER = [
  {
    id: "ESC-20260918-001",
    time: "18/09 19:31",
    type: "Escrow Hold",
    debit: "Mentee Wallet (Linh)",
    credit: "Escrow Pool",
    amount: "450.000 ₫",
    hash: "0xa1b2c3...f9e8d7",
    typeVariant: "pending" as const,
  },
  {
    id: "ESC-20260917-002",
    time: "17/09 14:02",
    type: "Deposit",
    debit: "PayOS Gateway",
    credit: "Mentee Wallet (Linh)",
    amount: "1.000.000 ₫",
    hash: "0xd4e5f6...a3b2c1",
    typeVariant: "escrow" as const,
  },
  {
    id: "ESC-20260915-003",
    time: "15/09 20:15",
    type: "Escrow Release",
    debit: "Escrow Pool",
    credit: "Mentor Wallet (An)",
    amount: "300.000 ₫",
    hash: "0x7f8e9d...c6b5a4",
    typeVariant: "escrow" as const,
  },
  {
    id: "ESC-20260915-004",
    time: "15/09 20:15",
    type: "Platform Fee",
    debit: "Escrow Pool",
    credit: "Platform Revenue",
    amount: "0 ₫",
    hash: "0x1a2b3c...d4e5f6",
    typeVariant: "neutral" as const,
  },
  {
    id: "ESC-20260914-005",
    time: "14/09 16:00",
    type: "Payout",
    debit: "Mentor Wallet (An)",
    credit: "MB Bank ****4321",
    amount: "2.000.000 ₫",
    hash: "0xe9f8d7...a1b2c3",
    typeVariant: "neutral" as const,
  },
  {
    id: "ESC-20260910-006",
    time: "10/09 11:05",
    type: "Refund",
    debit: "Escrow Pool",
    credit: "Mentee Wallet (Tuan)",
    amount: "450.000 ₫",
    hash: "0x5c6d7e...f8a9b0",
    typeVariant: "dispute" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function AdminEscrowPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <Wallet className="h-5 w-5 text-[#5E6AD2]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Giám Sát Sổ Cái Escrow Toàn Sàn &amp; Đối Soát
        </h1>
      </div>

      {/* ── Top Summary Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            sublabel={stat.sublabel ?? undefined}
          />
        ))}
      </div>

      {/* ── Filter Controls ── */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 rounded-xl bg-[#14171D] border border-white/[0.08]">
        <Filter className="h-4 w-4 text-[#5D6474] mb-2" />
        <Select
          label="Ngày giao dịch"
          options={[
            { value: "today", label: "Hôm nay" },
            { value: "7d", label: "7 ngày qua" },
            { value: "30d", label: "30 ngày qua" },
            { value: "all", label: "Tất cả" },
          ]}
          value="30d"
          className="flex-1 min-w-[140px]"
        />
        <Select
          label="Cổng thanh toán"
          options={[
            { value: "all", label: "Tất cả" },
            { value: "payos", label: "PayOS" },
            { value: "vnpay", label: "VNPAY" },
          ]}
          value="all"
          className="flex-1 min-w-[140px]"
        />
        <Select
          label="Loại giao dịch"
          options={[
            { value: "all", label: "Tất cả" },
            { value: "deposit", label: "Deposit" },
            { value: "escrow_hold", label: "Escrow Hold" },
            { value: "escrow_release", label: "Escrow Release" },
            { value: "refund", label: "Refund" },
            { value: "payout", label: "Payout" },
          ]}
          value="all"
          className="flex-1 min-w-[140px]"
        />
      </div>

      {/* ── Double-Entry Ledger Table ── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MÃ GD</TableHead>
            <TableHead>THỜI GIAN</TableHead>
            <TableHead>LOẠI GD</TableHead>
            <TableHead>TÀI KHOẢN NỢ (DEBIT)</TableHead>
            <TableHead>TÀI KHOẢN CÓ (CREDIT)</TableHead>
            <TableHead className="text-right">SỐ TIỀN</TableHead>
            <TableHead>HASH AUDIT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LEDGER.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-mono text-[10px] text-[#5D6474]">
                {entry.id}
              </TableCell>
              <TableCell className="font-mono text-xs text-[#5D6474]">
                {entry.time}
              </TableCell>
              <TableCell>
                <Badge variant={entry.typeVariant}>{entry.type}</Badge>
              </TableCell>
              <TableCell className="text-xs text-[#E3E2E5]">
                {entry.debit}
              </TableCell>
              <TableCell className="text-xs text-[#E3E2E5]">
                {entry.credit}
              </TableCell>
              <TableCell className="text-right font-mono font-medium text-[#F0F2F5]">
                {entry.amount}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-[10px] text-[#5D6474]">
                    {entry.hash}
                  </span>
                  <CopyButton text={entry.hash} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
