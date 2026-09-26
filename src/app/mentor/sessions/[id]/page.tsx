"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MonitorUp,
  MessageSquare,
  PhoneOff,
  Upload,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge, Button, Card, Textarea, Avatar } from "@/components/ui";

const RUBRIC_ITEMS = [
  { id: "arch", title: "Kiến trúc tổng thể & Trade-offs (CAP/PACELC)", score: 9 },
  { id: "db", title: "Phân vùng Database & Caching Strategy", score: 8 },
  { id: "queue", title: "Message Broker & Event-Driven Reliability", score: 9 },
  { id: "scale", title: "Khả năng mở rộng (Scalability & Rate Limiting)", score: 9 },
  { id: "comm", title: "Kỹ năng truyền đạt & Bảo vệ luận điểm kỹ thuật", score: 10 },
];

export default function MentorSessionRoomPage() {
  const params = useParams();
  const sessionId = params?.id as string;

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [summaryNotes, setSummaryNotes] = useState(
    "Học viên nắm chắc lý thuyết về Microservices nhưng cần lưu ý xử lý Saga Pattern khi rollback giao dịch phân tán. Đã gửi kèm sơ đồ Mermaid và tài liệu rubric FAANG 10 tiêu chí."
  );
  const [activeTab, setActiveTab] = useState<"rubric" | "scratchpad">("rubric");

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F0F2F5] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-14 border-b border-white/[0.08] bg-[#14171D] px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 px-2.5 py-1 rounded-md text-[11px] font-mono text-[#FF5C5C]">
            <span className="h-2 w-2 rounded-full bg-[#FF5C5C] animate-pulse" />
            <span>REC 00:58:10</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-xs font-semibold text-[#F0F2F5]">
            Phòng Học #{sessionId || "RM-98124"} — Mentor Studio View
          </span>
          <Badge variant="brand" className="text-[10px]">
            Mock Interview System Design & .NET
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#27C98F]/10 border border-[#27C98F]/20 px-3 py-1 rounded-md text-xs font-mono text-[#27C98F]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Escrow Lock: 450.000 ₫</span>
          </div>
          <Link href="/mentor/sessions">
            <Button variant="ghost" size="sm" className="text-xs text-[#9BA1B0] hover:text-white">
              Thoát Phòng
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Classroom Area: 7:5 ratio */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column (7 Cols): Video Calls & Meeting Dock */}
        <div className="lg:col-span-7 p-4 flex flex-col bg-[#0B0C0E] border-r border-white/[0.08]">
          {/* Main Video: Mentee Video Stream with Mentor PIP */}
          <div className="relative flex-1 min-h-[380px] rounded-2xl bg-[#14171D] border border-white/[0.08] overflow-hidden flex items-center justify-center">
            {/* Visualizer Simulation */}
            <div className="flex flex-col items-center justify-center text-center p-6">
              <Avatar size="xl" alt="Hoàng Thùy Linh" className="mb-4 ring-4 ring-[#5E6AD2]/20" />
              <div className="text-sm font-semibold text-[#F0F2F5] mb-1">
                Hoàng Thùy Linh (Mentee)
              </div>
              <p className="text-xs text-[#9BA1B0] mb-4">
                Đang trình bày: Giải pháp Idempotent Payment Handler với Redis Redlock
              </p>

              {/* Audio Wave Bars */}
              <div className="flex items-center gap-1.5 h-6">
                {[12, 24, 18, 28, 14, 22, 10, 26, 16, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-[#27C98F] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Mentee Status Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#0B0C0E]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-[#27C98F]" />
              <span>Mentee Audio & Screen 1080p60</span>
            </div>

            {/* Picture-in-Picture: Mentor Self Preview */}
            <div className="absolute top-4 right-4 w-40 h-28 rounded-xl bg-[#1C2028] border border-white/[0.12] overflow-hidden shadow-2xl flex flex-col justify-between p-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#9BA1B0]">
                <span>Bạn (Mentor)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#27C98F]" />
              </div>
              <div className="flex items-center justify-center text-xs text-[#5D6474]">
                Webcam HD
              </div>
              <div className="text-[10px] text-[#5D6474] text-center font-mono">
                Nguyễn Văn An
              </div>
            </div>

            {/* Bottom Meeting Control Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0B0C0E]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/[0.1]">
              <button
                type="button"
                onClick={() => setMicOn(!micOn)}
                className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                  micOn
                    ? "bg-[#1F2022] text-[#F0F2F5] hover:bg-[#292A2C]"
                    : "bg-[#FF5C5C]/20 text-[#FF5C5C]"
                }`}
                title={micOn ? "Tắt Mic" : "Bật Mic"}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setCamOn(!camOn)}
                className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                  camOn
                    ? "bg-[#1F2022] text-[#F0F2F5] hover:bg-[#292A2C]"
                    : "bg-[#FF5C5C]/20 text-[#FF5C5C]"
                }`}
                title={camOn ? "Tắt Camera" : "Bật Camera"}
              >
                {camOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setSharing(!sharing)}
                className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                  sharing
                    ? "bg-[#5E6AD2] text-white"
                    : "bg-[#1F2022] text-[#F0F2F5] hover:bg-[#292A2C]"
                }`}
                title="Chia sẻ màn hình"
              >
                <MonitorUp className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="p-2.5 rounded-lg bg-[#1F2022] text-[#F0F2F5] hover:bg-[#292A2C] transition-colors cursor-pointer"
                title="Mở Chat"
              >
                <MessageSquare className="h-4 w-4" />
              </button>

              <span className="w-px h-6 bg-white/[0.1] mx-1" />

              <button
                type="button"
                className="p-2.5 rounded-lg bg-[#FF5C5C] hover:bg-[#E04D4D] text-white transition-colors cursor-pointer"
                title="Rời cuộc gọi"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Rubric & Escrow Submission */}
        <div className="lg:col-span-5 p-4 flex flex-col bg-[#14171D] overflow-y-auto space-y-5">
          {/* Tabs: Live Rubric vs Scratchpad */}
          <div className="flex items-center gap-1 rounded-lg bg-[#0B0C0E] p-1 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab("rubric")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "rubric"
                  ? "bg-[#1F2022] text-[#F0F2F5] shadow-sm"
                  : "text-[#9BA1B0] hover:text-white"
              }`}
            >
              Rubric 10 Tiêu Chí Kỹ Thuật
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scratchpad")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "scratchpad"
                  ? "bg-[#1F2022] text-[#F0F2F5] shadow-sm"
                  : "text-[#9BA1B0] hover:text-white"
              }`}
            >
              C# Scratchpad Code
            </button>
          </div>

          {activeTab === "rubric" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9BA1B0] font-mono">
                <span>Tiêu chuẩn đánh giá Senior FAANG</span>
                <span className="text-[#27C98F] font-bold">Điểm tạm tính: 45 / 50 (Pass)</span>
              </div>

              {RUBRIC_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#0D0E10] border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                >
                  <span className="text-[#F0F2F5] font-medium">{item.title}</span>
                  <div className="flex items-center gap-1 bg-[#14171D] px-2.5 py-1 rounded border border-white/[0.06] font-mono text-[#27C98F]">
                    <span>{item.score}</span>
                    <span className="text-[#5D6474]">/ 10</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-[#0D0E10] border border-white/[0.04] font-mono text-xs text-[#9BA1B0] space-y-1">
              <p className="text-[#5E6AD2]">{"// Idempotent Payment Consumer with Redlock"}</p>
              <p className="text-[#F0F2F5]">public async Task Handle(PaymentCommand cmd)</p>
              <p className="text-[#F0F2F5]">{"{"}</p>
              <p className="text-[#27C98F] pl-4">var lock = await _redlock.AcquireAsync(cmd.Key);</p>
              <p className="text-[#9BA1B0] pl-4">if (!lock.IsAcquired) return Task.CompletedTask;</p>
              <p className="text-[#F0F2F5]">{"}"}</p>
            </div>
          )}

          {/* Bottom Submission Drawer: Kết Thúc Buổi Học & Nộp Proof-of-Work */}
          <div className="rounded-xl bg-[#0D0E10] border border-[#27C98F]/20 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-[#27C98F]" />
              <h3 className="text-xs font-bold text-[#F0F2F5] uppercase tracking-wider">
                Nộp Bằng Chứng Nghiệm Thu (Proof-of-Work)
              </h3>
            </div>
            <p className="text-[11px] text-[#9BA1B0]">
              Tải lên bằng chứng buổi học để kích hoạt bộ đếm ngược Escrow 24h tự động giải ngân về ví của bạn.
            </p>

            {/* Proof File 1: Screenshot */}
            <div className="p-3 rounded-lg bg-[#14171D] border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 text-[#5E6AD2] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-mono text-[#F0F2F5] truncate">
                    webrtc_session_proof_98124.png
                  </div>
                  <div className="text-[10px] text-[#5D6474]">
                    MinIO Bucket: 1.8 MB • Timestamp: 2026-09-18 20:30
                  </div>
                </div>
              </div>
              <Badge variant="escrow" className="text-[10px]">
                Uploaded
              </Badge>
            </div>

            {/* Proof File 2: Deliverable PDF */}
            <div className="p-3 rounded-lg bg-[#14171D] border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="h-4 w-4 text-[#27C98F] shrink-0" />
                <div className="truncate">
                  <div className="text-xs font-mono text-[#F0F2F5] truncate">
                    system_design_rubric_deliverable.pdf
                  </div>
                  <div className="text-[10px] text-[#5D6474]">
                    Tài liệu bàn giao cho học viên • 420 KB
                  </div>
                </div>
              </div>
              <Badge variant="neutral" className="text-[10px]">
                Ready
              </Badge>
            </div>

            {/* Notes textarea */}
            <div>
              <label className="text-[11px] text-[#9BA1B0] mb-1.5 block">
                Ghi chú tóm tắt sau buổi học & Lời khuyên cho Mentee:
              </label>
              <Textarea
                rows={3}
                value={summaryNotes}
                onChange={(e) => setSummaryNotes(e.target.value)}
                className="text-xs bg-[#14171D]"
              />
            </div>

            {/* Submit Action Button */}
            {proofSubmitted ? (
              <div className="p-3 rounded-lg bg-[#27C98F]/10 border border-[#27C98F]/30 flex items-center gap-2 text-xs text-[#27C98F]">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  Đã nộp bằng chứng thành công! Bộ đếm ngược Escrow 24h đã được kích hoạt.
                </span>
              </div>
            ) : (
              <Button
                onClick={() => setProofSubmitted(true)}
                className="w-full bg-[#27C98F] hover:bg-[#22B37E] text-white font-semibold py-2.5 text-xs shadow-lg shadow-[#27C98F]/10"
              >
                Xác Nhận Hoàn Thành & Kích Hoạt Escrow 24h
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
