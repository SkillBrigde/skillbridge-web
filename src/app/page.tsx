import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Calendar, Wallet, Award, Scale } from "lucide-react";
import { Badge, Button, Card, CardContent } from "@/components/ui";

const SKELETON_ROUTES = [
  {
    category: "Cộng Đồng & Khám Phá (Public)",
    routes: [
      { href: "/mentors", label: "SCR-PUB-01: Khám Phá Mentors & Lọc Kỹ Năng", icon: Users },
      { href: "/mentors/mentor-an-nguyen", label: "SCR-PUB-02: Hồ Sơ Mentor & 3 Gói Dịch Vụ", icon: Award },
      { href: "/login", label: "SCR-AUT-01: Xác Thực & Đăng Nhập", icon: ShieldCheck },
    ],
  },
  {
    category: "Đặt Lịch & Thanh Toán (Booking & Escrow)",
    routes: [
      { href: "/bookings/sb-2026-98124/intake", label: "SCR-BKG-01: Khảo Sát Intake & Khóa Slot Redis", icon: Calendar },
      { href: "/checkout/sb-2026-98124", label: "SCR-PAY-01: Cổng Thanh Toán Kép (VietQR / VNPAY)", icon: Wallet },
      { href: "/bookings", label: "SCR-BKG-02: Bảng Điều Khiển Buổi Học Của Tôi", icon: Calendar },
      { href: "/bookings/sb-2026-98124/room", label: "SCR-LRN-01: Phòng Học 1-on-1 & Nghiệm Thu Escrow", icon: Users },
      { href: "/wallet", label: "SCR-WLT-01: Ví Cá Nhân & Lịch Sử Ký Quỹ Mentee", icon: Wallet },
      { href: "/reviews/sb-2026-98124", label: "SCR-REV-01: Đánh Giá 4 Tiêu Chí Sau Buổi Học", icon: Award },
    ],
  },
  {
    category: "Dành Cho Mentor (Expert Studio)",
    routes: [
      { href: "/mentor/onboarding", label: "SCR-MTR-01: Đăng Ký Mentor & Nộp KYC", icon: ShieldCheck },
      { href: "/mentor/studio", label: "SCR-MTR-02: Studio Đóng Gói 3 Gói Dịch Vụ", icon: Award },
      { href: "/mentor/schedule", label: "SCR-MTR-03 / SCH-01: Lịch Dạy & Quy Tắc Lặp Tuần", icon: Calendar },
      { href: "/mentor/sessions/sb-2026-98124", label: "SCR-MTR-04: Phòng Học Mentor & Nộp Bằng Chứng", icon: Users },
      { href: "/mentor/reputation", label: "SCR-MTR-05: Quản Lý Uy Tín & Phản Hồi Đánh Giá", icon: Award },
      { href: "/mentor/wallet", label: "SCR-WLT-02: Ví Doanh Thu & Rút Tiền VietQR 24/7", icon: Wallet },
    ],
  },
  {
    category: "Tranh Chấp & Quản Trị (Disputes & Admin)",
    routes: [
      { href: "/disputes/new", label: "SCR-DSP-01: Khởi Tạo Hồ Sơ Khiếu Nại Buổi Học", icon: Scale },
      { href: "/disputes/disp-98124", label: "SCR-DSP-02: Phản Hồi Khiếu Nại & Đối Chất", icon: Scale },
      { href: "/admin/disputes", label: "SCR-ADM-01: Trung Tâm Phán Quyết Khiếu Nại SLA 48h", icon: Scale },
      { href: "/admin/kyc", label: "SCR-ADM-02: Duyệt Hồ Sơ KYC Mentor & Cấp Tích Xanh", icon: ShieldCheck },
      { href: "/admin/escrow", label: "SCR-ADM-03: Giám Sát Sổ Cái Escrow Toàn Sàn", icon: Wallet },
    ],
  },
  {
    category: "Trang Trạng Thái & Lỗi (Error Diagnostics)",
    routes: [
      { href: "/not-found", label: "SCR-ERR-01: Màn Hình 404 Không Tìm Thấy Trang", icon: Scale },
      { href: "/slot-expired", label: "SCR-ERR-03: Hết Hạn Khóa Slot 10 Phút Redis", icon: Calendar },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Banner */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-4">
          <Badge variant="brand" dot pulse>
            Foundation Ready • Next.js 16 + Tailwind
          </Badge>
          <Badge variant="escrow">
            Dark Slate Precision
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F0F2F5] mb-3">
          SkillBridge Web Foundation Base
        </h1>
        <p className="text-sm text-[#9BA1B0] leading-relaxed">
          Nền móng khung sườn web đã dựng hoàn tất theo đúng Design System Dark Slate Precision từ Stitch Design.
          Toàn bộ 24 routes đã được cấu hình khung xương, sẵn sàng cho việc triển khai chi tiết từng màn hình.
        </p>
      </div>

      {/* Routes Matrix Grid */}
      <div className="space-y-8">
        {SKELETON_ROUTES.map((group) => (
          <div key={group.category} className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#5D6474] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5E6AD2]" />
              {group.category}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.routes.map((route) => {
                const IconComponent = route.icon;
                return (
                  <Link key={route.href} href={route.href}>
                    <Card hoverable className="p-4 h-full flex flex-col justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1115] border border-white/[0.08] text-[#5E6AD2] flex-shrink-0">
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-[#F0F2F5] line-clamp-2 leading-snug">
                            {route.label}
                          </span>
                          <span className="text-[11px] font-mono text-[#5D6474] block mt-1 truncate">
                            {route.href}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#9BA1B0]">
                        <span>Xem Skeleton Route</span>
                        <ArrowRight className="h-3 w-3 text-[#5E6AD2]" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
