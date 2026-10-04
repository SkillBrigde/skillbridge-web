"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function MentorSessionPage() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0B0C0E]">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-12 border-b border-white/[0.08] bg-[#0D0E10] flex-shrink-0">
        <div className="flex items-center gap-3">
          <SessionTimer initialSeconds={3490} running={true} maxDuration={3600} />
          <span className="text-xs text-[#9BA1B0] hidden sm:inline">
            Phòng Học #RM-98124 — Mock Interview System Design
          </span>
          <Badge variant="brand" dot pulse>
            MENTOR VIEW
          </Badge>
        </div>
        <Button variant="destructive" size="sm">
          <LogOut className="h-3.5 w-3.5" />
          Rời Phòng
        </Button>
      </div>

      {/* ── Video Workspace ── */}
      <div className="flex-1 relative min-h-0">
        {/* Main video area */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-4xl rounded-xl bg-[#14171D] border border-white/[0.08] flex items-center justify-center">
            <div className="text-center">
              <Avatar alt="Hoàng Thùy Linh" size="xl" />
              <p className="mt-3 text-sm font-medium text-[#F0F2F5]">
                Hoàng Thùy Linh
              </p>
              <p className="text-xs text-[#9BA1B0]">Mentee</p>
              {/* Audio visualizer */}
              <div className="flex items-end gap-0.5 mt-3 h-6 justify-center">
                {[4, 6, 9, 7, 5, 8, 6, 4, 7, 5].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#5E6AD2] rounded-full animate-pulse"
                    style={{ height: `${h * 3}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PiP: Mentor (you) */}
        <div className="absolute top-4 right-4 w-36 h-28 rounded-lg bg-[#1C2028] border border-white/[0.12] flex items-center justify-center shadow-lg z-10">
          <div className="text-center">
            <Avatar alt="Bạn (Mentor)" size="sm" />
            <p className="text-[10px] text-[#9BA1B0] mt-1">Bạn</p>
          </div>
        </div>

        {/* Meeting control dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
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
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022] transition-all cursor-pointer">
            <MessageSquare className="h-4 w-4" />
          </button>

          <div className="w-[1px] h-6 bg-white/[0.08] mx-1" />

          {/* Submission drawer trigger */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex items-center gap-1.5 h-10 px-3 rounded-full bg-[#27C98F]/15 border border-[#27C98F]/30 text-[#27C98F] hover:bg-[#27C98F]/20 transition-all cursor-pointer text-xs font-medium"
          >
            <Upload className="h-3.5 w-3.5" />
            Nộp Bằng Chứng
            <ChevronUp className={`h-3 w-3 transition-transform ${drawerOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Bottom Submission Drawer ── */}
      <div
        className={`border-t border-white/[0.08] bg-[#0D0E10] transition-all duration-300 overflow-hidden ${
          drawerOpen ? "max-h-[500px] py-6" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-3xl px-6 space-y-5">
          <h3 className="text-base font-semibold text-[#F0F2F5] tracking-tight">
            Kết Thúc Buổi Học &amp; Nộp Bằng Chứng Nghiệm Thu (Proof-of-Work)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload
              accept="image/*"
              maxSizeMB={10}
              label="Ảnh chụp màn hình buổi học / Bảng vẽ kiến trúc"
            />
            <FileUpload
              accept=".pdf,image/*"
              maxSizeMB={20}
              label="Tài liệu bàn giao (PDF Rubric / Source code)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-1.5">
              Ghi chú tóm tắt sau buổi học và lời khuyên dành cho Mentee
            </label>
            <Textarea
              placeholder="Tóm tắt nội dung đã cover, điểm mạnh / điểm cần cải thiện của Mentee..."
              rows={3}
            />
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Xác Nhận Hoàn Thành Buổi Học &amp; Kích Hoạt Bộ Đếm Escrow 24h
          </Button>
        </div>
      </div>
    </div>
  );
}
