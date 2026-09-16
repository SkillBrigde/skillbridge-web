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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer select-none",
        active
          ? "bg-[#5E6AD2] text-[#FDFAFF] shadow-sm shadow-[#5E6AD2]/20"
          : variant === "tag"
          ? "bg-[#1F2022] text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#292A2C] border border-white/[0.04]"
          : "bg-[#14171D] text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#1F2022] border border-white/[0.08]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
