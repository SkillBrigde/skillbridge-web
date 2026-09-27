"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Modal,
  Input,
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
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Banknote,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const STATS = [
  {
    label: "Số dư khả dụng (Rút ngay)",
    value: "6.200.000 ₫",
    icon: <Wallet className="h-4 w-4" />,
    variant: "emerald" as const,
    sublabel: null,
  },
  {
    label: "Đang giữ trong Escrow",
    value: "1.800.000 ₫",
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: "amber" as const,
    sublabel: "3 buổi đang trong 24h nghiệm thu",
  },
  {
    label: "Đang khiếu nại (SLA 48h)",
    value: "450.000 ₫",
    icon: <AlertTriangle className="h-4 w-4" />,
    variant: "default" as const,
    sublabel: "1 ca tranh chấp chờ Admin phán quyết",
  },
];

const TRANSACTIONS = [
  {
    id: "TX-98124",
    type: "Escrow Released",
    detail: "Mock Interview — Hoàng Thùy Linh",
    amount: "+450.000 ₫",
    amountColor: "text-[#27C98F]",
    status: "Đã giải phóng",
    statusVariant: "escrow" as const,
  },
  {
    id: "TX-97800",
    type: "Escrow Hold",
    detail: "Review CV — Trần Minh Tuấn",
    amount: "+300.000 ₫",
    amountColor: "text-[#F5A623]",
    status: "Tạm giữ",
    statusVariant: "pending" as const,
  },
  {
    id: "TX-97200",
    type: "Payout",
    detail: "Rút tiền về MB Bank",
    amount: "-2.000.000 ₫",
    amountColor: "text-[#9BA1B0]",
    status: "Thành công",
    statusVariant: "neutral" as const,
  },
  {
    id: "TX-96800",
    type: "Escrow Released",
    detail: "Lộ Trình Architect — Lê Hoàng Nam",
    amount: "+2.000.000 ₫",
    amountColor: "text-[#27C98F]",
    status: "Đã giải phóng",
    statusVariant: "escrow" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function MentorWalletPage() {
  const [showPayout, setShowPayout] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
          Ví Doanh Thu Mentor
        </h1>
        <Button variant="primary" onClick={() => setShowPayout(true)}>
          <Banknote className="h-4 w-4" />
          Rút Tiền Ngay
        </Button>
      </div>

      {/* ── Top 3 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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

      {/* ── Action Bar ── */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#14171D] border border-white/[0.08] mb-8">
        <Banknote className="h-5 w-5 text-[#27C98F]" />
        <div className="flex-1">
          <p className="text-sm font-medium text-[#F0F2F5]">
            Rút Thù Lao Về Tài Khoản Ngân Hàng
          </p>
          <p className="text-xs text-[#9BA1B0]">
            PayOS Payout 24/7 liên ngân hàng Napas — Xử lý tức thì trong 30 giây
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowPayout(true)}>
          <ArrowUpRight className="h-3.5 w-3.5" />
          Rút Tiền
        </Button>
      </div>

      {/* ── Ledger Table ── */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>TXID</TableHead>
            <TableHead>LOẠI</TableHead>
            <TableHead>CHI TIẾT BUỔI HỌC</TableHead>
            <TableHead className="text-right">SỐ TIỀN</TableHead>
            <TableHead>TRẠNG THÁI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TRANSACTIONS.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs text-[#5D6474]">
                {tx.id}
              </TableCell>
              <TableCell className="text-xs">{tx.type}</TableCell>
              <TableCell className="text-xs">{tx.detail}</TableCell>
              <TableCell
                className={`text-right font-mono font-medium ${tx.amountColor}`}
              >
                {tx.amount}
              </TableCell>
              <TableCell>
                <Badge variant={tx.statusVariant}>{tx.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ── Payout Modal ── */}
      <Modal
        isOpen={showPayout}
        onClose={() => setShowPayout(false)}
        title="Rút Thù Lao Về Tài Khoản Ngân Hàng"
        description="PayOS Payout 24/7 — Xử lý tức thì trong 30 giây qua liên ngân hàng Napas."
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-1">
              Tài khoản nhận
            </p>
            <p className="text-sm font-medium text-[#F0F2F5]">
              MB Bank — 0987654321 — NGUYEN VAN AN
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
              Số tiền rút (VND)
            </label>
            <Input
              type="text"
              defaultValue="2.000.000"
              className="font-mono text-lg"
            />
          </div>

          <p className="text-xs text-[#9BA1B0]">
            Xử lý tức thì trong 30 giây qua PayOS Payout liên ngân hàng 24/7.
          </p>

          <Button variant="primary" size="lg" className="w-full">
            Xác Nhận Rút 2.000.000 ₫
          </Button>
        </div>
      </Modal>
    </div>
  );
}
