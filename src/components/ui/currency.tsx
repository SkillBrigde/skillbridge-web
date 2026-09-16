import * as React from "react";
import { cn } from "@/lib/utils";

export interface CurrencyProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
  highlight?: "emerald" | "amber" | "rose" | "indigo" | "default";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Currency({
  amount,
  highlight = "default",
  size = "md",
  className,
  ...props
}: CurrencyProps) {
  const formatted = new Intl.NumberFormat("vi-VN").format(amount);

  const colorStyles = {
    default: "text-[#F0F2F5]",
    emerald: "text-[#27C98F]",
    amber: "text-[#F5A623]",
    rose: "text-[#FF5C5C]",
    indigo: "text-[#BDC2FF]",
  };

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg",
    xl: "text-2xl font-bold",
  };

  return (
    <span
      className={cn(
        "font-mono tracking-tight inline-flex items-baseline gap-0.5",
        colorStyles[highlight],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span>{formatted}</span>
      <span className="text-[0.85em] font-normal opacity-80">₫</span>
    </span>
  );
}
