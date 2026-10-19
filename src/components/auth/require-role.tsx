"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHydrated, useSession, actions } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShieldAlert, UserCheck, ArrowRight, Sparkles } from "lucide-react";

export interface RequireRoleProps {
  children: React.ReactNode;
  role?: "mentee" | "mentor" | "admin" | "any";
  title?: string;
  description?: string;
}

export function RequireRole({
  children,
  role = "any",
  title,
  description,
}: RequireRoleProps) {
  const hydrated = useHydrated();
  const session = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5E6AD2] border-t-transparent" />
          <p className="text-sm font-mono text-[#9BA1B0]">Đang tải dữ liệu phiên làm việc...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session.user || !session.role) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl border border-white/[0.08] bg-[#14171D] p-6 text-center shadow-2xl sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#7C87ED]">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-[#F0F2F5]">
            {title || "Yêu cầu đăng nhập"}
          </h2>
          <p className="mt-2 text-sm text-[#9BA1B0]">
            {description || "Bạn cần đăng nhập tài khoản SkillBridge để truy cập trang này."}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
              <Button variant="primary" className="w-full justify-center">
                Đăng nhập ngay
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#14171D] px-2 text-[#5D6474]">Hoặc chọn tài khoản demo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => {
                  actions.loginAs("u-linh");
                  router.refresh();
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0D0E10] px-2.5 py-2 text-xs font-medium text-[#E3E2E5] hover:border-[#5E6AD2] hover:text-white transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#27C98F]" />
                Linh (Mentee)
              </button>
              <button
                type="button"
                onClick={() => {
                  actions.loginAs("u-an");
                  router.refresh();
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0D0E10] px-2.5 py-2 text-xs font-medium text-[#E3E2E5] hover:border-[#5E6AD2] hover:text-white transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#5E6AD2]" />
                An (Mentor)
              </button>
              <button
                type="button"
                onClick={() => {
                  actions.loginAs("u-admin");
                  router.refresh();
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#0D0E10] px-2.5 py-2 text-xs font-medium text-[#E3E2E5] hover:border-[#FF5C5C] hover:text-white transition-colors"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#FF5C5C]" />
                Admin SLA
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role match
  if (role !== "any") {
    const isRoleMatch =
      role === "admin"
        ? session.user.roles.includes("admin")
        : role === "mentor"
        ? session.role === "mentor"
        : session.role === "mentee";

    if (!isRoleMatch) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 py-12">
          <div className="w-full rounded-2xl border border-white/[0.08] bg-[#14171D] p-6 text-center shadow-2xl sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/30 text-[#F5A623]">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-[#F0F2F5]">
              Cần vai trò {role === "admin" ? "Quản Trị Viên (Admin)" : role === "mentor" ? "Chuyên Gia (Mentor)" : "Học Viên (Mentee)"}
            </h2>
            <p className="mt-2 text-sm text-[#9BA1B0]">
              Bạn đang đăng nhập với tư cách{" "}
              <span className="font-semibold text-white">
                {session.user.name} ({session.role.toUpperCase()})
              </span>
              . Trang này dành riêng cho phân hệ {role}.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {role === "mentor" && session.user.mentorId ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    actions.switchRole("mentor");
                    router.refresh();
                  }}
                  className="w-full justify-center"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Chuyển sang chế độ Mentor
                </Button>
              ) : role === "mentor" && !session.user.mentorId ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    actions.upgradeToMentor();
                    actions.switchRole("mentor");
                    router.push("/mentor/onboarding");
                  }}
                  className="w-full justify-center"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Nâng cấp & Thiết lập hồ sơ Mentor
                </Button>
              ) : role === "mentee" && session.role === "mentor" ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    actions.switchRole("mentee");
                    router.refresh();
                  }}
                  className="w-full justify-center"
                >
                  Chuyển sang chế độ Mentee
                </Button>
              ) : role === "admin" ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    actions.loginAs("u-admin");
                    router.refresh();
                  }}
                  className="w-full justify-center"
                >
                  Chuyển sang tài khoản Quản trị Demo
                </Button>
              ) : null}

              <Button
                variant="ghost"
                onClick={() => actions.logout()}
                className="w-full justify-center text-xs text-[#9BA1B0]"
              >
                Đăng xuất tài khoản hiện tại
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
