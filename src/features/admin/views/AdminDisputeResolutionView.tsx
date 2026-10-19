"use client";

import { useState, useMemo } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  NoticeBanner,
} from "@/components/ui";
import { Timeline } from "@/components/ui/timeline";
import {
  Scale,
  ShieldCheck,
  Clock,
  Server,
} from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useNow, actions } from "@/lib/store";
import { vnd, fmtCountdown, slotDateLabel, type DisputeRuling } from "@/lib/domain";

export function AdminDisputeResolutionView() {
  const state = useAppState();
  const now = useNow("second");

  const disputes = state.disputes;
  const [selectedDisputeId, setSelectedDisputeId] = useState(disputes[0]?.id || "");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispute = useMemo(() => {
    return disputes.find((d) => d.id === selectedDisputeId) || disputes[0];
  }, [disputes, selectedDisputeId]);

  const booking = useMemo(() => {
    return dispute ? state.bookings.find((b) => b.id === dispute.bookingId) : null;
  }, [state.bookings, dispute]);

  const remainingSeconds = useMemo(() => {
    if (!dispute) return 0;
    return Math.max(0, Math.floor((dispute.slaExpiresAt - now) / 1000));
  }, [dispute, now]);

  const handleRule = (ruling: DisputeRuling, label: string) => {
    if (!dispute) return;
    setErrorMsg("");
    const res = actions.ruleDispute(
      dispute.id,
      ruling,
      `Admin phê duyệt phán quyết: ${label} sau khi đối soát WebRTC log và bằng chứng.`
    );
    if (!res.ok) {
      setErrorMsg(res.error || "Thực hiện phán quyết thất bại.");
    } else {
      setSuccessMsg(`Đã thực thi thành công phán quyết: ${label}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const auditEvents = useMemo(() => {
    if (!dispute) return [];
    const ev: Array<{
      id: string;
      timestamp: string;
      actor: string;
      title: string;
      description: string;
      variant: "error" | "brand" | "warning" | "success";
    }> = [
      {
        id: "1",
        timestamp: slotDateLabel(dispute.createdAt),
        actor: "Mentee",
        title: `Khiếu nại #${dispute.id} được khởi tạo`,
        description: `Mentee ${dispute.menteeName} gửi khiếu nại: "${dispute.menteeStatement}". Escrow được đóng băng tự động.`,
        variant: "error",
      },
    ];
    if (dispute.mentorStatement) {
      ev.push({
        id: "2",
        timestamp: slotDateLabel(dispute.mentorRespondedAt || dispute.createdAt),
        actor: "Mentor",
        title: `Mentor ${booking?.mentorName || "chuyên gia"} gửi giải trình`,
        description: dispute.mentorStatement,
        variant: "brand",
      });
    }
    if (dispute.ruling) {
      ev.push({
        id: "3",
        timestamp: dispute.resolvedAt ? slotDateLabel(dispute.resolvedAt) : "Chưa có thời gian xử lý",
        actor: "Admin",
        title: `Admin thực thi phán quyết: ${dispute.ruling}`,
        description: dispute.rulingNote || "",
        variant: "success",
      });
    }
    return ev;
  }, [dispute, booking]);

  return (
    <RequireRole role="admin" title="Admin Tranh Chấp & SLA" description="Chỉ Quản trị viên SkillBridge mới có quyền thực thi phán quyết SLA.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Queue Selector Bar */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs font-mono text-[#5D6474] uppercase tracking-wider flex-shrink-0">
            Hàng đợi tranh chấp ({disputes.length}):
          </span>
          {disputes.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDisputeId(d.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono border transition-all flex items-center gap-1.5 flex-shrink-0 ${
                d.id === dispute?.id
                  ? "bg-[#FF5C5C]/20 border-[#FF5C5C] text-white font-bold"
                  : "bg-[#14171D] border-white/[0.08] text-[#9BA1B0] hover:text-white"
              }`}
            >
              <span>#{d.id}</span>
              <span className="text-[10px] text-[#5D6474]">({d.status})</span>
            </button>
          ))}
        </div>

        {errorMsg && <div className="mb-6"><NoticeBanner variant="error" message={errorMsg} /></div>}
        {successMsg && <div className="mb-6"><NoticeBanner variant="success" message={successMsg} /></div>}

        {/* ── Urgency Banner ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#FF5C5C]/5 border border-[#FF5C5C]/20 p-4 mb-8">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 text-[#FF5C5C]" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-[#F0F2F5]">
                  Khiếu Nại #{dispute?.id}
                </h1>
                <Badge variant={dispute?.status === "Resolved" ? "escrow" : "dispute"} dot pulse>
                  {dispute?.status}
                </Badge>
              </div>
              <p className="text-xs text-[#9BA1B0]">
                Đơn học: #{booking?.code} • Tiền ký quỹ Escrow:{" "}
                <span className="font-mono text-[#F5A623]">
                  {booking ? vnd(booking.priceVnd) : "0 ₫"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#F5A623]" />
            <span className="font-mono text-lg font-bold text-[#F5A623]">
              {fmtCountdown(remainingSeconds)}
            </span>
            <span className="text-xs text-[#5D6474]">SLA 48h deadline</span>
          </div>
        </div>

        {/* ── Side-by-Side Split Review ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Column 1: Mentee Claim */}
          <Card className="p-5 border-[#FF5C5C]/15">
            <div className="flex items-center gap-3 mb-4">
              <Avatar alt={dispute?.menteeName} size="sm" />
              <div>
                <span className="text-sm font-medium text-[#F0F2F5]">
                  {dispute?.menteeName}
                </span>
                <span className="text-xs text-[#5D6474] ml-2">
                  (Học viên khiếu nại)
                </span>
              </div>
              <Badge variant="dispute" className="ml-auto">
                {dispute?.reason}
              </Badge>
            </div>
            <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4 bg-[#FF5C5C]/5 p-3 rounded-lg border border-[#FF5C5C]/10">
              &ldquo;{dispute?.menteeStatement}&rdquo;
            </p>

            <div className="rounded-lg bg-[#0B0C0E] border border-white/[0.06] p-3 text-xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-1">
                Yêu cầu xử lý từ Mentee:
              </p>
              <p className="text-white font-medium">
                {dispute?.menteeWish === "full_refund" ? "Hoàn tiền 100% về ví" : "Đổi lịch học bù phiên khác"}
              </p>
            </div>
          </Card>

          {/* Column 2: Mentor Defense */}
          <Card className="p-5 border-[#5E6AD2]/15">
            <div className="flex items-center gap-3 mb-4">
              <Avatar alt={booking?.mentorName} size="sm" />
              <div>
                <span className="text-sm font-medium text-[#F0F2F5]">
                  {booking?.mentorName}
                </span>
                <span className="text-xs text-[#5D6474] ml-2">
                  (Mentor giải trình)
                </span>
              </div>
              <Badge variant="brand" className="ml-auto">
                Mentor
              </Badge>
            </div>

            {dispute?.mentorStatement ? (
              <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4 bg-[#5E6AD2]/5 p-3 rounded-lg border border-[#5E6AD2]/10">
                &ldquo;{dispute.mentorStatement}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-[#5D6474] italic mb-4">
                Chưa có văn bản giải trình từ phía Mentor (trong thời hạn SLA 24h).
              </p>
            )}

            {/* Attendance Log */}
            <div className="rounded-lg bg-[#0B0C0E] border border-white/[0.06] p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Server className="h-3 w-3 text-[#5D6474]" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                  WebRTC Server Attendance Log
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#9BA1B0]">Mentee Online:</span>
                  <span className="text-[#E3E2E5]">19:30 – 20:17</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA1B0]">Mentor Online:</span>
                  <span className="text-[#E3E2E5]">19:41 – 20:16</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                  <span className="text-[#9BA1B0]">Thời gian trùng:</span>
                  <span className="text-[#F5A623] font-medium">35m 10s / 60m</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── 4 Ruling Commands ── */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-[#F0F2F5] mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#5E6AD2]" />
            Quyết Định Phán Quyết (Admin SLA Actions)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="destructive"
              className="h-auto py-3 flex-col gap-1"
              disabled={dispute?.status === "Resolved"}
              onClick={() => handleRule("FullRefund", "Hoàn 100% tiền học phí cho Mentee")}
            >
              <span className="text-xs font-semibold">Hoàn 100% Mentee</span>
              <span className="text-[10px] opacity-70">
                Chấp thuận khiếu nại
              </span>
            </Button>
            <Button
              variant="primary"
              className="h-auto py-3 flex-col gap-1"
              disabled={dispute?.status === "Resolved"}
              onClick={() => handleRule("Split5050", "Chia đôi 50/50 tiền ký quỹ")}
            >
              <span className="text-xs font-semibold">Chia Đôi 50/50</span>
              <span className="text-[10px] opacity-70">
                Mỗi bên 50% thù lao
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1 border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/5"
              disabled={dispute?.status === "Resolved"}
              onClick={() => handleRule("MakeUpSession", "Yêu cầu Mentor dạy bù 1 buổi")}
            >
              <span className="text-xs font-semibold">Cấp Slot Dạy Bù</span>
              <span className="text-[10px] opacity-70">
                Giữ Escrow, Mentor bù
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-3 flex-col gap-1 border-[#27C98F]/30 text-[#27C98F] hover:bg-[#27C98F]/5"
              disabled={dispute?.status === "Resolved"}
              onClick={() => handleRule("ReleaseMentor", "Giải phóng tiền cho Mentor")}
            >
              <span className="text-xs font-semibold">Giải Phóng Mentor</span>
              <span className="text-[10px] opacity-70">
                Bác khiếu nại (đúng cam kết)
              </span>
            </Button>
          </div>
        </section>

        {/* ── Audit Trail ── */}
        <section>
          <h2 className="text-sm font-semibold text-[#F0F2F5] mb-4">
            Audit Trail Log
          </h2>
          <Timeline events={auditEvents} />
        </section>
      </div>
    </RequireRole>
  );
}
