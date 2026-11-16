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
    escrow: "bg-[#e8f5ed] text-[#1e7e45] border-[#bde6ca]",
    pending: "bg-[#fdf6e7] text-[#946200] border-[#f4dfad]",
    dispute: "bg-[#fceeea] text-[#a64533] border-[#f5cac2]",
    neutral: "bg-[#f1efea] text-[#5e5866] border-[#e5e2de]",
    brand: "bg-[#ece5f5] text-[#6551a4] border-[#d4c3e7]",
  };

  const dotColors = {
    escrow: "bg-[#1e7e45]",
    pending: "bg-[#946200]",
    dispute: "bg-[#a64533]",
    neutral: "bg-[#5e5866]",
    brand: "bg-[#6551a4]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider font-medium border",
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
