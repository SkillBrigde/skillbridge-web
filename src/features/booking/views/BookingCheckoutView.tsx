"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAppState, useNow, useSession, actions } from "@/lib/store";
import {
  vnd,
  bookingTimeLabel,
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
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

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

  const handlePayOSConfirm = async () => {
    setProcessing(true);
    setErrorMsg("");
    try {
      const { paymentService } = await import("@/services/paymentService");
      const res = await paymentService.createPayment({
        bookingId: booking.id,
        gateway: "PayOS",
        amount: booking.priceVnd,
        returnUrl: window.location.origin + "/bookings",
        cancelUrl: window.location.origin + "/bookings",
      });
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
    } catch {
      // Fallback to local store simulation
      const res = actions.payBooking(booking.id, "PayOS");
      if (!res.ok) {
        setErrorMsg(res.error || "Thanh toán thất bại.");
      } else {
        setSuccess(true);
        const t2 = setTimeout(() => router.push("/bookings"), 1500);
        timeoutRefs.current.push(t2);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleVnpayConfirm = async () => {
    setProcessing(true);
    setErrorMsg("");
    try {
      const { paymentService } = await import("@/services/paymentService");
      const res = await paymentService.createPayment({
        bookingId: booking.id,
        gateway: "VnPay",
        amount: booking.priceVnd,
        returnUrl: window.location.origin + "/bookings",
        cancelUrl: window.location.origin + "/bookings",
      });
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
    } catch {
      // Fallback to local store simulation
      const res = actions.payBooking(booking.id, "VNPAY");
      if (!res.ok) {
        setErrorMsg(res.error || "Giao dịch VNPAY thất bại.");
      } else {
        setSuccess(true);
        const t2 = setTimeout(() => router.push("/bookings"), 1500);
        timeoutRefs.current.push(t2);
      }
    } finally {
      setProcessing(false);
    }
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
  const priceFormatted = vnd(booking.priceVnd);

  return (
    <RequireRole role="mentee" title="Thanh Toán & Ký Quỹ Escrow" description="Đăng nhập tài khoản để tiến hành thanh toán và khóa slot an toàn.">
      <div className="sb-container py-8 sm:py-10">
        {/* Navigation & Context */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5e5866] hover:text-[#6551a4] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại danh sách mentor</span>
          </Link>
          <span className="text-[11px] font-mono text-[#5e5866]">
            Mã đơn: <strong className="text-[#27252d]">{booking.code}</strong>
          </span>
        </div>

        {/* Countdown Timer Banner */}
        <CountdownTimer
          initialSeconds={lockRemainingSeconds || 599}
          slotKey={`Mã đơn: ${booking.code}`}
          onExpire={() => {
            actions.expireBooking(booking.id);
            router.push(`/slot-expired?booking=${booking.id}`);
          }}
          className="mb-6"
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
              message="Thanh toán thành công! Học phí đã được khóa an toàn vào Két Escrow. Đang chuyển về trang lịch học..."
            />
          </div>
        )}

        {/* ── MOBILE PRIORITY: Order Summary & Total First ── */}
        <div className="block lg:hidden mb-6">
          <Card className="p-5 border-[#d4c3e7] bg-[#fbfaf8]">
            <div className="flex items-center justify-between border-b border-[#e5e2de] pb-3 mb-3">
              <span className="text-xs font-semibold text-[#5e5866] uppercase tracking-wider">
                Xác nhận đơn đặt lịch
              </span>
              <Badge variant="escrow">Bảo chứng Escrow</Badge>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Avatar src={mentor.avatarUrl} alt={booking.mentorName} size="md" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#27252d] truncate">
                  {booking.mentorName}
                </p>
                <p className="text-xs text-[#5e5866] truncate mt-0.5">
                  {booking.serviceName}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs mb-4 pb-4 border-b border-[#e5e2de]">
              <div className="flex justify-between">
                <span className="text-[#5e5866]">Khung giờ:</span>
                <span className="font-medium text-[#27252d] text-right font-mono">{slotText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5e5866]">Thời lượng:</span>
                <span className="font-medium text-[#27252d]">{booking.durationLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5e5866]">Phí nền tảng Mentee:</span>
                <span className="text-[#1e7e45] font-semibold">Miễn phí</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-bold text-[#27252d]">
                Tổng thanh toán:
              </span>
              <span className="text-2xl font-mono tabular-nums font-bold text-[#1e7e45]">
                {priceFormatted}
              </span>
            </div>
          </Card>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* ── Payment Column (3/5) ── */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#27252d] tracking-tight">
                Phương thức thanh toán
              </h1>
              <p className="text-xs sm:text-sm text-[#5e5866] mt-1">
                Học phí được giữ an toàn tại Két Escrow và chỉ giải ngân sau khi buổi học hoàn tất.
              </p>
            </div>

            <Tabs
              items={[
                { id: "payos", label: "VietQR (Quét mã 24/7)" },
                { id: "vnpay", label: "Thẻ ngân hàng (VNPAY)" },
                { id: "wallet", label: `Ví SkillBridge (${vnd(session.wallet)})` },
              ]}
              activeId={paymentTab}
              onChange={setPaymentTab}
              disabled={processing}
            />

            {paymentTab === "payos" && (
              <Card className="p-6">
                {/* QR Code Card */}
                <div className="flex justify-center mb-6">
                  <div
                    role="region"
                    aria-label="Mã QR thanh toán PayOS VietQR"
                    className="w-60 h-60 rounded-2xl bg-white p-3.5 flex flex-col items-center justify-between border-2 border-[#bde6ca] shadow-xs"
                  >
                    <div className="text-[11px] font-bold text-[#27252d] tracking-wider uppercase font-mono">
                      VIETQR • MB BANK
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <QrCode className="h-40 w-40 text-[#27252d]" aria-hidden="true" />
                    </div>
                    <div className="text-[10px] font-mono text-[#5e5866] bg-[#f1efea] rounded px-2.5 py-1">
                      Mở app ngân hàng bất kỳ để quét
                    </div>
                  </div>
                </div>

                {/* Transfer details */}
                <div className="space-y-3 bg-[#faf9f6] rounded-xl p-4 border border-[#e5e2de] mb-6">
                  <div className="flex items-center justify-between py-1 border-b border-[#e5e2de]">
                    <span className="text-xs text-[#5e5866]">Ngân hàng thụ hưởng</span>
                    <span className="text-sm font-semibold text-[#27252d]">
                      MB Bank (Ngân hàng Quân Đội)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#e5e2de]">
                    <span className="text-xs text-[#5e5866]">Số tài khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-[#27252d]">
                        0987654321
                      </span>
                      <CopyButton text="0987654321" aria-label="Sao chép số tài khoản MB Bank 0987654321" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#e5e2de]">
                    <span className="text-xs text-[#5e5866]">Nội dung chuyển khoản</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-[#6551a4] font-bold">
                        {transferCode}
                      </span>
                      <CopyButton text={transferCode} aria-label={`Sao chép mã nội dung chuyển khoản ${transferCode}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-semibold text-[#27252d]">Số tiền cần thanh toán</span>
                    <span className="text-lg font-mono tabular-nums font-bold text-[#1e7e45]">
                      {priceFormatted}
                    </span>
                  </div>
                </div>

                {/* Friendly status guidance */}
                <div className="mb-6 flex items-start gap-3 rounded-lg bg-[#e8f5ed]/50 border border-[#bde6ca] p-3 text-xs text-[#1e7e45]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Chuyển đúng số tiền và nội dung để hệ thống tự động xác nhận đơn và gửi link phòng học vào tài khoản của bạn.
                  </span>
                </div>

                <Button
                  variant="primary"
                  className="w-full text-base font-semibold py-3.5"
                  size="lg"
                  disabled={processing || success}
                  onClick={handlePayOSConfirm}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang xác nhận giao dịch...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Tôi Đã Hoàn Tất Chuyển Khoản {priceFormatted}
                    </>
                  )}
                </Button>
              </Card>
            )}

            {paymentTab === "vnpay" && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="h-5 w-5 text-[#6551a4]" />
                  <h3 className="text-base font-semibold text-[#27252d]">
                    Thanh toán qua cổng VNPAY
                  </h3>
                </div>

                <div className="rounded-xl bg-[#faf9f6] border border-[#e5e2de] p-4 mb-5 text-xs text-[#5e5866] space-y-1.5">
                  <p className="font-semibold text-[#27252d]">Môi trường thử nghiệm VNPAY Sandbox:</p>
                  <p>Số thẻ test: <span className="font-mono text-[#27252d]">9704198526191432198</span> (NCB)</p>
                  <p>Tên chủ thẻ: <span className="font-mono text-[#27252d]">NGUYEN VAN A</span></p>
                  <p>Mã OTP mặc định: <span className="font-mono font-bold text-[#6551a4]">123456</span></p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="vnpay-otp-input" className="block text-xs font-medium text-[#5e5866] mb-1.5">
                      Nhập mã xác thực OTP
                    </label>
                    <Input
                      id="vnpay-otp-input"
                      name="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={vnpayOtp}
                      onChange={(e) => setVnpayOtp(e.target.value)}
                      placeholder="123456"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full mt-6 text-base font-semibold py-3.5"
                  size="lg"
                  disabled={processing || success}
                  onClick={handleVnpayConfirm}
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang kết nối cổng VNPAY...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Thanh Toán {priceFormatted} Qua VNPAY
                    </>
                  )}
                </Button>
              </Card>
            )}

            {paymentTab === "wallet" && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Wallet className="h-5 w-5 text-[#1e7e45]" />
                  <h3 className="text-base font-semibold text-[#27252d]">
                    Thanh toán bằng số dư ví SkillBridge
                  </h3>
                </div>

                <div className="rounded-xl bg-[#faf9f6] border border-[#e5e2de] p-5 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5e5866]">Số dư khả dụng</span>
                    <span className="text-base font-mono tabular-nums font-bold text-[#27252d]">
                      {vnd(session.wallet)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#e5e2de]">
                    <span className="text-xs font-semibold text-[#27252d]">Học phí cần trừ</span>
                    <span className="text-base font-mono tabular-nums font-bold text-[#1e7e45]">
                      {priceFormatted}
                    </span>
                  </div>
                </div>

                {session.wallet < booking.priceVnd ? (
                  <div>
                    <NoticeBanner
                      variant="warning"
                      message={`Số dư ví của bạn còn thiếu ${vnd(booking.priceVnd - session.wallet)}. Vui lòng nạp thêm tiền hoặc chọn VietQR / VNPAY.`}
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
                    className="w-full text-base font-semibold py-3.5"
                    size="lg"
                    disabled={processing || success}
                    onClick={handleWalletConfirm}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Xác Nhận Trừ Ví {priceFormatted} & Khóa Tiền Vào Escrow
                  </Button>
                )}
              </Card>
            )}
          </div>

          {/* ── DESKTOP STICKY SIDEBAR: Order Summary & Escrow (2/5) ── */}
          <div className="hidden lg:block lg:col-span-2 space-y-5 sticky top-24">
            <Card className="p-6 border-[#d4c3e7] shadow-sm">
              <h2 className="text-base font-semibold text-[#27252d] mb-4">
                Tóm Tắt Đơn Đặt Lịch
              </h2>

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
                  <span className="text-[#27252d] font-mono tabular-nums font-medium">
                    {priceFormatted}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5e5866]">Phí nền tảng Mentee</span>
                  <span className="text-[#1e7e45] font-semibold">Miễn phí (0 ₫)</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-[#27252d]">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-mono tabular-nums font-bold text-[#1e7e45]">
                  {priceFormatted}
                </span>
              </div>
            </Card>

            {/* Escrow Shield Reassurance */}
            <EscrowShield amount={priceFormatted} />
          </div>
        </div>
      </div>
    </RequireRole>
  );
}

export { BookingCheckoutView as default };
