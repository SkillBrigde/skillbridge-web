import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export type BookingStatus =
  | "confirmed"
  | "pending_review"
  | "completed"
  | "disputed";

export interface BookingCardProps {
  /** Booking code, e.g. "#SB-2026-98124" */
  bookingCode: string;
  status: BookingStatus;
  /** Mentor name */
  mentorName: string;
  mentorAvatar?: string;
  /** Service description */
  service: string;
  /** Session time text */
  time: string;
  /** Optional countdown text, e.g. "Còn 2 ngày" or "Còn 18h" */
  countdown?: string;
  /** Star rating if completed */
  rating?: number;
  /** Primary action */
  primaryAction?: { label: string; onClick: () => void };
  /** Secondary / ghost action */
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; variant: "escrow" | "pending" | "neutral" | "dispute" }
> = {
  confirmed: { label: "Đã xác nhận", variant: "escrow" },
  pending_review: { label: "Chờ Nghiệm Thu Escrow", variant: "pending" },
  completed: { label: "Đã Hoàn Tất", variant: "neutral" },
  disputed: { label: "Đang Khiếu Nại", variant: "dispute" },
};

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
  const statusInfo = statusConfig[status];

  return (
    <div
      className={cn(
        "rounded-xl bg-[#14171D] border p-5 transition-colors",
        status === "confirmed"
          ? "border-[#27C98F]/25"
          : status === "pending_review"
          ? "border-[#F5A623]/25"
          : status === "disputed"
          ? "border-[#FF5C5C]/25"
          : "border-white/[0.08]",
        className
      )}
    >
      {/* Header: Code + Status */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <span className="text-xs font-mono text-[#5D6474]">{bookingCode}</span>
        <Badge variant={statusInfo.variant} dot>
          {statusInfo.label}
          {countdown && ` (${countdown})`}
        </Badge>
      </div>

      {/* Mentor + Service info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={mentorAvatar} alt={mentorName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#F0F2F5] truncate">
            {mentorName}
          </p>
          <p className="text-xs text-[#9BA1B0] truncate">{service}</p>
        </div>
      </div>

      {/* Time */}
      <p className="text-xs text-[#9BA1B0] mb-4 font-mono">{time}</p>

      {/* Rating for completed */}
      {status === "completed" && rating && (
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={cn(
                "text-sm",
                i < rating ? "text-[#F5A623]" : "text-[#5D6474]"
              )}
            >
              ★
            </span>
          ))}
          <span className="text-xs text-[#5D6474] ml-1">(Xem đánh giá)</span>
        </div>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2 flex-wrap">
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
              variant="ghost"
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
