"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  /** Current rating value (0-5) */
  value: number;
  /** Maximum number of stars */
  max?: number;
  /** Callback when rating changes — omit or set readOnly for read-only mode */
  onChange?: (value: number) => void;
  /** Set to true to disable interaction */
  readOnly?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional label displayed next to stars */
  label?: string;
  /** Show numeric value beside stars */
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  value,
  max = 5,
  onChange,
  readOnly = false,
  size = "md",
  label,
  showValue = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const isInteractive = !readOnly && !!onChange;

  const sizeStyles = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5.5 w-5.5",
  };

  const displayValue = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-sm text-[#9BA1B0] min-w-[140px]">{label}</span>
      )}
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => isInteractive && setHovered(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= displayValue;

          return (
            <button
              key={starIndex}
              type="button"
              disabled={!isInteractive}
              onClick={() => onChange?.(starIndex)}
              onMouseEnter={() => isInteractive && setHovered(starIndex)}
              className={cn(
                "transition-all duration-100 focus:outline-none disabled:cursor-default",
                isInteractive && "cursor-pointer hover:scale-110"
              )}
              aria-label={`${starIndex} sao`}
            >
              <Star
                className={cn(
                  sizeStyles[size],
                  "transition-colors duration-100",
                  isFilled
                    ? "fill-[#F5A623] text-[#F5A623]"
                    : "fill-transparent text-[#5D6474]"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-mono text-[#F0F2F5]">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
