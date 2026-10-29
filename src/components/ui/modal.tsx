"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Scrim backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-[#faf9f6] border border-[#e5e2de] p-6 sm:p-7 shadow-2xl text-[#27252d] animate-fade-in",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#e5e2de]">
          <div>
            {title && (
              <h3 className="font-semibold text-lg text-[#27252d] tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-[#5e5866] leading-relaxed">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#5e5866] hover:bg-[#f1efea] hover:text-[#27252d] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}
