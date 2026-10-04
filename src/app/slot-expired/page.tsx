import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { Clock, RefreshCw } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const EXPIRED_SLOT = "19:30 - 20:30 Thứ 6, 18/09";

const AVAILABLE_SLOTS = [
  { id: "s1", label: "19:30 - 20:30", note: "Khóa lại ngay", primary: true },
  { id: "s2", label: "20:45 - 21:45", note: null, primary: false },
  { id: "s3", label: "09:00 - 10:00 (Thứ 7)", note: null, primary: false },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function SlotExpiredPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="w-full max-w-[500px] rounded-xl bg-[#14171D] border border-[#F5A623]/20 p-8 text-center">
        {/* Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 mb-4">
          <Clock className="h-8 w-8 text-[#F5A623]" />
        </div>

        {/* Badge */}
        <div className="mb-4">
          <Badge variant="pending" dot>
            REDIS ATOMIC LOCK EXPIRED
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight mb-3">
          Khung Giờ Đã Hết Hạn Khóa Độc Quyền
        </h1>

        {/* Explanation */}
        <p className="text-sm text-[#9BA1B0] leading-relaxed mb-6">
          Thời hạn giữ chỗ 10 phút trên Redis cho khung giờ{" "}
          <span className="font-mono text-[#F5A623]">[{EXPIRED_SLOT}]</span>{" "}
          đã kết thúc. Để đảm bảo tính công bằng cho các học viên khác, slot
          này đã được giải phóng trở lại lịch trống.
        </p>

        {/* Live Availability */}
        <div className="text-left mb-6">
          <p className="text-xs text-[#5D6474] mb-3">
            Slot này hiện vẫn còn trống hoặc bạn có thể chọn các khung giờ lân
            cận:
          </p>
          <div className="space-y-2">
            {AVAILABLE_SLOTS.map((slot) => (
              <button
                key={slot.id}
                className={`w-full flex items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all cursor-pointer ${
                  slot.primary
                    ? "bg-[#5E6AD2]/8 border-[#5E6AD2]/30 text-[#F0F2F5] hover:bg-[#5E6AD2]/15"
                    : "bg-[#0D0E10] border-white/[0.08] text-[#9BA1B0] hover:border-white/[0.16] hover:text-[#F0F2F5]"
                }`}
              >
                <span className="font-mono text-xs">{slot.label}</span>
                {slot.note && (
                  <Badge variant="escrow">{slot.note}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button variant="primary" size="lg" className="w-full mb-3">
          <RefreshCw className="h-4 w-4" />
          Tiếp Tục Đặt Lại Khung Giờ Này
        </Button>

        <Link href="/mentors">
          <Button variant="ghost" size="sm" className="w-full">
            Quay lại danh sách Mentors
          </Button>
        </Link>
      </div>
    </div>
  );
}
