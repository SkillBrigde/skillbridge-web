"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Textarea,
} from "@/components/ui";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { Scale } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const DISPUTE_REASONS = [
  { value: "absent", label: "Mentor vắng mặt hoặc không tham gia buổi học" },
  { value: "early_end", label: "Kết thúc sớm > 20 phút so với thời lượng cam kết" },
  { value: "wrong_content", label: "Nội dung không đúng cam kết của gói dịch vụ" },
  { value: "tech_issue", label: "Sự cố kỹ thuật từ phía Mentor (mất kết nối lâu)" },
];

const RESOLUTION_OPTIONS = [
  {
    value: "full_refund",
    label: "Hoàn lại 100% tiền về ví",
    description: "Tiền Escrow sẽ được hoàn nguyên vào ví SkillBridge của bạn.",
  },
  {
    value: "reschedule",
    label: "Yêu cầu Mentor xếp lịch học bù miễn phí",
    description: "Mentor sẽ phải sắp xếp 1 buổi bù tương đương trong vòng 7 ngày.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function NewDisputePage() {
  const [reason, setReason] = useState("early_end");
  const [resolution, setResolution] = useState("full_refund");
  const [description, setDescription] = useState(
    "Mentor vào trễ 15 phút và kết thúc buổi học sau 30 phút do việc riêng, chưa sửa bản thiết kế kiến trúc như cam kết gói 60 phút."
  );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <Scale className="h-5 w-5 text-[#FF5C5C]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Khởi Tạo Khiếu Nại Buổi Học #SB-2026-98124
        </h1>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Avatar alt="Nguyễn Văn An" size="sm" />
        <span className="text-sm text-[#9BA1B0]">
          Mentor: Nguyễn Văn An
        </span>
      </div>

      {/* ── Warning Notice ── */}
      <NoticeBanner variant="warning" className="mb-8">
        Khiếu nại sẽ đóng băng giải ngân Escrow{" "}
        <span className="font-mono font-semibold">450.000 ₫</span> và kích hoạt
        quy trình phán quyết SLA 48h của Ban Quản Trị.
      </NoticeBanner>

      {/* ── Form ── */}
      <div className="space-y-8">
        {/* 1. Reason dropdown */}
        <Select
          label="Lý do chính"
          options={DISPUTE_REASONS}
          value={reason}
          onChange={setReason}
        />

        {/* 2. Description */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            Mô tả chi tiết sự việc
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {/* 3. File upload */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            Đính kèm ảnh chụp màn hình bằng chứng / biên bản tin nhắn chat
          </label>
          <FileUpload
            accept="image/*,.pdf"
            maxSizeMB={10}
            label="Kéo thả hoặc click để tải lên bằng chứng"
          />
        </div>

        {/* 4. Resolution options */}
        <RadioGroup
          name="resolution"
          label="Lựa chọn mong muốn giải quyết"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={setResolution}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t border-white/[0.06]">
        <Button variant="ghost">← Quay lại</Button>
        <Button variant="destructive" size="lg">
          Gửi Khiếu Nại Lên Ban Quản Trị (Mở SLA 48h)
        </Button>
      </div>
    </div>
  );
}
