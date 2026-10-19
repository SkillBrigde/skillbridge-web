"use client";

import React from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AdminKycActionButtonsProps {
  onApprove: () => void;
  onRequestMoreInfo: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function AdminKycActionButtons({
  onApprove,
  onRequestMoreInfo,
  onReject,
  disabled = false,
}: AdminKycActionButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 h-auto p-3 rounded-xl bg-[#14171D] border border-white/[0.08]">
      <Button
        variant="outline"
        disabled={disabled}
        className="h-auto min-h-[40px] py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap border-[#27C98F]/30 text-[#27C98F] hover:bg-[#27C98F]/10 flex-1 sm:flex-none"
        onClick={onApprove}
      >
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Duyệt &amp; Cấp Tích Xanh</span>
      </Button>
      <Button
        variant="outline"
        disabled={disabled}
        className="h-auto min-h-[40px] py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/10 flex-1 sm:flex-none"
        onClick={onRequestMoreInfo}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Yêu Cầu Bổ Sung</span>
      </Button>
      <Button
        variant="destructive"
        disabled={disabled}
        className="h-auto min-h-[40px] py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap flex-1 sm:flex-none"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Từ Chối Hồ Sơ</span>
      </Button>
    </div>
  );
}

export { AdminKycActionButtons as default };
