import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export interface ServiceDeliverable {
  label: string;
}

export interface ServiceTierCardProps {
  /** Tier level: 1 (Quick Win), 2 (High Impact), 3 (Transformation) */
  tier: 1 | 2 | 3;
  /** Service package name */
  title: string;
  /** Duration text, e.g. "45 phút" or "5 Buổi Lộ Trình" */
  duration: string;
  /** Formatted price, e.g. "300.000 ₫" */
  price: string;
  /** Whether this tier is featured / top pick (typically Tier 2) */
  featured?: boolean;
  /** List of deliverables */
  deliverables: ServiceDeliverable[];
  /** CTA button label */
  ctaLabel?: string;
  /** CTA click handler */
  onSelect?: () => void;
  className?: string;
}

const tierLabels: Record<number, string> = {
  1: "Tier 1 • Quick Win",
  2: "Tier 2 • Phổ Biến Nhất",
  3: "Tier 3 • Lộ Trình Dài Hạn",
};

export function ServiceTierCard({
  tier,
  title,
  duration,
  price,
  featured = false,
  deliverables,
  ctaLabel = "Chọn Gói Này",
  onSelect,
  className,
}: ServiceTierCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 flex flex-col transition-all bg-white shadow-sm",
        featured
          ? "border-[#6551a4] shadow-md ring-1 ring-[#6551a4]/20"
          : "border-[#e5e2de] hover:border-[#d4c3e7]",
        className
      )}
    >
      {/* Tier label */}
      <div className="flex items-center justify-between mb-3.5">
        <Badge variant={featured ? "brand" : "neutral"}>
          {tierLabels[tier]}
        </Badge>
        {featured && (
          <span className="text-[10px] font-mono font-semibold text-[#6551a4] uppercase tracking-wider bg-[#ece5f5] px-2 py-0.5 rounded-full">
            Đề Xuất
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-[#27252d] tracking-tight mb-1">
        {title}
      </h3>

      {/* Duration + Price */}
      <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-[#f1efea]">
        <span className="text-xs text-[#5e5866]">{duration}</span>
        <span className="text-xs text-[#cfc9c2]">•</span>
        <span className="font-mono text-xl font-bold text-[#6551a4] tracking-tight">
          {price}
        </span>
      </div>

      {/* Deliverables */}
      <div className="space-y-2.5 mb-6 flex-1">
        <p className="text-[11px] font-semibold text-[#5e5866] uppercase tracking-wider">
          Cam kết đầu ra cụ thể
        </p>
        {deliverables.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-[#27252d]"
          >
            <Check className="h-4 w-4 text-[#1e7e45] flex-shrink-0 mt-0.5 stroke-[2.5]" />
            <span className="leading-snug">{item.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button
        variant={featured ? "primary" : "secondary"}
        className="w-full"
        onClick={onSelect}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}

export const BookingServiceTierCard = ServiceTierCard;
