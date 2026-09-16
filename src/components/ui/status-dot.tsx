import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatusDotProps {
  status: "online" | "pending" | "dispute" | "offline";
  pulse?: boolean;
  className?: string;
}

export function StatusDot({
  status = "online",
  pulse = true,
  className,
}: StatusDotProps) {
  const colorStyles = {
    online: "bg-[#27C98F]",
    pending: "bg-[#F5A623]",
    dispute: "bg-[#FF5C5C]",
    offline: "bg-[#5D6474]",
  };

  return (
    <span className={cn("relative flex h-2 w-2 flex-shrink-0", className)}>
      {pulse && status !== "offline" && (
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            colorStyles[status]
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          colorStyles[status]
        )}
      />
    </span>
  );
}
