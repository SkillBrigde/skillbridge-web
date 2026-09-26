"use client";

import React from "react";
import {
  Video,
  Mic,
  Camera,
  MonitorUp,
  MessageSquare,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Check,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import { Badge, Button, Card, Currency } from "@/components/ui";

export default function RoomPage() {
  const [activeTab, setActiveTab] = React.useState<"code" | "proof">("code");

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#0B0C0E]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5C5C] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5C5C] font-bold">REC</span>
          </span>
          <span className="text-xs text-[#9BA1B0]">
            Phòng Học <span className="font-mono text-[#5E6AD2]">#RM-98124</span> — Mock Interview System Design
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-bold text-[#27C98F] tracking-tight">00:55:12</span>
          <Button variant="destructive" size="sm">
            <Phone className="h-3.5 w-3.5" />
            Rời Phòng
          </Button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video Feeds (7/12) */}
        <div className="lg:w-7/12 flex flex-col bg-[#0B0C0E] relative">
          {/* Main Video */}
          <div className="flex-1 relative bg-gradient-to-br from-[#14171D] to-[#0B0C0E] flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-[#1F2022] border border-white/[0.12] flex items-center justify-center mx-auto mb-3">
                <Video className="h-10 w-10 text-[#5D6474]" />
              </div>
              <p className="text-sm font-semibold text-[#F0F2F5]">Nguyễn Văn An</p>
              <p className="text-[11px] text-[#5D6474]">Mentor • Tech Lead @ VNG</p>
              {/* Audio visualizer */}
              <div className="flex items-end justify-center gap-0.5 mt-3 h-6">
                {[3, 5, 8, 4, 6, 7, 3, 5, 4, 6, 8, 5, 3].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#27C98F] rounded-full animate-pulse"
                    style={{ height: `${h * 2.5}px`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>
            {/* PIP - Mentee */}
            <div className="absolute top-4 right-4 w-36 h-28 rounded-xl bg-[#1F2022] border border-white/[0.12] flex items-center justify-center shadow-lg">
              <div className="text-center">
                <Camera className="h-5 w-5 text-[#5D6474] mx-auto mb-1" />
                <span className="text-[10px] text-[#5D6474]">Bạn</span>
              </div>
            </div>
          </div>

          {/* Controls Dock */}
          <div className="flex items-center justify-center gap-2 py-3 px-4 border-t border-white/[0.06] bg-[#0D0E10]">
            {[
              { icon: Mic, label: "Mic", active: true },
              { icon: Camera, label: "Camera", active: true },
              { icon: MonitorUp, label: "Chia sẻ", active: false },
              { icon: MessageSquare, label: "Chat", active: false },
            ].map((ctrl) => (
              <button
                key={ctrl.label}
                type="button"
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-[10px] transition-all cursor-pointer ${
                  ctrl.active
                    ? "bg-[#1F2022] text-[#F0F2F5] border border-white/[0.08]"
                    : "text-[#5D6474] hover:text-[#9BA1B0] hover:bg-[#14171D]"
                }`}
              >
                <ctrl.icon className="h-4 w-4" />
                {ctrl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Workspace & Escrow (5/12) */}
        <div className="lg:w-5/12 border-l border-white/[0.08] flex flex-col bg-[#14171D] overflow-y-auto">
          {/* Tab switch */}
          <div className="flex border-b border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex-1 py-3 text-xs font-medium text-center transition-colors cursor-pointer ${
                activeTab === "code" ? "text-[#F0F2F5] border-b-2 border-[#5E6AD2]" : "text-[#5D6474] hover:text-[#9BA1B0]"
              }`}
            >
              Shared Code & Scratchpad
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("proof")}
              className={`flex-1 py-3 text-xs font-medium text-center transition-colors cursor-pointer ${
                activeTab === "proof" ? "text-[#F0F2F5] border-b-2 border-[#5E6AD2]" : "text-[#5D6474] hover:text-[#9BA1B0]"
              }`}
            >
              Bằng Chứng Nghiệm Thu
            </button>
          </div>

          {activeTab === "code" ? (
            <div className="p-4 flex-1">
              <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 font-mono text-xs text-[#E3E2E5] overflow-x-auto">
                <div className="text-[#5D6474] mb-2">{"// payment-idempotency.cs"}</div>
                <div><span className="text-[#BDC2FF]">public async</span> Task&lt;PaymentResult&gt; <span className="text-[#48DFA3]">ProcessPayment</span>(</div>
                <div className="pl-4"><span className="text-[#FFB955]">PaymentRequest</span> request,</div>
                <div className="pl-4"><span className="text-[#FFB955]">CancellationToken</span> ct)</div>
                <div>{"{"}</div>
                <div className="pl-4"><span className="text-[#5D6474]">{"// Idempotency key check"}</span></div>
                <div className="pl-4"><span className="text-[#BDC2FF]">var</span> existing = <span className="text-[#BDC2FF]">await</span> _cache</div>
                <div className="pl-8">.<span className="text-[#48DFA3]">GetAsync</span>($<span className="text-[#FFB955]">&quot;pay:{"{"}request.IdempotencyKey{"}"}&quot;</span>);</div>
                <div className="pl-4"><span className="text-[#BDC2FF]">if</span> (existing != <span className="text-[#BDC2FF]">null</span>)</div>
                <div className="pl-8"><span className="text-[#BDC2FF]">return</span> JsonSerializer.Deserialize&lt;PaymentResult&gt;(existing);</div>
                <div>{"}"}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 flex-1 space-y-4">
              {/* Proof preview */}
              <div className="rounded-xl bg-[#0F1115] border border-white/[0.04] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1F2022] border border-white/[0.08]">
                    <ImageIcon className="h-5 w-5 text-[#5D6474]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#F0F2F5]">webrtc_session_proof_98124.png</p>
                    <p className="text-[10px] text-[#5D6474] font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 55m 12s • WebRTC Recording
                    </p>
                  </div>
                </div>
              </div>

              {/* Escrow Holding */}
              <div className="rounded-xl bg-[#03BD84]/[0.06] border border-[#27C98F]/20 p-4 text-center">
                <ShieldCheck className="h-8 w-8 text-[#27C98F] mx-auto mb-2" />
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#27C98F] mb-1">
                  Escrow Holding
                </p>
                <Currency amount={450000} highlight="emerald" size="lg" />
                <p className="text-[10px] text-[#5D6474] mt-1">đang giữ trong Escrow</p>
              </div>

              {/* Actions */}
              <Button className="w-full bg-[#27C98F] hover:bg-[#2ED89C] text-white border-[#27C98F]/30" size="lg">
                <Check className="h-4 w-4" />
                Tôi Hài Lòng & Giải Phóng Tiền Cho Mentor
              </Button>
              <Button variant="destructive" className="w-full" size="md">
                <AlertTriangle className="h-4 w-4" />
                Báo Cáo Sự Cố / Khiếu Nại (Mở SLA 48h)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
