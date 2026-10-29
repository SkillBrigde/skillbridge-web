import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: "emerald" | "amber" | "rose" | "indigo" | "default";
  variant?: "emerald" | "amber" | "rose" | "indigo" | "default";
  description?: string;
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
    default: "text-[#27252d]",
    emerald: "text-[#1e7e45]",
    amber: "text-[#946200]",
    rose: "text-[#a64533]",
    indigo: "text-[#6551a4]",
  };

  const iconBgStyles = {
    default: "bg-[#f1efea] text-[#5e5866] border-[#e5e2de]",
    emerald: "bg-[#e8f5ed] text-[#1e7e45] border-[#bde6ca]",
    amber: "bg-[#fdf6e7] text-[#946200] border-[#f4dfad]",
    rose: "bg-[#fceeea] text-[#a64533] border-[#f5cac2]",
    indigo: "bg-[#ece5f5] text-[#6551a4] border-[#d4c3e7]",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-[#e5e2de] p-5 transition-all hover:border-[#d4c3e7] shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5e5866] mb-2">
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
            <p className="text-xs text-[#5e5866] mt-1.5 leading-relaxed">{activeDescription}</p>
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
