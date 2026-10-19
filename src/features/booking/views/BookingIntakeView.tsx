"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
  Input,
  EmptyState,
} from "@/components/ui";
import { SlotPicker, type SlotOption } from "@/components/ui/slot-picker";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { Calendar, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAppState, useNow, actions, mentorSlotsForPicker } from "@/lib/store";
import { vnd, slotDateLabel, slotTimeLabel } from "@/lib/domain";

const QUICK_CHIPS = [
  "System Design Event-Driven & Microservices scale 100k CCU",
  "Tối ưu CV Senior .NET/Go chuẩn FAANG & kiến trúc phân tán",
  "Nghẽn DB PostgreSQL 10k RPS, deadlocks và query plan",
];

export function BookingIntakeView() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const state = useAppState();
  const now = useNow("second");

  const bookingId = params.bookingId;
  const booking = useMemo(
    () => state.bookings.find((b) => b.id === bookingId),
    [state.bookings, bookingId]
  );

  const mentor = useMemo(
    () => (booking ? state.mentors.find((m) => m.id === booking.mentorId) : null),
    [state.mentors, booking]
  );

  const [issue, setIssue] = useState(booking?.intake?.coreIssue || "");
  const [link, setLink] = useState(booking?.intake?.link || "https://github.com/");
  const [expectation, setExpectation] = useState(
    booking?.intake?.expectation || "Nắm chắc cách giải bài toán System Design và tự tin pass vòng kỹ thuật"
  );
  const [selectedSlotId, setSelectedSlot] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const slotOptions: SlotOption[] = useMemo(() => {
    if (!booking) return [];
    const list = mentorSlotsForPicker(state, booking.mentorId, booking.id, now, 12);
    return list.map(({ slot, available }) => ({
      id: slot.id,
      date: slotDateLabel(slot.startMs),
      time: slotTimeLabel(slot.startMs, slot.endMs),
      available,
    }));
  }, [state, booking, now]);

  const selectedSlot = selectedSlotId || booking?.slotId || slotOptions.find((s) => s.available)?.id || "";

  if (!booking || !mentor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy đơn đặt lịch"
          description="Đơn đặt lịch không tồn tại hoặc đã hết hạn."
          action={{
            label: "Quay lại danh sách mentors",
            onClick: () => router.push("/mentors"),
          }}
        />
      </div>
    );
  }

  const handleProceed = () => {
    setErrorMsg("");

    if (issue.trim().length < 30) {
      setErrorMsg("Vui lòng mô tả chi tiết vấn đề kỹ thuật (tối thiểu 30 ký tự).");
      return;
    }

    if (!link.trim() || !link.startsWith("http")) {
      setErrorMsg("Vui lòng cung cấp link hợp lệ (bắt đầu bằng http:// hoặc https://).");
      return;
    }

    if (expectation.trim().length < 10) {
      setErrorMsg("Vui lòng nêu kỳ vọng kết quả cụ thể (tối thiểu 10 ký tự).");
      return;
    }

    if (!selectedSlot) {
      setErrorMsg("Vui lòng chọn một khung giờ (slot) còn trống.");
      return;
    }

    const res = actions.lockSlot(booking.id, selectedSlot, {
      coreIssue: issue.trim(),
      link: link.trim(),
      expectation: expectation.trim(),
    });

    if (!res.ok) {
      setErrorMsg(res.error || "Không thể khóa slot. Vui lòng thử chọn slot khác.");
      return;
    }

    router.push(`/checkout/${booking.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Top Summary ── */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
        <span className="text-xs font-mono text-[#5D6474]">Đơn #{booking.code}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-[#14171D] border border-white/[0.08]">
        <Avatar src={mentor.avatarUrl} alt={booking.mentorName} size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            {booking.serviceName} ({booking.durationLabel})
          </h1>
          <p className="text-xs text-[#9BA1B0]">
            Mentor: <span className="text-[#F0F2F5] font-medium">{booking.mentorName}</span> • Tạm tính:{" "}
            <span className="font-mono text-[#27C98F] font-semibold">
              {vnd(booking.priceVnd)}
            </span>
          </p>
        </div>
      </div>

      {/* ── Notice ── */}
      <NoticeBanner variant="info" className="mb-8">
        Khảo sát bắt buộc để Mentor nghiên cứu case trước giờ học, cam kết 100%
        thời lượng vào giải pháp thay vì tìm hiểu bối cảnh.
      </NoticeBanner>

      {errorMsg && (
        <div className="mb-6">
          <NoticeBanner variant="error" message={errorMsg} />
        </div>
      )}

      {/* ── 3 Mandatory Fields ── */}
      <section className="space-y-6 mb-10">
        {/* Q1 */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            1. Vấn đề hoặc mục tiêu kỹ thuật lớn nhất bạn muốn giải quyết?{" "}
            <span className="text-[#FF5C5C]">*</span>
          </label>
          <Textarea
            placeholder="Mô tả chi tiết vấn đề kỹ thuật bạn đang gặp... (Tối thiểu 30 ký tự)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            rows={4}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-xs text-[#5D6474] mb-2">
            <span>Gợi ý mẫu câu nhanh:</span>
            <span className={issue.length < 30 ? "text-[#FF5C5C]" : "text-[#27C98F]"}>
              {issue.length}/30 ký tự tối thiểu
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setIssue(chip)}
                className="inline-flex items-center rounded-full bg-[#14171D] border border-white/[0.08] px-2.5 py-1 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#1F2022] hover:border-white/[0.14] transition-all cursor-pointer select-none"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            2. Link GitHub repo, Figma hoặc CV Drive đính kèm{" "}
            <span className="text-[#FF5C5C]">*</span>
          </label>
          <Input
            type="url"
            placeholder="https://github.com/..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            3. Kỳ vọng kết quả cụ thể sau buổi Mentoring?{" "}
            <span className="text-[#FF5C5C]">*</span>
          </label>
          <Input
            value={expectation}
            onChange={(e) => setExpectation(e.target.value)}
            placeholder="Ví dụ: Nắm vững kiến trúc cache và tự tin pass vòng System Design..."
          />
        </div>
      </section>

      {/* ── Slot Selection Grid ── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Calendar className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-base font-semibold text-[#F0F2F5] tracking-tight">
            Chọn Khung Giờ (Slot)
          </h2>
          <span className="text-xs text-[#5D6474]">
            Múi giờ Asia/Ho_Chi_Minh (UTC+7)
          </span>
          <Badge variant="escrow" dot pulse className="ml-auto">
            Live Redis Availability
          </Badge>
        </div>

        {slotOptions.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#9BA1B0] rounded-xl border border-white/[0.08] bg-[#14171D]">
            Hiện chưa có slot trống nào trong 14 ngày tới. Vui lòng liên hệ hỗ trợ hoặc chọn mentor khác.
          </div>
        ) : (
          <SlotPicker
            slots={slotOptions}
            selectedId={selectedSlot}
            onChange={setSelectedSlot}
          />
        )}
      </section>

      {/* ── Footer ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
        <p className="text-xs text-[#5D6474] flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#F5A623]" />
          Khung giờ sẽ được khóa 10 phút trên Redis để đảm bảo tính công bằng
        </p>
        <Button variant="primary" size="lg" onClick={handleProceed}>
          Khóa Slot &amp; Sang Thanh Toán →
        </Button>
      </div>
    </div>
  );
}

export { BookingIntakeView as default };
