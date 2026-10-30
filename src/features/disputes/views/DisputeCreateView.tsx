"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Button,
  Textarea,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { Select } from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { Scale, CheckCircle2 } from "lucide-react";
import { useAppState, actions } from "@/lib/store";
import { vnd } from "@/lib/domain";

const DISPUTE_REASONS = [
  { value: "mentor_no_show", label: "Mentor vắng mặt hoặc không tham gia buổi học" },
  { value: "short_session", label: "Kết thúc sớm > 20 phút so với thời lượng cam kết" },
  { value: "wrong_scope", label: "Nội dung không đúng cam kết của gói dịch vụ" },
  { value: "technical_issues", label: "Sự cố kỹ thuật từ phía Mentor (mất kết nối lâu)" },
  { value: "unprofessional", label: "Thái độ không chuyên nghiệp / vi phạm chuẩn mực" },
  { value: "other", label: "Lý do khác" },
];

const RESOLUTION_OPTIONS = [
  {
    value: "full_refund",
    label: "Hoàn lại 100% tiền về ví",
    description: "Tiền Escrow sẽ được hoàn nguyên vào ví SkillBridge của bạn.",
  },
  {
    value: "reschedule",
    label: "Yêu cầu Mentor xếp lịch học bù miễn phí",
    description: "Mentor sẽ phải sắp xếp 1 buổi bù tương đương trong vòng 7 ngày.",
  },
];

function NewDisputeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = useAppState();

  const bookingParam = searchParams.get("booking") || "";
  const booking = useMemo(() => {
    return (
      state.bookings.find(
        (b) =>
          b.id === bookingParam ||
          b.code === bookingParam ||
          b.code === `#${bookingParam}` ||
          b.code.toLowerCase().includes(bookingParam.toLowerCase())
      ) || state.bookings.find((b) => b.status === "AwaitingAcceptance" || b.status === "Confirmed")
    );
  }, [state.bookings, bookingParam]);

  const [reason, setReason] = useState("short_session");
  const [resolution, setResolution] = useState("full_refund");
  const [description, setDescription] = useState(
    "Mentor vào trễ 15 phút và kết thúc buổi học sau 30 phút do việc riêng, chưa hoàn thành nội dung kiến trúc như đã cam kết."
  );
  const [proofFiles, setProofFiles] = useState<string[]>([
    "webrtc_call_log.png",
  ]);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy đơn khiếu nại"
          description="Vui lòng chọn buổi học bạn muốn khiếu nại từ danh sách lịch học."
          action={{
            label: "Xem lịch học của tôi",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const handleSubmit = () => {
    setErrorMsg("");
    if (!description.trim() || description.length < 20) {
      setErrorMsg("Vui lòng mô tả chi tiết sự việc (tối thiểu 20 ký tự).");
      return;
    }

    const res = actions.openDispute({
      bookingId: booking.id,
      reasonKey: reason,
      statement: description.trim(),
      wish: resolution === "full_refund" ? "full_refund" : "reschedule",
      files: proofFiles,
    });

    if (!res.ok) {
      setErrorMsg(res.error || "Không thể mở khiếu nại.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/disputes/${res.disputeId}`);
      }, 1200);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="mb-2">
        <span className="sb-eyebrow">Escrow Protection & Dispute</span>
        <div className="flex items-center gap-2 mt-1">
          <Scale className="h-6 w-6 text-[#a64533]" />
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
            Khởi Tạo Khiếu Nại Buổi Học #{booking.code}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Avatar alt={booking.mentorName} size="sm" />
        <span className="text-sm text-[#5e5866]">
          Mentor: <span className="text-[#27252d] font-semibold">{booking.mentorName}</span> • Gói: {booking.serviceName}
        </span>
      </div>

      {/* ── Warning Notice ── */}
      <NoticeBanner variant="warning" className="mb-8">
        Khiếu nại sẽ đóng băng giải ngân Escrow{" "}
        <span className="font-mono font-semibold">{vnd(booking.priceVnd)}</span> và kích hoạt
        quy trình phán quyết SLA 48h của Ban Quản Trị.
      </NoticeBanner>

      {errorMsg && <div className="mb-6"><NoticeBanner variant="error" message={errorMsg} /></div>}
      {success && (
        <div className="mb-6">
          <NoticeBanner
            variant="success"
            message="Khiếu nại đã được ghi nhận vào hệ thống SLA 48h! Đang chuyển đến chi tiết hồ sơ..."
          />
        </div>
      )}

      {/* ── Form ── */}
      <div className="space-y-8 bg-white border border-[#e5e2de] rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* 1. Reason dropdown */}
        <Select
          label="Lý do chính"
          options={DISPUTE_REASONS}
          value={reason}
          onChange={setReason}
        />

        {/* 2. Description */}
        <div>
          <label className="block text-xs font-medium text-[#5e5866] mb-2">
            Mô tả chi tiết sự việc <span className="text-[#a64533]">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Mô tả cụ thể thời gian, diễn biến sự cố..."
          />
        </div>

        {/* 3. File upload */}
        <div>
          <label className="block text-xs font-medium text-[#5e5866] mb-2">
            Đính kèm ảnh chụp màn hình bằng chứng / biên bản tin nhắn chat
          </label>
          <FileUpload
            accept="image/*,.pdf"
            maxSizeMB={10}
            label="Kéo thả hoặc click để tải lên bằng chứng"
            onFilesSelected={(files) => {
              if (files.length > 0) {
                setProofFiles((prev) => [...prev, files[0].name]);
              }
            }}
          />
          {proofFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {proofFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8f5ed] border border-[#1e7e45]/20 px-3 py-1 text-xs text-[#1e7e45] font-medium"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {file}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 4. Resolution options */}
        <RadioGroup
          name="resolution"
          label="Lựa chọn mong muốn giải quyết"
          options={RESOLUTION_OPTIONS}
          value={resolution}
          onChange={setResolution}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-4 pt-6 mt-6 border-t border-[#e5e2de]">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Quay lại
        </Button>
        <Button
          variant="destructive"
          size="lg"
          disabled={success}
          onClick={handleSubmit}
        >
          Gửi Khiếu Nại Lên Ban Quản Trị (Mở SLA 48h)
        </Button>
      </div>
    </div>
  );
}

export function DisputeCreateView() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm font-mono text-[#5e5866]">Đang tải...</div>}>
      <NewDisputeForm />
    </Suspense>
  );
}
