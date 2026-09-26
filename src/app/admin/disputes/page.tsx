"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Scale,
  CalendarPlus,
  Send,
  FileText,
  User,
  ExternalLink,
  MessageSquare,
  Activity,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Currency } from "@/components/ui";

interface AuditLog {
  timestamp: string;
  adminName: string;
  action: string;
  reason: string;
}

export default function AdminDisputeCenterPage() {
  const [selectedVerdict, setSelectedVerdict] = useState<string | null>(null);
  const [verdictReason, setVerdictReason] = useState("");
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      timestamp: "18/09/2026 20:35",
      adminName: "Hệ Thống",
      action: "Khởi tạo Dispute #DISP-98124",
      reason: "Mentee gửi đơn khiếu nại buổi học thiếu thời lượng cam kết",
    },
    {
      timestamp: "18/09/2026 22:10",
      adminName: "Hệ Thống",
      action: "Ghi nhận giải trình Mentor",
      reason: "Mentor Nguyễn Văn An nộp bằng chứng WebRTC và tài liệu rubric",
    },
  ]);

  const handleApplyVerdict = (verdict: string) => {
    setSelectedVerdict(verdict);
    const newLog: AuditLog = {
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " Hôm nay",
      adminName: "Super Admin (Bạn)",
      action: verdict,
      reason: verdictReason || "Phán quyết dựa trên WebRTC server log thiếu 24m50s",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb & Urgency Banner */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-3">
        <Link href="/admin/escrow" className="hover:text-[#F0F2F5] transition-colors">
          Admin Operations
        </Link>
        <span>/</span>
        <span className="text-[#9BA1B0]">SLA 48h Dispute Arbitration</span>
      </div>

      {/* SLA 48h Countdown Banner */}
      <div className="rounded-2xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-[#FF5C5C]/5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-[#FF5C5C]/20 border border-[#FF5C5C]/30 flex items-center justify-center text-[#FF5C5C] shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-base font-bold text-[#F0F2F5]">
                Khiếu Nại #DISP-98124 — SLA ARBITRATION REVIEW
              </span>
              <Badge variant="dispute" dot pulse>
                Khẩn cấp
              </Badge>
            </div>
            <p className="text-xs text-[#9BA1B0] mt-1 font-mono">
              Hợp đồng: #SB-2026-98124 • Tiền ký quỹ đang đóng băng:{" "}
              <span className="text-[#27C98F] font-bold">450.000 ₫</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#14171D] px-4 py-2.5 rounded-xl border border-white/[0.08]">
          <Clock className="h-5 w-5 text-[#F5A623] animate-pulse" />
          <div>
            <span className="text-[10px] text-[#5D6474] uppercase font-mono block">
              Thời hạn phán quyết SLA:
            </span>
            <span className="text-sm font-mono font-bold text-[#F5A623]">
              ⏱️ 31h 14m 28s remaining
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Split Review (Linear / PR Review Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Column 1: Mentee Claim */}
        <Card className="p-6 bg-[#14171D] border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Avatar size="md" alt="Hoàng Thùy Linh" />
                <div>
                  <div className="text-xs font-bold text-[#F0F2F5]">
                    Hoàng Thùy Linh (Mentee)
                  </div>
                  <div className="text-[10px] text-[#5D6474] font-mono">
                    Nộp đơn: 18/09/2026 20:35
                  </div>
                </div>
              </div>
              <Badge variant="dispute" className="text-[10px]">
                Bên Khởi Kiện
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                  Lý do khiếu nại:
                </span>
                <p className="text-xs font-semibold text-[#FF5C5C] bg-[#FF5C5C]/5 p-2.5 rounded-lg border border-[#FF5C5C]/20">
                  Mentor vắng mặt & kết thúc buổi học trước thời hạn cam kết (&gt;20 phút)
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                  Nội dung tường trình của Mentee:
                </span>
                <p className="text-xs text-[#F0F2F5] leading-relaxed bg-[#0D0E10] p-3.5 rounded-xl border border-white/[0.04]">
                  &ldquo;Buổi học theo lịch là 19:30 nhưng đến 19:42 Mentor mới vào. Sau đó Mentor
                  trả lời qua loa các câu hỏi về System Design rồi đến 20:15 thì xin phép rời
                  phòng sớm do có việc gia đình đột xuất. Tôi không nhận được giải pháp kiến trúc
                  hoàn chỉnh như cam kết của gói 60 phút.&rdquo;
                </p>
              </div>

              {/* Chat Log Extraction */}
              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                  Trích xuất tin nhắn chat trong phòng học:
                </span>
                <div className="bg-[#0D0E10] rounded-xl border border-white/[0.04] p-3 text-[11px] font-mono space-y-1.5 text-[#9BA1B0]">
                  <div>
                    <span className="text-[#5D6474]">[19:30:12]</span> Mentee join room.
                  </div>
                  <div>
                    <span className="text-[#5D6474]">[19:42:05]</span>{" "}
                    <span className="text-[#5E6AD2]">Mentor:</span> &ldquo;Chào Linh, anh xin lỗi bị kẹt xe vào trễ 12p nhé.&rdquo;
                  </div>
                  <div>
                    <span className="text-[#5D6474]">[20:15:20]</span>{" "}
                    <span className="text-[#5E6AD2]">Mentor:</span> &ldquo;Anh có việc gấp phải out trước nhé, tài liệu anh gửi sau.&rdquo;
                  </div>
                  <div>
                    <span className="text-[#5D6474]">[20:16:01]</span> Mentor left room.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-[#F5A623]">
            Nguyện vọng: Hoàn lại 100% tiền về ví Mentee (450.000 ₫)
          </div>
        </Card>

        {/* Column 2: Mentor Defense & Server Logs */}
        <Card className="p-6 bg-[#14171D] border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Avatar size="md" alt="Nguyễn Văn An" />
                <div>
                  <div className="text-xs font-bold text-[#F0F2F5]">
                    Nguyễn Văn An (Mentor)
                  </div>
                  <div className="text-[10px] text-[#5D6474] font-mono">
                    Giải trình: 18/09/2026 22:10
                  </div>
                </div>
              </div>
              <Badge variant="brand" className="text-[10px]">
                Bên Bị Khiếu Nại
              </Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                  Đề xuất giải quyết của Mentor:
                </span>
                <p className="text-xs font-semibold text-[#5E6AD2] bg-[#5E6AD2]/10 p-2.5 rounded-lg border border-[#5E6AD2]/20">
                  Đồng ý dạy bù 1 buổi 60 phút hoàn toàn miễn phí cho Mentee
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                  Ý kiến giải trình của Mentor:
                </span>
                <p className="text-xs text-[#F0F2F5] leading-relaxed bg-[#0D0E10] p-3.5 rounded-xl border border-white/[0.04]">
                  &ldquo;Tôi có mặt lúc 19:40 do sự cố kỹ thuật kết nối mạng. Tôi đã chuẩn bị sẵn
                  toàn bộ rubric 10 tiêu chí và tài liệu PDF. Tôi có đề xuất dạy bù thêm 20 phút
                  sau đó nhưng mentee bảo bận. Tôi đã gửi file rubric qua email lúc 21:00.&rdquo;
                </p>
              </div>

              {/* Server Attendance Log */}
              <div>
                <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#27C98F]" />
                  <span>WebRTC Server Telemetry Log (Bằng chứng độc lập):</span>
                </span>
                <div className="bg-[#0D0E10] rounded-xl border border-white/[0.04] p-3 text-[11px] font-mono space-y-1 text-[#9BA1B0]">
                  <div className="flex justify-between">
                    <span>Mentee Connected:</span>
                    <span className="text-[#F0F2F5]">19:30:10 → 20:17:15 (47m 05s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mentor Connected:</span>
                    <span className="text-[#F0F2F5]">19:41:02 → 20:16:12 (35m 10s)</span>
                  </div>
                  <div className="flex justify-between border-t border-white/[0.04] pt-1 text-[#FF5C5C]">
                    <span>Thời gian học chung thực tế:</span>
                    <span className="font-bold">35m 10s (Thiếu 24m 50s so với cam kết 60m)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-[#27C98F]">
            Chứng từ đính kèm: rubric_faang_sent.pdf (Khớp MinIO hash)
          </div>
        </Card>
      </div>

      {/* Admin 4 Ruling Commands Action Bar */}
      <Card className="p-6 mb-8 bg-[#14171D] border-white/[0.08] space-y-5">
        <div>
          <h2 className="text-sm font-bold text-[#F0F2F5] flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#5E6AD2]" />
            Bảng Lệnh Phán Quyết Của Ban Quản Trị (Admin Ruling Commands)
          </h2>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Quyết định của Admin sẽ tự động giải phóng tiền Escrow theo tỷ lệ và ghi nhận nhật ký bất biến.
          </p>
        </div>

        {/* 4 Verdict Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ruling 1 */}
          <button
            type="button"
            onClick={() => handleApplyVerdict("Hoàn 100% Cho Mentee")}
            className="p-4 rounded-xl bg-[#FF5C5C]/10 hover:bg-[#FF5C5C]/20 border border-[#FF5C5C]/30 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#FF5C5C]">1. Hoàn 100% Mentee</span>
              <RotateCcw className="h-4 w-4 text-[#FF5C5C] group-hover:rotate-180 transition-transform duration-300" />
            </div>
            <div className="text-[11px] text-[#9BA1B0]">
              Hoàn trả 450.000 ₫ về ví Mentee. Cảnh cáo vi phạm SLA Mentor.
            </div>
          </button>

          {/* Ruling 2 */}
          <button
            type="button"
            onClick={() => handleApplyVerdict("Chia Đôi 50/50")}
            className="p-4 rounded-xl bg-[#5E6AD2]/10 hover:bg-[#5E6AD2]/20 border border-[#5E6AD2]/30 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#BDC2FF]">2. Chia Đôi 50/50</span>
              <Scale className="h-4 w-4 text-[#5E6AD2]" />
            </div>
            <div className="text-[11px] text-[#9BA1B0]">
              Mỗi bên nhận 225.000 ₫ vì Mentor có dạy 35m và gửi tài liệu.
            </div>
          </button>

          {/* Ruling 3 */}
          <button
            type="button"
            onClick={() => handleApplyVerdict("Cấp Slot Dạy Bù")}
            className="p-4 rounded-xl bg-[#F5A623]/10 hover:bg-[#F5A623]/20 border border-[#F5A623]/30 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#F5A623]">3. Cấp Slot Dạy Bù</span>
              <CalendarPlus className="h-4 w-4 text-[#F5A623]" />
            </div>
            <div className="text-[11px] text-[#9BA1B0]">
              Tiếp tục giữ tiền Escrow. Yêu cầu Mentor xếp lịch dạy bù 60m.
            </div>
          </button>

          {/* Ruling 4 */}
          <button
            type="button"
            onClick={() => handleApplyVerdict("Giải Phóng Mentor")}
            className="p-4 rounded-xl bg-[#27C98F]/10 hover:bg-[#27C98F]/20 border border-[#27C98F]/30 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#27C98F]">4. Giải Phóng Mentor</span>
              <CheckCircle2 className="h-4 w-4 text-[#27C98F]" />
            </div>
            <div className="text-[11px] text-[#9BA1B0]">
              Bác khiếu nại, giải phóng 450.000 ₫ cho Mentor nếu khiếu nại sai.
            </div>
          </button>
        </div>

        {selectedVerdict && (
          <div className="p-4 rounded-xl bg-[#27C98F]/10 border border-[#27C98F]/30 flex items-center justify-between gap-3 text-xs text-[#27C98F]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Phán quyết đã chọn: <strong>{selectedVerdict}</strong>. Lệnh thực thi Escrow đã được gửi tới Ledger Service!
              </span>
            </div>
            <Badge variant="escrow" className="font-mono text-[10px]">
              Ledger Synced
            </Badge>
          </div>
        )}
      </Card>

      {/* Audit Trail Log */}
      <Card className="p-6 bg-[#14171D] border-white/[0.08]">
        <h3 className="text-xs font-bold text-[#F0F2F5] uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#5E6AD2]" />
          Nhật Ký Thẩm Định & Phán Quyết Bất Biến (Audit Trail)
        </h3>

        <div className="space-y-3">
          {auditLogs.map((log, i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg bg-[#0D0E10] border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-[#5D6474]">{log.timestamp}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[#5E6AD2] font-semibold">{log.adminName}</span>
                </div>
                <div className="text-[#F0F2F5] font-medium">{log.action}</div>
                <div className="text-[11px] text-[#9BA1B0]">{log.reason}</div>
              </div>

              <div className="font-mono text-[10px] text-[#27C98F] bg-[#14171D] px-2 py-1 rounded border border-white/[0.04]">
                SHA256: 9e88b...d21
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
