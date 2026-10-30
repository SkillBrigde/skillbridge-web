"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
  Input,
} from "@/components/ui";
import { SlotPicker, type SlotOption } from "@/components/ui/slot-picker";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { Calendar, ShieldCheck, ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { useAppState, useNow, actions, mentorSlotsForPicker } from "@/lib/store";
import { vnd, slotDateLabel, slotTimeLabel } from "@/lib/domain";
import { bookingService } from "@/services/bookingService";
import { schedulingService } from "@/services/schedulingService";

const QUICK_CHIPS = [
  "Tối ưu kiến trúc Event-Driven Microservices scale 100k CCU",
  "Review & Tối ưu CV Senior .NET/Java Backend chuẩn ATS",
  "Nghẽn Database PostgreSQL, phân tích query execution plan",
];

function BookingIntakeContent() {
  const params = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const state = useAppState();
  const now = useNow("second");

  const bookingId = params.bookingId;
  const serviceIdParam = searchParams.get("serviceId") || "";
  const mentorIdParam = searchParams.get("mentorId") || "";

  // Check state booking or mock booking
  const booking = useMemo(
    () => state.bookings.find((b) => b.id === bookingId),
    [state.bookings, bookingId]
  );

  const mentorId = mentorIdParam || booking?.mentorId || "mentor-an-nguyen";
  const mentor = useMemo(
    () => state.mentors.find((m) => m.id === mentorId) || state.mentors[0],
    [state.mentors, mentorId]
  );

  const [issue, setIssue] = useState(booking?.intake?.coreIssue || "");
  const [link, setLink] = useState(booking?.intake?.link || "https://github.com/my-profile");
  const [expectation, setExpectation] = useState(
    booking?.intake?.expectation || "Nắm chắc cách giải bài toán System Design và tự tin vượt qua phỏng vấn kỹ thuật"
  );
  const [selectedSlotId, setSelectedSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [apiSlots, setApiSlots] = useState<SlotOption[]>([]);

  // Fetch live slots from Scheduling API
  useEffect(() => {
    if (!mentorId) return;
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const endDate = twoWeeksLater.toISOString().split("T")[0];

    schedulingService
      .getMentorSlots(mentorId, startDate, endDate, 1, 24)
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          const mapped: SlotOption[] = res.items.map((s) => {
            const startMs = new Date(s.startAtUtc).getTime();
            const endMs = new Date(s.endAtUtc).getTime();
            return {
              id: s.id,
              date: slotDateLabel(startMs),
              time: slotTimeLabel(startMs, endMs),
              available: s.status === "Available",
            };
          });
          setApiSlots(mapped);
        }
      })
      .catch(() => {
        // Fallback to local slots
      });
  }, [mentorId]);

  const slotOptions: SlotOption[] = useMemo(() => {
    if (apiSlots.length > 0) return apiSlots;
    const list = mentorSlotsForPicker(state, mentorId, booking?.id || "", now, 12);
    return list.map(({ slot, available }) => ({
      id: slot.id,
      date: slotDateLabel(slot.startMs),
      time: slotTimeLabel(slot.startMs, slot.endMs),
      available,
    }));
  }, [apiSlots, state, mentorId, booking, now]);

  const selectedSlot = selectedSlotId || booking?.slotId || slotOptions.find((s) => s.available)?.id || "";

  const handleProceed = async () => {
    setErrorMsg("");

    if (issue.trim().length < 20) {
      setErrorMsg("Vui lòng mô tả chi tiết vấn đề kỹ thuật (tối thiểu 20 ký tự).");
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

    setSubmitting(true);
    try {
      const targetServiceId = serviceIdParam || booking?.serviceId || "019a0000-0000-7000-8000-000000000001";
      const createdBooking = await bookingService.createBooking({
        serviceId: targetServiceId,
        serviceVersion: 1,
        slotIds: [selectedSlot],
        intakeForm: {
          coreQuestion: issue.trim(),
          attachedLinks: link.trim(),
          targetGoals: expectation.trim(),
        },
      });

      if (createdBooking?.id) {
        router.push(`/checkout/${createdBooking.id}`);
        return;
      }
    } catch (err: unknown) {
      // If backend call fails (e.g. offline or slot held), try local store fallback
      if (booking) {
        const res = actions.lockSlot(booking.id, selectedSlot, {
          coreIssue: issue.trim(),
          link: link.trim(),
          expectation: expectation.trim(),
        });
        if (res.ok) {
          router.push(`/checkout/${booking.id}`);
          return;
        }
      }
      const message = err instanceof Error ? err.message : "Không thể tạo đơn đặt lịch. Vui lòng thử lại.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const serviceName = booking?.serviceName || "Gói Tư Vấn & Định Hướng Kỹ Thuật";
  const durationLabel = booking?.durationLabel || "60 phút";
  const priceVnd = booking?.priceVnd || mentor?.services[0]?.priceVnd || 1_500_000;
  const mentorName = booking?.mentorName || mentor?.fullName || "Chuyên gia SkillBridge";

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
        <span className="text-xs font-mono font-semibold text-[#5e5866]">
          Khảo sát & Khóa lịch Atomic 10 Phút
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 p-5 rounded-2xl bg-white border border-[#e5e2de] shadow-sm">
        <Avatar src={mentor?.avatarUrl} alt={mentorName} size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[#27252d] tracking-tight">
            {serviceName} ({durationLabel})
          </h1>
          <p className="text-xs text-[#5e5866] mt-0.5">
            Cố vấn: <span className="text-[#27252d] font-semibold">{mentorName}</span> • Tạm tính trọn gói:{" "}
            <span className="font-mono text-[#6551a4] font-bold text-sm">
              {vnd(priceVnd)}
            </span>
          </p>
        </div>
        <Badge variant="brand" dot>
          Escrow Bảo Chứng
        </Badge>
      </div>

      {errorMsg && (
        <div className="mb-6">
          <NoticeBanner variant="error" message={errorMsg} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Intake Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-[#e5e2de] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#27252d] mb-1">
              1. Khảo Sát Nhu Cầu Trước Buổi Học
            </h2>
            <p className="text-xs text-[#5e5866] mb-5">
              Cung cấp chi tiết vấn đề giúp chuyên gia chuẩn bị tài liệu và giải pháp trọng tâm nhất.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#27252d] mb-1.5">
                  Vấn đề kỹ thuật / Chủ đề cốt lõi cần tháo gỡ *
                </label>
                <Textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Mô tả cụ thể bối cảnh, công nghệ đang dùng, lỗi hoặc trở ngại bạn đang gặp phải..."
                  rows={4}
                />
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-[#5e5866]">Gợi ý nhanh:</span>
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setIssue(chip)}
                      className="text-[11px] bg-[#f1efea] hover:bg-[#e5e2de] text-[#27252d] px-2 py-0.5 rounded-md transition-colors"
                    >
                      {chip.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#27252d] mb-1.5">
                  Link tài liệu / Mã nguồn / CV đính kèm *
                </label>
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://github.com/... hoặc link Google Drive/Figma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#27252d] mb-1.5">
                  Kỳ vọng kết quả cụ thể sau buổi hướng dẫn *
                </label>
                <Input
                  value={expectation}
                  onChange={(e) => setExpectation(e.target.value)}
                  placeholder="Mục tiêu bạn muốn đạt được (VD: hiểu rõ sơ đồ DB, sửa xong query chậm...)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Slot Picker & Action */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-[#e5e2de] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-[#6551a4]" />
              <h2 className="text-base font-bold text-[#27252d]">
                2. Chọn Khung Giờ Rảnh
              </h2>
            </div>
            <p className="text-xs text-[#5e5866] mb-4">
              Khung giờ sẽ được khóa giữ chỗ trong 10 phút sau khi bạn chuyển tiếp thanh toán.
            </p>

            <SlotPicker
              slots={slotOptions}
              selectedId={selectedSlot}
              onSelect={(slotId: string) => setSelectedSlot(slotId)}
            />
          </div>

          <div className="rounded-2xl bg-[#faf9f6] border border-[#e5e2de] p-5">
            <div className="flex items-start gap-2.5 mb-4">
              <ShieldCheck className="h-5 w-5 text-[#1e7e45] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#5e5866] leading-relaxed">
                Tiền của bạn được giữ an toàn tại <strong>Két Escrow</strong> và chỉ giải ngân sau khi buổi học kết thúc đạt chuẩn.
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              disabled={submitting}
              onClick={handleProceed}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang khóa slot...
                </>
              ) : (
                <>
                  Khóa Slot & Thanh Toán Escrow
                  <ArrowUpRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingIntakeView() {
  return (
    <Suspense fallback={<div className="sb-container py-20 text-center">Đang tải biểu mẫu...</div>}>
      <BookingIntakeContent />
    </Suspense>
  );
}

export { BookingIntakeView as default };
