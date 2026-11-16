"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SessionTimerProps {
  initialSeconds?: number;
  running?: boolean;
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
    <div className={cn("inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#f1efea] border border-[#e5e2de]", className)}>
      {/* REC indicator */}
      {running && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a64533] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a64533]" />
        </span>
      )}
      <span
        className={cn(
          "font-mono tabular-nums text-base font-bold tracking-tight",
          isOvertime ? "text-[#a64533]" : "text-[#1e7e45]"
        )}
      >
        {formatted}
      </span>
    </div>
  );
}
