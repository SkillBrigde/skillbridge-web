import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function LoginPage() {
  return (
    <RouteSkeleton
      screenId="SCR-AUT-01"
      screenTitle="Xác Thực & Đăng Nhập (Google OAuth 2.0 & Work Email)"
      module="Identity & Access"
      actor="All Actors"
      description="Đăng nhập bảo mật 1 chạm Google OAuth 2.0 hoặc tài khoản email công ty/học tập. Tích hợp huy hiệu tuân thủ ISO-27001 và telemetry phiên mã hóa."
      features={[
        "Google OAuth 2.0 một chạm kèm fallback email công ty",
        "Ghi nhớ đăng nhập 30 ngày qua Refresh Token rotation",
        "Huy hiệu bảo chứng: ISO-27001, 256-Bit Encryption, Zero-Trust Audited",
        "Session Nonce cryptographic telemetry: TLS 1.3 SHA-384",
      ]}
    />
  );
}
