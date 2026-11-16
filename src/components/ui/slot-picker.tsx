"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface SlotOption {
  id: string;
  date: string;
  time: string;
  available?: boolean;
}

export interface SlotPickerProps {
  slots: SlotOption[];
  selectedId?: string;
  onChange?: (slotId: string) => void;
  onSelect?: (slotId: string) => void;
  timezone?: string;
  className?: string;
}

export function SlotPicker({
  slots,
  selectedId,
  onChange,
  onSelect,
  timezone = "Asia/Ho_Chi_Minh (UTC+7)",
  className,
}: SlotPickerProps) {
  const handleSelect = onChange ?? onSelect;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#6551a4]" />
          <span className="text-sm font-semibold text-[#27252d]">
            Chọn Khung Giờ (Slot Lịch)
          </span>
          <span className="text-xs text-[#5e5866]">— Múi giờ {timezone}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5ed] border border-[#bde6ca] px-2.5 py-0.5 text-[10px] font-mono text-[#1e7e45] uppercase tracking-wider font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e7e45] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1e7e45]" />
          </span>
          Lịch Thực Tế
        </span>
      </div>

      {/* Slot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {slots.map((slot) => {
          const isSelected = slot.id === selectedId;
          const isDisabled = slot.available === false;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && handleSelect?.(slot.id)}
              className={cn(
                "relative flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all duration-150 cursor-pointer select-none",
                isSelected
                  ? "bg-[#ece5f5]/30 border-[#6551a4] shadow-sm ring-1 ring-[#6551a4]"
                  : isDisabled
                  ? "bg-[#f1efea] border-[#e5e2de] opacity-50 cursor-not-allowed"
                  : "bg-white border-[#e5e2de] hover:border-[#d4c3e7] hover:bg-[#faf9f6]"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-[#6551a4] font-semibold" : "text-[#27252d]"
                )}
              >
                {slot.date}
              </span>
              <span className="font-mono text-xs text-[#5e5866]">
                {slot.time}
              </span>
              {isDisabled && (
                <span className="absolute top-3 right-3 text-[10px] font-mono text-[#a64533] uppercase tracking-wider font-medium">
                  Đã kín
                </span>
              )}
              {isSelected && (
                <span className="absolute top-3 right-3 text-[10px] font-mono text-[#6551a4] uppercase tracking-wider font-semibold">
                  Đã chọn
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
