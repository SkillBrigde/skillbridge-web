import {
  Avatar,
  Badge,
  Button,
  Card,
  Tabs,
} from "@/components/ui";
import { NoticeBanner } from "@/components/ui/notice-banner";
import {
  ShieldCheck,
  ExternalLink,
  FileImage,
  ZoomIn,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const CANDIDATE = {
  kycId: "KYC-8812",
  name: "Nguyễn Văn An",
  email: "an.nguyen@vng.com.vn",
  phone: "0987 654 321",
  company: "VNG — Tech Lead",
  linkedin: "https://linkedin.com/in/an-nguyen-vng",
  bank: {
    name: "MB Bank",
    account: "0987654321",
    holder: "NGUYEN VAN AN",
  },
};

const RISK_ASSESSMENT = {
  faceMatch: "98%",
  nameMatch: "100%",
  creditHistory: "Không có tiền sử nợ xấu",
};

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function AdminKYCPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="h-5 w-5 text-[#5E6AD2]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Thẩm Định Hồ Sơ Mentor #{CANDIDATE.kycId}
        </h1>
      </div>
      <p className="text-sm text-[#9BA1B0] mb-8">
        Ứng viên: {CANDIDATE.name}
      </p>

      {/* ── Two-Pane Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        {/* Left Pane: Candidate Profile (2/5) */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-3 mb-5">
            <Avatar alt={CANDIDATE.name} size="lg" />
            <div>
              <h2 className="text-base font-semibold text-[#F0F2F5]">
                {CANDIDATE.name}
              </h2>
              <p className="text-xs text-[#9BA1B0]">{CANDIDATE.company}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#9BA1B0]">Email</span>
              <span className="text-[#E3E2E5]">{CANDIDATE.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#9BA1B0]">Phone</span>
              <span className="text-[#E3E2E5] font-mono">
                {CANDIDATE.phone}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[#9BA1B0]">LinkedIn</span>
              <a
                href={CANDIDATE.linkedin}
                className="text-[#5E6AD2] flex items-center gap-1 text-xs"
              >
                Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="pt-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-2">
                Tài khoản ngân hàng
              </p>
              <p className="text-[#E3E2E5]">{CANDIDATE.bank.name}</p>
              <p className="font-mono text-[#E3E2E5]">
                {CANDIDATE.bank.account}
              </p>
              <p className="text-xs text-[#9BA1B0]">
                {CANDIDATE.bank.holder}
              </p>
            </div>
          </div>
        </Card>

        {/* Right Pane: KYC Documents (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* National ID */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4 flex items-center gap-2">
              <FileImage className="h-4 w-4 text-[#5E6AD2]" />
              Căn Cước Công Dân (MinIO Private Bucket)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] h-40 flex items-center justify-center relative group cursor-pointer">
                <span className="text-xs text-[#5D6474]">CCCD Mặt Trước</span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] h-40 flex items-center justify-center relative group cursor-pointer">
                <span className="text-xs text-[#5D6474]">CCCD Mặt Sau</span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Certificates */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4">
              Bằng cấp &amp; Chứng chỉ
            </h3>
            <div className="flex gap-3">
              <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] h-32 w-40 flex items-center justify-center relative group cursor-pointer">
                <div className="text-center">
                  <FileImage className="h-5 w-5 text-[#5D6474] mx-auto mb-1" />
                  <span className="text-[10px] text-[#5D6474]">
                    AWS Solutions Architect
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-[#0B0C0E] border border-white/[0.08] h-32 w-40 flex items-center justify-center">
                <div className="text-center">
                  <FileImage className="h-5 w-5 text-[#5D6474] mx-auto mb-1" />
                  <span className="text-[10px] text-[#5D6474]">
                    ĐH Bách Khoa HN
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Risk Assessment */}
          <NoticeBanner variant="success">
            <div className="space-y-1">
              <p className="font-medium">Risk Assessment — Passed</p>
              <p>
                Khớp khuôn mặt: {RISK_ASSESSMENT.faceMatch} • Trùng khớp họ tên
                ngân hàng: {RISK_ASSESSMENT.nameMatch} •{" "}
                {RISK_ASSESSMENT.creditHistory}
              </p>
            </div>
          </NoticeBanner>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-[#14171D] border border-white/[0.08]">
        <Button
          variant="outline"
          className="border-[#27C98F]/30 text-[#27C98F] hover:bg-[#27C98F]/5 flex-1 sm:flex-none"
        >
          <CheckCircle className="h-4 w-4" />
          Duyệt Hồ Sơ &amp; Cấp Tích Xanh (Verified Pro)
        </Button>
        <Button
          variant="outline"
          className="border-[#F5A623]/30 text-[#F5A623] hover:bg-[#F5A623]/5 flex-1 sm:flex-none"
        >
          <AlertTriangle className="h-4 w-4" />
          Yêu Cầu Bổ Sung Giấy Tờ
        </Button>
        <Button variant="destructive" className="flex-1 sm:flex-none">
          <XCircle className="h-4 w-4" />
          Từ Chối Hồ Sơ
        </Button>
      </div>
    </div>
  );
}
