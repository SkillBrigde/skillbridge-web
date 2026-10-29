import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export type BookingStatus =
  | "confirmed"
  | "pending_review"
  | "completed"
  | "disputed"
  | "pending_payment"
  | "cancelled";

export interface BookingCardProps {
  bookingCode: string;
  status: BookingStatus;
  mentorName: string;
  mentorAvatar?: string;
  service: string;
  time: string;
  countdown?: string;
  rating?: number;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

import { getBookingStatusInfo } from "@/lib/domain";

export function BookingCard({
  bookingCode,
  status,
  mentorName,
  mentorAvatar,
  service,
  time,
  countdown,
  rating,
  primaryAction,
  secondaryAction,
  className,
}: BookingCardProps) {
  const statusInfo = getBookingStatusInfo(status);

  return (
    <div
      className={cn(
        "rounded-xl bg-white border p-5 sm:p-6 transition-all shadow-sm",
        status === "confirmed"
          ? "border-[#bde6ca]"
          : status === "pending_review"
          ? "border-[#f4dfad]"
          : status === "disputed"
          ? "border-[#f5cac2]"
          : status === "pending_payment"
          ? "border-[#d4c3e7]"
          : "border-[#e5e2de]",
        status === "cancelled" && "opacity-75 bg-[#faf9f6]",
        className
      )}
    >
      {/* Header: Code + Status */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3.5">
        <span className="text-xs font-mono font-semibold text-[#5e5866]">{bookingCode}</span>
        <Badge variant={statusInfo.variant} dot>
          {statusInfo.label}
          {countdown && ` (${countdown})`}
        </Badge>
      </div>

      {/* Mentor + Service info */}
      <div className="flex items-center gap-3.5 mb-3.5">
        <Avatar src={mentorAvatar} alt={mentorName} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[#27252d] truncate">
            {mentorName}
          </p>
          <p className="text-xs text-[#5e5866] truncate mt-0.5">{service}</p>
        </div>
      </div>

      {/* Time */}
      <p className="text-xs text-[#5e5866] mb-4 font-mono">{time}</p>

      {/* Rating for completed */}
      {status === "completed" && rating && (
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "text-sm",
                i < rating ? "text-[#f5a623]" : "text-[#e5e2de]"
              )}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-[#5e5866] ml-1 font-medium">(Đã đánh giá)</span>
        </div>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2.5 flex-wrap pt-2 border-t border-[#f1efea]">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const BookingSessionCard = BookingCard;
