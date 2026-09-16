import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-MTR-04"
      screenTitle="Phòng Học Mentor & Nộp Bằng Chứng Nghiệm Thu (Proof-of-Work)"
      module="Learning & Escrow"
      actor="Mentor"
      description="Không gian giảng dạy chuyên gia: WebRTC call, rubric chấm điểm trực tiếp 4 tiêu chí, MinIO S3 Proof uploader, và kích hoạt bộ đếm ngược Escrow 24h tự động giải ngân."
      features={[
        "Bảng rubric 10 tiêu chí kỹ thuật chấm điểm trực tiếp trong buổi học",
        "Upload bắt buộc ảnh chụp màn hình WebRTC và tài liệu bàn giao vào MinIO S3",
        "Textarea ghi chú tóm tắt và lời khuyên định hướng cho học viên",
        "Kích hoạt bộ đếm ngược 24 giờ tự động giải phóng tiền ký quỹ về ví Mentor"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [id]: </span>
        <span className="text-[#5E6AD2] font-semibold">{id}</span>
      </div>
    </RouteSkeleton>
  );
}
