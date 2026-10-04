import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Star } from "lucide-react";

export interface MentorCardProps {
  name: string;
  avatarSrc?: string;
  verified?: boolean;
  online?: boolean;
  role: string;
  rating: number;
  reviewCount: number;
  sessionCount: number;
  /** Productized service tag pills */
  services: { label: string; price: string }[];
  /** Available slot text */
  availableSlot?: string;
  /** "Xem Hồ Sơ & Đặt Lịch" click handler */
  onViewProfile?: () => void;
  className?: string;
}

export function MentorCard({
  name,
  avatarSrc,
  verified = false,
  online = false,
  role,
  rating,
  reviewCount,
  sessionCount,
  services,
  availableSlot,
  onViewProfile,
  className,
}: MentorCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#14171D] border border-white/[0.08] p-5 transition-all hover:bg-[#171A21] hover:border-white/[0.14] group",
        className
      )}
    >
      {/* Header: Avatar + Name + Role */}
      <div className="flex items-start gap-3.5 mb-3.5">
        <Avatar src={avatarSrc} alt={name} size="lg" online={online} shape="rounded" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-[#F0F2F5] truncate">
              {name}
            </h3>
            {verified && (
              <BadgeCheck className="h-4.5 w-4.5 text-[#5E6AD2] flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-[#9BA1B0] mt-0.5">{role}</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
            <span className="text-xs font-mono text-[#F0F2F5]">
              {rating.toFixed(2)}
            </span>
            <span className="text-xs text-[#5D6474]">
              ({reviewCount} reviews) • {sessionCount} Sessions
            </span>
          </div>
        </div>
      </div>

      {/* Service badges */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {services.map((service) => (
          <Badge key={service.label} variant="neutral">
            {service.label} ({service.price})
          </Badge>
        ))}
      </div>

      {/* Available slot */}
      {availableSlot && (
        <div className="mb-3.5">
          <Badge variant="escrow" dot>
            Trống {availableSlot}
          </Badge>
        </div>
      )}

      {/* CTA */}
      <Button
        variant="primary"
        size="sm"
        className="w-full"
        onClick={onViewProfile}
      >
        Xem Hồ Sơ & Đặt Lịch
      </Button>
    </div>
  );
}
