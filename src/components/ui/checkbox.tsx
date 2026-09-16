"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, id, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-[#E3E2E5]", className)}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="h-4 w-4 rounded bg-[#0F1115] border border-white/[0.16] transition-all peer-checked:bg-[#5E6AD2] peer-checked:border-[#5E6AD2] peer-focus-visible:ring-1 peer-focus-visible:ring-[#5E6AD2]" />
          <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[3]" />
        </div>
        {label && <span className="leading-none">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
