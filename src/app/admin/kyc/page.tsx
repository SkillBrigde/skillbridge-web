"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Building,
  ExternalLink,
  ZoomIn,
  CreditCard,
  Lock,
  Sparkles,
  Award,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Input, Textarea } from "@/components/ui";

export default function AdminKycAuditPage() {
  const [activeIdTab, setActiveIdTab] = useState<"front" | "back">("front");
  const [auditStatus, setAuditStatus] = useState<"pending" | "approved" | "rejected" | "requestMore">("pending");
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState("");

  const handleApprove = () => {
    setAuditStatus("approved");
  };

  const handleReject = () => {
    setAuditStatus("rejected");
    setRejectReasonModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <Link href="/admin/escrow" className="hover:text-[#F0F2F5] transition-colors">
              Admin Center
            </Link>
            <span>/</span>
            <span className="text-[#9BA1B0]">Mentor KYC Verification Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Thẩm Định Hồ Sơ Mentor #KYC-8812
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Ứng viên: <strong className="text-[#F0F2F5]">Nguyễn Văn An</strong> • Đăng ký ngày 18/09/2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          {auditStatus === "approved" ? (
            <Badge variant="escrow" className="text-xs py-1.5 px-3">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Đã Cấp Tích Xanh Verified Pro
            </Badge>
          ) : auditStatus === "rejected" ? (
            <Badge variant="dispute" className="text-xs py-1.5 px-3">
              <XCircle className="h-4 w-4 mr-1.5" />
              Hồ Sơ Đã Bị Từ Chối
            </Badge>
          ) : (
            <Badge variant="pending" dot pulse className="text-xs py-1.5 px-3">
              Chờ Thẩm Định (Pending Review)
            </Badge>
          )}
        </div>
      </div>

      {/* Main 2-Pane Layout (Profile Left, Docs Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Pane (5 Cols): Candidate Profile & Bank Account */}
        <div className="lg:col-span-5 space-y-6">
          {/* Candidate Card */}
          <Card className="p-6 bg-[#14171D] border-white/[0.08] space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.06]">
              <Avatar size="xl" alt="Nguyễn Văn An" className="ring-2 ring-[#5E6AD2]/30" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#F0F2F5]">Nguyễn Văn An</h2>
                  <Badge variant="brand" className="text-[10px]">
                    Applicant
                  </Badge>
                </div>
                <p className="text-xs text-[#9BA1B0] mt-0.5">Tech Lead @ VNG Corporation</p>
                <div className="text-[11px] font-mono text-[#5D6474] mt-1">
                  Kinh nghiệm: 9+ YOE
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-[#5D6474]">Email công việc:</span>
                <span className="font-mono text-[#F0F2F5]">an.nguyen@vng.com.vn</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-[#5D6474]">Số điện thoại:</span>
                <span className="font-mono text-[#F0F2F5]">+84 987 654 321</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-[#5D6474]">Số CCCD định danh:</span>
                <span className="font-mono text-[#27C98F]">079093012845</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-[#5D6474]">LinkedIn Profile:</span>
                <a
                  href="https://linkedin.com/in/an-nguyen-techlead"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5E6AD2] hover:text-[#BDC2FF] flex items-center gap-1 font-mono"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>an-nguyen-techlead</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {/* Bank KYC Account */}
            <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F0F2F5]">
                <Building className="h-4 w-4 text-[#27C98F]" />
                <span>Tài Khoản Ngân Hàng Nhận Tiền (Payout)</span>
              </div>
              <div className="text-xs space-y-1 font-mono">
                <div className="text-[#9BA1B0]">Ngân hàng: MB Bank (Napas 24/7)</div>
                <div className="text-[#9BA1B0]">Số tài khoản: 0987654321</div>
                <div className="text-[#27C98F] font-bold">
                  Chủ TK: NGUYEN VAN AN (Khớp 100% tên CCCD)
                </div>
              </div>
            </div>
          </Card>

          {/* AI & Security Risk Assessment Box */}
          <Card className="p-6 bg-[#14171D] border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#5E6AD2]" />
              <h3 className="text-xs font-bold text-[#F0F2F5] uppercase tracking-wider font-mono">
                Báo Cáo Đánh Giá Rủi Ro Tự Động (AI Risk Engine)
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0E10] border border-white/[0.04]">
                <span className="text-[#9BA1B0]">Khớp khuôn mặt CCCD vs Video:</span>
                <span className="text-[#27C98F] font-mono font-bold">98.4% (Cao)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0E10] border border-white/[0.04]">
                <span className="text-[#9BA1B0]">Trùng khớp họ tên ngân hàng:</span>
                <span className="text-[#27C98F] font-mono font-bold">100% (Hoàn hảo)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0E10] border border-white/[0.04]">
                <span className="text-[#9BA1B0]">Kiểm tra nợ xấu & Tranh chấp cũ:</span>
                <span className="text-[#27C98F] font-mono font-bold">Sạch (0 vi phạm)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Pane (7 Cols): KYC Documents Viewer (MinIO Private Bucket) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-[#14171D] border-white/[0.08] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#5E6AD2]" />
                <h3 className="text-sm font-semibold text-[#F0F2F5]">
                  Tài Liệu Định Danh Đính Kèm (MinIO Encrypted S3)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#27C98F] bg-[#27C98F]/10 px-2 py-0.5 rounded border border-[#27C98F]/20">
                AES-256 GCM
              </span>
            </div>

            {/* National ID Preview Tabs */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setActiveIdTab("front")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeIdTab === "front"
                      ? "bg-[#5E6AD2] text-white"
                      : "bg-[#0D0E10] text-[#9BA1B0] hover:text-[#F0F2F5]"
                  }`}
                >
                  CCCD Mặt Trước
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdTab("back")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeIdTab === "back"
                      ? "bg-[#5E6AD2] text-white"
                      : "bg-[#0D0E10] text-[#9BA1B0] hover:text-[#F0F2F5]"
                  }`}
                >
                  CCCD Mặt Sau (Chíp & Vân Tay)
                </button>
              </div>

              {/* ID Card Simulator Box */}
              <div className="relative aspect-[16/10] rounded-xl bg-[#0D0E10] border border-white/[0.08] overflow-hidden flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-xs text-[#5D6474]">
                  <span className="font-mono">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
                  <ZoomIn className="h-4 w-4 text-[#9BA1B0] hover:text-white cursor-pointer" />
                </div>

                {activeIdTab === "front" ? (
                  <div className="flex items-center gap-6 my-auto">
                    <div className="w-24 h-32 rounded-lg bg-[#1C2028] border border-white/[0.1] flex items-center justify-center text-xs text-[#5D6474] font-mono">
                      Ảnh Thẻ
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="text-[#5D6474] text-[10px]">HỌ VÀ TÊN / FULL NAME:</div>
                      <div className="text-[#F0F2F5] font-bold text-sm">NGUYỄN VĂN AN</div>
                      <div className="text-[#5D6474] text-[10px] mt-2">SỐ / NO:</div>
                      <div className="text-[#27C98F] font-bold text-sm tracking-widest">
                        079 093 012845
                      </div>
                      <div className="text-[#5D6474] text-[10px] mt-2">NGÀY SINH / DOB:</div>
                      <div className="text-[#F0F2F5]">14/08/1993</div>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto space-y-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[#14171D] border border-white/[0.04]">
                      <span className="text-[#5D6474] text-[10px] block">ĐẶC ĐIỂM NHẬN DẠNG:</span>
                      <span className="text-[#F0F2F5]">Nốt ruồi cách 1cm dưới sau đuôi mắt phải</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#14171D] border border-white/[0.04] text-[10px] text-[#27C98F]">
                      &lt;&lt;IDVNM0790930128459308149M3108145&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
                      NGUYEN&lt;&lt;VAN&lt;AN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-[#5D6474] font-mono flex items-center justify-between">
                  <span>SHA-256: 4a91b...88c2</span>
                  <span>MinIO Bucket: s3://kyc-encrypted/cccd-8812</span>
                </div>
              </div>
            </div>

            {/* Degrees & Certifications */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-[#F0F2F5]">
                Bằng Cấp & Chứng Chỉ Chuyên Môn (2 Tệp)
              </h4>

              <div className="p-3 rounded-lg bg-[#0D0E10] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#F5A623]" />
                  <div>
                    <div className="text-xs font-medium text-[#F0F2F5]">
                      AWS Certified Solutions Architect – Professional
                    </div>
                    <div className="text-[10px] text-[#5D6474] font-mono">
                      Validation ID: AWS-981240182 • Valid until 2028
                    </div>
                  </div>
                </div>
                <Badge variant="escrow" className="text-[10px]">
                  Verified
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-[#0D0E10] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#5E6AD2]" />
                  <div>
                    <div className="text-xs font-medium text-[#F0F2F5]">
                      Bằng Kỹ Sư Công Nghệ Thông Tin — ĐH Bách Khoa TP.HCM
                    </div>
                    <div className="text-[10px] text-[#5D6474] font-mono">
                      Loại Giỏi • Khóa 2011-2016
                    </div>
                  </div>
                </div>
                <Badge variant="escrow" className="text-[10px]">
                  Verified
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Admin Action Bar */}
      <Card className="p-6 bg-[#14171D] border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-[#F0F2F5] uppercase tracking-wider font-mono">
            Phê Duyệt & Thẩm Quyền Ban Quản Trị
          </h3>
          <p className="text-xs text-[#9BA1B0] mt-0.5">
            Duyệt hồ sơ sẽ tự động cấp Tích Xanh Verified Pro và kích hoạt quyền mở bán 3 gói dịch vụ.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setRejectReasonModal(true)}
            className="text-xs"
          >
            Từ Chối Hồ Sơ
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAuditStatus("requestMore")}
            className="text-xs text-[#F5A623] hover:text-[#F5A623]"
          >
            Yêu Cầu Bổ Sung Giấy Tờ
          </Button>

          <Button
            onClick={handleApprove}
            className="bg-[#27C98F] hover:bg-[#22B37E] text-white font-semibold text-xs gap-1.5 shadow-lg shadow-[#27C98F]/20"
            size="sm"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Duyệt Hồ Sơ & Cấp Tích Xanh</span>
          </Button>
        </div>
      </Card>

      {/* Rejection Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#14171D] border border-[#FF5C5C]/30 p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#FF5C5C] flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Lý Do Từ Chối Hồ Sơ KYC #8812
            </h3>
            <p className="text-xs text-[#9BA1B0]">
              Lý do này sẽ được gửi qua email cho Mentor kèm hướng dẫn cập nhật lại hồ sơ.
            </p>
            <Textarea
              rows={3}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Ví dụ: Ảnh CCCD mặt trước bị mờ số, vui lòng chụp lại rõ nét..."
              className="text-xs bg-[#0D0E10]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectReasonModal(false)}
                className="text-xs"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                className="text-xs"
              >
                Xác Nhận Từ Chối
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
