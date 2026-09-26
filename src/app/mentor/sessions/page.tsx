"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Currency } from "@/components/ui";

interface UpcomingSession {
  id: string;
  bookingCode: string;
  timeDisplay: string;
  timeTag: string;
  isUrgent?: boolean;
  mentee: {
    name: string;
    avatarUrl?: string;
    role: string;
    badge: string;
  };
  service: {
    title: string;
    duration: string;
    price: number;
  };
  intake: {
    problem: string;
    githubUrl: string;
    expectation: string;
  };
}

const UPCOMING_SESSIONS: UpcomingSession[] = [
  {
    id: "sb-2026-98124",
    bookingCode: "SB-2026-98124",
    timeDisplay: "Hôm nay • 19:30 - 20:30",
    timeTag: "Bắt đầu sau 2 giờ",
    isUrgent: true,
    mentee: {
      name: "Hoàng Thùy Linh",
      role: "Backend Developer @ FPT Software (3 YOE)",
      badge: "Mentee Pro",
    },
    service: {
      title: "Mock Interview System Design & .NET",
      duration: "60 phút",
      price: 450000,
    },
    intake: {
      problem:
        "Chuẩn bị phỏng vấn Senior Backend, muốn luyện thiết kế kiến trúc phân tán thanh toán 10k RPS và chống xung đột giao dịch kép (Double Spending).",
      githubUrl: "https://github.com/linh-hoang/microservices-demo",
      expectation:
        "Nắm chắc rubric chấm điểm của FAANG, biết cách phân tích trade-off giữa Eventual Consistency và Strict Serializability.",
    },
  },
  {
    id: "sb-2026-98135",
    bookingCode: "SB-2026-98135",
    timeDisplay: "Ngày mai, 19/09 • 20:45 - 21:45",
    timeTag: "Sau 26 giờ",
    isUrgent: false,
    mentee: {
      name: "Lê Tuấn Kiệt",
      role: "Mid-level .NET Engineer (2 YOE)",
      badge: "Mentee Active",
    },
    service: {
      title: "Review CV & Tối Ưu Portfolio",
      duration: "45 phút",
      price: 300000,
    },
    intake: {
      problem:
        "Gửi CV ứng tuyển 10 công ty nhưng chưa qua được vòng HR Screening. Cần mentor soi cấu trúc và cách viết Impact metrics theo Google XYZ format.",
      githubUrl: "https://github.com/kiet-letuan/cv-portfolio-2026",
      expectation:
        "Có bản CV chuẩn Senior Markdown và Notion Checklist hành động trong 7 ngày tới.",
    },
  },
  {
    id: "sb-2026-98188",
    bookingCode: "SB-2026-98188",
    timeDisplay: "Thứ 7, 20/09 • 09:00 - 10:00",
    timeTag: "Sau 3 ngày",
    isUrgent: false,
    mentee: {
      name: "Trần Mai Anh",
      role: "Software Architect Aspiring (5 YOE)",
      badge: "Mentee Pro",
    },
    service: {
      title: "Lộ Trình Software Architect (Buổi 1/4)",
      duration: "60 phút (Gói 1 Tháng)",
      price: 2000000,
    },
    intake: {
      problem:
        "Chuyển từ Senior Developer lên Technical Architect, gặp bối rối trong việc lập Architectural Decision Records (ADR) và đàm phán Technical Debt với Product Owner.",
      githubUrl: "https://github.com/maianh-tran/enterprise-adr-template",
      expectation:
        "Xây dựng khung tư duy đánh giá công nghệ và hoàn thiện bài toán Module Monolith vs Microservices.",
    },
  },
];

