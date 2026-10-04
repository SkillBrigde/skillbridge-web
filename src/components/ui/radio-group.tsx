"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioGroupProps {
  /** Group name attribute */
  name: string;
  /** List of radio options */
  options: RadioOption[];
  /** Currently selected value */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Optional label for the entire group */
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
    <fieldset className={cn("space-y-2", className)}>
      {label && (
        <legend className="text-sm font-medium text-[#E3E2E5] mb-2">
          {label}
        </legend>
      )}
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <label
            key={option.value}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-150 select-none",
              isSelected
                ? "bg-[#5E6AD2]/8 border-[#5E6AD2]/40 ring-1 ring-[#5E6AD2]/20"
                : "bg-[#14171D] border-white/[0.08] hover:bg-[#171A21] hover:border-white/[0.14]"
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
                  "h-4 w-4 rounded-full border-2 transition-all",
                  isSelected
                    ? "border-[#5E6AD2] bg-[#5E6AD2]"
                    : "border-white/[0.2] bg-transparent"
                )}
              />
              {isSelected && (
                <div className="absolute h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  "text-sm font-medium block",
                  isSelected ? "text-[#F0F2F5]" : "text-[#E3E2E5]"
                )}
              >
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-[#5D6474] mt-0.5 block">
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
