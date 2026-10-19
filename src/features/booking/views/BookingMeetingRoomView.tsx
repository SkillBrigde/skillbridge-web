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
import { SessionTimer } from "@/components/ui/session-timer";
import { EscrowShield } from "@/components/ui/escrow-shield";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  FileImage,
  Send,
  Clock,
} from "lucide-react";
<<<<<<< HEAD
import { useAppState, useSession, actions, useNow } from "@/lib/store";
=======
import { useAppState, actions, useNow } from "@/lib/store";
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
import { vnd, looksLikeContactLeak } from "@/lib/domain";

export function BookingMeetingRoomView() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const state = useAppState();
<<<<<<< HEAD
  const session = useSession();
=======
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
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
<<<<<<< HEAD
  const [scratchpad, setScratchpad] = useState(booking?.scratchpad || "");

  // Join session on mount
  useEffect(() => {
    if (booking) {
      actions.joinSession(booking.id, "mentee");
      if (booking.scratchpad) {
        setScratchpad(booking.scratchpad);
      }
    }
  }, [booking?.id]);
=======
  const scratchpad = booking?.scratchpad || "";
  const sessionBookingId = booking?.id;

  // Join session on mount
  useEffect(() => {
    if (sessionBookingId) {
      actions.joinSession(sessionBookingId, "mentee");
    }
  }, [sessionBookingId]);
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da

  const messages = useMemo(
    () => state.messages.filter((m) => m.bookingId === bookingId),
    [state.messages, bookingId]
  );

  if (!booking || !mentor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy phòng học"
          description="Đơn đặt lịch không tồn tại hoặc phiên học đã đóng."
          action={{
            label: "Quay về lịch học",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const handleLeave = () => {
    actions.leaveSession(booking.id, "mentee");
    router.push("/bookings");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (looksLikeContactLeak(chatInput)) {
      setChatWarning("Cảnh báo: Không trao đổi thông tin liên lạc ngoài sàn (email/SĐT/Telegram) để bảo vệ quyền lợi Escrow.");
    } else {
      setChatWarning("");
    }

    actions.sendMessage(booking.id, chatInput.trim());
    setChatInput("");
  };

  const handleScratchpadChange = (val: string) => {
<<<<<<< HEAD
    setScratchpad(val);
=======
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
    actions.setScratchpad(booking.id, val);
  };

  const handleAcceptSession = () => {
    setAccepting(true);
    const res = actions.acceptSession(booking.id);
    setAccepting(false);
    if (res.ok) {
      router.push(`/reviews/${booking.id}`);
    }
  };

  // Elapsed seconds calculation
  const sessionElapsedSeconds = booking.startedAt
<<<<<<< HEAD
    ? Math.max(0, Math.floor(((now || Date.now()) - booking.startedAt) / 1000))
=======
    ? Math.max(0, Math.floor((now - booking.startedAt) / 1000))
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
    : 1800;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0B0C0E]">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-12 border-b border-white/[0.08] bg-[#0D0E10] flex-shrink-0">
        <div className="flex items-center gap-3">
          <SessionTimer
            initialSeconds={sessionElapsedSeconds}
            running={true}
            maxDuration={3600}
          />
          <span className="text-xs text-[#9BA1B0] hidden sm:inline">
            Phòng Học #{booking.code} — {booking.serviceName}
          </span>
          <Badge variant="escrow" dot pulse>
            WebRTC Encrypted
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={handleLeave}>
          <LogOut className="h-3.5 w-3.5" />
          Rời Phòng
        </Button>
      </div>

      {/* ── Main Split Layout (7:5) ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* ── Left: Video Call Feeds (7/12) ── */}
        <div className="lg:w-[58%] flex flex-col bg-[#0B0C0E] p-4 min-h-0">
          {/* Main video feed */}
          <div className="relative flex-1 rounded-xl bg-[#14171D] border border-white/[0.08] overflow-hidden min-h-[300px]">
            {/* Mentor video display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Avatar
                src={mentor.avatarUrl}
                alt={mentor.fullName}
                size="xl"
                online={true}
              />
              <p className="mt-3 text-sm font-medium text-[#F0F2F5]">
                {mentor.fullName}
              </p>
              <p className="text-xs text-[#9BA1B0]">{mentor.title} @ {mentor.company}</p>
              {/* Audio visualizer mock */}
              <div className="flex items-end gap-0.5 mt-3 h-6">
                {[3, 5, 8, 6, 4, 7, 5, 3, 6, 4].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#27C98F] rounded-full animate-pulse"
                    style={{
                      height: `${h * 3}px`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* PiP: Mentee */}
            <div className="absolute top-3 right-3 w-32 h-24 rounded-lg bg-[#1C2028] border border-white/[0.12] flex items-center justify-center overflow-hidden shadow-lg">
              <div className="text-center">
                <Avatar alt={booking.menteeName} size="sm" />
                <p className="text-[10px] text-[#9BA1B0] mt-1">{booking.menteeName} (Bạn)</p>
              </div>
            </div>
          </div>

          {/* Meeting control dock */}
          <div className="flex items-center justify-center gap-2 mt-4 py-2">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${
                micOn
                  ? "bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022]"
                  : "bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 text-[#FF5C5C]"
              }`}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCamOn(!camOn)}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all cursor-pointer ${
                camOn
                  ? "bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022]"
                  : "bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 text-[#FF5C5C]"
              }`}
            >
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022] transition-all cursor-pointer">
              <MonitorUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022] transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Right: Workspace & Escrow (5/12) ── */}
        <div className="lg:w-[42%] flex flex-col border-l border-white/[0.08] bg-[#0D0E10] min-h-0">
          {/* Tabs */}
          <div className="px-4 pt-3">
            <Tabs
              items={[
                { id: "code", label: "Ghi Chú & Scratchpad" },
                { id: "chat", label: `Trao Đổi (${messages.length})` },
                { id: "proof", label: "Nghiệm Thu Escrow" },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
              size="sm"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4 min-h-0 flex flex-col justify-between">
            {activeTab === "code" && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                    Shared Real-time Scratchpad
                  </span>
                  <span className="text-[10px] text-[#27C98F]">● Tự động lưu</span>
                </div>
                <Textarea
                  value={scratchpad}
                  onChange={(e) => handleScratchpadChange(e.target.value)}
                  placeholder="// Gõ ghi chú, kiến trúc hệ thống, đoạn code review tại đây..."
                  className="flex-1 min-h-[360px] font-mono text-xs leading-relaxed bg-[#0B0C0E]"
                />
              </div>
            )}

            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col justify-between">
                {/* Messages list */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4 max-h-[420px]">
                  {messages.length === 0 ? (
                    <p className="text-xs text-[#5D6474] text-center py-10">
                      Chưa có tin nhắn nào trong phòng học này.
                    </p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          m.role === "mentee" ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-[10px] text-[#5D6474] mb-0.5">
                          {m.senderName} ({m.role})
                        </span>
                        <div
                          className={`rounded-xl px-3 py-2 text-xs max-w-[85%] ${
                            m.role === "mentee"
                              ? "bg-[#5E6AD2] text-white"
                              : "bg-[#14171D] border border-white/[0.08] text-[#E3E2E5]"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {chatWarning && (
                  <div className="mb-2">
                    <NoticeBanner variant="warning" message={chatWarning} />
                  </div>
                )}

                {/* Chat input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 text-xs"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "proof" && (
              <div className="space-y-4">
                {booking.proof ? (
                  <div className="rounded-xl bg-[#14171D] border border-white/[0.08] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileImage className="h-5 w-5 text-[#5E6AD2]" />
                      <div>
                        <p className="text-sm font-medium text-[#F0F2F5]">
                          {booking.proof.files[0] || "webrtc_session_proof.png"}
                        </p>
                        <p className="text-xs text-[#5D6474]">
                          Thời lượng ghi nhận: {booking.proof.durationLabel}
                        </p>
                      </div>
                    </div>
                    {booking.proof.note && (
                      <p className="text-xs text-[#9BA1B0] bg-[#0D0E10] p-2.5 rounded-lg border border-white/[0.04] mb-3">
                        {booking.proof.note}
                      </p>
                    )}
                    <div className="h-28 rounded-lg bg-[#0B0C0E] border border-white/[0.06] flex items-center justify-center">
                      <span className="text-xs text-[#27C98F] font-mono">
                        ✓ Đã xác thực biên bản bàn giao
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-[#14171D] border border-white/[0.08] p-4 text-center">
                    <Clock className="h-6 w-6 text-[#F5A623] mx-auto mb-2" />
                    <p className="text-xs font-medium text-[#F0F2F5]">
                      Mentor đang hoàn tất buổi học &amp; chuẩn bị nộp Proof-of-Work
                    </p>
                    <p className="text-[11px] text-[#5D6474] mt-1">
                      Sau khi mentor gửi, bạn có 24h để kiểm tra và nghiệm thu trước khi hệ thống tự động giải ngân.
                    </p>
                  </div>
                )}

                {/* Escrow holding */}
                <EscrowShield amount={vnd(booking.priceVnd)} />

                {/* Action buttons */}
                {booking.status === "AwaitingAcceptance" && (
                  <div className="space-y-2.5 pt-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      disabled={accepting}
                      onClick={handleAcceptSession}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      ✓ Tôi Hài Lòng &amp; Giải Phóng Tiền Cho Mentor
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      size="sm"
                      onClick={() => router.push(`/disputes/new?booking=${booking.id}`)}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-2" />
                      ⚠️ Báo Cáo Sự Cố / Khiếu Nại (Mở SLA 48h)
                    </Button>
                  </div>
                )}

                {booking.status === "Completed" && (
                  <div className="p-3 rounded-lg bg-[#27C98F]/10 border border-[#27C98F]/25 text-center text-xs text-[#27C98F]">
                    Buổi học đã được nghiệm thu và hoàn tất giải ngân thành công.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { BookingMeetingRoomView as default };
