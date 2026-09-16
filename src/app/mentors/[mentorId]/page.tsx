import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-PUB-02"
      screenTitle="Hồ Sơ Mentor & Chi Tiết 3 Gói Dịch Vụ Đóng Gói"
      module="Profiles & Packaging"
      actor="Mentee"
      description="Hồ sơ năng lực chuyên gia Tech Lead: kinh nghiệm thực chiến, tỷ lệ hài lòng 99.1%, 3 gói Productized Services cam kết đầu ra rõ ràng và quy trình Escrow 4 chặng."
      features={[
        "Tier 1 (Quick Win): Review CV & Portfolio Chuẩn ATS (45p - 300.000 ₫)",
        "Tier 2 (Featured): Mock Interview System Design & .NET (60p - 450.000 ₫)",
        "Tier 3 (Transformation): Lộ Trình Software Architect (1 Tháng - 2.000.000 ₫)",
        "Quy trình bảo vệ Escrow 4 chặng: Đặt cọc -> Học 1-1 -> Đánh giá 48h -> Giải ngân"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [mentorId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{mentorId}</span>
      </div>
    </RouteSkeleton>
  );
}
