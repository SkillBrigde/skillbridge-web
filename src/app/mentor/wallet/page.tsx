"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Building,
  CheckCircle2,
  Lock,
  Zap,
  ArrowDownLeft,
  X,
  CreditCard,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Currency,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

interface LedgerTx {
  txId: string;
  type: string;
  typeVariant: "escrow" | "pending" | "dispute" | "neutral";
  details: string;
  amount: number;
  isPositive: boolean;
  status: string;
  time: string;
}

const LEDGER_DATA: LedgerTx[] = [
  {
    txId: "PO-991204",
    type: "Rút Về Ngân Hàng",
    typeVariant: "neutral",
    details: "PayOS Payout Napas 24/7 -> MB Bank (0987654321)",
    amount: 3000000,
    isPositive: false,
    status: "Thành Công (Đã chuyển khoản)",
    time: "17/09/2026 15:45",
  },
  {
    txId: "TX-98124",
    type: "Giải Phóng Escrow",
    typeVariant: "escrow",
    details: "Hoàn tất Mock Interview System Design (Mentee: H.T. Linh)",
    amount: 450000,
    isPositive: true,
    status: "Đã Giải Phóng (+450.000 ₫)",
    time: "18/09/2026 21:00",
  },
  {
    txId: "TX-97810",
    type: "Đang Ký Quỹ",
    typeVariant: "pending",
    details: "Review CV Senior .NET (Mentee: L.T. Kiệt) — Chờ nghiệm thu 24h",
    amount: 300000,
    isPositive: true,
    status: "Tạm Giữ Trong Escrow",
    time: "18/09/2026 14:30",
  },
  {
    txId: "TX-96540",
    type: "Đang Khiếu Nại",
    typeVariant: "dispute",
    details: "Buổi học #SB-2026-96540 — Chờ Ban Quản Trị xem xét SLA 48h",
    amount: 450000,
    isPositive: false,
    status: "Đóng Băng Tranh Chấp",
    time: "16/09/2026 10:15",
  },
  {
    txId: "TX-95200",
    type: "Giải Phóng Escrow",
    typeVariant: "escrow",
    details: "Lộ trình Software Architect Buổi 4/4 (Mentee: T.M. Tuấn)",
    amount: 2000000,
    isPositive: true,
    status: "Đã Giải Phóng (+2.000.000 ₫)",
    time: "14/09/2026 18:20",
  },
];

