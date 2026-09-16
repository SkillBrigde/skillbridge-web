import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-WLT-02"
      screenTitle="Ví Doanh Thu Mentor & Rút Tiền VietQR Tức Thì 24/7"
      module="Fintech & Ledger"
      actor="Mentor"
      description="Hệ thống quản lý tài chính chuyên gia phân tách 3 dòng tiền minh bạch: Khả dụng (Available), Tạm giữ (Holding), Tranh chấp (Disputed), và lệnh rút tức thì qua PayOS."
      features={[
        "3 Dòng tiền rạch ròi: 6.2M ₫ Khả dụng | 1.8M ₫ Đang Escrow | 450k ₫ Tranh chấp",
        "Lệnh rút tiền tức thì về tài khoản MB Bank đã KYC trong 30 giây qua Napas 247",
        "Phí rút tiền 0 ₫ (SkillBridge tài trợ 100% chi phí chuyển khoản liên ngân hàng)",
        "Sổ cái kế toán kép ghi nhận mọi biến động số dư kèm chữ ký hàm băm SHA-256"
      ]}
    />
  );
}
