"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate visible page numbers with ellipsis
  const getPages = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9BA1B0] hover:bg-[#1F2022] hover:text-[#F0F2F5] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-8 w-8 items-center justify-center text-xs text-[#5D6474]"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-mono font-medium transition-all cursor-pointer",
              page === currentPage
                ? "bg-[#5E6AD2] text-white shadow-sm shadow-[#5E6AD2]/20"
                : "text-[#9BA1B0] hover:bg-[#1F2022] hover:text-[#F0F2F5]"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9BA1B0] hover:bg-[#1F2022] hover:text-[#F0F2F5] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
