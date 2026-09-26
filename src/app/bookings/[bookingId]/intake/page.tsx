"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  FileText,
  Code2,
  Target,
  Zap,
  Lock,
  ArrowRight,
  Info,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Chip, Currency, Textarea, Input } from "@/components/ui";

const QUICK_CHIPS = [
  "System Design Event-Driven",
  "Tối ưu CV Senior .NET",
  "Nghẽn DB PostgreSQL 10k RPS",
];

const SLOTS = [
  { id: "s1", label: "Thứ 6, 18/09 • 19:30 - 20:30", available: true, selected: true },
  { id: "s2", label: "Thứ 6, 18/09 • 20:45 - 21:45", available: true, selected: false },
  { id: "s3", label: "Thứ 7, 19/09 • 09:00 - 10:00", available: true, selected: false },
  { id: "s4", label: "Thứ 7, 19/09 • 14:00 - 15:00", available: false, selected: false },
];

export default function IntakePage() {
  const [selectedSlot, setSelectedSlot] = React.useState("s1");
  const [issue, setIssue] = React.useState("");
  const [repoUrl, setRepoUrl] = React.useState("");
  const [expectation, setExpectation] = React.useState(
    "Nắm chắc cách giải bài toán System Design và tự tin pass vòng kỹ thuật"
  );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Summary */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar size="md" alt="Nguyễn Văn An" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#F0F2F5]">
              Mock Interview System Design & .NET (60 phút)
            </p>
            <p className="text-xs text-[#9BA1B0]">
              Mentor: Nguyễn Văn An • Tạm tính:{" "}
              <Currency amount={450000} highlight="emerald" size="sm" />
            </p>
          </div>
        </div>
      </Card>

      {/* Notice */}
      <div className="rounded-xl bg-[#5E6AD2]/[0.06] border border-[#5E6AD2]/20 p-4 mb-6 flex items-start gap-3">
        <Info className="h-4 w-4 text-[#5E6AD2] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#E3E2E5] leading-relaxed">
          Khảo sát bắt buộc để Mentor nghiên cứu case trước giờ học, cam kết 100% thời lượng vào giải pháp.
        </p>
      </div>

      {/* Intake Form */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-bold text-[#F0F2F5] mb-5 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#5E6AD2]" />
          Khảo Sát Intake (3 Câu Hỏi Bắt Buộc)
        </h2>

        <div className="space-y-5">
          {/* Q1 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#E3E2E5]">
              1. Vấn đề hoặc mục tiêu kỹ thuật lớn nhất bạn muốn giải quyết? <span className="text-[#FF5C5C]">*</span>
            </label>
            <Textarea
              placeholder="Mô tả vấn đề kỹ thuật bạn cần mentor hỗ trợ (tối thiểu 30 ký tự)..."
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <Chip key={chip} variant="tag" onClick={() => setIssue(chip)}>
                  {chip}
                </Chip>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#E3E2E5]">
              2. Link GitHub repo, Figma hoặc CV Drive đính kèm <span className="text-[#FF5C5C]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#5D6474] flex-shrink-0" />
              <Input
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Q3 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#E3E2E5]">
              3. Kỳ vọng kết quả cụ thể sau buổi Mentoring? <span className="text-[#FF5C5C]">*</span>
            </label>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[#5D6474] flex-shrink-0" />
              <Input
                value={expectation}
                onChange={(e) => setExpectation(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Slot Selection */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#F0F2F5] flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#5E6AD2]" />
            Chọn Khung Giờ (Slot)
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#5D6474]">Asia/Ho_Chi_Minh (UTC+7)</span>
            <Badge variant="escrow" className="text-[9px]">Live Redis Availability</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.available}
              onClick={() => setSelectedSlot(slot.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium transition-all cursor-pointer select-none border ${
                selectedSlot === slot.id
                  ? "bg-[#5E6AD2]/10 border-[#5E6AD2]/40 text-[#BDC2FF] ring-1 ring-[#5E6AD2]/30"
                  : slot.available
                  ? "bg-[#14171D] border-white/[0.06] text-[#9BA1B0] hover:bg-[#1F2022] hover:text-[#F0F2F5]"
                  : "bg-[#0F1115] border-white/[0.04] text-[#5D6474] opacity-50 cursor-not-allowed"
              }`}
            >
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="font-mono">{slot.label}</span>
              {!slot.available && (
                <Badge variant="neutral" className="ml-auto text-[9px]">Đã đặt</Badge>
              )}
              {selectedSlot === slot.id && (
                <span className="ml-auto text-[10px] text-[#5E6AD2]">✓ Đã chọn</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-[#5D6474] font-mono mt-3 flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          Khung giờ sẽ được khóa 10 phút trên Redis (EX 600)
        </p>
      </Card>

      {/* Submit */}
      <Link href="/checkout/sb-2026-98124">
        <Button variant="primary" size="lg" className="w-full">
          <Lock className="h-4 w-4" />
          Khóa Slot & Sang Thanh Toán
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
