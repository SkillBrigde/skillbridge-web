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
          "w-full h-11 bg-white border rounded-lg px-3.5 text-sm text-[#27252d] placeholder:text-[#9b919f] font-sans transition-all outline-none",
          error
            ? "border-[#f5cac2] focus:border-[#a64533] focus:ring-2 focus:ring-[#fceeea]"
            : "border-[#e5e2de] hover:border-[#d4c3e7] focus:border-[#6551a4] focus:ring-2 focus:ring-[#ece5f5]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
