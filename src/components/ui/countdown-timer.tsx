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
      role="timer"
      aria-label="Thời gian giữ chỗ thanh toán"
      className={cn(
        "relative overflow-hidden rounded-xl bg-[#fffdfa] border border-[#f4dfad] p-4 sm:p-5 shadow-sm",
        className
      )}
    >
      {/* Depleting progress bar */}
      <div
        role="progressbar"
        aria-valuenow={secondsLeft}
        aria-valuemin={0}
        aria-valuemax={initialSeconds}
        aria-label="Thời gian giữ chỗ còn lại"
        className="absolute top-0 left-0 h-[3px] bg-[#b27400] transition-all duration-1000 ease-linear"
        style={{ width: `${percentLeft}%` }}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fdf6e7] border border-[#f4dfad] text-[#946200] flex-shrink-0">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#946200] font-semibold">
                GIỮ CHỖ TRONG VÒNG 10 PHÚT
              </span>
              {slotKey && (
                <span className="text-[11px] font-mono text-[#5e5866]">
                  {slotKey}
                </span>
              )}
            </div>
            <p className="text-xs text-[#5e5866] mt-0.5">
              Khung giờ này đang được giữ riêng cho bạn — Đơn sẽ tự hủy nếu chưa hoàn tất thanh toán
            </p>
          </div>
        </div>

        {/* Timer readout */}
        <div className="text-right flex-shrink-0 ml-auto sm:ml-0">
          <span className="text-[10px] font-mono text-[#5e5866] block uppercase tracking-wider">
            Thời Gian Còn Lại
          </span>
          <span className="font-mono tabular-nums text-2xl font-bold tracking-tight text-[#946200]">
            {formattedTime}
            <span className="text-xs text-[#946200] font-medium ml-0.5">s</span>
          </span>
        </div>
      </div>
    </div>
  );
}
