import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  variant?: "brand" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

const barColors: Record<string, string> = {
  brand: "bg-[#6551a4]",
  success: "bg-[#1e7e45]",
  warning: "bg-[#946200]",
  error: "bg-[#a64533]",
};

export function ProgressBar({
  value,
  label,
  showPercent = false,
  variant = "brand",
  size = "md",
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-medium text-[#27252d]">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-xs font-mono text-[#5e5866]">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-[#f1efea] overflow-hidden border border-[#e5e2de]",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColors[variant]
          )}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
