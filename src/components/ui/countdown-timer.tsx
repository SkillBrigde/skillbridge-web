"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface CountdownTimerProps {
  initialSeconds?: number;
  onExpire?: () => void;
  className?: string;
  slotKey?: string;
}

export function CountdownTimer({
  initialSeconds = 600,
  onExpire,
  className,
  slotKey = "lock:slot:session_88192",
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(initialSeconds);

  React.useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const percentLeft = (secondsLeft / initialSeconds) * 100;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-[#0D0E10] border border-[#F5A623]/25 p-4 shadow-xl",
        className
      )}
    >
      {/* Depleting progress bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-[#F5A623] transition-all duration-1000 ease-linear"
        style={{ width: `${percentLeft}%` }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623]">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#F5A623] font-semibold">
                REDIS LOCK: EX {initialSeconds}
              </span>
              <span className="text-[11px] font-mono text-[#5D6474]">
                KEY: {slotKey}
              </span>
            </div>
            <p className="text-xs text-[#9BA1B0]">
              Khóa độc quyền slot qua Redis — Slot sẽ giải phóng nếu không thanh toán kịp
            </p>
          </div>
        </div>

        {/* Timer readout */}
        <div className="text-right flex-shrink-0">
          <span className="text-[10px] font-mono text-[#9BA1B0] block uppercase tracking-wider">
            Thời Gian Còn Lại
          </span>
          <span className="font-mono text-xl font-bold tracking-tight text-[#F5A623]">
            {formattedTime}
            <span className="text-xs text-[#F5A623]/70 font-normal ml-0.5">s</span>
          </span>
        </div>
      </div>
    </div>
  );
}
