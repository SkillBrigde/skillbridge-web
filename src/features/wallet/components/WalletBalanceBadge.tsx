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
      className={`inline-flex items-center gap-2 rounded-xl bg-[#e8f5ed] border border-[#1e7e45]/20 px-3 py-1.5 transition-all hover:bg-[#dcf0e4] ${className}`}
    >
      <ShieldCheck className="h-4 w-4 text-[#1e7e45] shrink-0" />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#1e7e45] whitespace-nowrap">
          {label}
        </span>
        <span className="text-xs font-mono font-semibold text-[#27252d] whitespace-nowrap">
          {amount}
        </span>
      </div>
    </Link>
  );
}

export { WalletBalanceBadge as default };
