import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-DSP-01"
      screenTitle="Khởi Tạo Hồ Sơ Khiếu Nại Buổi Học (SLA 48h)"
      module="Dispute Resolution"
      actor="Mentee"
      description="Biểu mẫu khiếu nại pháp lý đóng băng tiền ký quỹ tức thì trong 0 giây, phân loại 4 nhóm nguyên nhân và vùng tải lên bằng chứng mã hóa E2EE MinIO S3."
      features={[
        "Cơ chế đóng băng smart contract tức thì, bảo vệ 100% khoản thanh toán",
        "Phân loại 4 nguyên nhân: Mentor vào muộn, Vắng mặt no-show, Sai nội dung, Lỗi kỹ thuật",
        "Vùng kéo thả tải bằng chứng MinIO Private S3 mã hóa AES-256 client-side",
        "Kích hoạt đồng hồ SLA đếm ngược 48 giờ yêu cầu Mentor và Admin đối soát"
      ]}
    />
  );
}
