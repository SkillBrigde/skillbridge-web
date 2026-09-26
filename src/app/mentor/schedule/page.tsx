"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  Check,
  Zap,
  Info,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarOff,
} from "lucide-react";
import { Badge, Button, Card, Input } from "@/components/ui";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  dayName: string;
  dayShort: string;
  enabled: boolean;
  slots: TimeSlot[];
}

const INITIAL_SCHEDULE: DaySchedule[] = [
  {
    dayName: "Thứ Hai (Monday)",
    dayShort: "T2",
    enabled: true,
    slots: [{ id: "m1", start: "19:30", end: "21:30" }],
  },
  {
    dayName: "Thứ Ba (Tuesday)",
    dayShort: "T3",
    enabled: false,
    slots: [{ id: "t1", start: "19:30", end: "21:30" }],
  },
  {
    dayName: "Thứ Tư (Wednesday)",
    dayShort: "T4",
    enabled: true,
    slots: [{ id: "w1", start: "19:30", end: "21:30" }],
  },
  {
    dayName: "Thứ Năm (Thursday)",
    dayShort: "T5",
    enabled: false,
    slots: [{ id: "th1", start: "19:30", end: "21:30" }],
  },
  {
    dayName: "Thứ Sáu (Friday)",
    dayShort: "T6",
    enabled: true,
    slots: [{ id: "f1", start: "19:30", end: "21:30" }],
  },
  {
    dayName: "Thứ Bảy (Saturday)",
    dayShort: "T7",
    enabled: true,
    slots: [{ id: "sa1", start: "09:00", end: "12:00" }],
  },
  {
    dayName: "Chủ Nhật (Sunday)",
    dayShort: "CN",
    enabled: false,
    slots: [],
  },
];

