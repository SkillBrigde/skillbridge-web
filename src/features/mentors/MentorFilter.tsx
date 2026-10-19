"use client";

import React from "react";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORIES, PRICE_OPTIONS } from "@/constants/mentorFilters";

export interface MentorFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceFilter: string;
  onPriceFilterChange: (price: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (verified: boolean) => void;
}

export function MentorFilter({
  activeCategory,
  onCategoryChange,
  priceFilter,
  onPriceFilterChange,
  verifiedOnly,
  onVerifiedOnlyChange,
}: MentorFilterProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 mb-8">
      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
              activeCategory === cat
                ? "bg-[#5E6AD2] text-white border border-[#5E6AD2] shadow-sm shadow-[#5E6AD2]/20"
                : "bg-[#14171D] text-[#9BA1B0] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#F0F2F5]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Price range selector */}
      <div className="relative">
        <select
          value={priceFilter}
          onChange={(e) => onPriceFilterChange(e.target.value)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171D] text-[#9BA1B0] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#F0F2F5] transition-all cursor-pointer appearance-none pr-7 focus:outline-none focus:border-[#5E6AD2]"
        >
          {PRICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#14171D] text-[#E3E2E5]">
              {opt.label}
            </option>
          ))}
        </select>
        <Filter className="h-3 w-3 text-[#5D6474] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Verified only checkbox */}
      <Checkbox
        label="Chỉ hiện Verified Mentor (Tích Xanh)"
        checked={verifiedOnly}
        onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
        className="ml-auto"
      />
    </section>
  );
}
