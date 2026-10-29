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
          <label className="block text-xs font-medium text-[#5e5866]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={cn(
              "w-full h-11 appearance-none bg-white border rounded-lg pl-3.5 pr-9 text-sm text-[#27252d] font-sans transition-all outline-none cursor-pointer",
              error
                ? "border-[#f5cac2] focus:border-[#a64533] focus:ring-2 focus:ring-[#fceeea]"
                : "border-[#e5e2de] hover:border-[#d4c3e7] focus:border-[#6551a4] focus:ring-2 focus:ring-[#ece5f5]"
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-[#9b919f]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white text-[#27252d]"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b919f] pointer-events-none" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
