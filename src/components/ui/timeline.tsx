import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  /** Timestamp text, e.g. "27/09/2026 14:30" */
  timestamp: string;
  /** Actor / role label */
  actor: string;
  /** Event title */
  title: string;
  /** Event description */
  description?: string;
  /** Semantic variant for the dot color */
  variant?: "default" | "success" | "warning" | "error" | "brand";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const dotVariants: Record<string, string> = {
  default: "bg-[#5D6474]",
  success: "bg-[#27C98F]",
  warning: "bg-[#F5A623]",
  error: "bg-[#FF5C5C]",
  brand: "bg-[#5E6AD2]",
};

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        const dot = dotVariants[event.variant ?? "default"];

        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 ring-4 ring-[#0B0C0E]",
                  dot
                )}
              />
              {!isLast && (
                <div className="w-[1px] flex-1 bg-white/[0.08] mt-1.5" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 -mt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-mono text-[#5D6474]">
                  {event.timestamp}
                </span>
                <span className="text-[10px] text-[#5D6474]">•</span>
                <span className="text-xs font-medium text-[#9BA1B0]">
                  {event.actor}
                </span>
              </div>
              <p className="text-sm font-medium text-[#F0F2F5]">
                {event.title}
              </p>
              {event.description && (
                <p className="text-xs text-[#9BA1B0] mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
