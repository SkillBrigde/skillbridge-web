import { Suspense } from "react";
import { AuthRegisterForm } from "@/features/auth";
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="sb-page-state">Đang tải…</div>}>
      <AuthRegisterForm />
    </Suspense>
  );
}
