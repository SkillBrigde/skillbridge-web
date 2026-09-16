import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-LRN-01"
      screenTitle="Phòng Học Trực Tuyến 1-on-1 & Nghiệm Thu Escrow (Mentee)"
      module="Learning & Video"
      actor="Mentee"
      description="Không gian học tập chia đôi màn hình: Luồng video WebRTC E2EE 1080p60 kèm bảng mã Scratchpad cộng tác, danh mục tài liệu bàn giao và nút giải phóng Escrow."
      features={[
        "WebRTC video call Full HD + âm thanh Opus 128kbps + tính năng PIP",
        "Dải băng thông báo ghi hình tự động phục vụ giải quyết khiếu nại SLA",
        "Live Scratchpad chia sẻ mã nguồn trực tiếp giữa Mentor và Mentee",
        "2 nút quyết định cuối buổi: Giải phóng tiền Escrow hoặc Mở khiếu nại SLA 48h"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [bookingId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{bookingId}</span>
      </div>
    </RouteSkeleton>
  );
}
