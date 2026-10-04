import {
  Badge,
  Button,
} from "@/components/ui";
import { StatCard } from "@/components/ui/stat-card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Clock } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: "Số dư ví hiện tại",
    value: "2.500.000 ₫",
    icon: <Wallet className="h-4 w-4" />,
    variant: "emerald" as const,
  },
  {
    label: "Tiền đang ký quỹ (Escrow Locked)",
    value: "450.000 ₫",
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: "amber" as const,
  },
  {
    label: "Tổng đã chi tiêu",
    value: "4.800.000 ₫",
    icon: <ArrowUpFromLine className="h-4 w-4" />,
    variant: "default" as const,
  },
];

const TRANSACTIONS = [
  {
    id: "TX-98124",
    type: "Escrow Hold",
    description: "Mock Interview (.NET) — Nguyễn Văn An",
    amount: "-450.000 ₫",
    amountColor: "text-[#F5A623]",
    status: "Đang Ký Quỹ",
    statusVariant: "pending" as const,
    time: "18/09 19:30",
  },
  {
    id: "TX-97500",
    type: "Deposit",
    description: "Nạp tiền qua PayOS VietQR",
    amount: "+1.000.000 ₫",
    amountColor: "text-[#27C98F]",
    status: "Thành Công",
    statusVariant: "escrow" as const,
    time: "17/09 14:00",
  },
  {
    id: "TX-96100",
    type: "Escrow Released",
    description: "Review CV — Lê Hoàng Nam",
    amount: "-300.000 ₫",
    amountColor: "text-[#9BA1B0]",
    status: "Hoàn Tất",
    statusVariant: "neutral" as const,
    time: "15/09 20:00",
  },
  {
    id: "TX-95800",
    type: "Deposit",
    description: "Nạp tiền qua VNPAY",
    amount: "+2.000.000 ₫",
    amountColor: "text-[#27C98F]",
    status: "Thành Công",
    statusVariant: "escrow" as const,
    time: "10/09 11:00",
  },
  {
    id: "TX-94200",
    type: "Escrow Released",
    description: "AWS Solutions — Trần Thanh Tùng",
    amount: "-550.000 ₫",
    amountColor: "text-[#9BA1B0]",
    status: "Hoàn Tất",
    statusVariant: "neutral" as const,
    time: "05/09 16:00",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
          Ví Cá Nhân &amp; Lịch Sử Ký Quỹ
        </h1>
        <Button variant="primary">
          <ArrowDownToLine className="h-4 w-4" />
          Nạp Tiền Vào Ví
        </Button>
      </div>

      {/* ── Top Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* ── Transaction Ledger Table ── */}
      <section>
        <h2 className="text-sm font-semibold text-[#F0F2F5] mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#5E6AD2]" />
          Lịch Sử Giao Dịch
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MÃ GD</TableHead>
              <TableHead>LOẠI</TableHead>
              <TableHead>DỊCH VỤ / MENTOR</TableHead>
              <TableHead className="text-right">SỐ TIỀN</TableHead>
              <TableHead>TRẠNG THÁI</TableHead>
              <TableHead className="text-right">THỜI GIAN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRANSACTIONS.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs text-[#5D6474]">
                  {tx.id}
                </TableCell>
                <TableCell className="text-xs">{tx.type}</TableCell>
                <TableCell className="text-xs max-w-[200px] truncate">
                  {tx.description}
                </TableCell>
                <TableCell
                  className={`text-right font-mono font-medium ${tx.amountColor}`}
                >
                  {tx.amount}
                </TableCell>
                <TableCell>
                  <Badge variant={tx.statusVariant}>{tx.status}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-[#5D6474]">
                  {tx.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
