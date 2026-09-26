"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Clock,
  User,
  Calendar,
  Banknote,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Currency, CountdownTimer, CopyButton } from "@/components/ui";

type PaymentTab = "payos" | "vnpay";

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = React.useState<PaymentTab>("payos");
  const [simulated, setSimulated] = React.useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner — Countdown Timer */}
      <CountdownTimer
        initialSeconds={599}
        slotKey="lock:slot:sb-2026-98124"
        className="mb-6"
      />

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Payment Methods (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Tab Switch */}
          <div className="flex items-center gap-1 rounded-xl bg-[#0D0E10] border border-white/[0.06] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("payos")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer select-none ${
                activeTab === "payos"
                  ? "bg-[#1F2022] text-[#F0F2F5] border border-white/[0.08] shadow-sm"
                  : "text-[#9BA1B0] hover:text-[#F0F2F5]"
              }`}
            >
              <QrCode className="h-4 w-4" />
              PayOS VietQR Pro
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("vnpay")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer select-none ${
                activeTab === "vnpay"
                  ? "bg-[#1F2022] text-[#F0F2F5] border border-white/[0.08] shadow-sm"
                  : "text-[#9BA1B0] hover:text-[#F0F2F5]"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              VNPAY Sandbox
            </button>
          </div>

          {/* PayOS VietQR Tab */}
          {activeTab === "payos" && (
            <Card className="p-6">
              <h3 className="text-sm font-bold text-[#F0F2F5] mb-4 flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[#5E6AD2]" />
                Quét Mã QR Để Chuyển Khoản
              </h3>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative rounded-2xl bg-white p-4 shadow-lg mb-4">
                  {/* Simulated QR Code Pattern */}
                  <div className="w-48 h-48 bg-white relative overflow-hidden">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* QR pattern simulation */}
                      <rect width="200" height="200" fill="white" />
                      {/* Position detection patterns */}
                      <rect x="10" y="10" width="50" height="50" fill="#000" rx="4"/>
                      <rect x="15" y="15" width="40" height="40" fill="#fff" rx="2"/>
                      <rect x="22" y="22" width="26" height="26" fill="#000" rx="2"/>
                      <rect x="140" y="10" width="50" height="50" fill="#000" rx="4"/>
                      <rect x="145" y="15" width="40" height="40" fill="#fff" rx="2"/>
                      <rect x="152" y="22" width="26" height="26" fill="#000" rx="2"/>
                      <rect x="10" y="140" width="50" height="50" fill="#000" rx="4"/>
                      <rect x="15" y="145" width="40" height="40" fill="#fff" rx="2"/>
                      <rect x="22" y="152" width="26" height="26" fill="#000" rx="2"/>
                      {/* Data modules */}
                      {Array.from({ length: 20 }).map((_, i) =>
                        Array.from({ length: 20 }).map((_, j) => {
                          const x = 70 + j * 5;
                          const y = 70 + i * 5;
                          if (Math.random() > 0.45) {
                            return <rect key={`${i}-${j}`} x={x} y={y} width="4" height="4" fill="#000" rx="0.5"/>;
                          }
                          return null;
                        })
                      )}
                      {/* Center logo placeholder */}
                      <rect x="80" y="80" width="40" height="40" fill="white" rx="6"/>
                      <rect x="85" y="85" width="30" height="30" fill="#5E6AD2" rx="4"/>
                      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SB</text>
                    </svg>
                  </div>
                  <p className="text-[10px] text-center text-gray-500 font-mono mt-2">
                    MB Bank • VietQR Dynamic
                  </p>
                </div>
              </div>

              {/* Transfer Info */}
              <div className="space-y-3 rounded-xl bg-[#0F1115] border border-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5D6474]">Ngân hàng</span>
                  <span className="text-xs font-medium text-[#F0F2F5]">MB Bank</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#5D6474]">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F0F2F5]">0987654321</span>
                    <CopyButton value="0987654321" label="Copy" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#5D6474]">Nội dung CK</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#5E6AD2] font-bold">SB20268819</span>
                    <CopyButton value="SB20268819" label="Copy" />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-xs text-[#5D6474]">Số tiền</span>
                  <Currency amount={450000} highlight="emerald" size="md" />
                </div>
              </div>

              {/* Webhook indicator + simulate */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-[#9BA1B0]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C98F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27C98F]" />
                  </span>
                  <span className="font-mono">Webhook listener active</span>
                </div>
                <Button
                  variant={simulated ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setSimulated(true)}
                  disabled={simulated}
                >
                  {simulated ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#27C98F]" />
                      <span>Đã Thanh Toán ✓</span>
                    </>
                  ) : (
                    "Giả Lập Mentee Đã Chuyển Tiền Thành Công"
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* VNPAY Sandbox Tab */}
          {activeTab === "vnpay" && (
            <Card className="p-6">
              <h3 className="text-sm font-bold text-[#F0F2F5] mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#5E6AD2]" />
                VNPAY Sandbox — Thẻ NCB Test
              </h3>

              <div className="rounded-xl bg-[#0F1115] border border-white/[0.04] p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#9BA1B0]">Số thẻ</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="9704198526191432198"
                      readOnly
                      className="flex-1 h-10 bg-[#14171D] border border-white/[0.08] rounded-xl px-3.5 text-sm font-mono text-[#F0F2F5] outline-none"
                    />
                    <CopyButton value="9704198526191432198" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#9BA1B0]">Chủ thẻ</label>
                    <input
                      type="text"
                      value="NGUYEN VAN A"
                      readOnly
                      className="w-full h-10 bg-[#14171D] border border-white/[0.08] rounded-xl px-3.5 text-sm font-mono text-[#F0F2F5] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#9BA1B0]">Hạn thẻ</label>
                      <input
                        type="text"
                        value="07/15"
                        readOnly
                        className="w-full h-10 bg-[#14171D] border border-white/[0.08] rounded-xl px-3.5 text-sm font-mono text-[#F0F2F5] outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-[#9BA1B0]">OTP</label>
                      <input
                        type="text"
                        value="123456"
                        readOnly
                        className="w-full h-10 bg-[#14171D] border border-white/[0.08] rounded-xl px-3.5 text-sm font-mono text-[#F0F2F5] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <Button variant="primary" className="w-full mt-2">
                  Thanh Toán Qua VNPAY Sandbox
                </Button>
              </div>

              <p className="text-[10px] text-[#5D6474] mt-3 font-mono text-center">
                Môi trường Sandbox — Không trừ tiền thật
              </p>
            </Card>
          )}
        </div>

        {/* Right Column: Order Summary & Escrow (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Summary */}
          <Card className="p-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D6474] mb-4">
              Chi Tiết Đơn Hàng
            </h3>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              <Avatar size="md" alt="Nguyễn Văn An" />
              <div>
                <p className="text-sm font-semibold text-[#F0F2F5]">
                  Nguyễn Văn An
                </p>
                <p className="text-[11px] text-[#9BA1B0]">
                  Tech Lead @ VNG Corporation
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#9BA1B0]">
                  <Banknote className="h-3.5 w-3.5" />
                  <span>Dịch vụ</span>
                </div>
                <span className="text-[#F0F2F5] font-medium text-right text-[11px]">
                  Mock Interview System Design (60m)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#9BA1B0]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Khung giờ</span>
                </div>
                <span className="text-[#F0F2F5] font-mono text-[11px]">
                  19:30 – 20:30 (18/09)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#9BA1B0]">
                  <User className="h-3.5 w-3.5" />
                  <span>Mentor</span>
                </div>
                <span className="text-[#F0F2F5] text-[11px]">Nguyễn Văn An</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#9BA1B0]">
                <span>Phí dịch vụ</span>
                <Currency amount={450000} size="sm" />
              </div>
              <div className="flex items-center justify-between text-[#9BA1B0]">
                <span>Phí sàn</span>
                <span className="font-mono text-[#27C98F]">0 ₫</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-sm">
                <span className="font-semibold text-[#F0F2F5]">Tổng cộng</span>
                <Currency amount={450000} highlight="emerald" size="lg" />
              </div>
            </div>
          </Card>

          {/* Escrow Shield Card */}
          <Card className="p-5 bg-[#03BD84]/[0.06] border-[#27C98F]/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#27C98F]/15 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-[#27C98F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#27C98F] uppercase font-mono tracking-wider mb-1.5">
                  SkillBridge Escrow Shield
                </h4>
                <p className="text-[11px] text-[#E3E2E5] leading-relaxed">
                  Tiền giữ an toàn tại tài khoản Escrow.
                  Mentor chỉ nhận tiền khi bạn nghiệm thu hài lòng hoặc sau 24h không có khiếu nại.
                </p>
                <div className="flex items-center gap-4 mt-3 text-[10px] font-mono text-[#5D6474]">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#27C98F]" />
                    AES-256 Encryption
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#27C98F]" />
                    Double-Entry Ledger
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
