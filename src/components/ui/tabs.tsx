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
  disabled?: boolean;
}

export function Tabs({
  items,
  activeId,
  onChange,
  className,
  size = "md",
  disabled = false,
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Tabs"
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-xl bg-[#f1efea] border border-[#e5e2de] p-1",
        className
      )}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg font-medium transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[#9982d2] disabled:opacity-50 disabled:pointer-events-none",
              size === "sm" ? "px-3 py-1.5 text-xs min-h-[36px]" : "px-4 py-2.5 text-sm min-h-[40px]",
              isActive
                ? "bg-white text-[#6551a4] border border-[#d4c3e7] shadow-xs font-semibold"
                : "text-[#5e5866] hover:text-[#27252d] hover:bg-white/60"
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-mono",
                  isActive
                    ? "bg-[#ece5f5] text-[#6551a4]"
                    : "bg-[#e5e2de] text-[#5e5866]"
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
