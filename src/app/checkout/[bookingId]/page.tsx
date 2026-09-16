import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;

  return (
    <RouteSkeleton
      screenId="SCR-PAY-01"
      screenTitle="Cổng Thanh Toán Kép Ký Quỹ Escrow (PayOS VietQR / VNPAY)"
      module="Payments & Escrow"
      actor="Mentee"
      description="Giao diện thanh toán chia 7:5 với mã QR VietQR Napas 247 tương phản cao, 1-click copy số tài khoản, Webhook realtime listener, và Sentinel đếm ngược Redis."
      features={[
        "PayOS VietQR Pro quét mã tức thì qua 40+ ứng dụng ngân hàng Việt Nam",
        "VNPAY Sandbox hỗ trợ thẻ ATM nội địa & thẻ quốc tế Visa/Mastercard",
        "Sao chép 1-click thông tin chuyển khoản: Ngân hàng MB, STK, Số tiền, Mã nội dung",
        "Webhook Live Socket lắng nghe giao dịch với độ trễ phản hồi < 1.2 giây"
      ]}
    >
      <div className="rounded-xl bg-[#0D0E10] border border-white/[0.06] p-4 text-xs font-mono text-[#9BA1B0]">
        <span>Dynamic Parameter [bookingId]: </span>
        <span className="text-[#5E6AD2] font-semibold">{bookingId}</span>
      </div>
    </RouteSkeleton>
  );
}
