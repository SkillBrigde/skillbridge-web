"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
import {
  Button,
  Input,
  Checkbox,
  NoticeBanner,
} from "@/components/ui";
import { Stepper } from "@/components/ui/stepper";
import { FileUpload } from "@/components/ui/file-upload";
import { Select } from "@/components/ui/select";
import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useSession, actions } from "@/lib/store";

const STEPS = [
  { number: 1, label: "Thông tin cá nhân" },
  { number: 2, label: "Xác minh CCCD" },
  { number: 3, label: "Bằng cấp & Ngân hàng" },
  { number: 4, label: "Kết quả thẩm định" },
];

const BANKS = [
  { value: "MB Bank", label: "MB Bank (Ngân hàng Quân Đội)" },
  { value: "Vietcombank", label: "Vietcombank" },
  { value: "Techcombank", label: "Techcombank" },
  { value: "TPBank", label: "TPBank" },
  { value: "ACB", label: "ACB" },
];

export function MentorOnboardingView() {
<<<<<<< HEAD
  const router = useRouter();
=======
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
  const state = useAppState();
  const session = useSession();

  const userId = session.user?.id || "";
  const existingKyc = useMemo(
    () => state.kyc.find((k) => k.userId === userId),
    [state.kyc, userId]
  );

  const [bank, setBank] = useState("MB Bank");
  const [accountNumber, setAccountNumber] = useState("0987654321");
  const [accountHolder, setAccountHolder] = useState(session.user?.name || "NGUYEN VAN AN");
  const [certUrl, setCertUrl] = useState("https://linkedin.com/in/mentor-demo");
  const [org, setOrg] = useState("AWS & VNG Tech Lead");
  const [agreedSLA, setAgreedSLA] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const currentStep = existingKyc?.status === "Approved"
    ? 4
    : existingKyc?.status === "Pending"
    ? 4
    : 2;

  const handleSubmit = () => {
    setErrorMsg("");
    if (!accountNumber.trim()) {
      setErrorMsg("Vui lòng nhập số tài khoản ngân hàng.");
      return;
    }
    if (!accountHolder.trim()) {
      setErrorMsg("Vui lòng nhập tên chủ tài khoản ngân hàng.");
      return;
    }
    if (!agreedSLA) {
      setErrorMsg("Bạn cần đồng ý với cam kết SLA.");
      return;
    }

    setSubmitting(true);
    const res = actions.submitKyc({
      idFront: "cccd_mat_truoc.png",
      idBack: "cccd_mat_sau.png",
      phone: "0901234567",
      company: org || "VNG Tech Lead",
      linkedin: certUrl,
      certFiles: ["chung_chi_chuyen_mon.pdf"],
      certUrl: certUrl,
      issuer: org || "AWS",
      bank: {
        code: bank,
        name: bank,
        account: accountNumber.trim(),
        holder: accountHolder.trim().toUpperCase(),
      },
    });
    setSubmitting(false);

    if (!res.ok) {
      setErrorMsg(res.error || "Gửi hồ sơ thất bại.");
    }
  };

  return (
    <RequireRole role="any" title="Xác Thực Mentor eKYC" description="Đăng nhập để nộp hồ sơ thẩm định chuyên gia.">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="h-5 w-5 text-[#5E6AD2]" />
          <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
            Hồ Sơ Đăng Ký Chuyên Gia (Mentor KYC &amp; Verification)
          </h1>
        </div>
        <p className="text-sm text-[#9BA1B0] mb-8">
          Hoàn tất xác minh danh tính và liên kết tài khoản ngân hàng để nhận tích xanh Verified Mentor.
        </p>

        {/* ── Step Indicator ── */}
        <Stepper steps={STEPS} currentStep={currentStep} className="mb-10" />

        {errorMsg && <div className="mb-6"><NoticeBanner variant="error" message={errorMsg} /></div>}

        {/* Approved state */}
        {existingKyc?.status === "Approved" ? (
          <div className="rounded-2xl border border-[#27C98F]/30 bg-[#27C98F]/10 p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#27C98F]/20 text-[#27C98F]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Hồ Sơ Của Bạn Đã Được Phê Duyệt!
            </h2>
            <p className="text-sm text-[#9BA1B0] max-w-md mx-auto">
              Tài khoản của bạn đã đạt chuẩn Verified Mentor với huy hiệu tích xanh. Bạn có thể thiết lập các gói dịch vụ và mở lịch trống ngay.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/mentor/studio">
                <Button variant="primary">
                  Vào Studio Thiết Lập Gói Dịch Vụ
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : existingKyc?.status === "Pending" ? (
          <div className="rounded-2xl border border-[#F5A623]/30 bg-[#F5A623]/10 p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5A623]/20 text-[#F5A623]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Hồ Sơ Đang Trong Hàng Đợi Duyệt SLA 24h
            </h2>
            <p className="text-sm text-[#9BA1B0] max-w-md mx-auto">
              Ban Quản Trị đang đối soát thông tin CCCD và tài khoản ngân hàng của bạn. Bạn sẽ nhận được thông báo ngay khi có kết quả.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs text-[#5D6474]">
                Mã hồ sơ: #{existingKyc.id}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* ── Section 1: CCCD ── */}
            <section className="mb-10">
              <h2 className="text-base font-semibold text-[#F0F2F5] mb-2">
                1. Căn cước công dân (CCCD 2 mặt)
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
              <h2 className="text-base font-semibold text-[#F0F2F5] mb-2">
                2. Bằng cấp &amp; Chứng chỉ chuyên môn
              </h2>
              <div className="space-y-4">
                <FileUpload
                  accept=".pdf,image/*"
                  maxSizeMB={10}
                  label="Tải lên bằng cấp / chứng chỉ (PDF, PNG, JPG)"
                  multiple
                />
                <Input
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                  placeholder="URL chứng chỉ trực tuyến (VD: Credly, LinkedIn)"
                />
                <Input
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="Tổ chức cấp (VD: AWS, Microsoft, Đại học Bách Khoa)"
                />
              </div>
            </section>

            {/* ── Section 3: Bank KYC Payout ── */}
            <section className="mb-10">
              <h2 className="text-base font-semibold text-[#F0F2F5] mb-2">
                3. Tài khoản ngân hàng nhận tiền (KYC Payout)
              </h2>
              <div className="space-y-4">
                <Select
                  label="Tên ngân hàng"
                  options={BANKS}
                  value={bank}
                  onChange={setBank}
                />
                <div>
                  <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
                    Số tài khoản
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="VD: 0987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
                    Tên chủ tài khoản (phải khớp chính xác với CCCD)
                  </label>
                  <Input
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="NGUYEN VAN AN"
                    className="uppercase font-mono"
                  />
                </div>
              </div>
            </section>

            {/* ── Notice + SLA Agreement ── */}
            <NoticeBanner variant="info" className="mb-6">
              Hồ sơ của bạn sẽ được Ban Quản Trị thẩm định trong vòng 24–48 giờ. Bạn sẽ nhận thông báo khi được cấp tích xanh Verified Mentor.
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
              disabled={!agreedSLA || submitting}
              onClick={handleSubmit}
            >
              Gửi Hồ Sơ Xác Minh Cho Ban Quản Trị
            </Button>
          </>
        )}
      </div>
    </RequireRole>
  );
}
