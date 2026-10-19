import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export interface EscrowShieldProps {
  /** The held amount displayed */
  amount?: string;
  /** Optional custom description */
  description?: string;
  /** Compact mode — less padding, single line */
  compact?: boolean;
  className?: string;
}

export function EscrowShield({
  amount,
  description = "Tiền giữ an toàn tại tài khoản Escrow. Mentor chỉ nhận tiền khi bạn nghiệm thu hài lòng hoặc sau 24h không có khiếu nại.",
  compact = false,
  className,
}: EscrowShieldProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#27C98F]/25 bg-[#27C98F]/5",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-3",
          compact ? "items-center" : "items-start"
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#27C98F]/10 border border-[#27C98F]/20 flex-shrink-0">
          <ShieldCheck className="h-4.5 w-4.5 text-[#27C98F]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#27C98F]">
              SkillBridge Escrow Shield
            </span>
            {amount && (
              <span className="text-xs font-mono text-[#27C98F]/80">
                {amount}
              </span>
            )}
          </div>
          {!compact && (
            <p className="text-xs text-[#9BA1B0] mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
