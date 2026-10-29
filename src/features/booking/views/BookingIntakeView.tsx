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
import { Calendar, ShieldCheck, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useAppState, useNow, actions, mentorSlotsForPicker } from "@/lib/store";
import { vnd, slotDateLabel, slotTimeLabel } from "@/lib/domain";

const QUICK_CHIPS = [
  "Tối ưu kiến trúc Event-Driven Microservices scale 100k CCU",
  "Review & Tối ưu CV Senior .NET/Java Backend chuẩn ATS",
  "Nghẽn Database PostgreSQL, phân tích query execution plan",
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
    booking?.intake?.expectation || "Nắm chắc cách giải bài toán System Design và tự tin vượt qua phỏng vấn kỹ thuật"
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
      <div className="sb-container py-16">
        <EmptyState
          title="Không tìm thấy đơn đặt lịch"
          description="Đơn đặt lịch không tồn tại hoặc đã hết hạn giữ chỗ."
          action={{
            label: "Quay lại danh sách chuyên gia",
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
      setErrorMsg("Vui lòng cung cấp link tài liệu hợp lệ (bắt đầu bằng http:// hoặc https://).");
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
    <div className="sb-container max-w-4xl py-10 sm:py-12">
      {/* ── Top Summary ── */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="sb-text-link text-xs text-[#5e5866] hover:text-[#6551a4] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
        <span className="text-xs font-mono font-semibold text-[#5e5866]">Đơn #{booking.code}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 p-5 rounded-2xl bg-white border border-[#e5e2de] shadow-sm">
        <Avatar src={mentor.avatarUrl} alt={booking.mentorName} size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#27252d] tracking-tight">
            {booking.serviceName} ({booking.durationLabel})
          </h1>
          <p className="text-xs text-[#5e5866] mt-0.5">
            Cố vấn: <span className="text-[#27252d] font-semibold">{booking.mentorName}</span> • Tạm tính trọn gói:{" "}
            <span className="font-mono text-[#6551a4] font-bold text-sm">
              {vnd(booking.priceVnd)}
            </span>
          </p>
        </div>
      </div>

      {/* ── Notice ── */}
      <NoticeBanner variant="info" className="mb-8">
        <strong>Khảo sát bắt buộc trước giờ học:</strong> Giúp Mentor nghiên cứu tài liệu kỹ thuật trước 15 phút, vào buổi học là đi thẳng vào giải pháp và cam kết đầu ra rõ ràng.
      </NoticeBanner>

      {errorMsg && (
        <div className="mb-6">
          <NoticeBanner variant="error" message={errorMsg} />
        </div>
      )}

      {/* ── 3 Mandatory Fields (Chương 4.2) ── */}
      <section className="space-y-6 mb-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e2de] shadow-sm">
        <div>
          <span className="sb-eyebrow">KHẢO SÁT CHUẨN BỊ (INTAKE FORM)</span>
          <h2 className="text-lg font-bold text-[#27252d] tracking-tight mt-1 mb-6">
            3 Câu Hỏi Bắt Buộc Để Mentor Nghiên Cứu Trước
          </h2>
        </div>

        {/* Q1 */}
        <div>
          <label className="block text-sm font-semibold text-[#27252d] mb-2">
            1. Vấn đề hoặc chủ đề kỹ thuật cốt lõi cần Mentor hỗ trợ?{" "}
            <span className="text-[#a64533]">*</span>
          </label>
          <Textarea
            placeholder="Mô tả chi tiết câu hỏi, rào cản kỹ thuật hoặc tình huống thực tế của bạn... (Tối thiểu 30 ký tự)"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            rows={4}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-xs text-[#5e5866] mb-3">
            <span>Gợi ý mẫu câu nhanh:</span>
            <span className={issue.length < 30 ? "text-[#a64533] font-medium" : "text-[#1e7e45] font-semibold"}>
              {issue.length}/30 ký tự tối thiểu
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setIssue(chip)}
                className="inline-flex items-center rounded-full bg-[#f1efea] border border-[#e5e2de] px-3 py-1 text-xs text-[#5e5866] hover:text-[#6551a4] hover:bg-white hover:border-[#d4c3e7] transition-all cursor-pointer select-none text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-sm font-semibold text-[#27252d] mb-2">
            2. Link GitHub repo, Google Drive CV hoặc sơ đồ hệ thống đính kèm{" "}
            <span className="text-[#a64533]">*</span>
          </label>
          <Input
            type="url"
            placeholder="https://github.com/... hoặc link Google Drive"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-sm font-semibold text-[#27252d] mb-2">
            3. Mục tiêu cụ thể kỳ vọng đạt được sau khi kết thúc 60 phút?{" "}
            <span className="text-[#a64533]">*</span>
          </label>
          <Input
            value={expectation}
            onChange={(e) => setExpectation(e.target.value)}
            placeholder="Ví dụ: Hiểu rõ nguyên lý phân vùng partition PostgreSQL và tự tin vượt qua vòng System Design..."
          />
        </div>
      </section>

      {/* ── Slot Selection Grid ── */}
      <section className="mb-10 bg-white p-6 sm:p-8 rounded-2xl border border-[#e5e2de] shadow-sm">
        <div className="flex items-center gap-2.5 mb-5 flex-wrap">
          <Calendar className="h-5 w-5 text-[#6551a4]" />
          <div>
            <h2 className="text-base font-bold text-[#27252d] tracking-tight">
              Chọn Khung Giờ Rảnh Trong Lịch (Slot)
            </h2>
            <span className="text-xs text-[#5e5866]">
              Múi giờ Asia/Ho_Chi_Minh (UTC+7)
            </span>
          </div>
          <Badge variant="escrow" dot pulse className="ml-auto">
            Live Availability
          </Badge>
        </div>

        {slotOptions.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#5e5866] rounded-xl border border-[#e5e2de] bg-[#faf9f6]">
            Hiện chưa có slot trống nào trong tuần tới. Vui lòng liên hệ hỗ trợ hoặc chọn chuyên gia khác.
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#e5e2de]">
        <p className="text-xs text-[#5e5866] flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-[#6551a4]" />
          Khung giờ sẽ được khóa nguyên tử 10 phút trên Redis để chống giữ chỗ trùng
        </p>
        <Button variant="primary" size="lg" onClick={handleProceed}>
          Khóa Slot 10 Phút & Sang Thanh Toán <ArrowUpRight size={17} />
        </Button>
      </div>
    </div>
  );
}

export { BookingIntakeView as default };
