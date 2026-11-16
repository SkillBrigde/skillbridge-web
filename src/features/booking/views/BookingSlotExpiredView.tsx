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
    return availableSlots(state, mentor.id, now, 4);
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
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-12">
      <div className="w-full max-w-[540px] rounded-2xl bg-white border border-[#f4dfad] p-8 text-center shadow-md relative">
        {/* Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fdf6e7] border border-[#f4dfad] mb-4 text-[#946200]">
          <Clock className="h-8 w-8" />
        </div>

        {/* Badge */}
        <div className="mb-3">
          <Badge variant="pending" dot>
            REDIS ATOMIC LOCK EXPIRED
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#27252d] tracking-tight mb-2">
          Khung Giờ Đã Hết Hạn Khóa Độc Quyền
        </h1>

        {/* Explanation */}
        <p className="text-sm text-[#5e5866] leading-relaxed mb-6">
          Thời hạn giữ chỗ 10 phút trên Redis cho đơn đặt{" "}
          <span className="font-semibold text-[#27252d]">
            [{booking ? booking.serviceName : "Khung giờ"}]
          </span>{" "}
          đã kết thúc. Để đảm bảo tính công bằng, slot đã được giải phóng trở lại lịch trống của chuyên gia.
        </p>

        {/* Live Availability */}
        <div className="text-left mb-6">
          <p className="text-xs font-semibold text-[#5e5866] uppercase tracking-wider mb-3">
            Chọn khung giờ còn trống để khóa lại và tiếp tục:
          </p>
          <div className="space-y-2">
            {altSlots.length === 0 ? (
              <div className="p-4 rounded-xl border border-[#e5e2de] bg-[#faf9f6] text-center text-xs text-[#5e5866]">
                Hiện không còn slot trống nào trong tuần này.
              </div>
            ) : (
              altSlots.map((slot, idx) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleReLock(slot.id)}
                  className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-sm font-medium transition-all cursor-pointer ${
                    idx === 0
                      ? "bg-[#ece5f5]/30 border-[#b3a0d1] text-[#6551a4] hover:bg-[#ece5f5]/60"
                      : "bg-white border-[#e5e2de] text-[#5e5866] hover:border-[#d4c3e7] hover:text-[#27252d]"
                  }`}
                >
                  <span className="font-mono text-xs font-semibold">
                    {slotTimeLabel(slot.startMs, slot.endMs)} ({slotDateLabel(slot.startMs)})
                  </span>
                  {idx === 0 ? (
                    <Badge variant="brand">Khóa lại ngay</Badge>
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
            Quay lại danh sách Chuyên gia
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function BookingSlotExpiredView() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-mono text-[#5e5866]">Đang tải...</div>}>
      <SlotExpiredContent />
    </Suspense>
  );
}

export { BookingSlotExpiredView as default };
