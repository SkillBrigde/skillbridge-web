"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Tabs,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { EscrowShield } from "@/components/ui/escrow-shield";
import {
  QrCode,
  Loader2,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Info,
} from "lucide-react";
import { getBooking } from "@/services/booking.service";
import { createPayment } from "@/services/payments.service";
import type { BookingResponse } from "@/types/api";

const VNPAY_TEST_CARD = {
  bank: "NCB (Ngân hàng Quốc Dân)",
  cardNumber: "9704198526191432198",
  cardHolder: "NGUYEN VAN A",
  issueDate: "07/15",
  otp: "123456",
};

export function BookingCheckoutView() {
  const params = useParams<{ bookingId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = params.bookingId;

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentTab, setPaymentTab] = useState("vnpay");
  const [lockRemainingSeconds, setLockRemainingSeconds] = useState(0);

  // PayOS info if generated
  const [payOsData, setPayOsData] = useState<{
    qrCode?: string;
    accountNumber?: string;
    accountName?: string;
    bin?: string;
  } | null>(null);

  // Read URL query params from VNPAY return
  const vnpResponseCode = searchParams.get("vnp_ResponseCode");
  const returnStatus = searchParams.get("status");
  const isVnpayReturnSuccess = vnpResponseCode === "00" || returnStatus === "success";

  // Fetch Booking details
  useEffect(() => {
    if (!bookingId) return;
    let isMounted = true;

    getBooking(bookingId)
      .then((res) => {
        if (!isMounted) return;
        setBooking(res);
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorMsg("Không thể tìm thấy thông tin đơn đặt lịch.");
      })
      .finally(() => {
        if (!isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  // Handle return from VNPAY: Poll until confirmed
  useEffect(() => {
    if (!bookingId || !isVnpayReturnSuccess) return;

    const timer = setInterval(() => {
      getBooking(bookingId)
        .then((b) => {
          if (b.status === "AwaitingMentor" || b.status === "Confirmed") {
            setBooking(b);
            clearInterval(timer);
          }
        })
        .catch(() => {});
    }, 2500);

    return () => clearInterval(timer);
  }, [bookingId, isVnpayReturnSuccess]);

  // Update error from return if failed
  useEffect(() => {
    if (vnpResponseCode && vnpResponseCode !== "00") {
      const timer = setTimeout(() => {
        setErrorMsg("Giao dịch VNPAY không thành công hoặc bạn đã hủy thanh toán.");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [vnpResponseCode]);

  // Lock expiry timer
  useEffect(() => {
    if (!booking?.heldUntilUtc) return;
    const expiresAt = new Date(booking.heldUntilUtc).getTime();
    const update = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setLockRemainingSeconds(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [booking?.heldUntilUtc]);

  const handleVnpayPayment = async () => {
    if (!booking) return;
    setProcessing(true);
    setErrorMsg("");

    try {
      const returnUrl = `${window.location.origin}/checkout/${booking.id}?status=success`;
      const cancelUrl = `${window.location.origin}/checkout/${booking.id}?status=cancel`;

      const payment = await createPayment({
        bookingId: booking.id,
        gateway: "VnPay",
        amount: booking.totalAmount,
        returnUrl,
        cancelUrl,
        description: `Thanh toan don SB ${booking.bookingCode}`,
      });

      if (payment.paymentUrl) {
        window.location.assign(payment.paymentUrl);
      } else {
        throw new Error("Không nhận được đường dẫn thanh toán từ cổng VNPAY.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Khởi tạo thanh toán thất bại.";
      setErrorMsg(msg);
      setProcessing(false);
    }
  };

  const handlePayOsPayment = async () => {
    if (!booking) return;
    setProcessing(true);
    setErrorMsg("");

    try {
      const returnUrl = `${window.location.origin}/checkout/${booking.id}?status=success`;
      const cancelUrl = `${window.location.origin}/checkout/${booking.id}?status=cancel`;

      const payment = await createPayment({
        bookingId: booking.id,
        gateway: "PayOS",
        amount: booking.totalAmount,
        returnUrl,
        cancelUrl,
        description: `Thanh toan don SB ${booking.bookingCode}`,
      });

      setPayOsData({
        qrCode: payment.qrCode,
        accountNumber: payment.accountNumber,
        accountName: payment.accountName,
        bin: payment.bin,
      });
      setProcessing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Chưa thể khởi tạo cổng PayOS.";
      setErrorMsg(msg);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[var(--sb-muted)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--sb-purple)]" />
        <p className="text-sm">Đang tải thông tin thanh toán…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy đơn thanh toán"
          description={errorMsg || "Đơn thanh toán không tồn tại hoặc đã hết hạn giữ chỗ."}
          action={{
            label: "Xem danh sách lịch học",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const isConfirmed = booking.status === "AwaitingMentor" || booking.status === "Confirmed";
  const showSuccessBanner = isConfirmed || isVnpayReturnSuccess;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Countdown Timer Banner ── */}
      {!isConfirmed && (
        <CountdownTimer
          initialSeconds={lockRemainingSeconds || 599}
          onExpire={() => {
            router.push(`/slot-expired?booking=${booking.id}`);
          }}
          className="mb-8"
        />
      )}

      {errorMsg && (
        <div className="mb-6">
          <NoticeBanner variant="error" message={errorMsg} />
        </div>
      )}

      {showSuccessBanner && (
        <div className="mb-8 rounded-2xl bg-[#e8f8f0] border border-[#27C98F]/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-[#27C98F] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-[#14532d] text-base">
                Thanh Toán Thành Công! Tiền Đã Được Bảo Vệ Trong Escrow
              </h3>
              <p className="text-xs text-[#166534] mt-0.5">
                Đơn đặt lịch #{booking.bookingCode} đã chuyển sang trạng thái{" "}
                <strong>
                  {booking.status === "Confirmed" ? "Đã Xác Nhận" : "Chờ Mentor Phê Duyệt"}
                </strong>
                .
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/bookings")}
            className="bg-[#27C98F] text-white hover:bg-[#20ab78] px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 flex-shrink-0"
          >
            Vào Trang Lịch Học <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left Column: Payment Method (3/5) ── */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[var(--sb-ink)] tracking-tight">
              Cổng Thanh Toán Ký Quỹ Escrow
            </h1>
            <span className="text-xs text-[var(--sb-muted)]">
              Mã đơn: <strong className="font-mono text-[var(--sb-purple)]">{booking.bookingCode}</strong>
            </span>
          </div>

          <Tabs
            items={[
              { id: "vnpay", label: "VNPAY Sandbox (ATM Test)" },
              { id: "payos", label: "PayOS VietQR (NAPAS 24/7)" },
            ]}
            activeId={paymentTab}
            onChange={setPaymentTab}
          />

          {paymentTab === "vnpay" && (
            <Card className="p-6 bg-white border-[var(--sb-line)] space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#faf9f6] border border-[var(--sb-line)]">
                <Info className="w-5 h-5 text-[var(--sb-purple)] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--sb-muted)] leading-relaxed">
                  <p className="font-semibold text-[var(--sb-ink)] mb-1">
                    Môi Trường Thử Nghiệm VNPAY Sandbox
                  </p>
                  <p>
                    Hệ thống sẽ chuyển hướng bạn sang cổng thanh toán VNPAY chính thức. Bạn có thể sử dụng thông tin thẻ thử nghiệm NCB dưới đây để hoàn tất giao dịch mà không mất phí thật.
                  </p>
                </div>
              </div>

              {/* Test Card Info */}
              <div className="rounded-xl border border-[var(--sb-line)] bg-[#faf8fc] p-4 text-xs space-y-2 font-mono">
                <div className="text-[11px] font-sans font-semibold text-[var(--sb-purple)] uppercase tracking-wider mb-2">
                  Thông Tin Thẻ ATM Test NCB
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--sb-line)]">
                  <span className="text-[var(--sb-muted)] font-sans">Ngân hàng:</span>
                  <span className="font-bold text-[var(--sb-ink)]">{VNPAY_TEST_CARD.bank}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--sb-line)]">
                  <span className="text-[var(--sb-muted)] font-sans">Số thẻ test:</span>
                  <span className="font-bold text-[var(--sb-purple)]">{VNPAY_TEST_CARD.cardNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--sb-line)]">
                  <span className="text-[var(--sb-muted)] font-sans">Tên chủ thẻ:</span>
                  <span className="text-[var(--sb-ink)]">{VNPAY_TEST_CARD.cardHolder}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--sb-line)]">
                  <span className="text-[var(--sb-muted)] font-sans">Ngày phát hành:</span>
                  <span className="text-[var(--sb-ink)]">{VNPAY_TEST_CARD.issueDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--sb-muted)] font-sans">Mã OTP xác thực:</span>
                  <span className="font-bold text-[#27C98F]">{VNPAY_TEST_CARD.otp}</span>
                </div>
              </div>

              <Button
                onClick={handleVnpayPayment}
                disabled={processing || isConfirmed}
                className="w-full py-3.5 bg-[var(--sb-purple)] text-white hover:bg-[var(--sb-purple)]/90 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang kết nối cổng VNPAY…
                  </>
                ) : isConfirmed ? (
                  "Đơn Hàng Đã Thanh Toán"
                ) : (
                  <>
                    Chuyển Hướng Đến VNPAY Sandbox <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </Button>
            </Card>
          )}

          {paymentTab === "payos" && (
            <Card className="p-6 bg-white border-[var(--sb-line)] space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#faf9f6] border border-[var(--sb-line)]">
                <Info className="w-5 h-5 text-[var(--sb-purple)] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--sb-muted)] leading-relaxed">
                  <p className="font-semibold text-[var(--sb-ink)] mb-1">
                    Cổng Thanh Toán PayOS VietQR
                  </p>
                  <p>
                    Chuyển khoản trực tiếp qua ngân hàng bằng mã VietQR tiêu chuẩn NAPAS 24/7. Webhook tự động cập nhật trong 1-2 giây.
                  </p>
                </div>
              </div>

              {payOsData?.qrCode ? (
                <div className="flex flex-col items-center justify-center p-6 bg-[#faf9f6] rounded-xl border border-[var(--sb-line)]">
                  <div className="w-48 h-48 bg-white p-2 rounded-xl border border-[var(--sb-line)] flex items-center justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={payOsData.qrCode}
                      alt="VietQR PayOS"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-mono text-center space-y-1 text-[var(--sb-ink)]">
                    <p>Số TK: <strong>{payOsData.accountNumber}</strong></p>
                    <p>Chủ TK: <strong>{payOsData.accountName}</strong></p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Button
                    onClick={handlePayOsPayment}
                    disabled={processing || isConfirmed}
                    className="py-3 px-6 bg-[var(--sb-purple)] text-white hover:bg-[var(--sb-purple)]/90 rounded-xl font-medium text-xs flex items-center gap-2 mx-auto"
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <QrCode className="w-4 h-4" />
                    )}
                    Tạo Mã VietQR PayOS
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* ── Right Column: Order Summary & Escrow (2/5) ── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-white border-[var(--sb-line)] shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-[var(--sb-ink)] border-b border-[var(--sb-line)] pb-3">
              Chi Tiết Đơn Đặt Lịch
            </h2>

            <div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--sb-purple)]/10 text-[var(--sb-purple)] font-medium">
                {booking.serviceSnapshot.title}
              </span>
              <p className="text-xs text-[var(--sb-muted)] mt-2">
                {booking.serviceSnapshot.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[var(--sb-line)] text-xs text-[var(--sb-ink)]">
              <div className="flex justify-between">
                <span className="text-[var(--sb-muted)]">Số buổi học:</span>
                <span className="font-semibold">{booking.serviceSnapshot.totalSessions} buổi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--sb-muted)]">Thời lượng:</span>
                <span className="font-semibold">{booking.serviceSnapshot.sessionDurationMinutes} phút / buổi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--sb-muted)]">Trạng thái:</span>
                <span className="font-semibold text-[var(--sb-purple)]">
                  {booking.status === "Holding"
                    ? "Đang giữ chỗ (10p)"
                    : booking.status === "Confirmed"
                    ? "Đã xác nhận"
                    : booking.status === "AwaitingMentor"
                    ? "Chờ mentor duyệt"
                    : booking.status}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--sb-line)] flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--sb-ink)]">Tổng Học Phí:</span>
              <span className="text-xl font-bold text-[var(--sb-purple)]">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: booking.currency || "VND",
                }).format(booking.totalAmount)}
              </span>
            </div>
          </Card>

          <EscrowShield />
        </div>
      </div>
    </div>
  );
}

export default BookingCheckoutView;