export default function MentorWalletPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("2000000");
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const handleConfirmPayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => {
      setPayoutSuccess(false);
      setShowPayoutModal(false);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <Link href="/mentor/studio" className="hover:text-[#F0F2F5] transition-colors">
              Mentor Studio
            </Link>
            <span>/</span>
            <span className="text-[#9BA1B0]">Revenue & Payout Wallet</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Ví Doanh Thu & Rút Tiền VietQR Tức Thì
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Minh bạch 3 dòng tiền: Số dư khả dụng, Tạm giữ Escrow và Tranh chấp bảo vệ quyền lợi
          </p>
        </div>

        <Button
          onClick={() => setShowPayoutModal(true)}
          className="bg-[#27C98F] hover:bg-[#22B37E] text-white font-semibold gap-2 shadow-lg shadow-[#27C98F]/15"
          size="sm"
        >
          <ArrowUpRight className="h-4 w-4" />
          <span>Rút Tiền Về Ngân Hàng</span>
        </Button>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Card 1: Available Balance */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#9BA1B0]">
              Số Dư Khả Dụng (Rút Ngay)
            </span>
            <div className="p-2 rounded-lg bg-[#27C98F]/10 text-[#27C98F]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#27C98F] tracking-tight">
            6.200.000 ₫
          </div>
          <p className="text-[11px] text-[#9BA1B0] mt-2 flex items-center gap-1.5 font-mono">
            <Zap className="h-3 w-3 text-[#27C98F]" />
            PayOS Napas 24/7 Payout sẵn sàng
          </p>
        </Card>

        {/* Card 2: Escrow Locked */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#9BA1B0]">
              Đang Giữ Trong Escrow (24h)
            </span>
            <div className="p-2 rounded-lg bg-[#F5A623]/10 text-[#F5A623]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5A623] tracking-tight">
            1.800.000 ₫
          </div>
          <p className="text-[11px] text-[#9BA1B0] mt-2 flex items-center gap-1.5 font-mono">
            <Clock className="h-3 w-3 text-[#F5A623]" />
            3 Buổi học đang trong kỳ nghiệm thu
          </p>
        </Card>

        {/* Card 3: Disputed Funds */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#9BA1B0]">
              Đang Khiếu Nại (SLA 48h)
            </span>
            <div className="p-2 rounded-lg bg-[#FF5C5C]/10 text-[#FF5C5C]">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#FF5C5C] tracking-tight">
            450.000 ₫
          </div>
          <p className="text-[11px] text-[#9BA1B0] mt-2 flex items-center gap-1.5 font-mono">
            <Link href="/disputes/sb-2026-98124" className="text-[#FF5C5C] hover:underline flex items-center gap-1">
              <span>1 Ca tranh chấp đang đối chất</span>
              <span>→</span>
            </Link>
          </p>
        </Card>
      </div>

      {/* PayOS Napas Banner Info */}
      <div className="rounded-xl bg-[#14171D] border border-white/[0.08] p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#0D0E10] border border-white/[0.06] flex items-center justify-center text-[#5E6AD2]">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F0F2F5]">
                Tài Khoản Ngân Hàng Nhận Tiền (KYC Verified)
              </span>
              <Badge variant="escrow" className="text-[10px]">
                Active Payout
              </Badge>
            </div>
            <p className="text-xs font-mono text-[#9BA1B0] mt-0.5">
              MB Bank • STK: 0987654321 • NGUYEN VAN AN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#5D6474] font-mono">
            Phí rút tiền: 0 ₫ (SkillBridge tài trợ)
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowPayoutModal(true)}
            className="text-xs"
          >
            Rút Tiền Ngay
          </Button>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <Card className="p-0 overflow-hidden bg-[#14171D] border-white/[0.08]">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F0F2F5]">
              Sổ Cái Giao Dịch & Lịch Sử Biến Động Số Dư
            </h2>
            <p className="text-xs text-[#5D6474] mt-0.5">
              Mỗi biến động số dư đều được bảo chứng bởi hệ thống Escrow và chữ ký số SHA-256
            </p>
          </div>
          <span className="text-xs font-mono text-[#5D6474]">5 Bản ghi gần nhất</span>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06]">
                <TableHead className="text-xs font-mono text-[#5D6474]">MÃ GD</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">LOẠI GIAO DỊCH</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">CHI TIẾT BUỔI HỌC</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474] text-right">SỐ TIỀN</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">TRẠNG THÁI</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">THỜI GIAN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEDGER_DATA.map((row) => (
                <TableRow key={row.txId} className="border-white/[0.04] hover:bg-[#1C2028]">
                  <TableCell className="text-xs font-mono text-[#9BA1B0]">
                    {row.txId}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.typeVariant} className="text-[10px]">
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#F0F2F5] max-w-[280px] truncate">
                    {row.details}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-semibold text-right">
                    <span
                      className={
                        row.isPositive ? "text-[#27C98F]" : "text-[#F0F2F5]"
                      }
                    >
                      {row.isPositive ? "+" : "-"}
                      {new Intl.NumberFormat("vi-VN").format(row.amount)} ₫
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#9BA1B0]">
                    {row.status}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#5D6474]">
                    {row.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#14171D] border border-white/[0.1] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#27C98F]" />
                <h3 className="text-base font-bold text-[#F0F2F5]">
                  Rút Tiền Về Ngân Hàng (PayOS Payout)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="text-[#5D6474] hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 space-y-2">
              <div className="text-[11px] text-[#5D6474] uppercase font-mono">
                Tài khoản thụ hưởng:
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9BA1B0]">Ngân hàng:</span>
                <span className="font-bold text-[#F0F2F5]">MB Bank (Napas 24/7)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9BA1B0]">Số tài khoản:</span>
                <span className="font-mono text-[#27C98F]">0987654321</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9BA1B0]">Chủ tài khoản:</span>
                <span className="font-mono text-[#F0F2F5]">NGUYEN VAN AN</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#9BA1B0] mb-1.5 block">
                Số tiền muốn rút (Tối đa khả dụng: 6.200.000 ₫)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="font-mono text-sm pr-12 text-[#27C98F]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#5D6474]">
                  VND
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {["1000000", "2000000", "5000000", "6200000"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPayoutAmount(preset)}
                    className="text-[10px] font-mono bg-[#0D0E10] hover:bg-[#1F2022] text-[#9BA1B0] hover:text-[#F0F2F5] px-2 py-1 rounded border border-white/[0.04] transition-colors"
                  >
                    {new Intl.NumberFormat("vi-VN").format(Number(preset))} ₫
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#27C98F]/5 border border-[#27C98F]/20 text-[11px] text-[#9BA1B0]">
              <span className="text-[#27C98F] font-semibold">Tốc độ xử lý:</span> Tiền sẽ
              được chuyển tức thì vào tài khoản MB Bank của bạn trong vòng 30 giây qua cổng
              PayOS Payout liên ngân hàng 24/7.
            </div>

            {payoutSuccess ? (
              <div className="p-3 rounded-lg bg-[#27C98F]/15 border border-[#27C98F]/30 text-center text-xs text-[#27C98F] font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Lệnh rút tiền đã gửi thành công! Tiền đang về tài khoản.</span>
              </div>
            ) : (
              <Button
                onClick={handleConfirmPayout}
                className="w-full bg-[#27C98F] hover:bg-[#22B37E] text-white font-semibold py-2.5 text-xs shadow-lg shadow-[#27C98F]/10"
              >
                Xác Nhận Rút {new Intl.NumberFormat("vi-VN").format(Number(payoutAmount) || 0)} ₫
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
