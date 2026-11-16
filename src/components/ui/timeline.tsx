import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error" | "brand";
}

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const dotVariants: Record<string, string> = {
  default: "bg-[#9b919f]",
  success: "bg-[#1e7e45]",
  warning: "bg-[#946200]",
  error: "bg-[#a64533]",
  brand: "bg-[#6551a4]",
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
                  "h-3 w-3 rounded-full flex-shrink-0 mt-1 ring-4 ring-[#faf9f6]",
                  dot
                )}
              />
              {!isLast && (
                <div className="w-[1px] flex-1 bg-[#e5e2de] mt-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 -mt-0.5">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-mono text-[#5e5866]">
                  {event.timestamp}
                </span>
                <span className="text-[10px] text-[#9b919f]">•</span>
                <span className="text-xs font-semibold text-[#6551a4]">
                  {event.actor}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#27252d]">
                {event.title}
              </p>
              {event.description && (
                <p className="text-xs text-[#5e5866] mt-1 leading-relaxed">
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
