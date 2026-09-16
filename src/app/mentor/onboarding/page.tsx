import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-MTR-01"
      screenTitle="Đăng Ký Trở Thành Mentor & Nộp Hồ Sơ KYC"
      module="Profiles & Verification"
      actor="Mentor"
      description="Quy trình nộp hồ sơ thẩm định chuyên gia 4 bước: CCCD gắn chip 2 mặt 300 DPI, bằng cấp chứng chỉ quốc tế (AWS/Azure), và tài khoản ngân hàng nhận Payout."
      features={[
        "Tải ảnh CCCD gắn chip 2 mặt với mã hóa băm SHA-256 client-side",
        "Đối soát tự động họ tên trên thẻ ngân hàng MB Bank khớp 100% với CCCD",
        "Tích hợp chứng chỉ quốc tế đối soát trực tiếp qua Credly URL",
        "Cam kết tuân thủ SLA phản hồi 15 phút và cơ chế trọng tài Escrow 48 giờ"
      ]}
    />
  );
}
