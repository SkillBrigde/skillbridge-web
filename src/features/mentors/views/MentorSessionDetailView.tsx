"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { SessionTimer } from "@/components/ui/session-timer";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  LogOut,
  Upload,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, actions, useNow } from "@/lib/store";

export function MentorSessionDetailView() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const state = useAppState();

  const now = useNow("second");

  const bookingId = params.bookingId;
  const booking = useMemo(
    () => state.bookings.find((b) => b.id === bookingId),
    [state.bookings, bookingId]
  );

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [proofFiles, setProofFiles] = useState<string[]>([
    "webrtc_session_screenshot.png",
  ]);
  const [note, setNote] = useState(
    "Đã hoàn thành buổi mock interview: Đánh giá tốt về tư duy thuật toán, cần bổ sung phần cache invalidation và CQRS pattern."
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const sessionBookingId = booking?.id;

  useEffect(() => {
    if (sessionBookingId) {
      actions.joinSession(sessionBookingId, "mentor");
    }
  }, [sessionBookingId]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy phòng học"
          description="Đơn đặt lịch không tồn tại hoặc bạn không có quyền truy cập."
          action={{
            label: "Quay về lịch giảng dạy",
            onClick: () => router.push("/mentor/schedule"),
          }}
        />
      </div>
    );
  }

  const handleLeave = () => {
    actions.leaveSession(booking.id, "mentor");
    router.push("/mentor/schedule");
  };

  const handleSubmitProof = () => {
    setErrorMsg("");
    if (proofFiles.length === 0) {
      setErrorMsg("Vui lòng đính kèm ít nhất 1 ảnh chụp màn hình bằng chứng buổi học.");
      return;
    }
    if (!note.trim()) {
      setErrorMsg("Vui lòng ghi tóm tắt nhận xét và lời khuyên cho Mentee.");
      return;
    }

    setSubmitting(true);
    const res = actions.submitProof(booking.id, {
      files: proofFiles,
      note: note.trim(),
    });
    setSubmitting(false);

    if (!res.ok) {
      setErrorMsg(res.error || "Nộp bằng chứng thất bại.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/mentor/schedule");
      }, 1500);
    }
  };

  const elapsedSeconds = booking.startedAt
    ? Math.max(0, Math.floor((now - booking.startedAt) / 1000))
    : 3490;

  return (
    <RequireRole role="mentor">
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#27252d]">
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[#3b3842] bg-[#1e1c23] shrink-0">
          <div className="flex items-center gap-3">
            <SessionTimer
              initialSeconds={elapsedSeconds}
              running={true}
              maxDuration={3600}
            />
            <span className="text-xs text-[#a9a4b2] hidden sm:inline">
              Phòng Học #{booking.code} — {booking.serviceName}
            </span>
            <Badge variant="brand" dot pulse>
              MENTOR STUDIO VIEW
            </Badge>
          </div>
          <Button variant="destructive" size="sm" onClick={handleLeave}>
            <LogOut className="h-3.5 w-3.5" />
            Rời Phòng
          </Button>
        </div>

        {/* ── Video Workspace ── */}
        <div className="flex-1 relative min-h-0 bg-[#19181d]">
          {/* Main video area */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full max-w-4xl rounded-2xl bg-[#27252d] border border-[#3b3842] flex items-center justify-center shadow-lg">
              <div className="text-center">
                <Avatar alt={booking.menteeName} size="xl" />
                <p className="mt-3 text-base font-semibold text-white">
                  {booking.menteeName}
                </p>
                <p className="text-xs text-[#a9a4b2]">Học viên (Mentee)</p>
                {/* Audio visualizer */}
                <div className="flex items-end gap-1 mt-4 h-6 justify-center">
                  {[4, 6, 9, 7, 5, 8, 6, 4, 7, 5].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#6551a4] rounded-full animate-pulse"
                      style={{ height: `${h * 2.8}px`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PiP: Mentor (you) */}
          <div className="absolute top-6 right-6 w-40 h-32 rounded-xl bg-[#2e2b35] border border-[#484451] flex items-center justify-center shadow-2xl z-10">
            <div className="text-center">
              <Avatar alt={booking.mentorName} size="sm" />
              <p className="text-[11px] text-[#e5e2de] mt-1.5 font-medium">{booking.mentorName} (Bạn)</p>
            </div>
          </div>

          {/* Meeting control dock */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 bg-[#1e1c23]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#3b3842] shadow-xl">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${
                micOn
                  ? "bg-[#2e2b35] border border-[#484451] text-white hover:bg-[#3b3842]"
                  : "bg-[#fceeea] border border-[#a64533] text-[#a64533]"
              }`}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCamOn(!camOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${
                camOn
                  ? "bg-[#2e2b35] border border-[#484451] text-white hover:bg-[#3b3842]"
                  : "bg-[#fceeea] border border-[#a64533] text-[#a64533]"
              }`}
            >
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e2b35] border border-[#484451] text-white hover:bg-[#3b3842] transition-all cursor-pointer">
              <MonitorUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => router.push(`/bookings/${booking.id}/room`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2e2b35] border border-[#484451] text-white hover:bg-[#3b3842] transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
            </button>

            <div className="w-[1px] h-6 bg-[#484451] mx-1" />

            {/* Submission drawer trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#6551a4] text-white hover:bg-[#523e8f] transition-all cursor-pointer text-xs font-semibold shadow-xs"
            >
              <Upload className="h-3.5 w-3.5" />
              Nộp Bằng Chứng Nghiệm Thu
              <ChevronUp className={`h-3 w-3 transition-transform ${drawerOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Bottom Submission Drawer (Editorial Paper Style) ── */}
        <div
          className={`border-t border-[#e5e2de] bg-[#faf9f6] transition-all duration-300 overflow-y-auto ${
            drawerOpen ? "max-h-[500px] py-6" : "max-h-0"
          }`}
        >
          <div className="mx-auto max-w-3xl px-6 space-y-5">
            <div>
              <span className="sb-eyebrow mb-1">Proof-of-Work</span>
              <h3 className="font-serif text-2xl font-semibold text-[#27252d] tracking-tight">
                Kết Thúc Buổi Học & Bàn Giao Nghiệm Thu
              </h3>
              <p className="text-xs text-[#5e5866] mt-0.5">
                Sau khi gửi bằng chứng, học viên sẽ có 24h để xác nhận giải phóng học phí từ Escrow.
              </p>
            </div>

            {errorMsg && <NoticeBanner variant="error" message={errorMsg} />}
            {success && (
              <NoticeBanner
                variant="success"
                message="Đã nộp bằng chứng thành công! Đơn chuyển sang trạng thái Chờ Mentee Nghiệm Thu (24h SLA)."
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                accept="image/*"
                maxSizeMB={10}
                label="Ảnh chụp màn hình buổi học / Bảng vẽ kiến trúc"
                onFilesSelected={(files) => {
                  if (files.length > 0) {
                    setProofFiles((prev) => [...prev, files[0].name]);
                  }
                }}
              />
              <FileUpload
                accept=".pdf,image/*"
                maxSizeMB={20}
                label="Tài liệu bàn giao (PDF Rubric / Source code)"
                onFilesSelected={(files) => {
                  if (files.length > 0) {
                    setProofFiles((prev) => [...prev, files[0].name]);
                  }
                }}
              />
            </div>

            {proofFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {proofFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg bg-[#e8f5ed] border border-[#1e7e45]/20 px-3 py-1 text-[#1e7e45] font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {file}
                  </span>
                ))}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
                Ghi chú tóm tắt sau buổi học và lời khuyên dành cho Mentee
              </label>
              <Textarea
                placeholder="Tóm tắt nội dung đã cover, điểm mạnh / điểm cần cải thiện của Mentee..."
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              size="lg"
              disabled={submitting || success}
              onClick={handleSubmitProof}
            >
              Hoàn Tất Buổi Học & Gửi Nghiệm Thu Cho Học Viên
            </Button>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}

export { MentorSessionDetailView as default };
