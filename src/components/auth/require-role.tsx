"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { useHydrated, useSession } from "@/lib/store";
export interface RequireRoleProps {
  children: ReactNode;
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
  const { user, role: currentRole } = useSession();
  const pathname = usePathname();
  if (!hydrated)
    return (
      <div className="sb-page-state" role="status">
        Đang tải tài khoản…
      </div>
    );
  if (!user || (role !== "any" && currentRole !== role))
    return (
      <section className="sb-page-state">
        <span className="sb-state-icon">
          <LockKeyhole />
        </span>
        <h1>
          {title ||
            (user ? "Bạn chưa có quyền truy cập" : "Đăng nhập để tiếp tục")}
        </h1>
        <p>
          {description ||
            "Sử dụng tài khoản của bạn để truy cập không gian cá nhân."}
        </p>
        <Link
          className="sb-button"
          href={"/login?next=" + encodeURIComponent(pathname)}
        >
          Đăng nhập
        </Link>
      </section>
    );
  return <>{children}</>;
}
