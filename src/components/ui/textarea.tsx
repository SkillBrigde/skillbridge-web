import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full min-h-[90px] bg-[#0F1115] border rounded-xl p-3.5 text-sm text-[#F0F2F5] placeholder:text-[#5D6474] font-sans transition-all outline-none resize-y",
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
Textarea.displayName = "Textarea";
