import * as React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

export interface EscrowShieldProps {
  amount?: string;
  description?: string;
  compact?: boolean;
  className?: string;
}

export function EscrowShield({
  amount,
  description = "Tiền được giữ an toàn tại Két ký quỹ Escrow. Mentor chỉ nhận tiền khi bạn nghiệm thu hài lòng hoặc sau 24h không có khiếu nại.",
  compact = false,
  className,
}: EscrowShieldProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#bde6ca] bg-[#e8f5ed]/60",
        compact ? "p-3" : "p-5",
        className
      )}
    >
      <div
        className={cn(
          "flex gap-3.5",
          compact ? "items-center" : "items-start"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f5ed] border border-[#bde6ca] flex-shrink-0 text-[#1e7e45]">
          <ShieldCheck className="h-5 w-5 text-[#1e7e45]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#1e7e45]">
              Két Ký Quỹ An Toàn (SkillBridge Escrow)
            </span>
            {amount && (
              <span className="text-xs font-mono font-bold text-[#1e7e45]">
                {amount}
              </span>
            )}
          </div>
          {!compact && (
            <p className="text-xs text-[#2e593d] mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
