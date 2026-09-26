"use client";

import React from "react";
import Link from "next/link";
import { Eye, EyeOff, ShieldCheck, Lock, Fingerprint } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Badge, Button, Input, Checkbox } from "@/components/ui";

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Raycast Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#454652_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05] pointer-events-none" />

      {/* Glow accent behind card */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5E6AD2]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Card Container */}
        <div className="rounded-2xl bg-[#14171D] border border-white/[0.08] p-8 shadow-2xl animate-fade-in">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-8">
            <Logo size={44} showText={false} className="mb-4" />
            <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight text-center">
              Đăng Nhập Vào SkillBridge
            </h1>
            <p className="text-xs text-[#9BA1B0] mt-1.5 text-center leading-relaxed">
              Nền tảng kết nối 1-on-1 Mentoring & Escrow Ledger
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-[#F0F2F5] hover:bg-white text-[#1F2022] font-medium text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
          >
            {/* Google Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] text-[#5D6474] uppercase tracking-wider font-mono">
              hoặc đăng nhập bằng email
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-medium text-[#9BA1B0]">
                Email công việc hoặc học tập
              </label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-xs font-medium text-[#9BA1B0]">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5D6474] hover:text-[#9BA1B0] transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <Checkbox
                id="login-remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                label={<span className="text-xs text-[#9BA1B0]">Ghi nhớ 30 ngày</span>}
              />
              <Link
                href="#"
                className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full mt-2" size="lg">
              Đăng Nhập
            </Button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-[#9BA1B0] mt-6">
            Chưa có tài khoản?{" "}
            <Link
              href="/mentors"
              className="text-[#5E6AD2] hover:text-[#BDC2FF] font-medium transition-colors"
            >
              Đăng ký làm Mentee
            </Link>{" "}
            hoặc{" "}
            <Link
              href="/mentor/onboarding"
              className="text-[#27C98F] hover:text-[#48DFA3] font-medium transition-colors"
            >
              Trở thành Mentor
            </Link>
          </p>
        </div>

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5D6474]">
            <ShieldCheck className="h-3 w-3 text-[#27C98F]" />
            <span>ISO-27001</span>
          </div>
          <span className="text-white/10">•</span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5D6474]">
            <Lock className="h-3 w-3 text-[#5E6AD2]" />
            <span>256-Bit Encryption</span>
          </div>
          <span className="text-white/10">•</span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#5D6474]">
            <Fingerprint className="h-3 w-3 text-[#F5A623]" />
            <span>Zero-Trust Audited</span>
          </div>
        </div>

        {/* Session Telemetry */}
        <div className="mt-4 text-center text-[10px] font-mono text-[#5D6474]/60">
          Session Nonce: TLS 1.3 SHA-384 • RayID: 88f192b0c12
        </div>
      </div>
    </div>
  );
}
