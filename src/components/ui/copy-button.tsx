"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  /** Text to copy to clipboard (alias for `text`) */
  value?: string;
  /** Text to copy to clipboard */
  text?: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, text, label = "Sao chép", className }: CopyButtonProps) {
  const content = text ?? value ?? "";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-[#1F2022] border border-white/[0.08] px-2.5 py-1 text-xs font-mono text-[#E3E2E5] hover:bg-[#292A2C] hover:border-white/[0.16] transition-all cursor-pointer select-none",
        copied && "text-[#27C98F] border-[#27C98F]/40",
        className
      )}
      title="Sao chép vào clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#27C98F]" />
          <span>Đã chép</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-[#9BA1B0]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
