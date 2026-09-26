import Link from "next/link";
import { Clock, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const AVAILABLE_SLOTS = [
  { id: "slot-a", label: "19:30 – 20:30", sublabel: "Khóa lại ngay", available: true, primary: true },
  { id: "slot-b", label: "20:45 – 21:45", sublabel: "Thứ 6, 18/09", available: true, primary: false },
  { id: "slot-c", label: "09:00 – 10:00", sublabel: "Thứ 7, 19/09", available: true, primary: false },
];

export default function SlotExpiredPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#454652_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[500px]">
        {/* Card */}
        <Card className="p-0 overflow-hidden border-[#F5A623]/20">
          {/* Top amber glow */}
          <div className="h-1 bg-gradient-to-r from-[#F5A623] to-[#F5A623]/40" />

          <div className="p-6 sm:p-8 text-center">
            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 mx-auto mb-4">
              <Clock className="h-8 w-8 text-[#F5A623]" />
            </div>

            {/* Badge */}
            <Badge variant="pending" className="mb-4">
              REDIS ATOMIC LOCK EXPIRED
            </Badge>

            {/* Timer */}
            <div className="font-mono text-4xl font-bold text-[#F5A623]/40 mb-3 tracking-widest">
              00:00
            </div>

            {/* Title */}
            <h1 className="text-lg font-bold text-[#F0F2F5] tracking-tight mb-3">
              Khung Giờ Đã Hết Hạn Khóa Độc Quyền
            </h1>

            {/* Explanation */}
            <p className="text-xs text-[#9BA1B0] leading-relaxed mb-6">
              Thời hạn giữ chỗ 10 phút trên Redis cho khung giờ{" "}
              <span className="font-mono text-[#F5A623]">[19:30 – 20:30 Thứ 6, 18/09]</span>{" "}
              đã kết thúc. Để đảm bảo tính công bằng cho các học viên khác, slot này đã được giải phóng trở lại lịch trống.
            </p>

            {/* Availability Check */}
            <div className="rounded-xl bg-[#0F1115] border border-white/[0.06] p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C98F] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27C98F]" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#27C98F]">
                  Live Availability Check
                </span>
              </div>
              <p className="text-xs text-[#9BA1B0] mb-3">
                Slot này hiện vẫn còn trống hoặc bạn có thể chọn các khung giờ lân cận:
              </p>
              <div className="space-y-2">
                {AVAILABLE_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                      slot.primary
                        ? "bg-[#5E6AD2]/10 border border-[#5E6AD2]/30 text-[#BDC2FF] hover:bg-[#5E6AD2]/15"
                        : "bg-[#14171D] border border-white/[0.06] text-[#9BA1B0] hover:bg-[#1F2022] hover:text-[#F0F2F5]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-mono">{slot.label}</span>
                    </div>
                    <span className="text-[10px] text-[#5D6474]">
                      {slot.sublabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2">
              <Link href="/checkout/sb-2026-98124">
                <Button variant="primary" className="w-full" size="lg">
                  <RefreshCw className="h-4 w-4" />
                  Tiếp Tục Đặt Lại Khung Giờ Này
                </Button>
              </Link>
              <Link href="/mentors">
                <Button variant="ghost" className="w-full" size="md">
                  Quay Lại Trang Mentor
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Tech footer */}
        <div className="mt-6 text-center text-[10px] font-mono text-[#5D6474]/60">
          KEY: lock:slot:session_88192 • Policy: Zero Squatting • TTL: EX 600
        </div>
      </div>
    </div>
  );
}
