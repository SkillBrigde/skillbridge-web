import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthRegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Tạo tài khoản",
  description:
    "Bắt đầu cùng SkillBridge với vai trò Mentee hoặc Mentor. Kết nối kinh nghiệm, mở lối tiến xa.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="sb-page-state">Đang tải…</div>}>
      <AuthRegisterForm />
    </Suspense>
  );
}
