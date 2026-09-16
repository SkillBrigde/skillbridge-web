import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  shape?: "circle" | "rounded";
}

export function Avatar({
  className,
  src,
  alt = "User Avatar",
  size = "md",
  online,
  shape = "circle",
  ...props
}: AvatarProps) {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl",
  };

  const roundedStyles = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className={cn("relative inline-block flex-shrink-0", className)} {...props}>
      <div
        className={cn(
          "relative overflow-hidden bg-[#1F2022] border border-white/[0.12] flex items-center justify-center text-[#9BA1B0]",
          sizeStyles[size],
          roundedStyles
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <User className="h-1/2 w-1/2" />
        )}
      </div>
      {online && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full bg-[#27C98F] ring-2 ring-[#0B0C0E]",
            size === "sm" && "h-2 w-2",
            size === "md" && "h-3 w-3",
            (size === "lg" || size === "xl") && "h-3.5 w-3.5 ring-4"
          )}
        />
      )}
    </div>
  );
}
