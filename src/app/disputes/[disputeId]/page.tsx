"use client";

import React from "react";
import { ShieldAlert, Upload, Send, Clock } from "lucide-react";
import { Avatar, Badge, Button, Card, Textarea } from "@/components/ui";

export default function DisputeDefensePage() {
  const [defense, setDefense] = React.useState(
    "Tôi có mặt lúc 19:40 do sự cố kỹ thuật. Đã thông báo mentee dạy bù thêm nhưng mentee không đồng ý. Đã gửi tài liệu rubric qua email sau buổi học."
  );
  const [proposal, setProposal] = React.useState("makeup");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#F0F2F5] tracking-tight">
            Giải Trình Khiếu Nại Cho Buổi Học #SB-2026-98124
          </h1>
          <p className="text-xs text-[#9BA1B0] flex items-center gap-1.5 mt-1">
            <Clock className="h-3 w-3 text-[#F5A623]" />
            SLA 24h phản hồi
          </p>
        </div>
        <Badge variant="dispute" dot pulse>SLA 24H</Badge>
      </div>

      {/* Mentee Claim */}
      <Card className="p-5 mb-4 border-[#FF5C5C]/15">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF5C5C] mb-2">Khiếu nại từ Mentee</p>
        <div className="flex items-start gap-3">
          <Avatar size="sm" alt="Hoàng Thùy Linh" />
          <div>
            <p className="text-xs font-medium text-[#F0F2F5]">Hoàng Thùy Linh <span className="text-[#5D6474] font-mono">(20:35)</span></p>
            <p className="text-xs text-[#E3E2E5] mt-1 leading-relaxed">
              &ldquo;Mentor vào trễ 15 phút và kết thúc buổi học sau 30 phút do việc riêng, chưa sửa bản thiết kế kiến trúc như cam kết gói 60 phút.&rdquo;
            </p>
          </div>
        </div>
      </Card>

      {/* Defense Form */}
      <Card className="p-6 space-y-5 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-[#E3E2E5]">
            Ý kiến giải trình của bạn <span className="text-[#FF5C5C]">*</span>
          </label>
          <Textarea
            value={defense}
            onChange={(e) => setDefense(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[#E3E2E5]">Upload bổ sung bằng chứng</label>
          <div className="rounded-xl border-2 border-dashed border-white/[0.08] bg-[#0F1115] p-6 text-center cursor-pointer hover:border-[#5E6AD2]/30 transition-colors">
            <Upload className="h-5 w-5 text-[#5D6474] mx-auto mb-2" />
            <p className="text-[11px] text-[#9BA1B0]">Nhật ký cuộc gọi, video, email bàn giao</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-[#E3E2E5]">Đề xuất giải quyết</label>
          {[
            { id: "makeup", label: "Đồng ý dạy bù 1 buổi 60 phút miễn phí cho Mentee" },
            { id: "split", label: "Đồng ý chia đôi 50/50 tiền ký quỹ" },
            { id: "reject", label: "Bác bỏ khiếu nại và yêu cầu Admin xem xét lại log máy chủ" },
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer transition-all ${
                proposal === opt.id
                  ? "bg-[#5E6AD2]/[0.08] border-[#5E6AD2]/30 text-[#F0F2F5]"
                  : "bg-[#0F1115] border-white/[0.06] text-[#9BA1B0] hover:bg-[#14171D]"
              }`}
            >
              <input type="radio" name="proposal" value={opt.id} checked={proposal === opt.id} onChange={() => setProposal(opt.id)} className="sr-only" />
              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${proposal === opt.id ? "border-[#5E6AD2]" : "border-white/20"}`}>
                {proposal === opt.id && <div className="h-2 w-2 rounded-full bg-[#5E6AD2]" />}
              </div>
              <span className="text-xs">{opt.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Button variant="primary" size="lg" className="w-full">
        <Send className="h-4 w-4" />
        Gửi Giải Trình Cho Admin Phán Quyết
      </Button>
    </div>
  );
}
