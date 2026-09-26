"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Star,
  Video,
  CalendarClock,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Currency } from "@/components/ui";

type FilterTab = "all" | "upcoming" | "pending" | "completed" | "disputed";

const FILTER_TABS: { id: FilterTab; label: string; count: number }[] = [
  { id: "all", label: "Tất cả", count: 3 },
  { id: "upcoming", label: "Sắp diễn ra", count: 1 },
  { id: "pending", label: "Chờ nghiệm thu", count: 1 },
  { id: "completed", label: "Đã hoàn thành", count: 1 },
  { id: "disputed", label: "Đang khiếu nại", count: 0 },
];

const BOOKINGS = [
  {
    id: "sb-2026-98124",
    bookingCode: "#SB-2026-98124",
    status: "confirmed" as const,
    statusLabel: "Đã xác nhận (Confirmed)",
    mentorName: "Nguyễn Văn An",
    mentorTitle: "Tech Lead @ VNG",
    serviceName: "Mock Interview System Design (60 phút)",
    schedule: "19:30 Thứ 6, 18/09/2026",
    timeLeft: "Còn 2 ngày",
    amount: 450000,
    filterGroup: "upcoming" as FilterTab,
  },
  {
    id: "sb-2026-97500",
    bookingCode: "#SB-2026-97500",
    status: "pendingReview" as const,
    statusLabel: "Chờ Nghiệm Thu Escrow (Còn 18h)",
    mentorName: "Lê Hoàng Nam",
    mentorTitle: "Senior DevOps @ AWS Hero",
    serviceName: "Review CV Senior",
    schedule: "15/09/2026 20:00",
    timeLeft: "Còn 18h",
    amount: 300000,
    filterGroup: "pending" as FilterTab,
  },
  {
    id: "sb-2026-96100",
    bookingCode: "#SB-2026-96100",
    status: "completed" as const,
    statusLabel: "Đã Hoàn Tất",
    mentorName: "Trần Minh Đức",
    mentorTitle: "Principal Engineer @ Techcombank",
    serviceName: "Kiểm định High-load Core Banking",
    schedule: "12/09/2026 19:00",
    timeLeft: "",
    amount: 500000,
    filterGroup: "completed" as FilterTab,
    rating: 5,
  },
];

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="escrow" dot pulse>
          Đã xác nhận (Confirmed)
        </Badge>
      );
    case "pendingReview":
      return (
        <Badge variant="pending" dot pulse>
          Chờ Nghiệm Thu Escrow (Còn 18h)
        </Badge>
      );
    case "completed":
      return <Badge variant="neutral">Đã Hoàn Tất</Badge>;
    case "disputed":
      return (
        <Badge variant="dispute" dot pulse>
          Đang Khiếu Nại
        </Badge>
      );
    default:
      return null;
  }
}

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = React.useState<FilterTab>("all");

  const filteredBookings =
    activeFilter === "all"
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.filterGroup === activeFilter);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Lịch Học Của Tôi
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Quản lý đặt lịch, nghiệm thu Escrow và lịch sử buổi học
          </p>
        </div>
        <Link href="/mentors">
          <Button variant="primary" size="sm">
            <Calendar className="h-3.5 w-3.5" />
            Đặt Lịch Mới
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-[#0D0E10] border border-white/[0.06] p-1 mb-6 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer select-none whitespace-nowrap ${
              activeFilter === tab.id
                ? "bg-[#1F2022] text-[#F0F2F5] border border-white/[0.08] shadow-sm"
                : "text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#14171D]"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                activeFilter === tab.id
                  ? "bg-[#5E6AD2] text-white"
                  : "bg-[#292A2C] text-[#9BA1B0]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card
            key={booking.id}
            className={`p-0 overflow-hidden ${
              booking.status === "confirmed"
                ? "ring-1 ring-[#27C98F]/20"
                : booking.status === "pendingReview"
                ? "ring-1 ring-[#F5A623]/15"
                : ""
            }`}
          >
            {/* Top status bar */}
            {booking.status === "confirmed" && (
              <div className="h-0.5 bg-gradient-to-r from-[#27C98F] to-[#5E6AD2]" />
            )}
            {booking.status === "pendingReview" && (
              <div className="h-0.5 bg-gradient-to-r from-[#F5A623] to-[#F5A623]/40" />
            )}

            <div className="p-5">
              {/* Top Row: Code + Status */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#5D6474]">
                    {booking.bookingCode}
                  </span>
                  <StatusBadge status={booking.status} />
                </div>
                <Currency
                  amount={booking.amount}
                  highlight={
                    booking.status === "pendingReview" ? "amber" : "default"
                  }
                  size="sm"
                />
              </div>

              {/* Mentor + Service Info */}
              <div className="flex items-start gap-4 mb-4">
                <Avatar size="md" alt={booking.mentorName} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#F0F2F5]">
                    {booking.mentorName}
                  </p>
                  <p className="text-[11px] text-[#5D6474] mb-1">
                    {booking.mentorTitle}
                  </p>
                  <p className="text-xs text-[#9BA1B0]">
                    Dịch vụ: {booking.serviceName}
                  </p>
                </div>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 mb-4 rounded-lg bg-[#0F1115] border border-white/[0.04] px-3 py-2">
                <CalendarClock className="h-4 w-4 text-[#5E6AD2]" />
                <span className="text-xs font-mono text-[#F0F2F5]">
                  {booking.schedule}
                </span>
                {booking.timeLeft && (
                  <>
                    <span className="text-white/10">•</span>
                    <span
                      className={`text-xs font-mono font-medium ${
                        booking.status === "pendingReview"
                          ? "text-[#F5A623]"
                          : "text-[#27C98F]"
                      }`}
                    >
                      {booking.timeLeft}
                    </span>
                  </>
                )}
              </div>

              {/* Completed rating */}
              {booking.status === "completed" && booking.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < booking.rating!
                          ? "fill-[#F5A623] text-[#F5A623]"
                          : "text-[#5D6474]"
                      }`}
                    />
                  ))}
                  <Link
                    href="#"
                    className="text-[11px] text-[#5E6AD2] hover:underline ml-2"
                  >
                    Xem đánh giá
                  </Link>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
                {booking.status === "confirmed" && (
                  <>
                    <Link href={`/bookings/${booking.id}/room`}>
                      <Button variant="primary" size="sm">
                        <Video className="h-3.5 w-3.5" />
                        Vào Phòng Học Trực Tuyến
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Yêu Cầu Dời Lịch
                    </Button>
                  </>
                )}

                {booking.status === "pendingReview" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-[#27C98F] hover:bg-[#2ED89C] text-white border-[#27C98F]/30"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Xác Nhận Nghiệm Thu
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                      Xem Bằng Chứng Mentor
                    </Button>
                    <Link href="/disputes/new">
                      <Button variant="destructive" size="sm">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Khiếu Nại
                      </Button>
                    </Link>
                  </>
                )}

                {booking.status === "completed" && (
                  <Button variant="secondary" size="sm">
                    <ArrowRight className="h-3.5 w-3.5" />
                    Xem Chi Tiết
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        {/* Empty state */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1F2022] border border-white/[0.08] mx-auto mb-4">
              <Calendar className="h-5 w-5 text-[#5D6474]" />
            </div>
            <p className="text-sm text-[#9BA1B0]">
              Không có buổi học nào trong danh mục này
            </p>
            <Link href="/mentors" className="inline-block mt-3">
              <Button variant="primary" size="sm">
                Khám Phá Mentors
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Escrow Info */}
      <div className="mt-8 rounded-xl bg-[#03BD84]/[0.06] border border-[#27C98F]/15 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-[#27C98F] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#27C98F] uppercase font-mono tracking-wider mb-1">
            Escrow Protection Active
          </p>
          <p className="text-[11px] text-[#9BA1B0] leading-relaxed">
            Tất cả buổi học đều được bảo vệ bởi hệ thống Escrow. Tiền chỉ được giải phóng cho Mentor sau khi bạn xác nhận nghiệm thu hoặc sau 24h không có khiếu nại.
          </p>
        </div>
      </div>
    </div>
  );
}
