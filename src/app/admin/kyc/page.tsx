import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-ADM-02"
      screenTitle="Duyệt Hồ Sơ KYC Mentor & Cấp Tích Xanh (Super Admin)"
      module="Admin Governance"
      actor="Super Admin"
      description="Cổng thẩm định chuyên gia 2 cột (5:7): Hồ sơ ứng viên kèm AI Risk Ledger, trình soi tài liệu MinIO S3 Forensic Viewer với kính lúp Loupe Zoom, và thanh duyệt cấp tích xanh."
      features={[
        "AI Risk Ledger: Face Biometrics 98.4%, Đối soát tên MB 100%, CIC 0 disputes",
        "Trình soi tài liệu MinIO Forensic Viewer: CCCD gắn chip, Chứng chỉ AWS/Azure",
        "Mô phỏng kính lúp Loupe Zoom kiểm tra vi điểm bảo mật và mã MRZ",
        "3 Quyết định thẩm định: Từ chối hồ sơ, Yêu cầu bổ sung, Duyệt & Cấp tích xanh"
      ]}
    />
  );
}
