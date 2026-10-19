import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  value: number;
  /** Optional label displayed above the bar */
  label?: string;
  /** Show percentage text */
  showPercent?: boolean;
  /** Bar color variant */
  variant?: "brand" | "success" | "warning" | "error";
  /** Height size */
  size?: "sm" | "md";
  className?: string;
}

const barColors: Record<string, string> = {
  brand: "bg-[#5E6AD2]",
  success: "bg-[#27C98F]",
  warning: "bg-[#F5A623]",
  error: "bg-[#FF5C5C]",
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
            <span className="text-xs font-medium text-[#E3E2E5]">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-xs font-mono text-[#9BA1B0]">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-white/[0.06] overflow-hidden",
          size === "sm" ? "h-1" : "h-2"
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
