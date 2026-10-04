"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Checkbox,
} from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-[420px] rounded-xl bg-[#14171D] border border-white/[0.08] p-8">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#5E6AD2]/15 border border-[#5E6AD2]/30 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-[#5E6AD2]"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-1">
            Đăng Nhập Vào SkillBridge
          </h1>
          <p className="text-xs text-[#9BA1B0]">
            Nền tảng kết nối 1-on-1 Mentoring &amp; Escrow Ledger
          </p>
        </div>

        {/* OAuth Button */}
        <button className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-colors mb-5 cursor-pointer">
          {/* Google icon */}
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
          Tiếp tục với Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-[1px] bg-white/[0.08]" />
          <span className="text-xs text-[#5D6474]">
            hoặc đăng nhập bằng email
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.08]" />
        </div>

        {/* Email Form */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5">
              Email công việc hoặc học tập
            </label>
            <Input placeholder="name@company.com" type="email" />
          </div>
          <div>
            <label className="block text-xs text-[#9BA1B0] mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D6474] hover:text-[#F0F2F5] transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-6">
          <Checkbox
            label="Ghi nhớ 30 ngày"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <a
            href="#"
            className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors"
          >
            Quên mật khẩu?
          </a>
        </div>

        {/* Submit */}
        <Button variant="primary" size="lg" className="w-full">
          Đăng Nhập
        </Button>

        {/* Footer */}
        <p className="text-xs text-[#9BA1B0] text-center mt-6">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-[#5E6AD2] hover:text-[#BDC2FF] font-semibold underline underline-offset-4"
          >
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}
