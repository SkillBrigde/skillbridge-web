import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";

export interface NoticeBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "success" | "error";
  message?: string;
  children?: React.ReactNode;
}

export function NoticeBanner({
  variant = "info",
  message,
  children,
  className,
  ...props
}: NoticeBannerProps) {
  const variants = {
    info: {
      bg: "bg-[#ece5f5]/60 border-[#d4c3e7]",
      icon: <Info className="h-4.5 w-4.5 text-[#6551a4] flex-shrink-0 mt-0.5" />,
      text: "text-[#4d3d7d]",
    },
    warning: {
      bg: "bg-[#fdf6e7] border-[#f4dfad]",
      icon: (
        <AlertTriangle className="h-4.5 w-4.5 text-[#946200] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#7a5000]",
    },
    success: {
      bg: "bg-[#e8f5ed] border-[#bde6ca]",
      icon: (
        <CheckCircle className="h-4.5 w-4.5 text-[#1e7e45] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#1b6238]",
    },
    error: {
      bg: "bg-[#fceeea] border-[#f5cac2]",
      icon: (
        <AlertCircle className="h-4.5 w-4.5 text-[#a64533] flex-shrink-0 mt-0.5" />
      ),
      text: "text-[#833021]",
    },
  };

  const v = variants[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-sm",
        v.bg,
        className
      )}
      role="alert"
      {...props}
    >
      {v.icon}
      <div className={cn("text-xs sm:text-sm leading-relaxed", v.text)}>
        {children ?? message}
      </div>
    </div>
  );
}
