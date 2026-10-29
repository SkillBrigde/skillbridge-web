"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Tabs,
  Modal,
  NoticeBanner,
} from "@/components/ui";
import { BookingCard, type BookingStatus } from "@/components/booking-card";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useSession, useNow, actions } from "@/lib/store";
import {
  displayStatus,
  bookingTimeLabel,
  relativeFuture,
  cancelQuote,
  vnd,
  type BookingRec,
} from "@/lib/domain";
import { Clock, Plus } from "lucide-react";

export function BookingPageView() {
  const router = useRouter();
  const state = useAppState();
  const session = useSession();
  const now = useNow("minute");

  const [activeTab, setActiveTab] = useState("all");
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingRec | null>(null);
  const [cancelError, setCancelError] = useState("");

  const myBookings = useMemo(() => {
    if (!session.user) return [];
    return state.bookings
      .filter((b) => b.menteeId === session.user?.id)
      .sort((a, b) => (b.startMs || b.createdAt) - (a.startMs || a.createdAt));
  }, [state.bookings, session.user]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: myBookings.length,
      confirmed: 0,
      pending_review: 0,
      completed: 0,
      disputed: 0,
    };
    for (const b of myBookings) {
      const s = displayStatus(b);
      if (s === "confirmed") counts.confirmed += 1;
      else if (s === "pending_review") counts.pending_review += 1;
      else if (s === "completed") counts.completed += 1;
      else if (s === "disputed") counts.disputed += 1;
    }
    return counts;
  }, [myBookings]);

  const tabItems = [
    { id: "all", label: "Tất cả", badge: tabCounts.all },
    { id: "confirmed", label: "Sắp diễn ra", badge: tabCounts.confirmed },
    { id: "pending_review", label: "Chờ nghiệm thu", badge: tabCounts.pending_review },
    { id: "completed", label: "Đã hoàn thành", badge: tabCounts.completed },
    { id: "disputed", label: "Đang khiếu nại", badge: tabCounts.disputed },
  ];

  const filtered = useMemo(() => {
    if (activeTab === "all") return myBookings;
    return myBookings.filter((b) => displayStatus(b) === activeTab);
  }, [myBookings, activeTab]);

  const getActions = (b: BookingRec) => {
    const st = displayStatus(b);

    if (st === "confirmed") {
      return {
        primaryAction: {
          label: "Vào Phòng Học Trực Tuyến",
          onClick: () => router.push(`/bookings/${b.id}/room`),
        },
        secondaryAction: {
          label: "Hủy / Dời Lịch",
          onClick: () => {
            setCancelModalBooking(b);
            setCancelError("");
          },
        },
      };
    }
    if (st === "pending_review") {
      return {
        primaryAction: {
          label: "Xác Nhận Nghiệm Thu Escrow",
          onClick: () => router.push(`/bookings/${b.id}/room`),
        },
        secondaryAction: {
          label: "Mở Khiếu Nại",
          onClick: () => router.push(`/disputes/new?booking=${b.id}`),
        },
      };
    }
    if (st === "completed") {
      return {
        primaryAction: {
          label: b.reviewId ? "Xem Đánh Giá Đã Gửi" : "Đánh Giá Buổi Học ★",
          onClick: () => router.push(`/reviews/${b.id}`),
        },
        secondaryAction: {
          label: "Đặt Lịch Tiếp",
          onClick: () => router.push(`/mentors/${b.mentorId}`),
        },
      };
    }
    if (st === "disputed") {
      return {
        primaryAction: {
          label: "Chi Tiết Khiếu Nại",
          onClick: () => router.push(`/disputes/${b.disputeId || "DISP-" + b.id}`),
        },
      };
    }
    if (st === "pending_payment") {
      return {
        primaryAction: {
          label: "Thanh Toán Ngay",
          onClick: () => router.push(`/checkout/${b.id}`),
        },
      };
    }
    return {};
  };

  const handleCancelBooking = (bookingId: string) => {
    const res = actions.cancelBooking(bookingId);
    if (!res.ok) {
      setCancelError(res.error || "Hủy lịch không thành công.");
    } else {
      setCancelModalBooking(null);
    }
  };

  return (
    <RequireRole role="mentee" title="Lịch Học Của Bạn" description="Đăng nhập để xem danh sách lịch học và quản lý két ký quỹ Escrow.">
      <div className="sb-container max-w-5xl py-10 sm:py-12">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="sb-eyebrow">KHÔNG GIAN HỌC TẬP</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#27252d] tracking-tight mt-1">
              Lịch Học Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-[#5e5866] mt-1">
              Theo dõi tiến độ buổi học, tham gia phòng họp Google Meet và nghiệm thu giải ngân Két Escrow
            </p>
          </div>
          <Link href="/mentors">
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4 mr-1.5" />
              Đặt Buổi Cố Vấn Mới
            </Button>
          </Link>
        </div>

        {/* ── Status Filter Tabs ── */}
        <Tabs
          items={tabItems}
          activeId={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />

        {/* ── Booking List ── */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-[#e5e2de] bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edf8] border border-[#d4c3e7] text-[#6551a4] mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-[#27252d] mb-1">
                Không có buổi học nào trong mục này
              </h3>
              <p className="text-sm text-[#5e5866] max-w-sm mb-5 leading-relaxed">
                Bạn chưa có đơn đặt lịch nào thuộc trạng thái này. Khám phá các chuyên gia công nghệ để bắt đầu buổi cố vấn.
              </p>
              <Link href="/mentors">
                <Button variant="primary" size="sm">
                  Khám Phá Chuyên Gia Ngay
                </Button>
              </Link>
            </div>
          ) : (
            filtered.map((b) => {
              const mentor = state.mentors.find((m) => m.id === b.mentorId);
              const status = displayStatus(b) as BookingStatus;
              const timeStr = b.startMs && b.endMs
                ? bookingTimeLabel(b.startMs, b.endMs)
                : "Chưa chọn khung giờ";
              const countdown = b.startMs ? relativeFuture(b.startMs, now) : undefined;
              const review = state.reviews.find((r) => r.bookingId === b.id);

              return (
                <BookingCard
                  key={b.id}
                  bookingCode={`#${b.code}`}
                  status={status}
                  mentorName={b.mentorName}
                  mentorAvatar={mentor?.avatarUrl}
                  service={`${b.serviceName} (${b.durationLabel})`}
                  time={timeStr}
                  countdown={status === "confirmed" ? countdown : undefined}
                  rating={review?.averageRating}
                  {...getActions(b)}
                />
              );
            })
          )}
        </div>

        {/* Cancel Modal (Chương 7.1 Ma Trận Hủy Lịch) */}
        {cancelModalBooking && (
          <Modal
            isOpen={true}
            onClose={() => setCancelModalBooking(null)}
            title="Chính Sách Hủy Buổi Học & Hoàn Tiền (Chương 7.1)"
          >
            {(() => {
              const quote = cancelQuote(
                cancelModalBooking.startMs || now,
                now
              );
              const refundVnd = Math.round((cancelModalBooking.priceVnd * quote.refundPercent) / 100);
              return (
                <div className="space-y-4 py-2">
                  <div className="rounded-xl bg-[#faf9f6] border border-[#e5e2de] p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#5e5866]">Học phí đã ký quỹ:</span>
                      <span className="font-mono text-[#27252d] font-semibold">{vnd(cancelModalBooking.priceVnd)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#5e5866]">Tỷ lệ hoàn tiền:</span>
                      <span className="font-mono text-[#1e7e45] font-bold">{quote.refundPercent}%</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1.5 border-t border-[#e5e2de]">
                      <span className="text-[#5e5866]">Số tiền hoàn vào ví SkillBridge:</span>
                      <span className="font-mono text-[#1e7e45] font-bold text-sm">{vnd(refundVnd)}</span>
                    </div>
                  </div>

                  <NoticeBanner variant={quote.refundPercent === 100 ? "info" : "warning"}>
                    {quote.label}
                  </NoticeBanner>

                  {cancelError && <NoticeBanner variant="error" message={cancelError} />}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f1efea]">
                    <Button
                      variant="ghost"
                      onClick={() => setCancelModalBooking(null)}
                    >
                      Giữ Lại Lịch Học
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelBooking(cancelModalBooking.id)}
                    >
                      Xác Nhận Hủy Buổi Học
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Modal>
        )}
      </div>
    </RequireRole>
  );
}

export { BookingPageView as default };
