"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      label,
      placeholder = "Chọn...",
      error,
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-1.5", className)}>
        {label && (
          <label className="block text-sm font-medium text-[#E3E2E5]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              "w-full h-10 appearance-none bg-[#0F1115] border rounded-xl pl-3.5 pr-9 text-sm text-[#F0F2F5] font-sans transition-all outline-none cursor-pointer",
              error
                ? "border-[#FF5C5C] focus:ring-1 focus:ring-[#FF5C5C]"
                : "border-white/[0.08] hover:border-white/[0.16] focus:border-[#5E6AD2]/80 focus:ring-1 focus:ring-[#5E6AD2]/50"
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-[#5D6474]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#14171D] text-[#F0F2F5]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D6474] pointer-events-none" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
