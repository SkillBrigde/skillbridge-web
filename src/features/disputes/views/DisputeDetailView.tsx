"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Textarea,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { Scale, Clock, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAppState, useSession, actions } from "@/lib/store";
import { vnd } from "@/lib/domain";

const RESOLUTION_OPTIONS = [
  {
    value: "compensate",
    label: "Đồng ý dạy bù 1 buổi 60 phút miễn phí cho Mentee",
    description: "Tiền Escrow giữ nguyên, bạn cam kết xếp lịch bù trong 7 ngày.",
  },
  {
    value: "split",
    label: "Đồng ý chia đôi 50/50 tiền ký quỹ",
    description: "Mỗi bên nhận lại 50% thù lao. Không ảnh hưởng điểm uy tín.",
  },
  {
    value: "reject",
    label: "Bác bỏ khiếu nại và yêu cầu Admin xem xét lại log WebRTC",
    description: "Admin sẽ đối soát máy chủ WebRTC attendance log để phán quyết.",
  },
];

export function DisputeDetailView() {
  const params = useParams<{ disputeId: string }>();
  const router = useRouter();
  const state = useAppState();
  const session = useSession();

  const disputeId = params.disputeId;
  const dispute = useMemo(() => {
    return (
      state.disputes.find(
        (d) =>
          d.id === disputeId ||
          d.bookingId === disputeId ||
          d.id.toLowerCase() === disputeId.toLowerCase()
      ) || state.disputes[0]
    );
  }, [state.disputes, disputeId]);

  const booking = useMemo(() => {
    return dispute ? state.bookings.find((b) => b.id === dispute.bookingId) : null;
  }, [state.bookings, dispute]);

  const [resolution, setResolution] = useState<"compensate" | "split" | "reject">("compensate");
  const [defense, setDefense] = useState(
    dispute?.mentorStatement ||
      "Tôi có mặt lúc 19:40 do sự cố kỹ thuật. Đã thông báo mentee dạy bù thêm nhưng mentee không đồng ý. Đã gửi tài liệu rubric qua email sau buổi học."
  );
  const [proofFiles, setProofFiles] = useState<string[]>(
    dispute?.mentorEvidence || ["webrtc_call_log_details.png"]
  );
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!dispute || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy hồ sơ khiếu nại"
          description="Mã khiếu nại không tồn tại hoặc đã được xử lý xong."
          action={{
            label: "Quay về danh sách",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const isMentor = session.role === "mentor" || session.user?.id === booking.mentorId;
  const hasResponded = Boolean(dispute.mentorStatement);

  const handleSendDefense = () => {
    setErrorMsg("");
    if (!defense.trim()) {
      setErrorMsg("Vui lòng nhập nội dung giải trình của bạn.");
      return;
    }

    setSubmitting(true);
    const res = actions.respondDispute(dispute.id, {
      statement: defense.trim(),
      files: proofFiles,
      proposal: resolution,
    });
    setSubmitting(false);

    if (!res.ok) {
      setErrorMsg(res.error || "Gửi giải trình thất bại.");
    } else {
      setSuccessMsg("Giải trình của bạn đã được gửi tới Ban Quản Trị để đối soát.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <Scale className="h-5 w-5 text-[#F5A623]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Hồ Sơ Khiếu Nại #{dispute.id} — Đơn #{booking.code}
        </h1>
      </div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Badge variant={dispute.status === "Resolved" ? "escrow" : "pending"} dot>
          <Clock className="h-3 w-3 mr-0.5" />
          Trạng thái: {dispute.status}
        </Badge>
        <span className="text-xs text-[#5D6474]">
          Escrow đóng băng: <span className="font-mono text-[#F5A623]">{vnd(booking.priceVnd)}</span>
        </span>
      </div>

      {errorMsg && <div className="mb-4"><NoticeBanner variant="error" message={errorMsg} /></div>}
      {successMsg && <div className="mb-4"><NoticeBanner variant="success" message={successMsg} /></div>}

      {/* ── Mentee Claim Card ── */}
      <Card className="p-5 mb-8 border-[#FF5C5C]/20 bg-[#14171D]">
        <div className="flex items-center gap-3 mb-3">
          <Avatar alt={dispute.menteeName} size="sm" />
          <div>
            <span className="text-sm font-medium text-[#F0F2F5]">
              {dispute.menteeName}
            </span>
            <span className="text-xs text-[#5D6474] ml-2">Học viên khiếu nại</span>
          </div>
          <Badge variant="dispute" className="ml-auto">
            Lý do: {dispute.reason}
          </Badge>
        </div>
        <p className="text-sm text-[#E3E2E5] leading-relaxed bg-[#FF5C5C]/5 rounded-lg p-3 border border-[#FF5C5C]/10 mb-3">
          &ldquo;{dispute.menteeStatement}&rdquo;
        </p>
        <p className="text-xs text-[#9BA1B0]">
          Yêu cầu từ Mentee: <span className="font-semibold text-white">{dispute.menteeWish}</span>
        </p>
      </Card>

      {/* ── Ruling Card if already resolved ── */}
      {dispute.ruling && (
        <Card className="p-5 mb-8 border-[#27C98F]/30 bg-[#27C98F]/5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-[#27C98F]" />
            <h3 className="text-base font-semibold text-[#27C98F]">
              Phán Quyết Chính Thức Từ Admin SLA
            </h3>
          </div>
          <p className="text-sm text-white mb-2 font-mono">
            Kết luận: <span className="font-bold">{dispute.ruling}</span>
          </p>
          {dispute.rulingNote && (
            <p className="text-xs text-[#9BA1B0] leading-relaxed">
              {dispute.rulingNote}
            </p>
          )}
        </Card>
      )}

      {/* ── Mentor Defense Section ── */}
      {isMentor && !hasResponded && dispute.status !== "Resolved" ? (
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
              Ý kiến giải trình của bạn đối với khiếu nại trên{" "}
              <span className="text-[#FF5C5C]">*</span>
            </label>
            <Textarea
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              rows={4}
              placeholder="Giải trình chi tiết quá trình diễn ra buổi học..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
              Upload bổ sung bằng chứng
            </label>
            <p className="text-xs text-[#5D6474] mb-3">
              Nhật ký cuộc gọi, video ghi hình, email đã gửi tài liệu
            </p>
            <FileUpload
              accept="image/*,.pdf,.mp4"
              maxSizeMB={50}
              label="Kéo thả bằng chứng bổ sung"
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  setProofFiles((prev) => [...prev, files[0].name]);
                }
              }}
            />
          </div>

          <RadioGroup
            name="resolution"
            label="Đề xuất giải quyết"
            options={RESOLUTION_OPTIONS}
            value={resolution}
            onChange={(val) => setResolution(val as "compensate" | "split" | "reject")}
          />

          <div className="flex justify-end pt-8 mt-8 border-t border-white/[0.06]">
            <Button
              variant="primary"
              size="lg"
              disabled={submitting}
              onClick={handleSendDefense}
            >
              Gửi Giải Trình Cho Admin Phán Quyết
            </Button>
          </div>
        </div>
      ) : hasResponded ? (
        <Card className="p-5 border-white/[0.08]">
          <h3 className="text-sm font-semibold text-[#F0F2F5] mb-2">
            Giải Trình Từ Mentor {booking.mentorName}
          </h3>
          <p className="text-sm text-[#E3E2E5] leading-relaxed bg-[#0D0E10] p-3 rounded-lg border border-white/[0.06] mb-3">
            {dispute.mentorStatement}
          </p>
          <p className="text-xs text-[#9BA1B0]">
            Đề xuất giải quyết: <span className="font-semibold text-white">{dispute.mentorProposal}</span>
          </p>
        </Card>
      ) : (
        <NoticeBanner
          variant="info"
          message="Hồ sơ đang chờ phản hồi giải trình từ phía Mentor trong thời hạn SLA 24h."
        />
      )}
    </div>
  );
}
