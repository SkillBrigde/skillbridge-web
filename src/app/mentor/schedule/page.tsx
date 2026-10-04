"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
} from "@/components/ui";
import { Accordion } from "@/components/ui/accordion";
import { Select } from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA: Weekly Availability (SCR-SCH-01)                       */
/* ------------------------------------------------------------------ */

const WEEKDAYS = [
  { id: "mon", label: "Thứ 2", enabled: true, slots: "19:30 - 21:30" },
  { id: "tue", label: "Thứ 3", enabled: false, slots: "" },
  { id: "wed", label: "Thứ 4", enabled: true, slots: "19:30 - 21:30" },
  { id: "thu", label: "Thứ 5", enabled: false, slots: "" },
  { id: "fri", label: "Thứ 6", enabled: true, slots: "19:30 - 21:30" },
  { id: "sat", label: "Thứ 7", enabled: true, slots: "09:00 - 12:00" },
  { id: "sun", label: "Chủ nhật", enabled: false, slots: "Nghỉ ngơi" },
];

/* ------------------------------------------------------------------ */
/*  MOCK DATA: Upcoming Sessions (SCR-MTR-03)                         */
/* ------------------------------------------------------------------ */

const UPCOMING_SESSIONS = [
  {
    id: "s1",
    time: "Hôm nay • 19:30 - 20:30",
    countdown: "Bắt đầu sau 2 giờ",
    mentee: "Hoàng Thùy Linh",
    menteeBadge: "Mentee Pro",
    package: "Mock Interview System Design & .NET",
    price: "450.000 ₫",
    intake: {
      issue:
        "Chuẩn bị phỏng vấn Senior Backend, muốn luyện thiết kế kiến trúc phân tán thanh toán 10k RPS.",
      github: "https://github.com/linh-hoang/microservices-demo",
      expectation: "Nắm chắc rubric chấm điểm của FAANG.",
    },
  },
  {
    id: "s2",
    time: "Thứ 7, 19/09 • 09:00 - 10:00",
    countdown: "Còn 3 ngày",
    mentee: "Trần Minh Tuấn",
    menteeBadge: null,
    package: "Review CV & Tối Ưu Portfolio",
    price: "300.000 ₫",
    intake: {
      issue:
        "Muốn tối ưu CV để apply vị trí Senior .NET tại Techcombank.",
      github: "https://drive.google.com/cv-tuan",
      expectation: "CV đạt chuẩn Senior, có feedback cụ thể từng section.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function SchedulePage() {
  const [days, setDays] = useState(WEEKDAYS);

  const toggleDay = (id: string) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 1: SCR-SCH-01 — Availability Settings  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-1">
          <Calendar className="h-5 w-5 text-[#5E6AD2]" />
          <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
            Quản Lý Lịch Trống &amp; Quy Tắc Lặp Tuần
          </h1>
        </div>
        <p className="text-sm text-[#9BA1B0] mb-6">
          Cấu hình lịch trống mỗi tuần. Các slot sẽ tự động sinh ra cho 30 ngày
          tới.
        </p>

        {/* Top Settings Bar */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl bg-[#14171D] border border-white/[0.08]">
          <Select
            label="Thời lượng mặc định"
            options={[
              { value: "30", label: "30 phút" },
              { value: "45", label: "45 phút" },
              { value: "60", label: "60 phút" },
            ]}
            value="60"
            className="flex-1 min-w-[160px]"
          />
          <Select
            label="Buffer giữa các buổi"
            options={[
              { value: "0", label: "0 phút" },
              { value: "15", label: "15 phút" },
              { value: "30", label: "30 phút" },
            ]}
            value="15"
            className="flex-1 min-w-[160px]"
          />
          <Select
            label="Đặt trước tối thiểu (Lead time)"
            options={[
              { value: "12", label: "12 giờ" },
              { value: "24", label: "24 giờ" },
              { value: "48", label: "48 giờ" },
            ]}
            value="24"
            className="flex-1 min-w-[160px]"
          />
        </div>

        {/* Weekly Matrix */}
        <div className="space-y-2">
          {days.map((day) => (
            <div
              key={day.id}
              className={`flex items-center gap-4 rounded-xl border p-3.5 transition-colors ${
                day.enabled
                  ? "bg-[#14171D] border-white/[0.08]"
                  : "bg-[#0D0E10] border-white/[0.04] opacity-60"
              }`}
            >
              {/* Toggle */}
              <button
                onClick={() => toggleDay(day.id)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  day.enabled ? "bg-[#27C98F]" : "bg-[#1F2022]"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    day.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>

              <span className="text-sm font-medium text-[#F0F2F5] w-24">
                {day.label}
              </span>

              {day.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <Badge variant="brand" dot>
                    <Clock className="h-3 w-3 mr-0.5" />
                    {day.slots}
                  </Badge>
                  <button className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors cursor-pointer flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Thêm khoảng giờ
                  </button>
                </div>
              ) : (
                <span className="text-xs text-[#5D6474]">
                  {day.slots || "Không hoạt động"}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 2: SCR-MTR-03 — Upcoming Teaching      */}
      {/* ═══════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-[#27C98F]" />
          <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Lịch Dạy Sắp Tới
          </h2>
          <Badge variant="brand">
            {UPCOMING_SESSIONS.length} buổi học
          </Badge>
        </div>

        <div className="space-y-4">
          {UPCOMING_SESSIONS.map((session) => (
            <Card key={session.id} className="p-5">
              {/* Time + Countdown */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="escrow" dot pulse>
                    {session.time}
                  </Badge>
                  <span className="text-xs text-[#F5A623] font-mono">
                    ({session.countdown})
                  </span>
                </div>
                <span className="text-xs font-mono text-[#27C98F]">
                  {session.price}
                </span>
              </div>

              {/* Mentee + Package */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar alt={session.mentee} size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#F0F2F5]">
                      {session.mentee}
                    </span>
                    {session.menteeBadge && (
                      <Badge variant="brand">{session.menteeBadge}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#9BA1B0]">{session.package}</p>
                </div>
              </div>

              {/* Intake Preview Accordion */}
              <Accordion
                items={[
                  {
                    id: `intake-${session.id}`,
                    trigger: "Xem trước câu trả lời Khảo sát Intake của Mentee",
                    content: (
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                            Vấn đề
                          </span>
                          <p className="text-[#E3E2E5] mt-0.5">
                            {session.intake.issue}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                            Link GitHub
                          </span>
                          <a
                            href={session.intake.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#5E6AD2] hover:text-[#BDC2FF] text-xs mt-0.5"
                          >
                            {session.intake.github}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                            Kỳ vọng
                          </span>
                          <p className="text-[#E3E2E5] mt-0.5">
                            {session.intake.expectation}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                ]}
                className="mb-3"
              />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="primary" size="sm">
                  Vào Phòng Học Trực Tuyến
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Nhắn Tin Với Mentee
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
