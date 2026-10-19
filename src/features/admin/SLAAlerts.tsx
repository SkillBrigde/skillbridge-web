"use client";

import React from "react";
import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SLAAlertProps {
  remainingSeconds: number;
  formattedCountdown: string;
  disputeCode: string;
}

export function SLAAlerts({
  remainingSeconds,
  formattedCountdown,
  disputeCode,
}: SLAAlertProps) {
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 3600; // < 1 hour

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isUrgent
          ? "bg-[#FF5C5C]/10 border-[#FF5C5C]/30 text-[#FF5C5C]"
          : "bg-[#F5A623]/10 border-[#F5A623]/25 text-[#F5A623]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isUrgent ? (
          <ShieldAlert className="h-5 w-5 text-[#FF5C5C] shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-[#F5A623] shrink-0" />
        )}
        <div>
          <p className="text-xs font-semibold text-[#F0F2F5]">
            SLA Thời Hạn Phán Quyết Tranh Chấp #{disputeCode}
          </p>
          <p className="text-[11px] text-[#9BA1B0] mt-0.5">
            Admin cần đưa ra phán quyết trước khi thời gian hết hạn để bảo đảm cam kết SLA.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0" />
        <Badge variant={isUrgent ? "dispute" : "pending"} className="font-mono text-xs">
          {remainingSeconds > 0 ? `Còn ${formattedCountdown}` : "Đã hết hạn SLA"}
        </Badge>
      </div>
    </div>
  );
}
