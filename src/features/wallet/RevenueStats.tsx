"use client";

import React from "react";
import { Wallet, ShieldCheck, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { vnd } from "@/utils/formatters";

export interface RevenueStatsProps {
  availableBalance: number;
  holdingBalance: number;
  holdingCount: number;
  disputedBalance: number;
  disputedCount: number;
}

export function RevenueStats({
  availableBalance,
  holdingBalance,
  holdingCount,
  disputedBalance,
  disputedCount,
}: RevenueStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      <StatCard
        label="Số dư khả dụng (Rút ngay)"
        value={vnd(availableBalance)}
        icon={<Wallet className="h-4 w-4" />}
        variant="emerald"
        sublabel="Sẵn sàng chuyển khoản qua PayOS Napas"
      />
      <StatCard
        label="Đang giữ trong Escrow"
        value={vnd(holdingBalance)}
        icon={<ShieldCheck className="h-4 w-4" />}
        variant="amber"
        sublabel={`${holdingCount} buổi đang trong 24h chờ nghiệm thu`}
      />
      <StatCard
        label="Đang khiếu nại (SLA 48h)"
        value={vnd(disputedBalance)}
        icon={<AlertTriangle className="h-4 w-4" />}
        variant="default"
        sublabel={`${disputedCount} ca tranh chấp chờ Admin phán quyết`}
      />
    </div>
  );
}
