import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "tag";
}

export function Chip({
  className,
  active = false,
  variant = "default",
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer select-none",
        active
          ? "bg-[#ece5f5] text-[#6551a4] border border-[#d4c3e7] font-semibold"
          : variant === "tag"
          ? "bg-[#f1efea] text-[#5e5866] hover:text-[#27252d] hover:bg-[#eae6df] border border-transparent"
          : "bg-white text-[#5e5866] hover:text-[#27252d] hover:bg-[#faf9f6] border border-[#e5e2de]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
