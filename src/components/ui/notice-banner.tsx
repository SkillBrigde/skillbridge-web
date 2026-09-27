import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

export interface NoticeBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "error";
  children: React.ReactNode;
}

export function NoticeBanner({
  variant = "info",
  children,
  className,
  ...props
}: NoticeBannerProps) {
  const variants = {
    info: {
      bg: "bg-[#5E6AD2]/8 border-[#5E6AD2]/25",
      icon: <Info className="h-4 w-4 text-[#BDC2FF] flex-shrink-0 mt-0.5" />,
      text: "text-[#BDC2FF]",
    },
    warning: {
      bg: "bg-[#F5A623]/8 border-[#F5A623]/25",
      icon: (
        <AlertTriangle className="h-4 w-4 text-[#F5A623] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#F5A623]",
    },
    success: {
      bg: "bg-[#27C98F]/8 border-[#27C98F]/25",
      icon: (
        <CheckCircle className="h-4 w-4 text-[#27C98F] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#27C98F]",
    },
    error: {
      bg: "bg-[#FF5C5C]/8 border-[#FF5C5C]/25",
      icon: (
        <AlertCircle className="h-4 w-4 text-[#FF5C5C] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#FF5C5C]",
    },
  };

  const v = variants[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border p-3.5",
        v.bg,
        className
      )}
      role="alert"
      {...props}
    >
      {v.icon}
      <div className={cn("text-xs leading-relaxed", v.text)}>{children}</div>
    </div>
  );
}
