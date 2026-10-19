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

  const handleSaveAvailability = () => {
    if (!mentor) return;
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
    <RequireRole role="mentor" title="Lịch Dạy &amp; Khung Giờ" description="Đăng nhập tài khoản mentor để quản lý lịch dạy và quy tắc lặp tuần.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Disputes Alert Banner */}
        {disputesNeedingResponse.length > 0 && (
          <div className="mb-8 rounded-xl border border-[#FF5C5C]/30 bg-[#FF5C5C]/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[#FF5C5C]" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Có {disputesNeedingResponse.length} khiếu nại đang chờ bạn giải trình trong SLA 24h
                  </p>
                  <p className="text-xs text-[#9BA1B0]">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#5E6AD2]" />
              <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
                Quản Lý Lịch Trống &amp; Quy Tắc Lặp Tuần
              </h1>
            </div>
            <Button variant="primary" onClick={handleSaveAvailability}>
              Lưu Cấu Hình Lịch
            </Button>
          </div>
          <p className="text-sm text-[#9BA1B0] mb-6">
            Cấu hình lịch trống mỗi tuần. Các slot sẽ tự động sinh ra cho 30 ngày tới trên Redis.
          </p>

          {savedMsg && (
            <div className="mb-6">
              <NoticeBanner variant="success" message={savedMsg} />
            </div>
          )}

          {/* Top Settings Bar */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl bg-[#14171D] border border-white/[0.08]">
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
          <div className="space-y-2">
            {WEEKDAYS.map((day) => {
              const rule = rules[day.id as WeekdayId];
              const isEnabled = rule?.enabled ?? false;
              const windowsText = isEnabled && rule.windows.length > 0
                ? rule.windows.map((w) => `${w.start} - ${w.end}`).join(", ")
                : "Nghỉ ngơi";

              return (
                <div
                  key={day.id}
                  className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors ${isEnabled
                    ? "bg-[#14171D] border-white/[0.08]"
                    : "bg-[#0D0E10] border-white/[0.04] opacity-60"
                    }`}
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleDay(day.id as WeekdayId)}
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${isEnabled ? "bg-[#27C98F]" : "bg-[#1F2022]"
                      }`}
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${isEnabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                    />
                  </button>

                  <span className="text-sm font-medium text-[#F0F2F5] w-24">
                    {day.label}
                  </span>

                  {isEnabled ? (
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <Badge variant="brand" dot>
                        <Clock className="h-3 w-3 mr-0.5" />
                        {windowsText}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => addWindow(day.id as WeekdayId)}
                        className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm khoảng giờ
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#5D6474]">
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
            <Clock className="h-5 w-5 text-[#27C98F]" />
            <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
              Lịch Dạy Sắp Tới
            </h2>
            <Badge variant="brand">
              {upcomingBookings.length} buổi học
            </Badge>
          </div>

          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card className="p-8 text-center text-xs text-[#9BA1B0]">
                Chưa có buổi học nào được đặt trong thời gian tới.
              </Card>
            ) : (
              upcomingBookings.map((b) => {
                const timeText = b.startMs && b.endMs
                  ? bookingTimeLabel(b.startMs, b.endMs)
                  : "Chưa xác định";


                const countdown = b.startMs ? relativeFuture(b.startMs, now) : "";

                return (
                  <Card key={b.id} className="p-5">
                    {/* Time + Countdown */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="escrow" dot pulse>
                          {timeText}
                        </Badge>
                        {countdown && (
                          <span className="text-xs text-[#F5A623] font-mono">
                            ({countdown})
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#27C98F] font-bold">
                        {vnd(b.priceVnd)}
                      </span>
                    </div>

                    {/* Mentee + Package */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar alt={b.menteeName} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#F0F2F5]">
                            {b.menteeName}
                          </span>
                          <Badge variant="brand">Mentee Pro</Badge>
                        </div>
                        <p className="text-xs text-[#9BA1B0]">{b.serviceName} ({b.durationLabel})</p>
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
                              <div className="space-y-3 text-sm">
                                <div>
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                                    Vấn đề kỹ thuật
                                  </span>
                                  <p className="text-[#E3E2E5] mt-0.5 text-xs">
                                    {b.intake.coreIssue}
                                  </p>
                                </div>
                                {b.intake.link && (
                                  <div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                                      Link đính kèm
                                    </span>
                                    <a
                                      href={b.intake.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-[#5E6AD2] hover:text-[#BDC2FF] text-xs mt-0.5"
                                    >
                                      {b.intake.link}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                                <div>
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                                    Kỳ vọng kết quả
                                  </span>
                                  <p className="text-[#E3E2E5] mt-0.5 text-xs">
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/mentor/sessions/${b.id}`)}
                      >
                        Vào Phòng Học Trực Tuyến
                      </Button>
                      <Button
                        variant="ghost"
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
