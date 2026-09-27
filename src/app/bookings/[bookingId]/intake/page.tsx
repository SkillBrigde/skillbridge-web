"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
  Input,
} from "@/components/ui";
import { SlotPicker, type SlotOption } from "@/components/ui/slot-picker";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { Chip } from "@/components/ui/chip";
import { Calendar, ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const BOOKING_SUMMARY = {
  service: "Mock Interview System Design & .NET (60 phút)",
  mentor: "Nguyễn Văn An",
  price: "450.000 ₫",
};

const QUICK_CHIPS = [
  "System Design Event-Driven",
  "Tối ưu CV Senior .NET",
  "Nghẽn DB PostgreSQL 10k RPS",
];

const SLOTS: SlotOption[] = [
  {
    id: "slot-1",
    date: "Thứ 6, 18/09",
    time: "19:30 - 20:30",
    available: true,
  },
  {
    id: "slot-2",
    date: "Thứ 6, 18/09",
    time: "20:45 - 21:45",
    available: true,
  },
  {
    id: "slot-3",
    date: "Thứ 7, 19/09",
    time: "09:00 - 10:00",
    available: true,
  },
  {
    id: "slot-4",
    date: "Thứ 7, 19/09",
    time: "14:00 - 15:00",
    available: false,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function IntakePage() {
  const [selectedSlot, setSelectedSlot] = useState("slot-1");
  const [issue, setIssue] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Top Summary ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Avatar alt={BOOKING_SUMMARY.mentor} size="sm" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            {BOOKING_SUMMARY.service}
          </h1>
          <p className="text-xs text-[#9BA1B0]">
            Mentor: {BOOKING_SUMMARY.mentor} • Tạm tính:{" "}
            <span className="font-mono text-[#F0F2F5]">
              {BOOKING_SUMMARY.price}
            </span>
          </p>
        </div>
      </div>

      {/* ── Notice ── */}
      <NoticeBanner variant="info" className="mb-8">
        Khảo sát bắt buộc để Mentor nghiên cứu case trước giờ học, cam kết 100%
        thời lượng vào giải pháp thay vì tìm hiểu bối cảnh.
      </NoticeBanner>

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
            className="mb-2"
          />
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
          />
        </div>

        {/* Q3 */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            3. Kỳ vọng kết quả cụ thể sau buổi Mentoring?{" "}
            <span className="text-[#FF5C5C]">*</span>
          </label>
          <Input
            defaultValue="Nắm chắc cách giải bài toán System Design và tự tin pass vòng kỹ thuật"
          />
        </div>
      </section>

      {/* ── Slot Selection Grid ── */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
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

        <SlotPicker
          slots={SLOTS}
          selectedId={selectedSlot}
          onChange={setSelectedSlot}
        />
      </section>

      {/* ── Footer ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
        <p className="text-xs text-[#5D6474] flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#F5A623]" />
          Khung giờ sẽ được khóa 10 phút trên Redis để đảm bảo tính công bằng
        </p>
        <Button variant="primary" size="lg">
          Khóa Slot &amp; Sang Thanh Toán →
        </Button>
      </div>
    </div>
  );
}
