"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Tabs,
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
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function LearningRoomPage() {
  const [activeTab, setActiveTab] = useState("code");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0B0C0E]">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-12 border-b border-white/[0.08] bg-[#0D0E10] flex-shrink-0">
        <div className="flex items-center gap-3">
          <SessionTimer initialSeconds={3312} running={true} maxDuration={3600} />
          <span className="text-xs text-[#9BA1B0] hidden sm:inline">
            Phòng Học #RM-98124 — Mock Interview System Design
          </span>
        </div>
        <Button variant="destructive" size="sm">
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
            {/* Mentor placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Avatar alt="Nguyễn Văn An" size="xl" />
              <p className="mt-3 text-sm font-medium text-[#F0F2F5]">
                Nguyễn Văn An
              </p>
              <p className="text-xs text-[#9BA1B0]">Mentor</p>
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
                <Avatar alt="Bạn" size="sm" />
                <p className="text-[10px] text-[#9BA1B0] mt-1">Bạn</p>
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
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14171D] border border-white/[0.08] text-[#E3E2E5] hover:bg-[#1F2022] transition-all cursor-pointer">
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
                { id: "code", label: "Shared Code & Scratchpad" },
                { id: "proof", label: "Bằng Chứng Nghiệm Thu" },
              ]}
              activeId={activeTab}
              onChange={setActiveTab}
              size="sm"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4 min-h-0">
            {activeTab === "code" && (
              <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] p-4 font-mono text-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                    C# — Payment Idempotency
                  </span>
                </div>
                <pre className="text-[#E3E2E5] leading-relaxed overflow-x-auto">
{`public class PaymentService
{
    private readonly IIdempotencyStore _store;

    public async Task<PaymentResult> ProcessAsync(
        PaymentRequest request,
        CancellationToken ct)
    {
        // Check idempotency key in Redis
        var existing = await _store
            .GetAsync(request.IdempotencyKey, ct);

        if (existing is not null)
            return existing;

        // Process via PayOS gateway
        var result = await _gateway
            .ChargeAsync(request, ct);

        // Store result atomically
        await _store.SetAsync(
            request.IdempotencyKey,
            result,
            TimeSpan.FromHours(24),
            ct);

        return result;
    }
}`}
                </pre>
              </div>
            )}

            {activeTab === "proof" && (
              <div className="space-y-4">
                {/* Proof thumbnail */}
                <div className="rounded-xl bg-[#14171D] border border-white/[0.08] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileImage className="h-5 w-5 text-[#5E6AD2]" />
                    <div>
                      <p className="text-sm font-medium text-[#F0F2F5]">
                        webrtc_session_proof_98124.png
                      </p>
                      <p className="text-xs text-[#5D6474]">
                        Thời lượng ghi nhận: 55m 12s
                      </p>
                    </div>
                  </div>
                  <div className="h-32 rounded-lg bg-[#0B0C0E] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-xs text-[#5D6474]">
                      Ảnh chụp màn hình buổi học
                    </span>
                  </div>
                </div>

                {/* Escrow holding */}
                <EscrowShield amount="450.000 ₫" />

                {/* Action buttons */}
                <div className="space-y-2.5">
                  <Button variant="primary" className="w-full" size="lg">
                    <ShieldCheck className="h-4 w-4" />
                    ✓ Tôi Hài Lòng &amp; Giải Phóng Tiền Cho Mentor
                  </Button>
                  <Button variant="destructive" className="w-full" size="sm">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    ⚠️ Báo Cáo Sự Cố / Khiếu Nại (Mở SLA 48h)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