export default function MentorSessionsPage() {
  const [expandedIntakes, setExpandedIntakes] = useState<Record<string, boolean>>({
    "sb-2026-98124": true, // First one open by default
  });

  const toggleIntake = (id: string) => {
    setExpandedIntakes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <Link href="/mentor/studio" className="hover:text-[#F0F2F5] transition-colors">
              Mentor Studio
            </Link>
            <span>/</span>
            <span className="text-[#9BA1B0]">Upcoming Teaching Schedule</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Lịch Dạy Sắp Tới
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            3 Buổi học đã xác nhận • Toàn bộ tiền giữ an toàn trong Escrow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/mentor/schedule">
            <Button variant="secondary" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Chỉnh Lịch Trống</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 rounded-lg bg-[#27C98F]/10 border border-[#27C98F]/20 px-3 py-1.5 text-xs font-mono text-[#27C98F]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Escrow 100% Protected</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {UPCOMING_SESSIONS.map((session) => {
          const isExpanded = !!expandedIntakes[session.id];

          return (
            <Card
              key={session.id}
              className={`p-0 overflow-hidden bg-[#14171D] border transition-all ${
                session.isUrgent
                  ? "border-[#27C98F]/40 shadow-lg shadow-[#27C98F]/5"
                  : "border-white/[0.08]"
              }`}
            >
              {/* Highlight bar */}
              <div
                className={`h-1 ${
                  session.isUrgent
                    ? "bg-gradient-to-r from-[#27C98F] via-[#5E6AD2] to-[#27C98F]"
                    : "bg-[#292A2C]"
                }`}
              />

              <div className="p-6">
                {/* Header Row: Time + Booking code + Price */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#F0F2F5] bg-[#0D0E10] px-3 py-1.5 rounded-lg border border-white/[0.06] flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#5E6AD2]" />
                      {session.timeDisplay}
                    </span>
                    <Badge
                      variant={session.isUrgent ? "escrow" : "neutral"}
                      dot={session.isUrgent}
                      pulse={session.isUrgent}
                    >
                      {session.timeTag}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#5D6474]">
                      #{session.bookingCode}
                    </span>
                  </div>

                  <Currency
                    amount={session.service.price}
                    highlight="emerald"
                    size="sm"
                  />
                </div>

                {/* Mentee & Service Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 border-y border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg" alt={session.mentee.name} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#F0F2F5]">
                          {session.mentee.name}
                        </span>
                        <Badge variant="brand" className="text-[10px]">
                          {session.mentee.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#9BA1B0] mt-0.5">
                        {session.mentee.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-medium text-[#F0F2F5] block">
                      {session.service.title}
                    </span>
                    <span className="text-[11px] text-[#5D6474] font-mono">
                      Thời lượng: {session.service.duration}
                    </span>
                  </div>
                </div>

                {/* Collapsible Intake Accordion */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => toggleIntake(session.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0D0E10] hover:bg-[#1A1D24] border border-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-[#9BA1B0]">
                      <FileText className="h-4 w-4 text-[#5E6AD2]" />
                      <span>Xem trước câu trả lời Khảo sát Intake của Mentee</span>
                      <span className="text-[10px] font-mono text-[#27C98F] bg-[#27C98F]/10 px-2 py-0.5 rounded">
                        3 Câu hỏi
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[#9BA1B0]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#9BA1B0]" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-4 rounded-lg bg-[#0D0E10] border border-white/[0.04] space-y-3.5 text-xs animate-fade-in">
                      <div>
                        <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                          1. Vấn đề hoặc mục tiêu kỹ thuật lớn nhất:
                        </span>
                        <p className="text-[#F0F2F5] leading-relaxed bg-[#14171D] p-3 rounded-md border border-white/[0.04]">
                          {session.intake.problem}
                        </p>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                          2. Link tài liệu / GitHub Repo đính kèm:
                        </span>
                        <a
                          href={session.intake.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-[#5E6AD2] hover:text-[#BDC2FF] font-mono bg-[#14171D] px-3 py-2 rounded-md border border-white/[0.04] transition-colors"
                        >
                          <Code2 className="h-3.5 w-3.5" />
                          <span>{session.intake.githubUrl}</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-[#5D6474] uppercase tracking-wider block mb-1">
                          3. Kỳ vọng kết quả cụ thể:
                        </span>
                        <p className="text-[#F0F2F5] leading-relaxed bg-[#14171D] p-3 rounded-md border border-white/[0.04]">
                          {session.intake.expectation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Dock */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                  <div className="text-[11px] text-[#5D6474]">
                    WebRTC Room ID: <span className="font-mono text-[#9BA1B0]">RM-98124</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="gap-2 text-[#9BA1B0]">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Nhắn Tin Với Mentee</span>
                    </Button>

                    <Link href={`/mentor/sessions/${session.id}`}>
                      <Button
                        size="sm"
                        className={
                          session.isUrgent
                            ? "bg-[#27C98F] hover:bg-[#22B37E] text-white font-semibold shadow-lg shadow-[#27C98F]/20 gap-2"
                            : "gap-2"
                        }
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Vào Phòng Học Trực Tuyến</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
