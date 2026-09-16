import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-BKG-02"
      screenTitle="Bảng Điều Khiển Buổi Học Của Tôi (My Bookings)"
      module="Booking Management"
      actor="Mentee"
      description="Quản lý toàn diện các buổi học 1-on-1 sắp tới, lịch sử buổi học đã hoàn thành, tài liệu bàn giao rubric, và trạng thái tiền ký quỹ đang đóng băng."
      features={[
        "Bộ lọc tab trạng thái: Sắp diễn ra, Chờ nghiệm thu, Đã hoàn thành, Tranh chấp",
        "Đường line 4px mã màu chỉ thị trạng thái tiến trình (Indigo/Amber/Gray/Red)",
        "Hành động tức thì: Vào phòng học trực tuyến, Yêu cầu dời lịch, Xác nhận giải phóng tiền",
        "Tải về trọn bộ bằng chứng nghiệm thu (Screenshot WebRTC, Rubric PDF, Architecture Draw.io)"
      ]}
    />
  );
}
