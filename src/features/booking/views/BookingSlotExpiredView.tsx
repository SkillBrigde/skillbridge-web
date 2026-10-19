"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button } from "@/components/ui";
import { Clock, RefreshCw } from "lucide-react";
import { useAppState, useNow, actions, availableSlots } from "@/lib/store";
import { slotTimeLabel, slotDateLabel } from "@/lib/domain";

function SlotExpiredContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = useAppState();
  const now = useNow("second");

  const bookingId = searchParams.get("booking") || "";
  const booking = useMemo(() => {
    return state.bookings.find((b) => b.id === bookingId);
  }, [state.bookings, bookingId]);

  const mentor = useMemo(() => {
    return booking ? state.mentors.find((m) => m.id === booking.mentorId) : null;
  }, [state.mentors, booking]);

  const altSlots = useMemo(() => {
    if (!mentor) return [];
    return availableSlots(state, mentor.id, now || Date.now(), 4);
  }, [state, mentor, now]);

  const handleReLock = (slotId: string) => {
    if (!booking) {
      router.push("/mentors");
      return;
    }
    const res = actions.lockSlot(booking.id, slotId, booking.intake || {
      coreIssue: "Tiếp tục đặt lịch sau khi hết hạn giữ chỗ",
      link: "https://github.com/",
      expectation: "Hoàn tất buổi học",
    });
    if (res.ok) {
      router.push(`/checkout/${booking.id}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="w-full max-w-[500px] rounded-2xl bg-[#14171D] border border-[#F5A623]/25 p-8 text-center shadow-2xl relative">
        {/* Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 mb-4 text-[#F5A623]">
          <Clock className="h-8 w-8" />
        </div>

        {/* Badge */}
        <div className="mb-4">
          <Badge variant="pending" dot>
            REDIS ATOMIC LOCK EXPIRED
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-3">
          Khung Giờ Đã Hết Hạn Khóa Độc Quyền
        </h1>

        {/* Explanation */}
        <p className="text-sm text-[#9BA1B0] leading-relaxed mb-6">
          Thời hạn giữ chỗ 10 phút trên Redis cho đơn đặt{" "}
          <span className="font-mono text-[#F5A623]">
            [{booking ? booking.serviceName : "Khung giờ"}]
          </span>{" "}
          đã kết thúc. Để đảm bảo tính công bằng cho các học viên khác, slot đã được giải phóng trở lại lịch trống.
        </p>

        {/* Live Availability */}
        <div className="text-left mb-6">
          <p className="text-xs text-[#5D6474] mb-3">
            Chọn khung giờ còn trống để khóa lại và tiếp tục thanh toán:
          </p>
          <div className="space-y-2">
            {altSlots.length === 0 ? (
              <div className="p-4 rounded-xl border border-white/[0.06] bg-[#0D0E10] text-center text-xs text-[#5D6474]">
                Hiện không còn slot trống nào trong tuần này.
              </div>
            ) : (
              altSlots.map((slot, idx) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleReLock(slot.id)}
                  className={`w-full flex items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all cursor-pointer ${
                    idx === 0
                      ? "bg-[#5E6AD2]/10 border-[#5E6AD2]/30 text-[#F0F2F5] hover:bg-[#5E6AD2]/20"
                      : "bg-[#0D0E10] border-white/[0.08] text-[#9BA1B0] hover:border-white/[0.16] hover:text-[#F0F2F5]"
                  }`}
                >
                  <span className="font-mono text-xs">
                    {slotTimeLabel(slot.startMs, slot.endMs)} ({slotDateLabel(slot.startMs)})
                  </span>
                  {idx === 0 ? (
                    <Badge variant="escrow">Khóa lại ngay</Badge>
                  ) : (
                    <Badge variant="neutral">Khả dụng</Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {altSlots.length > 0 && (
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-3"
            onClick={() => handleReLock(altSlots[0].id)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Tiếp Tục Đặt Lại Khung Giờ Này
          </Button>
        )}

        <Link href="/mentors">
          <Button variant="ghost" size="sm" className="w-full">
            Quay lại danh sách Mentors
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function BookingSlotExpiredView() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-mono text-[#9BA1B0]">Đang tải...</div>}>
      <SlotExpiredContent />
    </Suspense>
  );
}

export { BookingSlotExpiredView as default };
