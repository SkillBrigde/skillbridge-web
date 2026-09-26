"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  TrendingUp,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Download,
  Hash,
  Lock,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Currency,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

interface DoubleEntryTx {
  txId: string;
  time: string;
  type: string;
  typeVariant: "escrow" | "pending" | "dispute" | "neutral";
  debitAccount: string;
  creditAccount: string;
  amount: number;
  hash: string;
}

const LEDGER_RECORDS: DoubleEntryTx[] = [
  {
    txId: "TX-2026-98124",
    time: "18/09 20:30:12",
    type: "Escrow Release",
    typeVariant: "escrow",
    debitAccount: "2110: Escrow Holding Pool",
    creditAccount: "1120: Mentor Wallet (V.An)",
    amount: 450000,
    hash: "9f82c...b129",
  },
  {
    txId: "TX-2026-98123",
    time: "18/09 19:25:04",
    type: "Platform Fee (10%)",
    typeVariant: "neutral",
    debitAccount: "1120: Mentor Wallet (V.An)",
    creditAccount: "4110: SkillBridge Revenue",
    amount: 50000,
    hash: "3a11e...7c04",
  },
  {
    txId: "TX-2026-98120",
    time: "18/09 18:45:22",
    type: "Deposit (PayOS QR)",
    typeVariant: "escrow",
    debitAccount: "1011: PayOS Bank Pool",
    creditAccount: "2110: Escrow Holding Pool",
    amount: 450000,
    hash: "6e49a...88ff",
  },
  {
    txId: "TX-2026-98115",
    time: "18/09 16:10:00",
    type: "Payout (Napas 24/7)",
    typeVariant: "pending",
    debitAccount: "1120: Mentor Wallet (H.Nam)",
    creditAccount: "1011: PayOS Bank Pool",
    amount: 2000000,
    hash: "2c74d...90a1",
  },
  {
    txId: "TX-2026-98108",
    time: "18/09 14:05:40",
    type: "Dispute Hold",
    typeVariant: "dispute",
    debitAccount: "2110: Escrow Holding Pool",
    creditAccount: "2130: Disputed Funds Pool",
    amount: 450000,
    hash: "e581b...33c2",
  },
  {
    txId: "TX-2026-98095",
    time: "18/09 11:20:15",
    type: "Deposit (VNPAY)",
    typeVariant: "escrow",
    debitAccount: "1012: VNPAY Gateway Pool",
    creditAccount: "2110: Escrow Holding Pool",
    amount: 1000000,
    hash: "b720e...4112",
  },
];

