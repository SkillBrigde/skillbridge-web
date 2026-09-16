import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-ADM-03"
      screenTitle="Giám Sát Sổ Cái Escrow Toàn Sàn & Đối Soát Kế Toán Kép"
      module="Admin Governance"
      actor="Super Admin"
      description="Giám sát dòng tiền toàn sàn phân tán: 4 thẻ Master KPI, đối soát cổng PayOS MB Bank và VNPAY, cùng bảng sổ cái kép ghi nhận mọi tài khoản Nợ (Debit) / Có (Credit)."
      features={[
        "4 Master KPI: 148.5M ₫ Đang giữ Escrow, 32.4M ₫ Phí sàn 10%, 12M ₫ Lệnh rút Payout",
        "Đối soát tự động 100% khớp giữa số dư thực tế cổng thanh toán và số dư sổ cái",
        "Bảng sổ cái kép (Double-Entry Ledger) chuẩn kế toán với Debit/Credit và Hash",
        "Bộ lọc chuyên sâu theo loại giao dịch: Giải phóng Escrow, Rút tiền, Tranh chấp"
      ]}
    />
  );
}
