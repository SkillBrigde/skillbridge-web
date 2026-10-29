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
import { RequireRole } from "@/components/auth/require-role";
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
      <RequireRole role="mentee" title="Thanh Toán & Ký Quỹ Escrow" description="Đăng nhập tài khoản để tiến hành thanh toán và khóa slot an toàn.">
        <div className="sb-container py-16">
          <EmptyState
            title="Không tìm thấy đơn thanh toán"
            description="Đơn thanh toán không tồn tại hoặc đã được xử lý."
            action={{
              label: "Xem lịch của tôi",
              onClick: () => router.push("/bookings"),
            }}
          />
        </div>
      </RequireRole>
    );
  }

  const handlePayOSConfirm = () => {
    setProcessing(true);
    setErrorMsg("");
    setWebhookStep(1);

    // 4-step webhook flow
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
      setErrorMsg(`Mã OTP không đúng. Vui lòng nhập ${VNPAY_TEST_OTP} cho môi trường VNPAY Sandbox.`);
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
    <RequireRole role="mentee" title="Thanh Toán & Ký Quỹ Escrow" description="Đăng nhập tài khoản để tiến hành thanh toán và khóa slot an toàn.">
      <div className="sb-container py-10 sm:py-12">
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
            message="Thanh toán thành công! Tiền học phí đã được giữ an toàn trong Két Escrow. Đang chuyển về trang lịch học..."
          />
        </div>
      )}

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left Column: Payment Method (3/5) ── */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <span className="sb-eyebrow">CHỌN CỔNG THANH TOÁN KÝ QUỸ</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#27252d] tracking-tight mt-1">
              Dual Gateway: PayOS VietQR & VNPAY Sandbox
            </h1>
          </div>

          <Tabs
            items={[
              { id: "payos", label: "PayOS VietQR (NAPAS 24/7)" },
              { id: "vnpay", label: "VNPAY Sandbox (Thẻ Thử Nghiệm)" },
              { id: "wallet", label: `Ví SkillBridge (${vnd(session.wallet)})` },
            ]}
            activeId={paymentTab}
            onChange={setPaymentTab}
          />

          {paymentTab === "payos" && (
            <Card className="p-6">
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="w-60 h-60 rounded-2xl bg-white p-3.5 flex flex-col items-center justify-between border-2 border-[#bde6ca] shadow-md">
                  <div className="text-[11px] font-bold text-[#27252d] tracking-wider uppercase font-mono">
                    VIETQR PRO • MB BANK
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <QrCode className="h-40 w-40 text-[#27252d]" />
                  </div>
                  <div className="text-[10px] font-mono text-[#5e5866] bg-[#f1efea] rounded px-2.5 py-1">
                    Quét mã trên app ngân hàng bất kỳ
                  </div>
                </div>
              </div>

              {/* Transfer details */}
              <div className="space-y-3.5 bg-[#faf9f6] rounded-xl p-4 border border-[#e5e2de]">
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5e2de]">
                  <span className="text-xs text-[#5e5866]">Ngân hàng thụ hưởng</span>
                  <span className="text-sm font-semibold text-[#27252d]">
                    MB Bank (Ngân hàng Quân Đội)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5e2de]">
                  <span className="text-xs text-[#5e5866]">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-semibold text-[#27252d]">
                      0987654321
                    </span>
                    <CopyButton text="0987654321" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#e5e2de]">
                  <span className="text-xs text-[#5e5866]">Nội dung chuyển khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#6551a4] font-bold">
                      {transferCode}
                    </span>
                    <CopyButton text={transferCode} />
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-xs text-[#5e5866]">Số tiền thanh toán</span>
                  <span className="text-lg font-mono font-bold text-[#1e7e45]">
                    {vnd(booking.priceVnd)}
                  </span>
                </div>
              </div>

              {/* Webhook indicator */}
              <div className="mt-5 mb-5 rounded-xl bg-white border border-[#e5e2de] p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-[#5e5866] mb-2.5">
                  <Badge variant="escrow" dot pulse>
                    TÍN HIỆU WEBHOOK
                  </Badge>
                  <span className="font-medium text-[#27252d]">
                    {webhookStep === 0 && "Đang chờ biến động số dư từ cổng PayOS..."}
                    {webhookStep === 1 && "Nhận tín hiệu webhook payload..."}
                    {webhookStep === 2 && "Xác thực chữ ký HMAC-SHA256 & chống replay..."}
                    {webhookStep === 3 && "Khớp mã giao dịch & đối soát số tiền..."}
                    {webhookStep === 4 && "Đã nhận tiền! Khóa ký quỹ thành công vào Escrow Vault"}
                  </span>
                </div>
                {processing && (
                  <div className="w-full bg-[#f1efea] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1e7e45] h-full transition-all duration-300"
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
                    Đang xử lý chữ ký Webhook...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Xác Nhận Đã Nhận Chuyển Khoản PayOS VietQR
                  </>
                )}
              </Button>
            </Card>
          )}

          {paymentTab === "vnpay" && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-[#6551a4]" />
                <h3 className="text-base font-semibold text-[#27252d]">
                  Thẻ Test NCB — VNPAY Sandbox (Học Thuật)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
                    Số thẻ test
                  </label>
                  <Input defaultValue={VNPAY_TEST_CARD.number} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
                      Tên chủ thẻ
                    </label>
                    <Input defaultValue={VNPAY_TEST_CARD.holder} readOnly />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
                      Ngày phát hành
                    </label>
                    <Input defaultValue={VNPAY_TEST_CARD.issueDate} readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5e5866] mb-1.5">
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
                    Đang kết nối cổng VNPAY Sandbox...
                  </>
                ) : (
                  "Xác Nhận Thanh Toán Qua VNPAY Sandbox"
                )}
              </Button>
            </Card>
          )}

          {paymentTab === "wallet" && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="h-5 w-5 text-[#1e7e45]" />
                <h3 className="text-base font-semibold text-[#27252d]">
                  Thanh Toán Bằng Số Dư Ví SkillBridge
                </h3>
              </div>

              <div className="rounded-xl bg-[#faf9f6] border border-[#e5e2de] p-5 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#5e5866]">Số dư khả dụng</span>
                  <span className="text-base font-mono font-bold text-[#27252d]">
                    {vnd(session.wallet)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#e5e2de]">
                  <span className="text-xs text-[#5e5866]">Học phí cần trừ</span>
                  <span className="text-base font-mono font-bold text-[#1e7e45]">
                    {vnd(booking.priceVnd)}
                  </span>
                </div>
              </div>

              {session.wallet < booking.priceVnd ? (
                <div>
                  <NoticeBanner
                    variant="warning"
                    message={`Số dư ví của bạn còn thiếu ${vnd(booking.priceVnd - session.wallet)}. Vui lòng chọn PayOS VietQR / VNPAY hoặc nạp thêm tiền vào ví.`}
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
                  Xác Nhận Trừ Ví & Khóa Tiền Vào Escrow
                </Button>
              )}
            </Card>
          )}
        </div>

        {/* ── Right Column: Order Summary (2/5) ── */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-[#27252d] mb-4">
              Tóm Tắt Đơn Đặt Lịch
            </h3>

            <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-[#f1efea]">
              <Avatar src={mentor.avatarUrl} alt={booking.mentorName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#27252d] truncate">
                  {booking.mentorName}
                </p>
                <p className="text-xs text-[#5e5866] truncate mt-0.5">
                  {booking.serviceName}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5 pb-5 border-b border-[#f1efea]">
              <div className="flex justify-between text-xs">
                <span className="text-[#5e5866]">Khung giờ</span>
                <span className="text-[#27252d] font-mono text-right font-medium">{slotText}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5e5866]">Thời lượng</span>
                <span className="text-[#27252d] font-medium">{booking.durationLabel}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5e5866]">Học phí mentor</span>
                <span className="text-[#27252d] font-mono font-medium">
                  {vnd(booking.priceVnd)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5e5866]">Phí nền tảng Mentee</span>
                <span className="text-[#1e7e45] font-mono font-semibold">0 ₫ (Miễn phí)</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#27252d]">
                Tổng thanh toán
              </span>
              <span className="text-xl font-mono font-bold text-[#1e7e45]">
                {vnd(booking.priceVnd)}
              </span>
            </div>
          </Card>

          {/* Escrow Shield */}
          <EscrowShield amount={vnd(booking.priceVnd)} />
        </div>
      </div>
    </div>
    </RequireRole>
  );
}

export { BookingCheckoutView as default };
