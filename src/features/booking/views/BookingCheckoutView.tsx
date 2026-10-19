"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Tabs,
  Input,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { EscrowShield } from "@/components/ui/escrow-shield";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Wallet,
  Loader2,
} from "lucide-react";
import { useAppState, useNow, useSession, actions } from "@/lib/store";
import {
  vnd,
  bookingTimeLabel,
  VNPAY_TEST_CARD,
  VNPAY_TEST_OTP,
} from "@/lib/domain";

export function BookingCheckoutView() {
  const params = useParams<{ bookingId: string }>();
  const router = useRouter();
  const state = useAppState();
  const session = useSession();
  const now = useNow("second");

  const bookingId = params.bookingId;
  const booking = useMemo(
    () => state.bookings.find((b) => b.id === bookingId),
    [state.bookings, bookingId]
  );

  const mentor = useMemo(
    () => (booking ? state.mentors.find((m) => m.id === booking.mentorId) : null),
    [state.mentors, booking]
  );

  const [paymentTab, setPaymentTab] = useState("payos");
  const [vnpayOtp, setVnpayOtp] = useState(VNPAY_TEST_OTP);
  const [processing, setProcessing] = useState(false);
  const [webhookStep, setWebhookStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if lock expired
  const lockRemainingSeconds = useMemo(() => {
    if (!booking || !booking.lockExpiresAt) return 0;
    const diff = Math.floor((booking.lockExpiresAt - now) / 1000);
    return Math.max(0, diff);
  }, [booking, now]);

  useEffect(() => {
    if (booking && booking.status === "Expired") {
      router.push(`/slot-expired?booking=${booking.id}`);
    }
  }, [booking, router]);

  if (!booking || !mentor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy đơn thanh toán"
          description="Đơn thanh toán không tồn tại hoặc đã được xử lý."
          action={{
            label: "Xem lịch của tôi",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const handlePayOSConfirm = () => {
    setProcessing(true);
    setErrorMsg("");
    setWebhookStep(1);

    // 4-step webhook simulation
    setTimeout(() => setWebhookStep(2), 600);
    setTimeout(() => setWebhookStep(3), 1200);
    setTimeout(() => {
      setWebhookStep(4);
      const res = actions.payBooking(booking.id, "PayOS");
      setProcessing(false);
      if (!res.ok) {
        setErrorMsg(res.error || "Thanh toán thất bại.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/bookings"), 1500);
      }
    }, 1800);
  };

  const handleVnpayConfirm = () => {
    setProcessing(true);
    setErrorMsg("");
    if (vnpayOtp !== VNPAY_TEST_OTP) {
      setProcessing(false);
      setErrorMsg(`Mã OTP không đúng. Vui lòng nhập ${VNPAY_TEST_OTP} cho môi trường Sandbox.`);
      return;
    }
    setTimeout(() => {
      const res = actions.payBooking(booking.id, "VNPAY");
      setProcessing(false);
      if (!res.ok) {
        setErrorMsg(res.error || "Giao dịch VNPAY thất bại.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/bookings"), 1500);
      }
    }, 800);
  };

  const handleWalletConfirm = () => {
    setProcessing(true);
    setErrorMsg("");
    const res = actions.payBooking(booking.id, "Wallet");
    setProcessing(false);
    if (!res.ok) {
      setErrorMsg(res.error || "Số dư ví không đủ.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/bookings"), 1500);
    }
  };

  const slotText = booking.startMs && booking.endMs
    ? bookingTimeLabel(booking.startMs, booking.endMs)
    : "Chưa xác định";

  const transferCode = `SB${booking.code.replace(/[^0-9]/g, "")}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Countdown Timer Banner ── */}
      <CountdownTimer
        initialSeconds={lockRemainingSeconds || 599}
        onExpire={() => {
          actions.expireBooking(booking.id);
          router.push(`/slot-expired?booking=${booking.id}`);
        }}
        className="mb-8"
      />

      {errorMsg && (
        <div className="mb-6">
          <NoticeBanner variant="error" message={errorMsg} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <NoticeBanner
            variant="success"
            message="Thanh toán thành công! Tiền học phí đã được giữ an toàn trong Escrow Vault. Đang chuyển về trang lịch học..."
          />
        </div>
      )}

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
              { id: "wallet", label: `Ví SkillBridge (${vnd(session.wallet)})` },
            ]}
            activeId={paymentTab}
            onChange={setPaymentTab}
          />

          {paymentTab === "payos" && (
            <Card className="p-6">
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="w-56 h-56 rounded-2xl bg-white p-3 flex flex-col items-center justify-between border-4 border-[#27C98F]/40 shadow-xl">
                  <div className="text-[10px] font-bold text-gray-800 tracking-wider uppercase">
                    VietQR PRO • MB BANK
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <QrCode className="h-36 w-36 text-gray-900" />
                  </div>
                  <div className="text-[9px] font-mono text-gray-600 bg-gray-100 rounded px-2 py-0.5">
                    Quét để thanh toán tức thì
                  </div>
                </div>
              </div>

              {/* Transfer details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Ngân hàng nhận</span>
                  <span className="text-sm font-medium text-[#F0F2F5]">
                    MB Bank (Ngân hàng Quân Đội)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#F0F2F5]">
                      0987654321
                    </span>
                    <CopyButton text="0987654321" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-xs text-[#9BA1B0]">Nội dung CK</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#5E6AD2] font-semibold">
                      {transferCode}
                    </span>
                    <CopyButton text={transferCode} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[#9BA1B0]">Số tiền</span>
                  <span className="text-lg font-mono font-bold text-[#27C98F]">
                    {vnd(booking.priceVnd)}
                  </span>
                </div>
              </div>

              {/* Webhook indicator */}
              <div className="mt-4 mb-4 rounded-lg bg-[#0D0E10] border border-white/[0.06] p-3">
                <div className="flex items-center gap-2 text-xs text-[#9BA1B0] mb-2">
                  <Badge variant="escrow" dot pulse>
                    WEBHOOK LISTENING
                  </Badge>
                  <span>
                    {webhookStep === 0 && "Đang lắng nghe tín hiệu chuyển khoản từ PayOS..."}
                    {webhookStep === 1 && "Nhận webhook payload..."}
                    {webhookStep === 2 && "Xác thực chữ ký HMAC-SHA256..."}
                    {webhookStep === 3 && "Kiểm tra số tiền và nội dung đơn..."}
                    {webhookStep === 4 && "Đã nhận tiền! Khóa tiền vào Escrow Vault"}
                  </span>
                </div>
                {processing && (
                  <div className="w-full bg-[#1F2022] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#27C98F] h-full transition-all duration-300"
                      style={{ width: `${(webhookStep / 4) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full"
                size="lg"
                disabled={processing || success}
                onClick={handlePayOSConfirm}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang xác thực Webhook...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Giả Lập Mentee Đã Chuyển Tiền Thành Công
                  </>
                )}
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
                  <Input defaultValue={VNPAY_TEST_CARD.number} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#9BA1B0] mb-1.5">
                      Tên chủ thẻ
                    </label>
                    <Input defaultValue={VNPAY_TEST_CARD.holder} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9BA1B0] mb-1.5">
                      Ngày phát hành
                    </label>
                    <Input defaultValue={VNPAY_TEST_CARD.issueDate} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#9BA1B0] mb-1.5">
                    Mã xác thực OTP (Mặc định: {VNPAY_TEST_OTP})
                  </label>
                  <Input
                    value={vnpayOtp}
                    onChange={(e) => setVnpayOtp(e.target.value)}
                  />
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full mt-6"
                size="lg"
                disabled={processing || success}
                onClick={handleVnpayConfirm}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi xác thực sang VNPAY...
                  </>
                ) : (
                  "Thanh Toán Qua VNPAY Sandbox"
                )}
              </Button>
            </Card>
          )}

          {paymentTab === "wallet" && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="h-5 w-5 text-[#27C98F]" />
                <h3 className="text-sm font-semibold text-[#F0F2F5]">
                  Thanh Toán Bằng Số Dư Ví Escrow
                </h3>
              </div>

              <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#9BA1B0]">Số dư khả dụng</span>
                  <span className="text-base font-mono font-bold text-[#F0F2F5]">
                    {vnd(session.wallet)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#9BA1B0]">Cần thanh toán</span>
                  <span className="text-base font-mono font-bold text-[#27C98F]">
                    {vnd(booking.priceVnd)}
                  </span>
                </div>
              </div>

              {session.wallet < booking.priceVnd ? (
                <div>
                  <NoticeBanner
                    variant="warning"
                    message={`Số dư ví của bạn còn thiếu ${vnd(booking.priceVnd - session.wallet)}. Vui lòng chọn PayOS / VNPAY hoặc nạp thêm tiền vào ví.`}
                    className="mb-4"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/wallet")}
                  >
                    Nạp Tiền Vào Ví
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  size="lg"
                  disabled={processing || success}
                  onClick={handleWalletConfirm}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Xác Nhận Trừ Ví &amp; Khóa Tiền Vào Escrow
                </Button>
              )}
            </Card>
          )}
        </div>

        {/* ── Right Column: Order Summary (2/5) ── */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-[#F0F2F5] mb-4">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              <Avatar src={mentor.avatarUrl} alt={booking.mentorName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F0F2F5] truncate">
                  {booking.mentorName}
                </p>
                <p className="text-xs text-[#9BA1B0] truncate">
                  {booking.serviceName}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Khung giờ</span>
                <span className="text-[#E3E2E5] font-mono text-right">{slotText}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Thời lượng</span>
                <span className="text-[#E3E2E5]">{booking.durationLabel}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Học phí mentor</span>
                <span className="text-[#E3E2E5] font-mono">
                  {vnd(booking.priceVnd)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9BA1B0]">Phí nền tảng Mentee</span>
                <span className="text-[#27C98F] font-mono">0 ₫ (Miễn phí)</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#F0F2F5]">
                Tổng cộng
              </span>
              <span className="text-lg font-mono font-bold text-[#27C98F]">
                {vnd(booking.priceVnd)}
              </span>
            </div>
          </Card>

          {/* Escrow Shield */}
          <EscrowShield amount={vnd(booking.priceVnd)} />
        </div>
      </div>
    </div>
  );
}

export { BookingCheckoutView as default };
