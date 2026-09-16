import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-MTR-05"
      screenTitle="Quản Lý Uy Tín & Phản Hồi Đánh Giá Của Học Viên"
      module="Reviews & Analytics"
      actor="Mentor"
      description="Bảng phân tích danh tiếng chuyên gia: Điểm trung bình 4.98, SVG sparkline 30 ngày, phân rã 4 tiêu chí chất lượng, và công cụ phản hồi công khai nhận xét của học viên."
      features={[
        "Bento KPI: Điểm 4.98/5.0, 142 đánh giá xác thực, 99.1% hài lòng, SLA < 15m",
        "Biểu đồ đường mini SVG Sparkline thể hiện xu hướng điểm 30 ngày",
        "Phân rã 4 tiêu chí: Chuyên môn, Sư phạm, Hữu ích, Đúng giờ",
        "Hệ thống trả lời phản hồi lồng nhau (Nested Reply Thread) cho từng review"
      ]}
    />
  );
}
