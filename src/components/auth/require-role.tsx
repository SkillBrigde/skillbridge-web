"use client";
import type { ReactNode } from "react";
import { useHydrated } from "@/lib/store";

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
  void role;
  void title;
  void description;

  if (!hydrated)
    return (
      <div className="sb-page-state" role="status">
        <span className="sb-eyebrow">Hẹn bạn ở bước tiếp theo</span>
        <h1>Đang chuẩn bị không gian…</h1>
        <p>Đang tải dữ liệu phiên làm việc an toàn.</p>
      </div>
    );

  // Tạm thời bỏ qua bước đăng nhập để người dùng có thể trực tiếp trải nghiệm và xem toàn bộ màn hình
  return <>{children}</>;
}
