import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label / title of the metric */
  label: string;
  /** The numeric or string value displayed prominently */
  value: React.ReactNode;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Color accent for the value */
  highlight?: "emerald" | "amber" | "rose" | "indigo" | "default";
  /** Alias for highlight */
  variant?: "emerald" | "amber" | "rose" | "indigo" | "default";
  /** Optional secondary info text */
  description?: string;
  /** Alias for description */
  sublabel?: string;
}

export function StatCard({
  label,
  value,
  icon,
  highlight,
  variant,
  description,
  sublabel,
  className,
  ...props
}: StatCardProps) {
  const activeHighlight = variant ?? highlight ?? "default";
  const activeDescription = sublabel ?? description;
  const highlightStyles = {
    default: "text-[#F0F2F5]",
    emerald: "text-[#27C98F]",
    amber: "text-[#F5A623]",
    rose: "text-[#FF5C5C]",
    indigo: "text-[#BDC2FF]",
  };

  const iconBgStyles = {
    default: "bg-white/[0.06] text-[#9BA1B0]",
    emerald: "bg-[#27C98F]/10 text-[#27C98F] border-[#27C98F]/20",
    amber: "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20",
    rose: "bg-[#FF5C5C]/10 text-[#FF5C5C] border-[#FF5C5C]/20",
    indigo: "bg-[#5E6AD2]/10 text-[#BDC2FF] border-[#5E6AD2]/20",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-[#14171D] border border-white/[0.08] p-5 transition-colors hover:bg-[#171A21]",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#9BA1B0] uppercase tracking-wider mb-2">
            {label}
          </p>
          <p
            className={cn(
              "text-2xl font-mono font-bold tracking-tight",
              highlightStyles[activeHighlight]
            )}
          >
            {value}
          </p>
          {activeDescription && (
            <p className="text-xs text-[#5D6474] mt-1.5">{activeDescription}</p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg border flex-shrink-0",
              iconBgStyles[activeHighlight]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
