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
        className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none text-sm text-[#27252d]", className)}
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
          <div className="h-4.5 w-4.5 rounded bg-white border border-[#e5e2de] transition-all peer-checked:bg-[#6551a4] peer-checked:border-[#6551a4] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ece5f5]" />
          <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[3]" />
        </div>
        {label && <span className="leading-tight text-sm text-[#27252d]">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
