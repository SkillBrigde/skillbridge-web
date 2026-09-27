"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Textarea,
} from "@/components/ui";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { Scale, Clock } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const RESOLUTION_OPTIONS = [
  {
    value: "compensate",
    label: "Đồng ý dạy bù 1 buổi 60 phút miễn phí cho Mentee",
    description: "Tiền Escrow giữ nguyên, bạn cam kết lịch bù trong 7 ngày.",
  },
  {
    value: "split",
    label: "Đồng ý chia đôi 50/50 tiền ký quỹ",
    description: "Mỗi bên nhận 225.000 ₫. Không ảnh hưởng điểm uy tín.",
  },
  {
    value: "reject",
    label: "Bác bỏ khiếu nại và yêu cầu Admin xem xét lại log máy chủ",
    description: "Admin sẽ xem lại WebRTC attendance log để phán quyết.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function DisputeDefensePage() {
  const [resolution, setResolution] = useState("compensate");
  const [defense, setDefense] = useState(
    "Tôi có mặt lúc 19:40 do sự cố kỹ thuật. Đã thông báo mentee dạy bù thêm nhưng mentee không đồng ý. Đã gửi tài liệu rubric qua email sau buổi học."
  );

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <Scale className="h-5 w-5 text-[#F5A623]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Giải Trình Khiếu Nại Cho Buổi Học #SB-2026-98124
        </h1>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="pending" dot>
          <Clock className="h-3 w-3 mr-0.5" />
          SLA 24h phản hồi
        </Badge>
      </div>

      {/* ── Mentee Claim Card ── */}
      <Card className="p-5 mb-8 border-[#FF5C5C]/20">
        <div className="flex items-center gap-3 mb-3">
          <Avatar alt="Hoàng Thùy Linh" size="sm" />
          <div>
            <span className="text-sm font-medium text-[#F0F2F5]">
              Hoàng Thùy Linh
            </span>
            <span className="text-xs text-[#5D6474] ml-2">Mentee</span>
          </div>
          <Badge variant="dispute" className="ml-auto">
            Khiếu nại
          </Badge>
        </div>
        <p className="text-sm text-[#E3E2E5] leading-relaxed bg-[#FF5C5C]/5 rounded-lg p-3 border border-[#FF5C5C]/10">
          &ldquo;Mentor vào trễ 15 phút và kết thúc buổi học sau 30 phút do việc
          riêng, chưa sửa bản thiết kế kiến trúc như cam kết gói 60 phút.&rdquo;
        </p>
      </Card>

      {/* ── Mentor Defense Form ── */}
      <div className="space-y-8">
        {/* Defense textarea */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            Ý kiến giải trình của bạn đối với khiếu nại trên{" "}
            <span className="text-[#FF5C5C]">*</span>
          </label>
          <Textarea
            value={defense}
            onChange={(e) => setDefense(e.target.value)}
            rows={4}
          />
        </div>

        {/* Upload evidence */}
        <div>
          <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
            Upload bổ sung bằng chứng
          </label>
          <p className="text-xs text-[#5D6474] mb-3">
            Nhật ký cuộc gọi, video ghi hình, email đã gửi tài liệu
          </p>
          <FileUpload
            accept="image/*,.pdf,.mp4"
            maxSizeMB={50}
            label="Kéo thả bằng chứng bổ sung"
            multiple
          />
        </div>

        {/* Resolution proposal */}
        <RadioGroup
          name="resolution"
          label="Đề xuất giải quyết"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={setResolution}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex justify-end pt-8 mt-8 border-t border-white/[0.06]">
        <Button variant="primary" size="lg">
          Gửi Giải Trình Cho Admin Phán Quyết
        </Button>
      </div>
    </div>
  );
}
