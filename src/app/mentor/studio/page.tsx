import { RouteSkeleton } from "@/components/layout/route-skeleton";

export default function Page() {
  return (
    <RouteSkeleton
      screenId="SCR-MTR-02"
      screenTitle="Studio Đóng Gói Dịch Vụ — Thiết Lập 3 Gói Cố Định"
      module="Catalog & Packaging"
      actor="Mentor"
      description="Studio cấu hình 3 gói dịch vụ Productized Services chuẩn mực: Định giá niêm yết cố định (VND), danh sách deliverables cam kết đầu ra, và switch đặt gói Featured."
      features={[
        "Tier 1 (Tốc độ): Review CV & Portfolio (300.000 ₫ / 45 phút)",
        "Tier 2 (Trọng tâm): Mock Interview System Design (450.000 ₫ / 60 phút - Featured)",
        "Tier 3 (Toàn diện): Lộ trình Software Architect (2.000.000 ₫ / 1 Tháng)",
        "Trình quản lý danh sách cam kết đầu ra (Deliverables Checklist) linh hoạt"
      ]}
    />
  );
}
