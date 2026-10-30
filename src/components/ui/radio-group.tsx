"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn("space-y-2.5", className)}>
      {label && (
        <legend className="text-xs font-semibold uppercase tracking-wider text-[#5e5866] mb-2">
          {label}
        </legend>
      )}
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all duration-150 select-none",
              isSelected
                ? "bg-[#ece5f5]/30 border-[#b3a0d1] shadow-sm"
                : "bg-white border-[#e5e2de] hover:border-[#d4c3e7] hover:bg-[#faf9f6]"
            )}
          >
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange?.(option.value)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  "h-4.5 w-4.5 rounded-full border-2 transition-all flex items-center justify-center",
                  isSelected
                    ? "border-[#6551a4] bg-[#6551a4]"
                    : "border-[#cfc9c2] bg-white"
                )}
              >
                {isSelected && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-sm font-medium block",
                  isSelected ? "text-[#6551a4] font-semibold" : "text-[#27252d]"
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-[#5e5866] mt-0.5 block leading-relaxed">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
