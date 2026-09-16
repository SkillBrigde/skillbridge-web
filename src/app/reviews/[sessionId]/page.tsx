import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-REV-01"
      screenTitle="Đánh Giá & Nhận Xét 4 Tiêu Chí Sau Buổi Học"
      module="Reviews & Reputation"
      actor="Mentee"
      description="Modal trung tâm đánh giá buổi học 1-on-1 qua 4 thang điểm sao độc lập, tính điểm trung bình thời gian thực và cấp quyền gắn nhãn Verified Escrow Review."
      features={[
        "01. Chuyên Môn & Kiến Thức Kỹ Thuật (Technical Depth)",
        "02. Kỹ Năng Sư Phạm & Khả Năng Truyền Đạt (Communication)",
        "03. Độ Hữu Ích So Với Kỳ Vọng Ban Đầu (Value Delivered)",
        "04. Đánh Giá Tổng Quan Buổi Mentoring (Overall Satisfaction)"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [sessionId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{sessionId}</span>
      </div>
    </RouteSkeleton>
  );
}
