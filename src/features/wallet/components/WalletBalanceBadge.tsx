"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export interface WalletBalanceBadgeProps {
  label: string;
  amount: string;
  href?: string;
  className?: string;
}

export function WalletBalanceBadge({
  label,
  amount,
  href = "/wallet",
  className = "",
}: WalletBalanceBadgeProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-xl bg-[#03BD84]/10 border border-[#27C98F]/30 px-2.5 py-1.5 transition-colors hover:bg-[#03BD84]/15 ${className}`}
    >
      <ShieldCheck className="h-4 w-4 text-[#27C98F] flex-shrink-0" />
      <div className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#27C98F] whitespace-nowrap">
          {label}
        </span>
        <span className="text-xs font-mono font-medium text-[#F0F2F5] whitespace-nowrap">
          {amount}
        </span>
      </div>
    </Link>
  );
}

export { WalletBalanceBadge as default };
