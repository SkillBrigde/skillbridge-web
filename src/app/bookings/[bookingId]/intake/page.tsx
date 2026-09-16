import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-BKG-01"
      screenTitle="Khảo Sát Intake & Khóa Slot Độc Quyền Redis 10 Phút"
      module="Booking & Intake"
      actor="Mentee"
      description="Bố cục 2 cột (7:5): Mentee điền khảo sát kỳ vọng kỹ thuật trước buổi học và chọn khung giờ. Hệ thống tự động kích hoạt khóa nguyên tử Redis trong 10 phút."
      features={[
        "Khảo sát 3 câu hỏi trọng tâm kỹ thuật kèm quick-chips một chạm",
        "Bộ đếm ký tự thời gian thực (tối thiểu 30 ký tự để đảm bảo chất lượng)",
        "Bộ chọn Slot thời gian thực đồng bộ cụm Redis (Zero Double-Booking)",
        "Đồng hồ đếm ngược Redis Lock TTL 10:00.00 bảo đảm giữ chỗ độc quyền"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [bookingId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{bookingId}</span>
      </div>
    </RouteSkeleton>
  );
}
