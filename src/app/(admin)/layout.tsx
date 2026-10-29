import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/require-role";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRole
      role="admin"
      title="Bàn Quản Trị Hệ Thống"
      description="Khu vực dành riêng cho Quản trị viên phân xử khiếu nại SLA và quản lý ký quỹ Escrow."
    >
      <div className="sb-admin-shell min-h-[70vh]">{children}</div>
    </RequireRole>
  );
}
