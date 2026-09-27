"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Checkbox,
} from "@/components/ui";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, User, Award } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"mentee" | "mentor">("mentee");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="w-full max-w-[460px] rounded-2xl bg-[#14171D] border border-white/[0.08] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-[#5E6AD2]/15 blur-3xl" />

        {/* Brand Icon + Title */}
        <div className="text-center mb-6 relative">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 mb-3.5">
            <ShieldCheck className="h-6 w-6 text-[#5E6AD2]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight mb-1.5">
            Tạo Tài Khoản SkillBridge
          </h1>
          <p className="text-xs text-[#9BA1B0]">
            Bảo chứng học phí 100% qua Escrow Vault &amp; Kết nối chuyên gia thực chiến
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0D0E10] border border-white/[0.08] mb-6">
          <button
            type="button"
            onClick={() => setRole("mentee")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === "mentee"
                ? "bg-[#5E6AD2] text-white shadow-md"
                : "text-[#9BA1B0] hover:text-[#F0F2F5]"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Tôi là Mentee
          </button>
          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              role === "mentor"
                ? "bg-[#5E6AD2] text-white shadow-md"
                : "text-[#9BA1B0] hover:text-[#F0F2F5]"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Tôi là Mentor
          </button>
        </div>

        {/* OAuth Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-colors mb-5 cursor-pointer shadow-sm"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Đăng ký nhanh bằng Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-[1px] bg-white/[0.08]" />
          <span className="text-xs text-[#5D6474]">hoặc đăng ký bằng email</span>
          <div className="flex-1 h-[1px] bg-white/[0.08]" />
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
              Họ và tên đầy đủ *
            </label>
            <Input placeholder="Nguyễn Văn A" type="text" />
          </div>

          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
              Email công việc / cá nhân *
            </label>
            <Input placeholder="name@domain.com" type="email" />
          </div>

          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
              Mật khẩu (Tối thiểu 8 ký tự) *
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D6474] hover:text-[#F0F2F5] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
              Nhập lại mật khẩu *
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D6474] hover:text-[#F0F2F5] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-[#FF5C5C] mt-1.5 animate-fade-in">
                Mật khẩu nhập lại không khớp
              </p>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <p className="text-xs text-[#27C98F] mt-1.5 flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="h-3 w-3" /> Mật khẩu hoàn toàn trùng khớp
              </p>
            )}
          </div>

          {role === "mentor" && (
            <div className="rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 p-3 text-xs text-[#9BA1B0] flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-[#5E6AD2] flex-shrink-0 mt-0.5" />
              <span>
                Sau khi tạo tài khoản, bạn sẽ được chuyển đến bước xác thực danh tính (eKYC) và thiết lập gói dịch vụ giảng dạy.
              </span>
            </div>
          )}
        </div>

        {/* Terms agreement */}
        <div className="mb-6">
          <Checkbox
            label="Tôi đồng ý với Điều khoản dịch vụ và Quy chế bảo chứng Escrow của SkillBridge"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
        </div>

        {/* Submit */}
        <Link href={role === "mentor" ? "/mentor/onboarding" : "/mentors"}>
          <Button variant="primary" size="lg" className="w-full font-semibold">
            {role === "mentor" ? "Tiếp Tục Đăng Ký Mentor" : "Đăng Ký Tài Khoản"}
          </Button>
        </Link>

        {/* Footer Toggle to Login */}
        <p className="text-xs text-[#9BA1B0] text-center mt-6">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-[#5E6AD2] hover:text-[#BDC2FF] font-medium underline underline-offset-4">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
