"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Tabs,
} from "@/components/ui";
import { BookingCard, type BookingStatus } from "@/components/booking-card";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

type BookingItem = {
  id: string;
  bookingCode: string;
  status: BookingStatus;
  mentorName: string;
  service: string;
  time: string;
  countdown?: string;
  rating?: number;
};

const BOOKINGS: BookingItem[] = [
  {
    id: "sb-2026-98124",
    bookingCode: "#SB-2026-98124",
    status: "confirmed",
    mentorName: "Nguyễn Văn An",
    service: "Mock Interview System Design (60 phút)",
    time: "19:30 Thứ 6, 18/09/2026",
    countdown: "Còn 2 ngày",
  },
  {
    id: "sb-2026-97500",
    bookingCode: "#SB-2026-97500",
    status: "pending_review",
    mentorName: "Lê Hoàng Nam",
    service: "Review CV Senior .NET",
    time: "14:00 Thứ 7, 15/09/2026",
    countdown: "Còn 18h",
  },
  {
    id: "sb-2026-96100",
    bookingCode: "#SB-2026-96100",
    status: "completed",
    mentorName: "Trần Thanh Tùng",
    service: "AWS Solutions Architecture (60 phút)",
    time: "09:00 Thứ 7, 12/09/2026",
    rating: 5,
  },
];

const TAB_ITEMS = [
  { id: "all", label: "Tất cả", badge: 3 },
  { id: "confirmed", label: "Sắp diễn ra", badge: 1 },
  { id: "pending_review", label: "Chờ nghiệm thu", badge: 1 },
  { id: "completed", label: "Đã hoàn thành", badge: 1 },
  { id: "disputed", label: "Đang khiếu nại", badge: 0 },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.status === activeTab);

  const getActions = (booking: BookingItem) => {
    switch (booking.status) {
      case "confirmed":
        return {
          primaryAction: { label: "Vào Phòng Học Trực Tuyến", onClick: () => {} },
          secondaryAction: { label: "Yêu Cầu Dời Lịch", onClick: () => {} },
        };
      case "pending_review":
        return {
          primaryAction: { label: "Xác Nhận Nghiệm Thu", onClick: () => {} },
          secondaryAction: { label: "Xem Bằng Chứng Mentor", onClick: () => {} },
        };
      default:
        return {};
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
          Lịch Học Của Tôi
        </h1>
      </div>

      {/* ── Status Filter Tabs ── */}
      <Tabs
        items={TAB_ITEMS}
        activeId={activeTab}
        onChange={setActiveTab}
        className="mb-8"
      />

      {/* ── Booking List ── */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#14171D] border border-white/[0.08] text-[#5D6474] mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#F0F2F5] mb-1">
              Chưa có buổi học nào
            </h3>
            <p className="text-sm text-[#9BA1B0]">
              Khám phá và đặt lịch mentoring với các chuyên gia.
            </p>
            <Link href="/mentors">
              <Button variant="primary" size="sm" className="mt-4">
                Khám Phá Mentors
              </Button>
            </Link>
          </div>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              bookingCode={booking.bookingCode}
              status={booking.status}
              mentorName={booking.mentorName}
              service={booking.service}
              time={booking.time}
              countdown={booking.countdown}
              rating={booking.rating}
              {...getActions(booking)}
            />
          ))
        )}
      </div>
    </div>
  );
}
