"use client";

import {
  Avatar,
  Badge,
  Button,
  Card,
} from "@/components/ui";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Timeline } from "@/components/ui/timeline";
import {
  Scale,
  ShieldCheck,
  Clock,
  User,
  Server,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const DISPUTE = {
  id: "DISP-98124",
  booking: "SB-2026-98124",
  escrowAmount: "450.000 ₫",
};

const MENTEE_CLAIM = {
  name: "Hoàng Thùy Linh",
  time: "20:35",
  text: "Mentor vào muộn 15 phút, giải thích qua loa rồi out sớm sau 30 phút. Chưa cover hết nội dung System Design như cam kết gói 60 phút.",
  chatLogs: [
    { time: "19:30", event: "Mentee join phòng học" },
    { time: "19:42", event: 'Mentor xin lỗi vào trễ: "Sự cố kết nối, xin lỗi em"' },
    { time: "20:15", event: "Mentor rời phòng" },
    { time: "20:17", event: "Mentee rời phòng" },
  ],
};

const MENTOR_DEFENSE = {
  name: "Nguyễn Văn An",
  time: "22:10",
  text: "Tôi có mặt lúc 19:40 do sự cố kỹ thuật. Đã chuẩn bị sẵn tài liệu rubric và gửi cho Mentee qua email sau buổi học. Đề xuất dạy bù miễn phí.",
  attendance: {
    mentee: "19:30 – 20:17",
    mentor: "19:41 – 20:16",
    total: "35m 10s",
    missing: "24m 50s",
  },
};

const AUDIT_TRAIL = [
  {
    id: "1",
    timestamp: "18/09/2026 20:35",
    actor: "System",
    title: "Khiếu nại #DISP-98124 được tạo",
    description: "Mentee Hoàng Thùy Linh khởi tạo khiếu nại. Escrow 450.000 ₫ đóng băng.",
    variant: "error" as const,
  },
  {
    id: "2",
    timestamp: "18/09/2026 22:10",
    actor: "Mentor",
    title: "Nguyễn Văn An gửi giải trình",
    description: "Đề xuất dạy bù 1 buổi 60 phút miễn phí.",
    variant: "brand" as const,
  },
  {
    id: "3",
    timestamp: "19/09/2026 09:00",
    actor: "Admin",
    title: "Admin bắt đầu thẩm định",
    description: "Kiểm tra WebRTC attendance log và bằng chứng hai bên.",
    variant: "warning" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function AdminDisputesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Urgency Banner ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#FF5C5C]/5 border border-[#FF5C5C]/20 p-4 mb-8">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-[#FF5C5C]" />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-[#F0F2F5]">
                Khiếu Nại #{DISPUTE.id}
              </h1>
              <Badge variant="dispute" dot pulse>
                SLA REVIEWING
              </Badge>
            </div>
            <p className="text-xs text-[#9BA1B0]">
              Booking: {DISPUTE.booking} • Tiền ký quỹ:{" "}
              <span className="font-mono text-[#F5A623]">
                {DISPUTE.escrowAmount}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#F5A623]" />
          <span className="font-mono text-lg font-bold text-[#F5A623]">
            31h 14m 28s
          </span>
          <span className="text-xs text-[#5D6474]">remaining</span>
        </div>
      </div>

      {/* ── Side-by-Side Split Review ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Column 1: Mentee Claim */}
        <Card className="p-5 border-[#FF5C5C]/15">
          <div className="flex items-center gap-3 mb-4">
            <Avatar alt={MENTEE_CLAIM.name} size="sm" />
            <div>
              <span className="text-sm font-medium text-[#F0F2F5]">
                {MENTEE_CLAIM.name}
              </span>
              <span className="text-xs text-[#5D6474] ml-2">
                ({MENTEE_CLAIM.time})
              </span>
            </div>
            <Badge variant="dispute" className="ml-auto">
              Mentee
            </Badge>
          </div>
          <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4">
            &ldquo;{MENTEE_CLAIM.text}&rdquo;
          </p>

          {/* Chat logs */}
          <div className="rounded-lg bg-[#0B0C0E] border border-white/[0.06] p-3">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-2">
              Extracted Chat Logs
            </p>
            {MENTEE_CLAIM.chatLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs py-1">
                <span className="font-mono text-[#5D6474] w-12 flex-shrink-0">
                  [{log.time}]
                </span>
                <span className="text-[#9BA1B0]">{log.event}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Column 2: Mentor Defense */}
        <Card className="p-5 border-[#5E6AD2]/15">
          <div className="flex items-center gap-3 mb-4">
            <Avatar alt={MENTOR_DEFENSE.name} size="sm" />
            <div>
              <span className="text-sm font-medium text-[#F0F2F5]">
                {MENTOR_DEFENSE.name}
              </span>
              <span className="text-xs text-[#5D6474] ml-2">
                ({MENTOR_DEFENSE.time})
              </span>
            </div>
            <Badge variant="brand" className="ml-auto">
              Mentor
            </Badge>
          </div>
          <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4">
            &ldquo;{MENTOR_DEFENSE.text}&rdquo;
          </p>

          {/* Attendance Log */}
          <div className="rounded-lg bg-[#0B0C0E] border border-white/[0.06] p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Server className="h-3 w-3 text-[#5D6474]" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
                WebRTC Server Attendance Log
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#9BA1B0]">Mentee</span>
                <span className="font-mono text-[#E3E2E5]">
                  {MENTOR_DEFENSE.attendance.mentee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA1B0]">Mentor</span>
                <span className="font-mono text-[#E3E2E5]">
                  {MENTOR_DEFENSE.attendance.mentor}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/[0.06]">
                <span className="text-[#9BA1B0]">Tổng thời gian</span>
                <span className="font-mono text-[#F5A623] font-medium">
                  {MENTOR_DEFENSE.attendance.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA1B0]">Thiếu</span>
                <span className="font-mono text-[#FF5C5C] font-medium">
                  {MENTOR_DEFENSE.attendance.missing}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── 4 Ruling Commands ── */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-[#F0F2F5] mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#5E6AD2]" />
          Quyết Định Phán Quyết (Admin Action)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="destructive" className="h-auto py-3 flex-col gap-1">
            <span className="text-xs font-semibold">Hoàn 100% Mentee</span>
            <span className="text-[10px] opacity-70">
              Chấp thuận khiếu nại
            </span>
          </Button>
          <Button variant="primary" className="h-auto py-3 flex-col gap-1">
            <span className="text-xs font-semibold">Chia Đôi 50/50</span>
            <span className="text-[10px] opacity-70">
              Mỗi bên 225.000 ₫
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1 border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/5"
          >
            <span className="text-xs font-semibold">Cấp Slot Dạy Bù</span>
            <span className="text-[10px] opacity-70">
              Giữ Escrow, Mentor bù
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-3 flex-col gap-1 border-[#27C98F]/30 text-[#27C98F] hover:bg-[#27C98F]/5"
          >
            <span className="text-xs font-semibold">Giải Phóng Mentor</span>
            <span className="text-[10px] opacity-70">
              Bác khiếu nại
            </span>
          </Button>
        </div>
      </section>

      {/* ── Audit Trail ── */}
      <section>
        <h2 className="text-sm font-semibold text-[#F0F2F5] mb-4">
          Audit Trail Log
        </h2>
        <Timeline events={AUDIT_TRAIL} />
      </section>
    </div>
  );
}
