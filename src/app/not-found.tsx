import Link from "next/link";
import { ArrowLeft, Compass, LayoutDashboard } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background Raycast Hairline Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#454652_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center">
        {/* Status Badge */}
        <div className="mb-6 inline-flex">
          <Badge variant="pending" dot pulse>
            HTTP STATUS 404 • NOT FOUND
          </Badge>
        </div>

        {/* Large Monospace 404 */}
        <h1 className="font-mono text-7xl sm:text-8xl font-bold tracking-tighter text-[#3B4150] mb-2 select-none">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight mb-3">
          Không tìm thấy trang hoặc khung giờ này
        </h2>

        <p className="text-sm text-[#9BA1B0] leading-relaxed mb-8">
          Đường dẫn bạn truy cập có thể đã bị thay đổi, xóa bỏ hoặc khung giờ phòng vấn này không còn tồn tại trên hệ thống SkillBridge.
        </p>

        {/* Bento Split Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link href="/mentors">
            <Card hoverable className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5E6AD2]/10 text-[#5E6AD2]">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F0F2F5]">Khám phá Mentors</h4>
                  <p className="text-[11px] text-[#9BA1B0]">Hơn 200+ Tech Lead & Chuyên gia</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/bookings">
            <Card hoverable className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#27C98F]/10 text-[#27C98F]">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#F0F2F5]">Lịch học của tôi</h4>
                  <p className="text-[11px] text-[#9BA1B0]">Xem các buổi học & Escrow</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/mentors">
            <Button variant="primary">
              Về Trang Chủ Khám Phá
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              <span>Về Trang Chủ</span>
            </Button>
          </Link>
        </div>

        {/* Technical Diagnostics */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-[11px] font-mono text-[#5D6474] flex flex-wrap items-center justify-center gap-4">
          <span>Mã lỗi: ERR_PAGE_NOT_FOUND</span>
          <span>•</span>
          <span>RayID: 88f192b0c12</span>
          <span>•</span>
          <span>Server: sg-node-04.skillbridge.internal</span>
        </div>
      </div>
    </div>
  );
}
