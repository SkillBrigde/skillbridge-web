import * as React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode;
  /** Tooltip position */
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  side = "top",
  children,
  className,
}: TooltipProps) {
  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={cn("relative group inline-flex", className)}>
      {children}
      <div
        role="tooltip"
        className={cn(
          "absolute z-50 hidden group-hover:block pointer-events-none",
          "rounded-lg bg-[#1F2022] border border-white/[0.12] px-2.5 py-1.5 text-xs text-[#E3E2E5] shadow-xl whitespace-nowrap",
          "animate-fade-in",
          positions[side]
        )}
      >
        {content}
      </div>
    </div>
  );
}
