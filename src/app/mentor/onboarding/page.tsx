"use client";

import React from "react";
import { Upload, Landmark, ShieldCheck, FileText, Check } from "lucide-react";
import { Badge, Button, Card, Input, Checkbox, Stepper } from "@/components/ui";

const STEPS = [
  { number: 1, label: "Thông tin cá nhân" },
  { number: 2, label: "Xác minh CCCD" },
  { number: 3, label: "Bằng cấp / Chứng chỉ" },
  { number: 4, label: "Chờ duyệt" },
];

export default function MentorOnboardingPage() {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-2">
        Hồ Sơ Đăng Ký Chuyên Gia (Mentor KYC & Verification)
      </h1>
      <p className="text-xs text-[#9BA1B0] mb-6">Hoàn tất 4 bước để trở thành Verified Mentor trên SkillBridge</p>

      <Stepper steps={STEPS} currentStep={2} className="mb-8" />

      {/* Section 1: CCCD */}
      <Card className="p-6 mb-4">
        <h2 className="text-sm font-bold text-[#F0F2F5] mb-1 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#5E6AD2]" />
          Căn cước công dân (CCCD 2 mặt)
        </h2>
        <p className="text-[10px] text-[#5D6474] mb-4 font-mono">Lưu trữ mã hóa riêng tư trên MinIO Private S3 bucket</p>
        <div className="grid grid-cols-2 gap-3">
          {["Mặt Trước", "Mặt Sau"].map((side) => (
            <div key={side} className="rounded-xl border-2 border-dashed border-white/[0.08] bg-[#0F1115] p-8 text-center cursor-pointer hover:border-[#5E6AD2]/30 transition-colors">
              <Upload className="h-6 w-6 text-[#5D6474] mx-auto mb-2" />
              <p className="text-xs text-[#9BA1B0]">CCCD {side}</p>
              <p className="text-[10px] text-[#5D6474] mt-1">Kéo thả hoặc click</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 2: Degrees */}
      <Card className="p-6 mb-4">
        <h2 className="text-sm font-bold text-[#F0F2F5] mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#5E6AD2]" />
          Bằng cấp & Chứng chỉ chuyên môn
        </h2>
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-dashed border-white/[0.08] bg-[#0F1115] p-6 text-center cursor-pointer hover:border-[#5E6AD2]/30 transition-colors">
            <Upload className="h-5 w-5 text-[#5D6474] mx-auto mb-2" />
            <p className="text-xs text-[#9BA1B0]">Upload bằng cấp, chứng chỉ (PDF/PNG)</p>
          </div>
          <Input placeholder="URL xác minh chứng chỉ (ví dụ: Credly, Coursera)" />
          <Input placeholder="Tổ chức cấp (AWS, Microsoft, Đại học Bách Khoa...)" />
        </div>
      </Card>

      {/* Section 3: Bank Account */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-bold text-[#F0F2F5] mb-4 flex items-center gap-2">
          <Landmark className="h-4 w-4 text-[#27C98F]" />
          Tài khoản ngân hàng nhận tiền (KYC Payout)
        </h2>
        <div className="space-y-3">
          <Input placeholder="Tên ngân hàng (VD: MB Bank, Vietcombank)" />
          <Input placeholder="Số tài khoản" />
          <Input placeholder="Tên chủ thẻ (phải khớp CCCD)" />
        </div>
      </Card>

      <Checkbox
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        label={<span className="text-xs text-[#9BA1B0]">Tôi cam kết tuân thủ SLA phản hồi trong 24h và chính sách phòng học của SkillBridge.</span>}
        className="mb-6"
      />

      <Button variant="primary" size="lg" className="w-full" disabled={!agreed}>
        <Check className="h-4 w-4" />
        Gửi Hồ Sơ Xác Minh Cho Ban Quản Trị
      </Button>
    </div>
  );
}
