import { Suspense } from "react";
import { AuthLoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-mono text-[#9BA1B0]">Đang tải...</div>}>
      <AuthLoginForm />
    </Suspense>
  );
}
