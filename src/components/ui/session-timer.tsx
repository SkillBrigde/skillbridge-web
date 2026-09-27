"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SessionTimerProps {
  /** Initial elapsed seconds (e.g. resume from backend) */
  initialSeconds?: number;
  /** Whether the timer is actively running */
  running?: boolean;
  /** Max duration in seconds (to show red when exceeded) */
  maxDuration?: number;
  className?: string;
}

export function SessionTimer({
  initialSeconds = 0,
  running = true,
  maxDuration,
  className,
}: SessionTimerProps) {
  const [elapsed, setElapsed] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const formatted = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isOvertime = maxDuration ? elapsed > maxDuration : false;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {/* REC indicator */}
      {running && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C5C] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C5C]" />
        </span>
      )}
      <span
        className={cn(
          "font-mono text-lg font-bold tracking-tight",
          isOvertime ? "text-[#FF5C5C]" : "text-[#27C98F]"
        )}
      >
        {formatted}
      </span>
    </div>
  );
}
