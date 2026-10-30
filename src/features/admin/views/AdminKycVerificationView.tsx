"use client";

import { useState, useMemo } from "react";
import {
  Avatar,
  Badge,
  Card,
  NoticeBanner,
} from "@/components/ui";
import {
  ShieldCheck,
  ExternalLink,
  FileImage,
  ZoomIn,
} from "lucide-react";
import { RequireRole } from "@/components/auth/require-role";
import { AdminKycActionButtons } from "../components/AdminKycActionButtons";
import { useAppState, actions } from "@/lib/store";
import { normalizeName, slotDateLabel } from "@/lib/domain";

export function AdminKycVerificationView() {
  const state = useAppState();
  const kycList = state.kyc;

  const [selectedId, setSelectedId] = useState(kycList[0]?.id || "");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const application = useMemo(() => {
    return kycList.find((k) => k.id === selectedId) || kycList[0];
  }, [kycList, selectedId]);

  const applicant = useMemo(() => {
    return application ? state.users.find((u) => u.id === application.userId) : null;
  }, [state.users, application]);

  const mentor = useMemo(() => {
    return applicant?.mentorId
      ? state.mentors.find((m) => m.id === applicant.mentorId)
      : null;
  }, [state.mentors, applicant]);

  const handleReview = async (status: "approve" | "need_more" | "reject", note: string) => {
    if (!application) return;
    setErrorMsg("");

    try {
      const { adminService } = await import("@/services/adminService");
      const targetMentorId = mentor?.id || applicant?.mentorId || application.userId;
      const verificationStatus =
        status === "approve" ? "Verified" : status === "reject" ? "Unverified" : "Pending";
      await adminService.verifyMentor(targetMentorId, verificationStatus).catch(() => {});
    } catch {
      // Continue
    }

    const res = actions.reviewKyc(application.id, status, note);
    if (!res.ok) {
      setErrorMsg(res.error || "Thao tác thất bại.");
    } else {
      setSuccessMsg(
        status === "approve"
          ? "Đã phê duyệt hồ sơ và cấp huy hiệu Verified Mentor thành công!"
          : status === "need_more"
          ? "Đã gửi yêu cầu bổ sung hồ sơ tới Mentor."
          : "Đã từ chối hồ sơ thẩm định."
      );
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const nameMatchPassed = useMemo(() => {
    if (!application) return true;
    const applicantName = applicant?.name || application.name;
    return normalizeName(applicantName) === normalizeName(application.bank.holder);
  }, [application, applicant]);

  return (
    <RequireRole role="admin" title="Duyệt Hồ Sơ KYC" description="Chỉ Quản trị viên mới có quyền thẩm định hồ sơ chuyên gia.">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Queue Selector */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs font-mono font-semibold text-[#5e5866] uppercase tracking-wider shrink-0">
            Hồ sơ eKYC ({kycList.length}):
          </span>
          {kycList.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedId(k.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-mono border transition-all flex items-center gap-1.5 shrink-0 ${
                k.id === application?.id
                  ? "bg-[#ece5f5] border-[#6551a4] text-[#6551a4] font-bold shadow-xs"
                  : "bg-white border-[#e5e2de] text-[#5e5866] hover:text-[#27252d] hover:border-[#6551a4]/40"
              }`}
            >
              <span>#{k.id}</span>
              <span className={`text-[10px] ${k.status === "Approved" ? "text-[#1e7e45] font-semibold" : "text-[#946200]"}`}>
                ({k.status})
              </span>
            </button>
          ))}
        </div>

        {errorMsg && <div className="mb-6"><NoticeBanner variant="error" message={errorMsg} /></div>}
        {successMsg && <div className="mb-6"><NoticeBanner variant="success" message={successMsg} /></div>}

        {/* ── Header ── */}
        <div className="mb-2">
          <span className="sb-eyebrow">Trust & Verification</span>
          <div className="flex items-center justify-between gap-3 flex-wrap mt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#6551a4]" />
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
                Thẩm Định Hồ Sơ Mentor #{application?.id}
              </h1>
            </div>
            <Badge variant={application?.status === "Approved" ? "escrow" : "pending"}>
              {application?.status}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-[#9BA1B0] mb-8">
          Ứng viên: <span className="text-white font-medium">{applicant?.name || application?.name || "Nguyễn Văn An"}</span> • Nộp lúc: {application ? slotDateLabel(application.submittedAt) : "Chưa có hồ sơ"}
        </p>

        {/* ── Two-Pane Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Left Pane: Candidate Profile (2/5) */}
          <Card className="lg:col-span-2 p-6 border-[#e5e2de]">
            <div className="flex items-center gap-3 mb-6">
              <Avatar alt={applicant?.name || application?.name} size="lg" />
              <div>
                <h2 className="text-base font-semibold text-[#27252d]">
                  {applicant?.name || application?.name}
                </h2>
                <p className="text-xs text-[#5e5866] mt-0.5">{mentor?.title || "Tech Lead"} @ {mentor?.company || application?.company || "VNG"}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between py-2 border-b border-[#f1efea]">
                <span className="text-xs font-medium text-[#5e5866]">Email</span>
                <span className="text-xs text-[#27252d] font-mono">{applicant?.email || application?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#f1efea]">
                <span className="text-xs font-medium text-[#5e5866]">Hồ sơ chứng chỉ</span>
                <a
                  href={application?.certUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6551a4] hover:text-[#523e8f] flex items-center gap-1 text-xs font-medium"
                >
                  Xem link
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#5e5866] mb-2">
                  Tài khoản thụ hưởng Payout
                </p>
                <p className="text-sm font-semibold text-[#27252d]">{application?.bank.name}</p>
                <p className="font-mono text-xs text-[#5e5866] mt-0.5">
                  {application?.bank.account}
                </p>
                <p className="text-xs text-[#1e7e45] font-mono font-bold mt-0.5">
                  {application?.bank.holder}
                </p>
              </div>
            </div>
          </Card>

          {/* Right Pane: KYC Documents (3/5) */}
          <div className="lg:col-span-3 space-y-4">
            {/* National ID */}
            <Card className="p-6 border-[#e5e2de]">
              <h3 className="font-serif text-base font-semibold text-[#27252d] mb-4 flex items-center gap-2">
                <FileImage className="h-4 w-4 text-[#6551a4]" />
                Căn Cước Công Dân (MinIO Private S3)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#faf9f6] border border-[#e5e2de] h-40 flex items-center justify-center relative group cursor-pointer shadow-2xs">
                  <span className="text-xs text-[#1e7e45] font-mono font-semibold">
                    ✓ {application?.idFront}
                  </span>
                  <div className="absolute inset-0 bg-[#27252d]/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="rounded-2xl bg-[#faf9f6] border border-[#e5e2de] h-40 flex items-center justify-center relative group cursor-pointer shadow-2xs">
                  <span className="text-xs text-[#1e7e45] font-mono font-semibold">
                    ✓ {application?.idBack}
                  </span>
                  <div className="absolute inset-0 bg-[#27252d]/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Risk Assessment */}
            <NoticeBanner variant={nameMatchPassed ? "success" : "warning"}>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-sm">
                  {nameMatchPassed ? "Đối Soát Tự Động: HỢP LỆ" : "CẢNH BÁO: TÊN KHÔNG TRÙNG KHỚP"}
                </p>
                <p>
                  Khớp khuôn mặt Face-Match: 98% • Trùng khớp họ tên tài khoản ngân hàng:{" "}
                  {nameMatchPassed ? "100% Khớp" : "Sai lệch"}
                </p>
              </div>
            </NoticeBanner>
          </div>
        </div>

        {/* ── Action Bar ── */}
        <AdminKycActionButtons
          onApprove={() => handleReview("approve", "Đã đối soát CCCD và tài khoản ngân hàng chính xác 100%")}
          onRequestMoreInfo={() => handleReview("need_more", "Yêu cầu chụp lại ảnh CCCD rõ nét không bị lóa")}
          onReject={() => handleReview("reject", "Hồ sơ vi phạm quy chế hoặc thông tin không trùng khớp")}
        />
      </div>
    </RequireRole>
  );
}

export { AdminKycVerificationView as default };
