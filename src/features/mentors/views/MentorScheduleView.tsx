"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  NoticeBanner,
} from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { Select } from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useSession, actions, useNow } from "@/lib/store";
import {
  bookingTimeLabel,
  relativeFuture,
  vnd,
  WEEKDAYS,
  type WeekdayId,
  type AvailabilityRules,
  type MentorRec,
} from "@/lib/domain";

export function MentorScheduleView() {
  const { mentor } = useSession();
  return <MentorScheduleContent key={mentor?.id || "guest"} mentor={mentor} />;
}

function MentorScheduleContent({ mentor }: { mentor: MentorRec | null }) {
  const router = useRouter();
  const state = useAppState();
  const now = useNow("minute");

  const mentorId = mentor?.id || "mentor-an-nguyen";

  const [rules, setRules] = useState<AvailabilityRules>(
    mentor?.rules || {
      mon: { enabled: true, windows: [{ start: "19:30", end: "21:30" }] },
      tue: { enabled: false, windows: [] },
      wed: { enabled: true, windows: [{ start: "19:30", end: "21:30" }] },
      thu: { enabled: false, windows: [] },
      fri: { enabled: true, windows: [{ start: "19:30", end: "21:30" }] },
      sat: { enabled: true, windows: [{ start: "09:00", end: "12:00" }] },
      sun: { enabled: false, windows: [] },
    }
  );

  const [duration, setDuration] = useState(String(mentor?.defaults.durationMin ?? 60));
  const [buffer, setBuffer] = useState(String(mentor?.defaults.bufferMin ?? 15));
  const [leadTime, setLeadTime] = useState(String(mentor?.defaults.leadHours ?? 24));
  const [savedMsg, setSavedMsg] = useState("");

  const toggleDay = (dayId: WeekdayId) => {
    setRules((prev) => {
      const current = prev[dayId];
      return {
        ...prev,
        [dayId]: {
          ...current,
          enabled: !current.enabled,
          windows: !current.enabled && current.windows.length === 0
            ? [{ start: "19:00", end: "21:00" }]
            : current.windows,
        },
      };
    });
  };

  const addWindow = (dayId: WeekdayId) => {
    setRules((prev) => {
      const current = prev[dayId];
      return {
        ...prev,
        [dayId]: {
          ...current,
          windows: [...current.windows, { start: "14:00", end: "16:00" }],
        },
      };
    });
  };

  const handleSaveAvailability = async () => {
    if (!mentor) return;
    try {
      const { schedulingService } = await import("@/services/schedulingService");
      await schedulingService.updateSettings({
        sessionDurationMinutes: Number(duration) || 60,
        bufferTimeMinutes: Number(buffer) || 15,
        leadTimeHours: Number(leadTime) || 24,
        maxDaysInAdvance: 30,
        timezone: "Asia/Ho_Chi_Minh",
      }).catch(() => null);
    } catch {
      // Continue
    }
    const res = actions.saveAvailability(rules, {
      durationMin: Number(duration),
      bufferMin: Number(buffer),
      leadHours: Number(leadTime),
    });
    if (res.ok) {
      setSavedMsg("Đã lưu quy tắc và tự động sinh slot 30 ngày thành công!");
      setTimeout(() => setSavedMsg(""), 3000);
    }
  };

  // Mentor upcoming bookings
  const upcomingBookings = useMemo(() => {
    return state.bookings
      .filter((b) => b.mentorId === mentorId && (b.status === "Confirmed" || b.status === "AwaitingAcceptance" || b.status === "InProgress"))
      .sort((a, b) => (a.startMs || 0) - (b.startMs || 0));
  }, [state.bookings, mentorId]);

  // Disputes needing response
  const disputesNeedingResponse = useMemo(() => {
    return state.disputes.filter(
      (d) => d.status === "PendingReview" && !d.mentorStatement
    );
  }, [state.disputes]);

  return (
    <RequireRole role="mentor" title="Lịch Dạy & Khung Giờ" description="Đăng nhập tài khoản mentor để quản lý lịch dạy và quy tắc lặp tuần.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Disputes Alert Banner */}
        {disputesNeedingResponse.length > 0 && (
          <div className="mb-8 rounded-2xl border border-[#a64533]/25 bg-[#fceeea] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#a64533] shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#a64533]">
                    Có {disputesNeedingResponse.length} khiếu nại đang chờ bạn giải trình trong SLA 24h
                  </p>
                  <p className="text-xs text-[#5e5866] mt-0.5">
                    Giải trình sớm để bảo vệ tiền ký quỹ Escrow và uy tín giảng dạy của bạn.
                  </p>
                </div>
              </div>
              <Link href={`/disputes/${disputesNeedingResponse[0].id}`}>
                <Button variant="destructive" size="sm">
                  Giải Trình Ngay
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 1: Availability Settings               */}
        {/* ═══════════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <div>
              <span className="sb-eyebrow mb-1">Weekly Rules</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#6551a4]" />
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
                  Quản Lý Lịch Trống & Quy Tắc Lặp Tuần
                </h1>
              </div>
            </div>
            <Button variant="primary" onClick={handleSaveAvailability}>
              Lưu Cấu Hình Lịch
            </Button>
          </div>
          <p className="text-sm text-[#5e5866] mb-6">
            Cấu hình lịch trống mỗi tuần. Các slot sẽ tự động sinh ra cho 30 ngày tới trên Redis với khóa nguyên tử (Atomic Lock).
          </p>

          {savedMsg && (
            <div className="mb-6">
              <NoticeBanner variant="success" message={savedMsg} />
            </div>
          )}

          {/* Top Settings Bar */}
          <div className="flex flex-wrap gap-4 mb-6 p-5 rounded-2xl bg-white border border-[#e5e2de] shadow-xs">
            <Select
              label="Thời lượng mặc định"
              options={[
                { value: "30", label: "30 phút" },
                { value: "45", label: "45 phút" },
                { value: "60", label: "60 phút" },
              ]}
              value={duration}
              onChange={setDuration}
              className="flex-1 min-w-[160px]"
            />
            <Select
              label="Buffer giữa các buổi"
              options={[
                { value: "0", label: "0 phút" },
                { value: "15", label: "15 phút" },
                { value: "30", label: "30 phút" },
              ]}
              value={buffer}
              onChange={setBuffer}
              className="flex-1 min-w-[160px]"
            />
            <Select
              label="Đặt trước tối thiểu (Lead time)"
              options={[
                { value: "12", label: "12 giờ" },
                { value: "24", label: "24 giờ" },
                { value: "48", label: "48 giờ" },
              ]}
              value={leadTime}
              onChange={setLeadTime}
              className="flex-1 min-w-[160px]"
            />
          </div>

          {/* Weekly Matrix */}
          <div className="space-y-2.5">
            {WEEKDAYS.map((day) => {
              const rule = rules[day.id as WeekdayId];
              const isEnabled = rule?.enabled ?? false;
              const windowsText = isEnabled && rule.windows.length > 0
                ? rule.windows.map((w) => `${w.start} - ${w.end}`).join(", ")
                : "Nghỉ ngơi";

              return (
                <div
                  key={day.id}
                  className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                    isEnabled
                      ? "bg-white border-[#e5e2de] shadow-xs"
                      : "bg-[#faf9f6] border-[#f1efea] opacity-70"
                  }`}
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleDay(day.id as WeekdayId)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
                      isEnabled ? "bg-[#1e7e45]" : "bg-[#e5e2de]"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  <span className="text-sm font-semibold text-[#27252d] w-24">
                    {day.label}
                  </span>

                  {isEnabled ? (
                    <div className="flex items-center gap-3 flex-1 flex-wrap">
                      <Badge variant="brand" dot>
                        <Clock className="h-3 w-3 mr-0.5" />
                        {windowsText}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => addWindow(day.id as WeekdayId)}
                        className="text-xs font-medium text-[#6551a4] hover:text-[#523e8f] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Thêm khoảng giờ
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#5e5866]">
                      Không hoạt động
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════ */}
        {/* SECTION 2: Upcoming Teaching Sessions          */}
        {/* ═══════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-[#1e7e45]" />
            <h2 className="font-serif text-2xl font-semibold text-[#27252d] tracking-tight">
              Lịch Dạy Sắp Tới
            </h2>
            <Badge variant="brand">
              {upcomingBookings.length} buổi học
            </Badge>
          </div>

          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card className="p-8 text-center text-sm text-[#5e5866]">
                Chưa có buổi học nào được đặt trong thời gian tới.
              </Card>
            ) : (
              upcomingBookings.map((b) => {
                const timeText = b.startMs && b.endMs
                  ? bookingTimeLabel(b.startMs, b.endMs)
                  : "Chưa xác định";
                const countdown = b.startMs ? relativeFuture(b.startMs, now) : "";

                return (
                  <Card key={b.id} className="p-6">
                    {/* Time + Countdown */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="escrow" dot pulse>
                          {timeText}
                        </Badge>
                        {countdown && (
                          <span className="text-xs text-[#946200] font-mono font-medium">
                            ({countdown})
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-mono text-[#1e7e45] font-bold">
                        {vnd(b.priceVnd)}
                      </span>
                    </div>

                    {/* Mentee + Package */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar alt={b.menteeName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#27252d]">
                            {b.menteeName}
                          </span>
                          <Badge variant="brand">Mentee Pro</Badge>
                        </div>
                        <p className="text-xs text-[#5e5866] mt-0.5">{b.serviceName} ({b.durationLabel})</p>
                      </div>
                    </div>

                    {/* Intake Preview Accordion */}
                    {b.intake && (
                      <Accordion
                        items={[
                          {
                            id: `intake-${b.id}`,
                            trigger: "Xem trước câu trả lời Khảo sát Intake của Mentee",
                            content: (
                              <div className="space-y-3 text-sm py-1">
                                <div>
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e5866]">
                                    Vấn đề kỹ thuật
                                  </span>
                                  <p className="text-[#27252d] mt-0.5 text-xs">
                                    {b.intake.coreIssue}
                                  </p>
                                </div>
                                {b.intake.link && (
                                  <div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e5866]">
                                      Link đính kèm
                                    </span>
                                    <a
                                      href={b.intake.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[#6551a4] hover:text-[#523e8f] text-xs mt-0.5"
                                    >
                                      {b.intake.link}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                                <div>
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5e5866]">
                                    Kỳ vọng kết quả
                                  </span>
                                  <p className="text-[#27252d] mt-0.5 text-xs">
                                    {b.intake.expectation}
                                  </p>
                                </div>
                              </div>
                            ),
                          },
                        ]}
                        className="mb-4"
                      />
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-[#f1efea]">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/mentor/sessions/${b.id}`)}
                      >
                        Vào Phòng Học Trực Tuyến
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push(`/bookings/${b.id}/room`)}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Nhắn Tin Với Mentee
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </section>
      </div>
    </RequireRole>
  );
}

export { MentorScheduleView as default };
