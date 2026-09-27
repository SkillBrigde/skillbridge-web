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
  /** Duration text, e.g. "45 phút" or "1 Tháng (4 Buổi)" */
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
  2: "Tier 2 • Phổ biến nhất",
  3: "Tier 3 • Transformation",
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
        "relative rounded-xl border p-5 flex flex-col transition-all",
        featured
          ? "bg-[#14171D] border-[#5E6AD2]/40 ring-1 ring-[#5E6AD2]/20"
          : "bg-[#14171D] border-white/[0.08] hover:border-white/[0.14]",
        className
      )}
    >
      {/* Tier label */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={featured ? "brand" : "neutral"}>
          {tierLabels[tier]}
        </Badge>
        {featured && (
          <span className="text-[10px] font-mono text-[#5E6AD2] uppercase tracking-wider">
            Top Pick
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[#F0F2F5] tracking-tight mb-1">
        {title}
      </h3>

      {/* Duration + Price */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-xs text-[#9BA1B0]">{duration}</span>
        <span className="text-xs text-[#5D6474]">•</span>
        <span className="font-mono text-lg font-bold text-[#F0F2F5] tracking-tight">
          {price}
        </span>
      </div>

      {/* Deliverables */}
      <div className="space-y-2 mb-5 flex-1">
        <p className="text-[11px] font-medium text-[#5D6474] uppercase tracking-wider">
          Cam kết đầu ra
        </p>
        {deliverables.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-2 text-sm text-[#9BA1B0]"
          >
            <Check className="h-3.5 w-3.5 text-[#27C98F] flex-shrink-0 mt-0.5" />
            <span>{item.label}</span>
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
