import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full h-10 bg-[#0F1115] border rounded-xl px-3.5 text-sm text-[#F0F2F5] placeholder:text-[#5D6474] font-sans transition-all outline-none",
          error
            ? "border-[#FF5C5C] focus:ring-1 focus:ring-[#FF5C5C]"
            : "border-white/[0.08] hover:border-white/[0.16] focus:border-[#5E6AD2]/80 focus:ring-1 focus:ring-[#5E6AD2]/50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
