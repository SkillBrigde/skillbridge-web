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
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#9982d2] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      // Primary: Signature SkillBridge Purple (#6551a4 -> #514085)
      primary:
        "bg-[#6551a4] hover:bg-[#514085] active:bg-[#43346f] text-white border border-transparent shadow-sm",
      // Secondary: Crisp warm surface with hairline border
      secondary:
        "bg-white hover:bg-[#f0ede7] active:bg-[#e7e3dc] text-[#27252d] border border-[#e5e2de]",
      // Destructive: Editorial red tint
      destructive:
        "bg-[#fceeea] hover:bg-[#f9ded7] active:bg-[#f5cfc5] text-[#a64533] border border-[#f5cac2]",
      // Ghost
      ghost:
        "bg-transparent hover:bg-[#f1efea] active:bg-[#e8e4dc] text-[#5e5866] hover:text-[#27252d]",
      // Outline
      outline:
        "bg-transparent hover:bg-[#f1efea] text-[#27252d] border border-[#e5e2de]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
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
