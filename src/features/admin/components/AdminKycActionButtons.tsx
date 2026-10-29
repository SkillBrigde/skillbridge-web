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
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white border border-[#e5e2de] shadow-xs">
      <Button
        variant="outline"
        disabled={disabled}
        className="h-auto min-h-[42px] py-2.5 px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap border-[#1e7e45]/30 text-[#1e7e45] hover:bg-[#e8f5ed] flex-1 sm:flex-none font-semibold rounded-xl"
        onClick={onApprove}
      >
        <CheckCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Duyệt & Cấp Tích Xanh</span>
      </Button>
      <Button
        variant="outline"
        disabled={disabled}
        className="h-auto min-h-[42px] py-2.5 px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap border-[#946200]/30 text-[#946200] hover:bg-[#fdf6e7] flex-1 sm:flex-none font-semibold rounded-xl"
        onClick={onRequestMoreInfo}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Yêu Cầu Bổ Sung</span>
      </Button>
      <Button
        variant="destructive"
        disabled={disabled}
        className="h-auto min-h-[42px] py-2.5 px-5 inline-flex items-center justify-center gap-2 whitespace-nowrap flex-1 sm:flex-none font-semibold rounded-xl"
        onClick={onReject}
      >
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Từ Chối Hồ Sơ</span>
      </Button>
    </div>
  );
}

export { AdminKycActionButtons as default };
