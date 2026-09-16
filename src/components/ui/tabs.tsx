"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs({
  items,
  activeId,
  onChange,
  className,
  size = "md",
}: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-[#0D0E10] border border-white/[0.06] p-1",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer select-none",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
              isActive
                ? "bg-[#1F2022] text-[#F0F2F5] border border-white/[0.08] shadow-sm"
                : "text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#14171D]"
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                  isActive
                    ? "bg-[#5E6AD2] text-white"
                    : "bg-[#292A2C] text-[#9BA1B0]"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
