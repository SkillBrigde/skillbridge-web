import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icon element */
  icon?: React.ReactNode;
  /** Heading text */
  title: string;
  /** Description text */
  description?: string;
  /** Optional CTA action */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14171D] border border-white/[0.08] text-[#5D6474] mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#F0F2F5] tracking-tight mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#9BA1B0] max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
