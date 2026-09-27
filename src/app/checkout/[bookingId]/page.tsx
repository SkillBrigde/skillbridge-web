"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Tabs,
  Input,
} from "@/components/ui";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { EscrowShield } from "@/components/ui/escrow-shield";
import { CopyButton } from "@/components/ui/copy-button";
import { ShieldCheck, CreditCard, QrCode } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const ORDER = {
  mentor: "Nguyễn Văn An",
  service: "Mock Interview System Design & .NET (60 phút)",
  slot: "19:30 - 20:30 (Thứ 6, 18/09)",
  subtotal: "450.000 ₫",
  platformFee: "0 ₫",
  total: "450.000 ₫",
};

const PAYOS_INFO = {
  bank: "MB Bank",
  accountNumber: "0987654321",
  transferContent: "SB20268819",
  amount: "450.000 ₫",
};

const VNPAY_TEST = {
  cardNumber: "9704198526191432198",
  cardName: "NGUYEN VAN A",
  expDate: "07/15",
  otp: "123456",
};

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const [paymentTab, setPaymentTab] = useState("payos");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Countdown Timer Banner ── */}
      <CountdownTimer initialSeconds={599} className="mb-8" />

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left Column: Payment Method (3/5) ── */}
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Chọn Phương Thức Thanh Toán
          </h1>

          <Tabs
            items={[
              { id: "payos", label: "PayOS VietQR Pro" },
              { id: "vnpay", label: "VNPAY Sandbox" },
            ]}
            activeId={paymentTab}
            onChange={setPaymentTab}
          />

          {paymentTab === "payos" && (
            <Card className="p-6">
              {/* QR Code placeholder */}
              <div className="flex justify-center mb-6">
                <div className="w-52 h-52 rounded-xl bg-white flex items-center justify-center border-4 border-white">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 text-gray-800 mx-auto mb-2" />
                    <span className="text-[10px] font-mono text-gray-500">
                      MB Bank VietQR
                    </span>
                  </div>
                </div>
              </div>

              {/* Transfer details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Ngân hàng</span>
                  <span className="text-sm font-medium text-[#F0F2F5]">
                    {PAYOS_INFO.bank}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#F0F2F5]">
                      {PAYOS_INFO.accountNumber}
                    </span>
                    <CopyButton text={PAYOS_INFO.accountNumber} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Nội dung CK</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#5E6AD2] font-semibold">
                      {PAYOS_INFO.transferContent}
                    </span>
                    <CopyButton text={PAYOS_INFO.transferContent} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[#9BA1B0]">Số tiền</span>
                  <span className="text-lg font-mono font-bold text-[#27C98F]">
                    {PAYOS_INFO.amount}
                  </span>
                </div>
              </div>

              {/* Webhook indicator */}
              <div className="flex items-center gap-2 mt-4 mb-4 text-xs text-[#9BA1B0]">
                <Badge variant="escrow" dot pulse>
                  WEBHOOK LISTENING
                </Badge>
                <span>Đang chờ xác nhận từ cổng thanh toán...</span>
              </div>

              <Button
                variant="primary"
                className="w-full"
                size="lg"
              >
                <ShieldCheck className="h-4 w-4" />
                Giả Lập Mentee Đã Chuyển Tiền Thành Công
              </Button>
            </Card>
          )}

          {paymentTab === "vnpay" && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-[#5E6AD2]" />
                <h3 className="text-sm font-semibold text-[#F0F2F5]">
                  Thẻ Test NCB (VNPAY Sandbox)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#9BA1B0] mb-1.5">
                    Số thẻ
                  </label>
                  <Input defaultValue={VNPAY_TEST.cardNumber} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9BA1B0] mb-1.5">
                      Tên chủ thẻ
                    </label>
                    <Input defaultValue={VNPAY_TEST.cardName} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9BA1B0] mb-1.5">
                      Ngày hết hạn
                    </label>
                    <Input defaultValue={VNPAY_TEST.expDate} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#9BA1B0] mb-1.5">
                    OTP
                  </label>
                  <Input defaultValue={VNPAY_TEST.otp} readOnly />
                </div>
              </div>

              <Button variant="primary" className="w-full mt-6" size="lg">
                Thanh Toán Qua VNPAY Sandbox
              </Button>
            </Card>
          )}
        </div>

        {/* ── Right Column: Order Summary (2/5) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Summary */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              <Avatar alt={ORDER.mentor} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F0F2F5] truncate">
                  {ORDER.mentor}
                </p>
                <p className="text-xs text-[#9BA1B0] truncate">
                  {ORDER.service}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Slot</span>
                <span className="text-[#E3E2E5] font-mono">{ORDER.slot}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Phí dịch vụ</span>
                <span className="text-[#E3E2E5] font-mono">
                  {ORDER.subtotal}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Phí sàn</span>
                <span className="text-[#E3E2E5] font-mono">
                  {ORDER.platformFee}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#F0F2F5]">
                Tổng cộng
              </span>
              <span className="text-lg font-mono font-bold text-[#27C98F]">
                {ORDER.total}
              </span>
            </div>
          </Card>

          {/* Escrow Shield */}
          <EscrowShield amount={ORDER.total} />
        </div>
      </div>
    </div>
  );
}