export default function AdminEscrowLedgerPage() {
  const [filterGateway, setFilterGateway] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = LEDGER_RECORDS.filter((rec) => {
    if (filterGateway === "payos" && !rec.debitAccount.includes("PayOS") && !rec.creditAccount.includes("PayOS")) {
      return false;
    }
    if (filterGateway === "vnpay" && !rec.debitAccount.includes("VNPAY") && !rec.creditAccount.includes("VNPAY")) {
      return false;
    }
    if (filterType !== "all" && rec.type.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    if (
      searchQuery &&
      !rec.txId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !rec.hash.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <span>Admin Center</span>
            <span>/</span>
            <span className="text-[#9BA1B0]">Platform Financial Escrow Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Giám Sát Sổ Cái Escrow & Đối Soát Toàn Sàn
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Hệ thống kế toán kép thời gian thực (Double-Entry Realtime) bảo đảm cân bằng tài chính 100%
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/disputes">
            <Button variant="secondary" size="sm" className="text-xs">
              Xem Ca Khiếu Nại (SLA 48h)
            </Button>
          </Link>
          <Link href="/admin/kyc">
            <Button variant="secondary" size="sm" className="text-xs">
              Duyệt KYC Mentor
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1 */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9BA1B0]">Tổng Tiền Ký Quỹ (Escrow)</span>
            <ShieldCheck className="h-4 w-4 text-[#27C98F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#27C98F]">
            148.500.000 ₫
          </div>
          <div className="text-[11px] text-[#5D6474] mt-1 font-mono">
            124 Hợp đồng đang bảo chứng
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9BA1B0]">Phí Sàn Lũy Kế (Take Rate 10%)</span>
            <TrendingUp className="h-4 w-4 text-[#5E6AD2]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#BDC2FF]">
            32.400.000 ₫
          </div>
          <div className="text-[11px] text-[#5D6474] mt-1 font-mono">
            Doanh thu thực nhận nền tảng
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9BA1B0]">Số Dư Cổng PayOS / VNPAY</span>
            <CreditCard className="h-4 w-4 text-[#F5A623]" />
          </div>
          <div className="text-sm font-bold font-mono text-[#F0F2F5] space-y-0.5">
            <div>PayOS: <span className="text-[#27C98F]">85.200.000 ₫</span></div>
            <div>VNPAY: <span className="text-[#F5A623]">63.300.000 ₫</span></div>
          </div>
          <div className="text-[11px] text-[#5D6474] mt-1 font-mono">
            Tổng thanh khoản: 148.5M ₫
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5 bg-[#14171D] border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9BA1B0]">Lệnh Payout Đang Xử Lý</span>
            <RefreshCw className="h-4 w-4 text-[#FF5C5C]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F0F2F5]">
            12.000.000 ₫
          </div>
          <div className="text-[11px] text-[#5D6474] mt-1 font-mono">
            6 Mentor đang rút tiền tức thì
          </div>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <Card className="p-4 mb-6 bg-[#14171D] border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-[#9BA1B0]">
              <Filter className="h-3.5 w-3.5 text-[#5E6AD2]" />
              <span>Bộ lọc:</span>
            </div>

            {/* Gateway Filter */}
            <select
              value={filterGateway}
              onChange={(e) => setFilterGateway(e.target.value)}
              className="h-8 rounded-lg bg-[#0D0E10] border border-white/[0.08] px-2.5 text-xs text-[#F0F2F5] focus:outline-none"
            >
              <option value="all">Tất cả Cổng Thanh Toán</option>
              <option value="payos">PayOS VietQR Pro</option>
              <option value="vnpay">VNPAY Sandbox</option>
            </select>

            {/* Tx Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-8 rounded-lg bg-[#0D0E10] border border-white/[0.08] px-2.5 text-xs text-[#F0F2F5] focus:outline-none"
            >
              <option value="all">Tất cả Loại Giao Dịch</option>
              <option value="deposit">Deposit (Nạp tiền)</option>
              <option value="escrow release">Escrow Release (Giải phóng)</option>
              <option value="payout">Payout (Rút về ngân hàng)</option>
              <option value="dispute hold">Dispute Hold (Đóng băng)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                placeholder="Tìm theo Mã GD hoặc Hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs w-56 pr-8 bg-[#0D0E10]"
              />
              <Search className="h-3.5 w-3.5 text-[#5D6474] absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-[#9BA1B0]">
              <Download className="h-3.5 w-3.5" />
              <span>Xuất CSV</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Real-time Double-Entry Ledger Table */}
      <Card className="p-0 overflow-hidden bg-[#14171D] border-white/[0.08]">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-[#27C98F]" />
            <h2 className="text-sm font-semibold text-[#F0F2F5]">
              Sổ Cái Kế Toán Kép (Double-Entry Balanced Ledger)
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#27C98F]">
            <span className="h-2 w-2 rounded-full bg-[#27C98F] animate-pulse" />
            <span>Σ Debit = Σ Credit (Balanced 100%)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06]">
                <TableHead className="text-xs font-mono text-[#5D6474]">MÃ GD</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">THỜI GIAN</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">LOẠI GD</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">TÀI KHOẢN NỢ (DEBIT)</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474]">TÀI KHOẢN CÓ (CREDIT)</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474] text-right">SỐ TIỀN</TableHead>
                <TableHead className="text-xs font-mono text-[#5D6474] text-right">HASH AUDIT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((rec) => (
                <TableRow key={rec.txId} className="border-white/[0.04] hover:bg-[#1C2028]">
                  <TableCell className="text-xs font-mono text-[#9BA1B0]">
                    {rec.txId}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#5D6474]">
                    {rec.time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={rec.typeVariant} className="text-[10px]">
                      {rec.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#FF5C5C]/90">
                    {rec.debitAccount}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-[#27C98F]/90">
                    {rec.creditAccount}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-right text-[#F0F2F5]">
                    {new Intl.NumberFormat("vi-VN").format(rec.amount)} ₫
                  </TableCell>
                  <TableCell className="text-xs font-mono text-right text-[#5E6AD2]">
                    {rec.hash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
