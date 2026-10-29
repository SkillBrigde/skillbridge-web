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
          className="inline-flex items-center gap-1.5 text-xs text-[#5e5866] hover:text-[#27252d] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── Header ── */}
      <div className="mb-2">
        <span className="sb-eyebrow">Case Details</span>
        <div className="flex items-center gap-2 mt-1">
          <Scale className="h-6 w-6 text-[#946200]" />
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
            Hồ Sơ Khiếu Nại #{dispute.id}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Badge variant={dispute.status === "Resolved" ? "escrow" : "pending"} dot>
          <Clock className="h-3 w-3 mr-0.5" />
          Trạng thái: {dispute.status}
        </Badge>
        <span className="text-xs text-[#5e5866]">
          Escrow đóng băng: <span className="font-mono font-semibold text-[#946200]">{vnd(booking.priceVnd)}</span>
        </span>
      </div>

      {errorMsg && <div className="mb-4"><NoticeBanner variant="error" message={errorMsg} /></div>}
      {successMsg && <div className="mb-4"><NoticeBanner variant="success" message={successMsg} /></div>}

      {/* ── Mentee Claim Card ── */}
      <Card className="p-6 mb-8 border-[#a64533]/25 bg-white shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <Avatar alt={dispute.menteeName} size="md" />
          <div>
            <span className="text-sm font-semibold text-[#27252d]">
              {dispute.menteeName}
            </span>
            <span className="text-xs text-[#5e5866] ml-2 font-mono">Học viên khiếu nại</span>
          </div>
          <Badge variant="dispute" className="ml-auto">
            Lý do: {dispute.reason}
          </Badge>
        </div>
        <p className="text-sm text-[#27252d] leading-relaxed bg-[#fceeea]/50 rounded-xl p-4 border border-[#a64533]/15 mb-3 italic">
          &ldquo;{dispute.menteeStatement}&rdquo;
        </p>
        <p className="text-xs text-[#5e5866]">
          Yêu cầu từ Mentee: <span className="font-semibold text-[#27252d]">{dispute.menteeWish}</span>
        </p>
      </Card>

      {/* ── Ruling Card if already resolved ── */}
      {dispute.ruling && (
        <Card className="p-6 mb-8 border-[#1e7e45]/30 bg-[#e8f5ed]/40 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-[#1e7e45]" />
            <h3 className="font-serif text-lg font-semibold text-[#1e7e45]">
              Phán Quyết Chính Thức Từ Ban Quản Trị SLA
            </h3>
          </div>
          <p className="text-sm text-[#27252d] mb-2 font-mono">
            Kết luận: <span className="font-bold text-[#1e7e45]">{dispute.ruling}</span>
          </p>
          {dispute.rulingNote && (
            <p className="text-xs text-[#5e5866] leading-relaxed">
              {dispute.rulingNote}
            </p>
          )}
        </Card>
      )}

      {/* ── Mentor Defense Section ── */}
      {isMentor && !hasResponded && dispute.status !== "Resolved" ? (
        <div className="space-y-6 bg-white border border-[#e5e2de] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div>
            <label className="block text-xs font-medium text-[#5e5866] mb-2">
              Ý kiến giải trình của bạn đối với khiếu nại trên{" "}
              <span className="text-[#a64533]">*</span>
            </label>
            <Textarea
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              rows={4}
              placeholder="Giải trình chi tiết quá trình diễn ra buổi học..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5e5866] mb-1">
              Upload bổ sung bằng chứng
            </label>
            <p className="text-xs text-[#5e5866] mb-3">
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

          <div className="flex justify-end pt-6 border-t border-[#e5e2de]">
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
        <Card className="p-6 border-[#e5e2de] bg-white shadow-xs">
          <h3 className="font-serif text-base font-semibold text-[#27252d] mb-3">
            Giải Trình Từ Mentor {booking.mentorName}
          </h3>
          <p className="text-sm text-[#27252d] leading-relaxed bg-[#faf9f6] p-4 rounded-xl border border-[#e5e2de] mb-3">
            {dispute.mentorStatement}
          </p>
          <p className="text-xs text-[#5e5866]">
            Đề xuất giải quyết: <span className="font-semibold text-[#27252d]">{dispute.mentorProposal}</span>
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

export { DisputeDetailView as default };