export default function MentorSchedulePage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [defaultDuration, setDefaultDuration] = useState("60");
  const [bufferTime, setBufferTime] = useState("15");
  const [leadTime, setLeadTime] = useState("24");
  const [timeOffStart, setTimeOffStart] = useState("");
  const [timeOffEnd, setTimeOffEnd] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [timeOffLocked, setTimeOffLocked] = useState(false);

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((day, i) => (i === index ? { ...day, enabled: !day.enabled } : day))
    );
  };

  const addSlot = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;
        return {
          ...day,
          slots: [
            ...day.slots,
            { id: Math.random().toString(), start: "14:00", end: "16:00" },
          ],
        };
      })
    );
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    setSchedule((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;
        return {
          ...day,
          slots: day.slots.filter((s) => s.id !== slotId),
        };
      })
    );
  };

  const updateSlot = (
    dayIndex: number,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;
        return {
          ...day,
          slots: day.slots.map((s) =>
            s.id === slotId ? { ...s, [field]: value } : s
          ),
        };
      })
    );
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLockTimeOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeOffStart && timeOffEnd) {
      setTimeOffLocked(true);
      setTimeout(() => setTimeOffLocked(false), 3500);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <Link href="/mentor/studio" className="hover:text-[#F0F2F5] transition-colors">
              Mentor Studio
            </Link>
            <span>/</span>
            <span className="text-[#9BA1B0]">Availability Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Quản Lý Lịch Trống & Quy Tắc Lặp Tuần
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Cấu hình thời gian giảng dạy cố định, thời gian đệm và đồng bộ tức thì lên Redis cluster
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-[#14171D] border border-white/[0.08] px-3 py-1.5 text-xs font-mono text-[#27C98F]">
            <span className="h-2 w-2 rounded-full bg-[#27C98F] animate-pulse" />
            <span>Redis Synced (UTC+7)</span>
          </div>
          <Button onClick={handleSave} className="gap-2" size="sm">
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-[#27C98F]" />
                <span>Đã Lưu Thay Đổi</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Lưu Cấu Hình Lịch</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Global Scheduling Parameters */}
      <Card className="p-5 mb-8 bg-[#14171D] border-white/[0.08]">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="h-4 w-4 text-[#5E6AD2]" />
          <h2 className="text-sm font-semibold text-[#F0F2F5]">
            Tham Số Đặt Lịch Toàn Cục (Global Rules)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#9BA1B0] mb-1.5 block">
              Thời lượng slot mặc định
            </label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="w-full h-10 rounded-lg bg-[#0D0E10] border border-white/[0.08] px-3 text-xs text-[#F0F2F5] focus:outline-none focus:border-[#5E6AD2] transition-colors"
            >
              <option value="45">45 phút (Quick Consultation)</option>
              <option value="60">60 phút (Chuẩn Mock Interview)</option>
              <option value="90">90 phút (Deep Architectural Review)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#9BA1B0] mb-1.5 block">
              Thời gian nghỉ giữa các buổi (Buffer)
            </label>
            <select
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
              className="w-full h-10 rounded-lg bg-[#0D0E10] border border-white/[0.08] px-3 text-xs text-[#F0F2F5] focus:outline-none focus:border-[#5E6AD2] transition-colors"
            >
              <option value="10">10 phút</option>
              <option value="15">15 phút (Khuyến nghị)</option>
              <option value="30">30 phút</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[#9BA1B0] mb-1.5 block">
              Đặt trước tối thiểu (Lead Time)
            </label>
            <select
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full h-10 rounded-lg bg-[#0D0E10] border border-white/[0.08] px-3 text-xs text-[#F0F2F5] focus:outline-none focus:border-[#5E6AD2] transition-colors"
            >
              <option value="12">12 giờ trước buổi học</option>
              <option value="24">24 giờ (Đủ thời gian đọc Intake)</option>
              <option value="48">48 giờ</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Grid: Weekly Schedule + Right Column (Mini Calendar & Time Off) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Weekly Matrix (7 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-[#F0F2F5] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#5E6AD2]" />
              Ma Trận Khung Giờ Trong Tuần (Weekly Availability)
            </h2>
            <span className="text-[11px] text-[#5D6474] font-mono">
              Auto-generate 30 days
            </span>
          </div>

          {schedule.map((day, dayIndex) => (
            <div
              key={day.dayShort}
              className={`rounded-xl border transition-all p-4 ${
                day.enabled
                  ? "bg-[#14171D] border-white/[0.08]"
                  : "bg-[#0E1013] border-white/[0.04] opacity-65"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDay(dayIndex)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      day.enabled ? "bg-[#5E6AD2]" : "bg-[#292A2C]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        day.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F2F5] font-mono">
                      {day.dayName}
                    </span>
                    {!day.enabled && (
                      <Badge variant="neutral" className="text-[10px]">
                        Nghỉ ngơi (OFF)
                      </Badge>
                    )}
                  </div>
                </div>

                {day.enabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addSlot(dayIndex)}
                    className="text-[11px] h-7 px-2.5 text-[#5E6AD2] hover:text-white hover:bg-[#5E6AD2]/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Thêm khoảng giờ
                  </Button>
                )}
              </div>

              {/* Time slot rows */}
              {day.enabled && (
                <div className="space-y-2 mt-3 pt-3 border-t border-white/[0.04]">
                  {day.slots.length === 0 ? (
                    <p className="text-xs text-[#5D6474] italic">
                      Chưa có khung giờ nào được thêm cho ngày này
                    </p>
                  ) : (
                    day.slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-2 sm:gap-3 flex-wrap"
                      >
                        <div className="flex items-center gap-2 bg-[#0D0E10] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                          <span className="text-[11px] text-[#9BA1B0] font-mono">
                            Từ:
                          </span>
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) =>
                              updateSlot(dayIndex, slot.id, "start", e.target.value)
                            }
                            className="bg-transparent text-xs font-mono text-[#F0F2F5] focus:outline-none"
                          />
                        </div>

                        <span className="text-xs text-[#5D6474]">→</span>

                        <div className="flex items-center gap-2 bg-[#0D0E10] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                          <span className="text-[11px] text-[#9BA1B0] font-mono">
                            Đến:
                          </span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              updateSlot(dayIndex, slot.id, "end", e.target.value)
                            }
                            className="bg-transparent text-xs font-mono text-[#F0F2F5] focus:outline-none"
                          />
                        </div>

                        <Badge variant="escrow" className="text-[10px] font-mono">
                          Live Available
                        </Badge>

                        <button
                          type="button"
                          onClick={() => removeSlot(dayIndex, slot.id)}
                          className="p-1.5 text-[#5D6474] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 rounded transition-colors ml-auto"
                          title="Xóa slot"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column: Mini Calendar & Time-Off (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mini Calendar 30 Days Preview */}
          <Card className="p-5 bg-[#14171D] border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#F0F2F5] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#5E6AD2]" />
                Xem Trước Lịch Tháng 10/2026
              </h3>
              <div className="flex items-center gap-1 text-[#5D6474]">
                <button className="p-1 hover:text-white transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button className="p-1 hover:text-white transition-colors">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Calendar header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-[#5D6474] mb-2">
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
              <span className="text-[#FF5C5C]/70">CN</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
              {/* Previous month empty days */}
              <span className="py-1.5 text-[#5D6474]/30">28</span>
              <span className="py-1.5 text-[#5D6474]/30">29</span>
              <span className="py-1.5 text-[#5D6474]/30">30</span>
              
              {/* October days */}
              {[...Array(31)].map((_, i) => {
                const dayNum = i + 1;
                const isWorkingDay = [1, 3, 5, 6, 8, 10, 12, 13, 15, 17, 19, 20, 22, 24, 26, 27, 29].includes(dayNum);
                const isSelected = dayNum === 18;
                return (
                  <div
                    key={dayNum}
                    className={`py-1.5 rounded text-[11px] transition-colors relative ${
                      isSelected
                        ? "bg-[#5E6AD2] text-white font-bold shadow"
                        : isWorkingDay
                        ? "bg-[#1C2028] text-[#27C98F] hover:bg-[#252B37] cursor-pointer"
                        : "text-[#5D6474] hover:text-[#9BA1B0]"
                    }`}
                  >
                    {dayNum}
                    {isWorkingDay && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#27C98F]" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#27C98F]" />
                <span className="text-[#9BA1B0]">Có slot trống</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
                <span className="text-[#9BA1B0]">Đang chọn</span>
              </div>
            </div>
          </Card>

          {/* Time-off registration */}
          <Card className="p-5 bg-[#14171D] border-white/[0.08]">
            <div className="flex items-center gap-2 mb-3">
              <CalendarOff className="h-4 w-4 text-[#F5A623]" />
              <h3 className="text-xs font-semibold text-[#F0F2F5]">
                Đăng Ký Nghỉ Phép (Time-off)
              </h3>
            </div>
            <p className="text-[11px] text-[#9BA1B0] mb-4">
              Tạm thời ẩn và hủy mở slot trong khoảng thời gian Mentor bận công tác hoặc nghỉ lễ.
            </p>

            <form onSubmit={handleLockTimeOff} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#5D6474] mb-1 block">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  value={timeOffStart}
                  onChange={(e) => setTimeOffStart(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#5D6474] mb-1 block">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  value={timeOffEnd}
                  onChange={(e) => setTimeOffEnd(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                className="w-full text-xs"
                disabled={!timeOffStart || !timeOffEnd}
              >
                {timeOffLocked ? "✓ Đã Tạm Khóa Lịch" : "Tạm Khóa Lịch Các Ngày Này"}
              </Button>
            </form>
          </Card>

          {/* Redis Info Card */}
          <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs">
            <div className="flex items-center gap-2 text-[#5E6AD2] font-semibold mb-1">
              <Zap className="h-3.5 w-3.5" />
              <span>Redis Lock Guarantee</span>
            </div>
            <p className="text-[11px] text-[#9BA1B0] leading-relaxed">
              Các thay đổi sẽ được đồng bộ và giải phóng slot cache theo key pattern:
              <code className="block mt-1 font-mono text-[10px] text-[#27C98F] bg-[#14171D] p-1.5 rounded border border-white/[0.04]">
                mentor:sched:vng_an:slots:2026-10
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
