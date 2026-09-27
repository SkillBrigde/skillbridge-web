"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
} from "@/components/ui";
import { Stepper } from "@/components/ui/stepper";
import { FileUpload } from "@/components/ui/file-upload";
import { Select } from "@/components/ui/select";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { ShieldCheck } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const STEPS = [
  { number: 1, label: "Thông tin cá nhân" },
  { number: 2, label: "Xác minh CCCD" },
  { number: 3, label: "Bằng cấp / Chứng chỉ" },
  { number: 4, label: "Chờ duyệt" },
];

const BANKS = [
  { value: "mbbank", label: "MB Bank" },
  { value: "vietcombank", label: "Vietcombank" },
  { value: "techcombank", label: "Techcombank" },
  { value: "tpbank", label: "TPBank" },
  { value: "acb", label: "ACB" },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function MentorOnboardingPage() {
  const [currentStep] = useState(2);
  const [agreedSLA, setAgreedSLA] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="h-5 w-5 text-[#5E6AD2]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Hồ Sơ Đăng Ký Chuyên Gia (Mentor KYC &amp; Verification)
        </h1>
      </div>
      <p className="text-sm text-[#9BA1B0] mb-8">
        Hoàn tất xác minh danh tính để nhận tích xanh Verified Mentor.
      </p>

      {/* ── Step Indicator ── */}
      <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

      {/* ── Section 1: CCCD ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#F0F2F5] mb-2">
          Căn cước công dân (CCCD 2 mặt)
        </h2>
        <p className="text-xs text-[#5D6474] mb-4">
          Lưu trữ mã hóa riêng tư trên MinIO Private S3 bucket
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload
            accept="image/*"
            maxSizeMB={5}
            label="CCCD — Mặt trước"
          />
          <FileUpload
            accept="image/*"
            maxSizeMB={5}
            label="CCCD — Mặt sau"
          />
        </div>
      </section>

      {/* ── Section 2: Bằng cấp & Chứng chỉ ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#F0F2F5] mb-4">
          Bằng cấp &amp; Chứng chỉ chuyên môn
        </h2>
        <div className="space-y-4">
          <FileUpload
            accept=".pdf,image/*"
            maxSizeMB={10}
            label="Tải lên bằng cấp / chứng chỉ (PDF, PNG, JPG)"
            multiple
          />
          <Input placeholder="URL chứng chỉ trực tuyến (VD: Credly, LinkedIn)" />
          <Input
            placeholder="Tổ chức cấp (VD: AWS, Microsoft, Đại học Bách Khoa)"
          />
        </div>
      </section>

      {/* ── Section 3: Bank KYC Payout ── */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#F0F2F5] mb-4">
          Tài khoản ngân hàng nhận tiền (KYC Payout)
        </h2>
        <div className="space-y-4">
          <Select
            label="Tên ngân hàng"
            options={BANKS}
            placeholder="Chọn ngân hàng..."
          />
          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
              Số tài khoản
            </label>
            <Input placeholder="VD: 0987654321" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
              Tên chủ thẻ (khớp CCCD)
            </label>
            <Input placeholder="NGUYEN VAN AN" className="uppercase" />
          </div>
        </div>
      </section>

      {/* ── Notice + SLA Agreement ── */}
      <NoticeBanner variant="info" className="mb-6">
        Hồ sơ của bạn sẽ được Ban Quản Trị thẩm định trong vòng 24–48 giờ. Bạn
        sẽ nhận thông báo qua email khi được phê duyệt.
      </NoticeBanner>

      <Checkbox
        label="Tôi cam kết tuân thủ SLA phản hồi trong 24h và chính sách phòng học của SkillBridge."
        checked={agreedSLA}
        onChange={(e) => setAgreedSLA(e.target.checked)}
        className="mb-8"
      />

      {/* ── Submit ── */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!agreedSLA}
      >
        Gửi Hồ Sơ Xác Minh Cho Ban Quản Trị
      </Button>
    </div>
  );
}
