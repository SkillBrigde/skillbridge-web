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
  services: { label: string; price: string }[];
  availableSlot?: string;
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
  const cleanSlot = availableSlot ? availableSlot.replace(/^trống\s+/i, "") : null;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-[#e5e2de] p-5 sm:p-6 transition-all hover:border-[#d4c3e7] hover:shadow-[0_8px_24px_rgba(101,81,164,0.06)] group h-full flex flex-col justify-between",
        className
      )}
    >
      {/* Top Section: Avatar, Info, and Service Badges */}
      <div className="flex-1">
        {/* Header: Avatar + Name + Role */}
        <div className="flex items-start gap-3.5 mb-4">
          <Avatar src={avatarSrc} alt={name} size="lg" online={online} shape="rounded" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-[#27252d] truncate">
                {name}
              </h3>
              {verified && (
                <BadgeCheck className="h-4.5 w-4.5 text-[#6551a4] flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#5e5866] mt-0.5">{role}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
              <span className="text-xs font-mono font-semibold text-[#27252d]">
                {rating.toFixed(2)}
              </span>
              <span className="text-xs text-[#5e5866]">
                ({reviewCount} đánh giá) • {sessionCount} Buổi học
              </span>
            </div>
          </div>
        </div>

        {/* Service badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {services.map((service) => (
            <Badge key={service.label} variant="neutral">
              {service.label} ({service.price})
            </Badge>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 pt-3 border-t border-[#f1efea] flex flex-col justify-end">
        {/* Available slot */}
        {cleanSlot && (
          <div className="mb-3">
            <Badge variant="escrow" dot>
              Khung giờ trống: {cleanSlot}
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
    </div>
  );
}

export const MentorProfileCard = MentorCard;
