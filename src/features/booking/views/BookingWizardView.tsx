"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  EmptyState,
} from "@/components/ui";
import {
  Calendar,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  HelpCircle,
  Target,
} from "lucide-react";
import { useSession } from "@/lib/store";
import {
  getPublicMentorProfile,
  getMentorService,
  getMentorSlots,
  createBooking,
} from "@/services";
import type {
  PublicMentorProfileResponse,
  MentorServiceResponse,
  AvailabilitySlotResponse,
} from "@/types/api";

export function BookingWizardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ mentorId: string }>();
  const session = useSession();

  const mentorId = params.mentorId;
  const serviceId = searchParams.get("serviceId");

  const [mentor, setMentor] = useState<PublicMentorProfileResponse | null>(null);
  const [service, setService] = useState<MentorServiceResponse | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Booking Form State
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [coreQuestion, setCoreQuestion] = useState("");
  const [attachedLinks, setAttachedLinks] = useState("");
  const [targetGoals, setTargetGoals] = useState("");

  useEffect(() => {
    if (!mentorId || !serviceId) return;
    let isMounted = true;

    // Calculate dates for slots (today -> 30 days ahead)
    const now = new Date();
    const startDate = now.toISOString().split("T")[0];
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    Promise.all([
      getPublicMentorProfile(mentorId).catch(() => null),
      getMentorService(serviceId).catch(() => null),
      getMentorSlots(mentorId, startDate, endDate).catch(() => ({ items: [] })),
    ])
      .then(([mentorRes, serviceRes, slotsRes]) => {
        if (!isMounted) return;
        if (!mentorRes || !serviceRes) {
          setErrorMessage("Không tìm thấy thông tin chuyên gia hoặc gói dịch vụ.");
        } else {
          setMentor(mentorRes);
          setService(serviceRes);
          setSlots(slotsRes?.items ?? []);
        }
      })
      .catch(() => {
        if (isMounted) setErrorMessage("Không thể kết nối đến máy chủ.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mentorId, serviceId]);

  const requiredSlotsCount = service?.totalSessions ?? 1;

  const availableSlots = useMemo(() => {
    return slots.filter((s) => s.status === "Available");
  }, [slots]);

  const handleToggleSlot = (slotId: string) => {
    if (selectedSlotIds.includes(slotId)) {
      setSelectedSlotIds(selectedSlotIds.filter((id) => id !== slotId));
    } else {
      if (selectedSlotIds.length >= requiredSlotsCount) {
        // Replace first if single, or ignore if max reached
        if (requiredSlotsCount === 1) {
          setSelectedSlotIds([slotId]);
        } else {
          setErrorMessage(`Gói này yêu cầu chọn đúng ${requiredSlotsCount} buổi.`);
        }
      } else {
        setSelectedSlotIds([...selectedSlotIds, slotId]);
        setErrorMessage("");
      }
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!session.user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!service) return;

    if (selectedSlotIds.length !== requiredSlotsCount) {
      setErrorMessage(`Vui lòng chọn đủ ${requiredSlotsCount} khung giờ cho gói này.`);
      return;
    }

    if (!coreQuestion.trim() || coreQuestion.trim().length < 10) {
      setErrorMessage("Vui lòng nêu rõ vấn đề kỹ thuật cần trao đổi (tối thiểu 10 ký tự).");
      return;
    }

    if (!targetGoals.trim() || targetGoals.trim().length < 10) {
      setErrorMessage("Vui lòng nêu rõ mục tiêu kỳ vọng đạt được (tối thiểu 10 ký tự).");
      return;
    }

    // Validate links: must be valid URLs if provided
    if (attachedLinks.trim()) {
      const urls = attachedLinks
        .split(/[\n,]/)
        .map((u) => u.trim())
        .filter(Boolean);
      for (const u of urls) {
        if (!u.startsWith("http://") && !u.startsWith("https://")) {
          setErrorMessage(`Link "${u}" không hợp lệ. Phải bắt đầu bằng http:// hoặc https://`);
          return;
        }
      }
    }

    try {
      setSubmitting(true);
      const booking = await createBooking({
        serviceId: service.id,
        serviceVersion: service.version,
        slotIds: selectedSlotIds,
        intakeForm: {
          coreQuestion: coreQuestion.trim(),
          attachedLinks: attachedLinks.trim() || "https://skillbridge.vn",
          targetGoals: targetGoals.trim(),
        },
      });

      // Atomically locked for 10 minutes -> Redirect to checkout!
      router.push(`/checkout/${booking.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể tạo đơn đặt chỗ. Vui lòng thử lại.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[var(--sb-muted)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--sb-purple)]" />
        <p className="text-sm">Đang tải lịch và thông tin dịch vụ…</p>
      </div>
    );
  }

  if (!mentor || !service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy thông tin"
          description={errorMessage || "Dịch vụ hoặc chuyên gia không tồn tại."}
          action={{
            label: "Quay lại danh sách chuyên gia",
            onClick: () => router.push("/mentors"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/mentors/${mentorId}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--sb-muted)] hover:text-[var(--sb-ink)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại hồ sơ {mentor.fullName}
        </Link>
      </div>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--sb-purple)]">
          Khảo Sát & Đặt Lịch
        </span>
        <h1 className="text-3xl font-bold text-[var(--sb-ink)] mt-1">
          Đặt Gói Dịch Vụ Với {mentor.fullName}
        </h1>
        <p className="text-sm text-[var(--sb-muted)] mt-1">
          Chọn khung giờ phù hợp và cung cấp mục tiêu để buổi mentoring đạt hiệu quả cao nhất.
        </p>
      </div>

      {/* Selected Service Card */}
      <div className="rounded-2xl border border-[var(--sb-purple)]/30 bg-[#faf8fc] p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[var(--sb-purple)]/10 text-[var(--sb-purple)]">
            {service.serviceType === "Tier1_ReviewCV"
              ? "Tier 1 • Quick Win"
              : service.serviceType === "Tier2_MockInterview"
              ? "Tier 2 • Phổ biến"
              : "Tier 3 • Transformation"}
          </span>
          <h2 className="text-xl font-bold text-[var(--sb-ink)] mt-2">{service.title}</h2>
          <p className="text-xs text-[var(--sb-muted)] mt-1">
            {service.description || "Gói dịch vụ kèm cam kết đầu ra rõ ràng."}
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--sb-ink)] mt-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--sb-purple)]" />
              {service.durationMinutes} phút / buổi
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[var(--sb-purple)]" />
              Tổng cộng {service.totalSessions} buổi học
            </span>
          </div>
        </div>
        <div className="text-right sm:border-l sm:border-[var(--sb-line)] sm:pl-6 flex-shrink-0">
          <span className="text-xs text-[var(--sb-muted)] block">Tổng chi phí gói</span>
          <span className="text-2xl font-bold text-[var(--sb-purple)]">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: service.currency || "VND",
            }).format(service.price)}
          </span>
          <span className="text-[11px] text-[var(--sb-muted)] block mt-0.5">
            Bảo vệ qua Két Escrow
          </span>
        </div>
      </div>

      <form onSubmit={handleCreateBooking} className="space-y-8">
        {/* Step 1: Chọn Slot */}
        <section className="rounded-2xl bg-white border border-[var(--sb-line)] p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--sb-purple)]" />
              <h3 className="font-semibold text-[var(--sb-ink)]">
                1. Chọn Khung Giờ Rảnh
              </h3>
            </div>
            <span className="text-xs text-[var(--sb-muted)]">
              Đã chọn: <strong className="text-[var(--sb-purple)]">{selectedSlotIds.length}</strong> / {requiredSlotsCount} buổi
            </span>
          </div>

          {availableSlots.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--sb-muted)] bg-[#faf9f6] rounded-xl border border-dashed border-[var(--sb-line)]">
              Mentor hiện chưa có lịch rảnh trong 30 ngày tới. Vui lòng liên hệ lại sau.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlotIds.includes(slot.id);
                const startDate = new Date(slot.startUtc);
                const endDate = new Date(slot.endUtc);

                const dateStr = startDate.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                });
                const timeStr = `${startDate.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${endDate.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleToggleSlot(slot.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[var(--sb-purple)] bg-[#eee7f6]/40 shadow-xs"
                        : "border-[var(--sb-line)] bg-white hover:border-[var(--sb-purple)]/50"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-[var(--sb-ink)]">{dateStr}</p>
                      <p className="text-xs text-[var(--sb-muted)] mt-0.5">{timeStr}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--sb-purple)] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Step 2: Intake Form 3 câu hỏi */}
        <section className="rounded-2xl bg-white border border-[var(--sb-line)] p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-[var(--sb-purple)]" />
            <h3 className="font-semibold text-[var(--sb-ink)]">
              2. Khảo Sát Nhu Cầu Cụ Thể (Intake Form)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--sb-ink)] mb-1.5">
              Câu hỏi 1: Vấn đề kỹ thuật trọng tâm bạn đang gặp phải? *
            </label>
            <p className="text-[11px] text-[var(--sb-muted)] mb-2">
              Ví dụ: Tối ưu query PostgreSQL bị chậm, refactor kiến trúc Clean Architecture, chuẩn bị mock interview câu hỏi System Design...
            </p>
            <Textarea
              value={coreQuestion}
              onChange={(e) => setCoreQuestion(e.target.value)}
              placeholder="Mô tả cụ thể vấn đề hoặc bài toán của bạn..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--sb-ink)] mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[var(--sb-purple)]" />
              Câu hỏi 2: Link tài liệu liên quan (GitHub Repo, CV, Slide, Figma...)
            </label>
            <p className="text-[11px] text-[var(--sb-muted)] mb-2">
              Các đường dẫn HTTP/HTTPS phân cách nhau bởi dấu phẩy hoặc xuống dòng.
            </p>
            <Input
              value={attachedLinks}
              onChange={(e) => setAttachedLinks(e.target.value)}
              placeholder="https://github.com/your-username/project, https://drive.google.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--sb-ink)] mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--sb-purple)]" />
              Câu hỏi 3: Mục tiêu hoặc kết quả bạn kỳ vọng đạt được sau buổi học? *
            </label>
            <p className="text-[11px] text-[var(--sb-muted)] mb-2">
              Ví dụ: Nắm vững cách thiết kế Redis cache chống stampede, có CV hoàn chỉnh để apply Senior, lộ trình học 3 tháng...
            </p>
            <Textarea
              value={targetGoals}
              onChange={(e) => setTargetGoals(e.target.value)}
              placeholder="Mục tiêu cụ thể của bạn..."
              rows={2}
              required
            />
          </div>
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 3: Nút Xác Nhận & Giữ Chỗ */}
        <div className="rounded-2xl bg-[#faf9f6] border border-[var(--sb-line)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#27C98F] flex-shrink-0" />
            <div className="text-xs text-[var(--sb-muted)]">
              <p className="font-semibold text-[var(--sb-ink)]">
                Bảo Vệ Tiền Học Qua Két Ký Quỹ Escrow
              </p>
              <p className="mt-0.5">
                Khi tạo đơn, slot được khóa 10 phút. Tiền được giữ an toàn trong Escrow và chỉ giải ngân sau khi buổi học hoàn tất.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting || availableSlots.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-[var(--sb-purple)] text-white hover:bg-[var(--sb-purple)]/90 rounded-xl font-medium text-sm flex-shrink-0"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang khóa slot & tạo đơn…
              </span>
            ) : (
              "Tạo Đơn & Giữ Chỗ (10 Phút)"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BookingWizardView;
