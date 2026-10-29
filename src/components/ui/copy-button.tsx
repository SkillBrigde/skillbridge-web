"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  text?: string;
  label?: string;
  className?: string;
}

export function CopyButton({
  value,
  text,
  label = "Sao chép",
  className,
  "aria-label": ariaLabel,
  ...props
}: CopyButtonProps) {
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

  const computedAriaLabel = ariaLabel ?? (copied ? "Đã sao chép nội dung" : `Sao chép ${content}`);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={computedAriaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md bg-[#f1efea] border border-[#e5e2de] px-3 py-1.5 text-xs font-mono text-[#27252d] hover:bg-[#e7e3dc] transition-all cursor-pointer select-none focus:outline-none focus-visible:outline-2 focus-visible:outline-[#9982d2] min-h-[32px]",
        copied && "text-[#1e7e45] border-[#bde6ca] bg-[#e8f5ed]",
        className
      )}
      title="Sao chép vào clipboard"
      {...props}
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
