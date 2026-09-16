import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ disputeId: string }>;
}) {
  const { disputeId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-DSP-02"
      screenTitle="Phản Hồi Khiếu Nại & Đối Chất Bằng Chứng (Mentor)"
      module="Dispute Resolution"
      actor="Mentor"
      description="Bố cục đối chất 2 cột (5:7): Mentor đối chiếu hồ sơ khiếu nại và WebRTC Telemetry của Mentee, nộp văn bản giải trình, và đề xuất 1 trong 3 phương án hòa giải."
      features={[
        "Banner khẩn cấp SLA 24h: Tự động hoàn tiền 100% nếu Mentor không phản hồi",
        "Đối chiếu snapshot tự động máy chủ WebRTC (thời lượng P2P, mốc vào/ra phòng)",
        "Văn bản giải trình kèm bằng chứng phản biện tải lên MinIO S3",
        "3 Đề xuất giải quyết: Dạy bù 1 buổi miễn phí, Hoàn 50%, Yêu cầu giải ngân toàn bộ"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [disputeId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{disputeId}</span>
      </div>
    </RouteSkeleton>
  );
}
