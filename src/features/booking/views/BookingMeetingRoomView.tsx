"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Tabs,
  Input,
  Textarea,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { RequireRole } from "@/components/auth/require-role";
import { SessionTimer } from "@/components/ui/session-timer";
import { EscrowShield } from "@/components/ui/escrow-shield";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  LogOut,
  ShieldCheck,
  Send,
  VideoIcon,
  Code,
} from "lucide-react";
import { useAppState, actions, useNow } from "@/lib/store";
import { vnd, looksLikeContactLeak } from "@/lib/domain";

export function BookingMeetingRoomView() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const state = useAppState();
  const now = useNow("second");

  const bookingId = params.bookingId;
  const booking = useMemo(
    () => state.bookings.find((b) => b.id === bookingId),
    [state.bookings, bookingId]
  );

  const mentor = useMemo(
    () => (booking ? state.mentors.find((m) => m.id === booking.mentorId) : null),
    [state.mentors, booking]
  );

  const [activeTab, setActiveTab] = useState("code");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatWarning, setChatWarning] = useState("");
  const [accepting, setAccepting] = useState(false);
  const scratchpad = booking?.scratchpad || "";
  const sessionBookingId = booking?.id;

  // Join session on mount
  useEffect(() => {
    if (sessionBookingId) {
      actions.joinSession(sessionBookingId, "mentee");
    }
  }, [sessionBookingId]);

  const messages = useMemo(
    () => state.messages.filter((m) => m.bookingId === bookingId),
    [state.messages, bookingId]
  );

  if (!booking || !mentor) {
    return (
      <RequireRole role="any" title="Phòng Học Trực Tuyến" description="Đăng nhập tài khoản để vào phòng học an toàn.">
        <div className="sb-container py-16">
          <EmptyState
            title="Không tìm thấy phòng học"
            description="Đơn đặt lịch không tồn tại hoặc phiên học đã đóng."
            action={{
              label: "Quay về lịch học",
              onClick: () => router.push("/bookings"),
            }}
          />
        </div>
      </RequireRole>
    );
  }

  const handleLeave = () => {
    actions.leaveSession(booking.id, "mentee");
    import("@/services/learningService").then(({ learningService }) => {
      learningService.leaveSession(booking.id).catch(() => {});
    });
    router.push("/bookings");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (looksLikeContactLeak(chatInput)) {
      setChatWarning("Cảnh báo bảo mật: Không trao đổi thông tin liên lạc ngoài sàn (email/SĐT/Zalo) để bảo toàn quyền bảo chứng của Két Escrow.");
    } else {
      setChatWarning("");
    }

    actions.sendMessage(booking.id, chatInput.trim());
    setChatInput("");
  };

  const handleScratchpadChange = (val: string) => {
    actions.setScratchpad(booking.id, val);
    import("@/services/learningService").then(({ learningService }) => {
      learningService.createNote(booking.id, val, false).catch(() => {});
    });
  };

  const handleAcceptSession = async () => {
    setAccepting(true);
    try {
      const { learningService } = await import("@/services/learningService");
      await learningService.endSession(booking.id);
    } catch {
      // Fallback
    }
    const res = actions.acceptSession(booking.id);
    setAccepting(false);
    if (res.ok) {
      router.push(`/reviews/${booking.id}`);
    }
  };

  const sessionElapsedSeconds = booking.startedAt
    ? Math.max(0, Math.floor((now - booking.startedAt) / 1000))
    : 1800;

  const meetUrl = `https://meet.google.com/sb-${booking.code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;

  return (
    <RequireRole role="any" title="Phòng Học Trực Tuyến" description="Đăng nhập tài khoản để vào phòng học an toàn.">
      <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-[#faf9f6]">
        {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[#e5e2de] bg-white flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <SessionTimer
            initialSeconds={sessionElapsedSeconds}
            running={true}
            maxDuration={3600}
          />
          <span className="text-xs font-medium text-[#27252d] hidden sm:inline">
            Phòng Học #{booking.code} — {booking.serviceName}
          </span>
          <Badge variant="escrow" dot pulse>
            WebRTC Encrypted
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ece5f5] text-[#6551a4] border border-[#d4c3e7] text-xs font-semibold hover:bg-[#e1d5f2] transition-colors"
            >
              <VideoIcon className="h-3.5 w-3.5" />
              Mở Google Meet
            </a>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeave}
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            Rời Phòng
          </Button>
        </div>
      </div>

      {/* ── Main Work Area (Split Grid) ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Video Tiles & Collaborative Scratchpad (8/12) */}
        <div className="lg:col-span-8 flex flex-col p-4 sm:p-5 border-r border-[#e5e2de] overflow-y-auto space-y-4">
          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mentor video box */}
            <div className="relative rounded-2xl bg-white border border-[#e5e2de] aspect-video flex flex-col items-center justify-center overflow-hidden shadow-sm">
              <Avatar src={mentor.avatarUrl} alt={mentor.fullName} size="xl" />
              <p className="text-sm font-semibold text-[#27252d] mt-2">
                {mentor.fullName} (Mentor)
              </p>
              <div className="absolute top-3 left-3">
                <Badge variant="escrow" dot>
                  Đang Giảng Dạy
                </Badge>
              </div>
            </div>

            {/* Mentee video box */}
            <div className="relative rounded-2xl bg-white border border-[#e5e2de] aspect-video flex flex-col items-center justify-center overflow-hidden shadow-sm">
              <div className="h-16 w-16 rounded-full bg-[#f1efea] border border-[#e5e2de] flex items-center justify-center text-lg font-bold text-[#6551a4]">
                Bạn
              </div>
              <p className="text-sm font-semibold text-[#27252d] mt-2">
                Học Viên (Mentee)
              </p>
              <div className="absolute top-3 left-3">
                <Badge variant="neutral" dot>
                  Đã Vào Lớp
                </Badge>
              </div>
            </div>
          </div>

          {/* Media controls */}
          <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-xl border border-[#e5e2de] shadow-sm">
            <Button
              variant={micOn ? "secondary" : "destructive"}
              size="sm"
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {micOn ? "Bật Mic" : "Tắt Mic"}
            </Button>
            <Button
              variant={camOn ? "secondary" : "destructive"}
              size="sm"
              onClick={() => setCamOn(!camOn)}
            >
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              {camOn ? "Bật Camera" : "Tắt Camera"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert("Chia sẻ màn hình được hỗ trợ trực tiếp trong Google Meet.")}
            >
              <MonitorUp className="h-4 w-4" />
              Chia Sẻ Màn Hình
            </Button>
          </div>

          {/* Collaborative Scratchpad */}
          <div className="flex-1 bg-white rounded-2xl border border-[#e5e2de] p-5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1efea]">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-[#6551a4]" />
                <span className="text-sm font-bold text-[#27252d]">
                  Bảng Ghi Chú & Live Scratchpad
                </span>
              </div>
              <span className="text-xs text-[#5e5866]">
                Đồng bộ hai chiều theo thời gian thực
              </span>
            </div>
            <Textarea
              value={scratchpad}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              placeholder="// Viết mã nguồn, ghi chú kiến trúc hoặc câu hỏi kỹ thuật tại đây..."
              className="flex-1 font-mono text-xs sm:text-sm bg-[#faf9f6] border-[#e5e2de] min-h-[160px]"
            />
          </div>
        </div>

        {/* Right Sidebar: Chat, Intake & Milestone Escrow (4/12) */}
        <div className="lg:col-span-4 flex flex-col bg-white overflow-hidden">
          <div className="p-4 border-b border-[#e5e2de]">
            <Tabs
              items={[
                { id: "code", label: "Trao Đổi" },
                { id: "intake", label: "Tài Liệu Intake" },
                { id: "escrow", label: "Nghiệm Thu" },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {activeTab === "code" && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {chatWarning && (
                <div className="mb-3">
                  <NoticeBanner variant="warning" message={chatWarning} />
                </div>
              )}

              {/* Message list */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-xs text-[#5e5866]">
                    Chưa có tin nhắn nào trong phòng học này.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        m.role === "mentee"
                          ? "bg-[#ece5f5]/40 border-[#d4c3e7] ml-4 text-[#27252d]"
                          : "bg-[#faf9f6] border-[#e5e2de] mr-4 text-[#27252d]"
                      }`}
                    >
                      <span className="font-semibold text-[#6551a4] block mb-1">
                        {m.senderName} ({m.role === "mentor" ? "Mentor" : "Học Viên"}):
                      </span>
                      {m.text}
                    </div>
                  ))
                )}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#f1efea]">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Gửi tin nhắn trong phòng học..."
                  className="text-xs h-10"
                />
                <Button type="submit" variant="primary" size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {activeTab === "intake" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h3 className="text-sm font-bold text-[#27252d]">
                Tài Liệu Khảo Sát Intake Form
              </h3>
              <div className="bg-[#faf9f6] rounded-xl p-4 border border-[#e5e2de] space-y-2">
                <span className="text-xs font-semibold text-[#6551a4] block">
                  1. Vấn đề cốt lõi cần giải quyết:
                </span>
                <p className="text-xs text-[#27252d] leading-relaxed">
                  {booking.intake?.coreIssue || "Chưa có thông tin"}
                </p>
              </div>

              <div className="bg-[#faf9f6] rounded-xl p-4 border border-[#e5e2de] space-y-2">
                <span className="text-xs font-semibold text-[#6551a4] block">
                  2. Liên kết tài liệu kỹ thuật:
                </span>
                <a
                  href={booking.intake?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#6551a4] underline break-all font-mono"
                >
                  {booking.intake?.link || "Chưa có link"}
                </a>
              </div>

              <div className="bg-[#faf9f6] rounded-xl p-4 border border-[#e5e2de] space-y-2">
                <span className="text-xs font-semibold text-[#6551a4] block">
                  3. Mục tiêu kỳ vọng:
                </span>
                <p className="text-xs text-[#27252d] leading-relaxed">
                  {booking.intake?.expectation || "Chưa có mục tiêu"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "escrow" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h3 className="text-sm font-bold text-[#27252d]">
                Nghiệm Thu Buổi Học & Két Escrow
              </h3>

              <EscrowShield amount={vnd(booking.priceVnd)} compact />

              {booking.proof && booking.proof.files.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-[#27252d] block">
                    Bằng chứng nghiệm thu từ Mentor:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {booking.proof.files.map((file, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e8f5ed] border border-[#1e7e45]/20 text-xs font-medium text-[#1e7e45]"
                      >
                        ✓ {file}
                      </span>
                    ))}
                  </div>
                  {booking.proof.note && (
                    <p className="text-xs text-[#5e5866] italic bg-[#faf9f6] p-3 rounded-xl border border-[#e5e2de]">
                      &ldquo;{booking.proof.note}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                <NoticeBanner variant="info">
                  Mentor sẽ tải lên ảnh chụp màn hình nghiệm thu buổi học trước khi kết thúc phiên.
                </NoticeBanner>
              )}

              <div className="pt-3 border-t border-[#f1efea] space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={accepting}
                  onClick={handleAcceptSession}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Xác Nhận Nghiệm Thu & Giải Ngân Escrow
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs text-[#a64533] border-[#f5cac2]"
                  onClick={() => router.push(`/disputes/new?booking=${booking.id}`)}
                >
                  Khiếu Nại Buổi Học Lên Admin (SLA 24h-48h)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </RequireRole>
  );
}

export { BookingMeetingRoomView as default };
