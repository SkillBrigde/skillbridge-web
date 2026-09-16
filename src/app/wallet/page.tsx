import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-WLT-01"
      screenTitle="Ví Cá Nhân & Lịch Sử Ký Quỹ Escrow (Mentee)"
      module="Payments & Wallet"
      actor="Mentee"
      description="Quản lý số dư ví khả dụng, tiền đang bị khóa tạm giữ trong hợp đồng Escrow, trực quan hóa luồng 4 giai đoạn, và sổ cái giao dịch kiểm toán minh bạch."
      features={[
        "3 Thẻ số dư: Khả dụng (Emerald), Đang ký quỹ (Amber), Tổng chi tiêu",
        "Trực quan hóa luồng Escrow Pipeline: Khóa tiền -> Học 1-1 -> Nghiệm thu -> Giải ngân",
        "Bảng sổ cái giao dịch chi tiết kèm mã băm SHA-256 và nút sao chép TXID",
        "Hỗ trợ nạp tiền nhanh vào ví để đặt lịch ngay không qua cổng trung gian"
      ]}
    />
  );
}
