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
          "w-full min-h-[96px] bg-white border rounded-lg p-3.5 text-sm text-[#27252d] placeholder:text-[#9b919f] font-sans transition-all outline-none resize-y",
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
Textarea.displayName = "Textarea";
