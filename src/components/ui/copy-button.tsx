"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  value?: string;
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
        "inline-flex items-center gap-1.5 rounded-md bg-[#f1efea] border border-[#e5e2de] px-2.5 py-1 text-xs font-mono text-[#27252d] hover:bg-[#e7e3dc] transition-all cursor-pointer select-none",
        copied && "text-[#1e7e45] border-[#bde6ca] bg-[#e8f5ed]",
        className
      )}
      title="Sao chép vào clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#1e7e45]" />
          <span>Đã chép</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-[#5e5866]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
