import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-MTR-03 / SCH-01"
      screenTitle="Quản Lý Lịch Trống & Quy Tắc Lặp Tuần (Availability Matrix)"
      module="Scheduling Engine"
      actor="Mentor"
      description="Ma trận cấu hình lịch giảng dạy từ Thứ 2 đến Chủ nhật, thiết lập khoảng đệm nghỉ giữa các buổi (buffer 15p), thời gian đặt trước tối thiểu (24h) và đồng bộ Redis cache."
      features={[
        "Cấu hình 4 tham số vàng: Slot 60p, Buffer 15p, Lead time 24h, Múi giờ UTC+7",
        "Ma trận ngày trong tuần với công tắc Bật/Tắt và quản lý nhiều ca giờ trong ngày",
        "Đồng bộ thời gian thực lên Redis cluster chống xung đột trùng lịch",
        "Danh sách các buổi học sắp diễn ra kèm tính năng xem trước câu trả lời Intake"
      ]}
    />
  );
}
