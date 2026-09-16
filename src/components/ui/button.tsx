import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      // Primary: Brand Indigo (#5E6AD2 -> #6F7BE2 -> #525DBB)
      primary:
        "bg-[#5E6AD2] hover:bg-[#6F7BE2] active:bg-[#525DBB] text-[#F0F2F5] border border-white/10 shadow-sm shadow-[#5E6AD2]/20 focus:ring-[#5E6AD2]/60",
      // Secondary: Dark Slate Surface (#14171D -> #171A21)
      secondary:
        "bg-[#14171D] hover:bg-[#171A21] active:bg-[#0F1115] text-[#F0F2F5] border border-white/[0.08] hover:border-white/[0.16] focus:ring-white/20",
      // Destructive: Rose Alert (#FF5C5C)
      destructive:
        "bg-[#FF5C5C]/10 hover:bg-[#FF5C5C]/20 active:bg-[#FF5C5C]/25 text-[#FF5C5C] border border-[#FF5C5C]/25 focus:ring-[#FF5C5C]/40",
      // Ghost
      ghost:
        "bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] text-[#9BA1B0] hover:text-[#F0F2F5] focus:ring-white/20",
      // Outline
      outline:
        "bg-transparent hover:bg-white/[0.04] text-[#E3E2E5] border border-white/[0.12] hover:border-white/[0.2] focus:ring-[#5E6AD2]/40",
    };

    const sizeStyles = {
      sm: "h-7 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
