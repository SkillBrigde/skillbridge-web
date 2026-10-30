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
          "relative overflow-hidden bg-[#ece5f5] border border-[#d4c3e7] flex items-center justify-center text-[#6551a4]",
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
            "absolute bottom-0 right-0 rounded-full bg-[#1e7e45] ring-2 ring-white",
            size === "sm" && "h-2.5 w-2.5",
            size === "md" && "h-3.5 w-3.5",
            (size === "lg" || size === "xl") && "h-4 w-4 ring-2"
          )}
        />
      )}
    </div>
  );
}
