"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

export interface SlotOption {
  id: string;
  /** e.g. "Thứ 6, 18/09" */
  date: string;
  /** e.g. "19:30 - 20:30" */
  time: string;
  /** Whether the slot is available for selection */
  available?: boolean;
}

export interface SlotPickerProps {
  slots: SlotOption[];
  selectedId?: string;
  onChange?: (slotId: string) => void;
  onSelect?: (slotId: string) => void;
  /** Timezone label */
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
          <Clock className="h-4 w-4 text-[#9BA1B0]" />
          <span className="text-sm font-medium text-[#F0F2F5]">
            Chọn Khung Giờ (Slot)
          </span>
          <span className="text-xs text-[#5D6474]">— Múi giờ {timezone}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27C98F]/10 border border-[#27C98F]/25 px-2 py-0.5 text-[10px] font-mono text-[#27C98F] uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C98F] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#27C98F]" />
          </span>
          Live Availability
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
                "relative flex flex-col items-start gap-0.5 rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer select-none",
                isSelected
                  ? "bg-[#5E6AD2]/10 border-[#5E6AD2]/40 ring-1 ring-[#5E6AD2]/30"
                  : isDisabled
                  ? "bg-[#0D0E10] border-white/[0.04] opacity-50 cursor-not-allowed"
                  : "bg-[#14171D] border-white/[0.08] hover:bg-[#171A21] hover:border-white/[0.14]"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-[#F0F2F5]" : "text-[#E3E2E5]"
                )}
              >
                {slot.date}
              </span>
              <span className="font-mono text-xs text-[#9BA1B0]">
                {slot.time}
              </span>
              {isDisabled && (
                <span className="absolute top-2 right-2 text-[10px] font-mono text-[#FF5C5C] uppercase tracking-wider">
                  Đã đặt
                </span>
              )}
              {isSelected && (
                <span className="absolute top-2 right-2 text-[10px] font-mono text-[#5E6AD2] uppercase tracking-wider">
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
