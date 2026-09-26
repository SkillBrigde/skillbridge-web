"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Upload, FileText, ArrowLeft, ShieldAlert } from "lucide-react";
import { Avatar, Badge, Button, Card, Textarea, Input } from "@/components/ui";

const REASONS = [
  "Mentor vắng mặt hoặc kết thúc buổi học trước thời hạn cam kết",
  "Kết thúc sớm > 20 phút so với thời lượng gói",
  "Nội dung không đúng cam kết của gói dịch vụ",
  "Sự cố kỹ thuật từ phía Mentor",
];

export default function NewDisputePage() {
  const [reason, setReason] = React.useState(REASONS[0]);
  const [description, setDescription] = React.useState(
    "Mentor vào trễ 15 phút và kết thúc buổi học sau 30 phút do việc riêng, chưa sửa bản thiết kế kiến trúc như cam kết gói 60 phút."
  );
  const [resolution, setResolution] = React.useState("refund");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings" className="text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#F0F2F5] tracking-tight">
            Khởi Tạo Khiếu Nại Buổi Học #SB-2026-98124
          </h1>
          <p className="text-xs text-[#9BA1B0]">Mentor: Nguyễn Văn An</p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="rounded-xl bg-[#FF5C5C]/[0.06] border border-[#FF5C5C]/20 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-[#FF5C5C] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#E3E2E5] leading-relaxed">
          Khiếu nại sẽ <strong>đóng băng giải ngân Escrow 450.000 ₫</strong> và kích hoạt quy trình phán quyết SLA 48h của Ban Quản Trị.
        </p>
      </div>

      {/* Form */}
      <Card className="p-6 space-y-5">
        {/* Reason */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#E3E2E5]">1. Lý do chính <span className="text-[#FF5C5C]">*</span></label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-10 bg-[#0F1115] border border-white/[0.08] rounded-xl px-3.5 text-sm text-[#F0F2F5] outline-none cursor-pointer appearance-none"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#E3E2E5]">2. Mô tả chi tiết <span className="text-[#FF5C5C]">*</span></label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#E3E2E5]">3. Đính kèm bằng chứng</label>
          <div className="rounded-xl border-2 border-dashed border-white/[0.08] bg-[#0F1115] p-8 text-center cursor-pointer hover:border-[#5E6AD2]/30 transition-colors">
            <Upload className="h-6 w-6 text-[#5D6474] mx-auto mb-2" />
            <p className="text-xs text-[#9BA1B0]">Kéo thả hoặc click để tải lên</p>
            <p className="text-[10px] text-[#5D6474] mt-1">PNG, JPG, PDF — Tối đa 10MB</p>
          </div>
        </div>

        {/* Resolution */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-[#E3E2E5]">4. Lựa chọn mong muốn</label>
          <div className="space-y-2">
            {[
              { id: "refund", label: "Hoàn lại 100% tiền về ví" },
              { id: "makeup", label: "Yêu cầu Mentor xếp lịch học bù miễn phí" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer transition-all ${
                  resolution === opt.id
                    ? "bg-[#FF5C5C]/[0.06] border-[#FF5C5C]/25 text-[#F0F2F5]"
                    : "bg-[#0F1115] border-white/[0.06] text-[#9BA1B0] hover:bg-[#14171D]"
                }`}
              >
                <input
                  type="radio"
                  name="resolution"
                  value={opt.id}
                  checked={resolution === opt.id}
                  onChange={() => setResolution(opt.id)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                  resolution === opt.id ? "border-[#FF5C5C]" : "border-white/20"
                }`}>
                  {resolution === opt.id && <div className="h-2 w-2 rounded-full bg-[#FF5C5C]" />}
                </div>
                <span className="text-xs">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6">
        <Link href="/bookings" className="flex-1">
          <Button variant="ghost" className="w-full">Quay lại</Button>
        </Link>
        <Button variant="destructive" className="flex-1" size="lg">
          <ShieldAlert className="h-4 w-4" />
          Gửi Khiếu Nại Lên Ban Quản Trị (Mở SLA 48h)
        </Button>
      </div>
    </div>
  );
}
