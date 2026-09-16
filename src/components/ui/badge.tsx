import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "escrow" | "pending" | "dispute" | "neutral" | "brand";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    escrow: "bg-[#27C98F]/10 text-[#27C98F] border-[#27C98F]/25",
    pending: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/25",
    dispute: "bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/25",
    neutral: "bg-[#0F1115] text-[#9BA1B0] border-white/[0.08]",
    brand: "bg-[#5E6AD2]/15 text-[#BDC2FF] border-[#5E6AD2]/30",
  };

  const dotColors = {
    escrow: "bg-[#27C98F]",
    pending: "bg-[#F5A623]",
    dispute: "bg-[#FF5C5C]",
    neutral: "bg-[#9BA1B0]",
    brand: "bg-[#5E6AD2]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider font-medium border border-solid",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                dotColors[variant]
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              dotColors[variant]
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
