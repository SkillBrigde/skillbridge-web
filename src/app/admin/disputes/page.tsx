import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-ADM-01"
      screenTitle="Trung Tâm Phán Quyết Khiếu Nại SLA 48h (Super Admin)"
      module="Admin Governance"
      actor="Super Admin"
      description="Màn hình trọng tài tối cao: Thanh đo WebRTC Telemetry độc lập, bảng đối chất song song giữa Mentee và Mentor, 4 phương án phán quyết và sổ cái kiểm toán bất biến."
      features={[
        "Đối soát máy chủ WebRTC Telemetry: Cam kết 60m vs Thực đạt 35m 10s (58.6%)",
        "So sánh bằng chứng đối chất trực quan giữa Mentee và Mentor",
        "4 Phương án phán quyết: Hoàn 100%, Chia đôi 50/50, Dạy bù 1 buổi, Bác khiếu nại",
        "Cryptographic Audit Trail Log ghi dấu vết bất biến thời gian thực với IP và Hash"
      ]}
    />
  );
}
