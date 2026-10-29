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
    default: "text-[#27252d]",
    emerald: "text-[#1e7e45]",
    amber: "text-[#946200]",
    rose: "text-[#a64533]",
    indigo: "text-[#6551a4]",
  };

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
    xl: "text-xl font-bold",
  };

  return (
    <span
      className={cn(
        "font-mono tabular-nums tracking-tight inline-flex items-baseline gap-0.5",
        colorStyles[highlight],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span>{formatted}</span>
      <span className="text-[0.85em] font-normal opacity-75">₫</span>
    </span>
  );
}
