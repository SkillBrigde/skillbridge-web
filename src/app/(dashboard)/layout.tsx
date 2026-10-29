import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="sb-dashboard-shell min-h-[70vh]">{children}</div>;
}
