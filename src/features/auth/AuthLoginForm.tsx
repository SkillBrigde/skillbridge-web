<<<<<<< HEAD
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Input,
  Checkbox,
  NoticeBanner,
  Modal,
} from "@/components/ui";
import { Eye, EyeOff, UserCheck, ShieldCheck } from "lucide-react";
import { actions } from "@/lib/store";

export function AuthLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    const res = actions.login(email.trim(), password);
    if (!res.ok) {
      setErrorMsg(res.error || "Đăng nhập không thành công.");
      return;
    }
    if (nextUrl) {
      router.push(nextUrl);
    } else {
      router.push("/mentors");
    }
  };

  const handleDemoLogin = (userId: string) => {
    const res = actions.loginAs(userId);
    if (res.ok) {
      if (nextUrl) {
        router.push(nextUrl);
      } else if (userId === "u-admin") {
        router.push("/admin/disputes");
      } else if (userId === "u-an") {
        router.push("/mentor/studio");
      } else {
        router.push("/bookings");
      }
    }
  };

  const handleGoogleDemo = () => {
    const res = actions.loginWithGoogleDemo("mentee");
    if (res.ok) {
      router.push(nextUrl || "/mentors");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="w-full max-w-[440px] rounded-2xl bg-[#14171D] border border-white/[0.08] p-8 shadow-2xl relative">
        {/* Logo + Title */}
        <div className="text-center mb-6">
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

        {errorMsg && (
          <div className="mb-4">
            <NoticeBanner variant="error" message={errorMsg} />
          </div>
        )}

        {/* Demo Fast Logins */}
        <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0D0E10] p-3">
          <p className="text-[11px] font-mono text-[#5D6474] uppercase tracking-wider mb-2 text-center">
            Đăng nhập nhanh bằng tài khoản Demo (pass: 12345678)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("u-linh")}
              className="flex flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#14171D] p-2 hover:border-[#27C98F] transition-all group"
            >
              <UserCheck className="h-4 w-4 text-[#27C98F] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#F0F2F5]">Linh</span>
              <span className="text-[10px] text-[#5D6474]">Mentee</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("u-an")}
              className="flex flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#14171D] p-2 hover:border-[#5E6AD2] transition-all group"
            >
              <UserCheck className="h-4 w-4 text-[#7C87ED] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#F0F2F5]">An</span>
              <span className="text-[10px] text-[#5D6474]">Mentor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("u-admin")}
              className="flex flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-[#14171D] p-2 hover:border-[#FF5C5C] transition-all group"
            >
              <ShieldCheck className="h-4 w-4 text-[#FF5C5C] mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-[#F0F2F5]">Admin</span>
              <span className="text-[10px] text-[#5D6474]">SLA</span>
            </button>
          </div>
        </div>

        {/* OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleDemo}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-white text-gray-800 font-medium text-sm hover:bg-gray-100 transition-colors mb-5 cursor-pointer shadow-sm"
        >
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
          Tiếp tục với Google (Demo)
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
                Email công việc hoặc học tập
              </label>
              <Input
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
                Mật khẩu
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
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setForgotSent(false);
                setShowForgotModal(true);
              }}
              className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Đăng Nhập
          </Button>
        </form>

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

        {/* Forgot password modal */}
        <Modal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          title="Khôi phục mật khẩu demo"
        >
          <div className="space-y-4 py-2">
            <p className="text-xs text-[#9BA1B0]">
              Trong môi trường demo, mật khẩu mặc định của tất cả tài khoản mẫu (Linh, An, Admin) là:{" "}
              <span className="font-mono font-bold text-white">12345678</span>
            </p>
            {forgotSent ? (
              <NoticeBanner
                variant="success"
                message="Đã gửi email khôi phục demo (tất cả tài khoản test dùng mật khẩu: 12345678)."
              />
            ) : (
              <div>
                <label className="block text-xs text-[#9BA1B0] mb-1.5 font-medium">
                  Địa chỉ email tài khoản
                </label>
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="mt-4 w-full"
                  onClick={() => setForgotSent(true)}
                >
                  Gửi liên kết khôi phục
                </Button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export const LoginForm = AuthLoginForm;
=======
import { AccountForm } from "./components/AccountForm";
export function AuthLoginForm() {
  return <AccountForm mode="login" />;
}
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
