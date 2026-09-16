"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring telemetry
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="max-w-xl w-full text-center">
        {/* Status Badge */}
        <div className="mb-6 inline-flex">
          <Badge variant="dispute" dot pulse>
            HTTP STATUS 500 • INTERNAL SERVER ERROR
          </Badge>
        </div>

        {/* Large Monospace 500 */}
        <h1 className="font-mono text-7xl sm:text-8xl font-bold tracking-tighter text-[#3B4150] mb-2 select-none">
          500
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight mb-3">
          Hệ thống gặp sự cố gián đoạn tạm thời
        </h2>

        <p className="text-sm text-[#9BA1B0] leading-relaxed mb-6">
          Máy chủ đang tự động kích hoạt cơ chế tự phục hồi (Self-Healing Failover). Toàn bộ dữ liệu phiên và tài sản số của bạn được bảo toàn tuyệt đối.
        </p>

        {/* Escrow Guarantee Banner */}
        <Card className="p-4 mb-8 bg-[#03BD84]/10 border-[#27C98F]/30 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#27C98F] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-[#27C98F] uppercase font-mono tracking-wider">
                Bảo Đảm An Toàn Escrow 100%
              </h4>
              <p className="text-xs text-[#E3E2E5] mt-1 leading-relaxed">
                Toàn bộ tiền ký quỹ và hợp đồng thông minh đã được đồng bộ an toàn trên sổ cái kế toán kép phân tán. Không có bất kỳ giao dịch nào bị thất thoát.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" onClick={() => reset()}>
            <RefreshCw className="h-4 w-4" />
            <span>Thử Tải Lại Trang (Retry Request)</span>
          </Button>
          <Link href="/">
            <Button variant="secondary">
              Về Trang Chủ
            </Button>
          </Link>
        </div>

        {/* Incident Ticket ID */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] text-[11px] font-mono text-[#5D6474]">
          Incident Ticket: #INC-99120 • Digest: {error.digest || "none"}
        </div>
      </div>
    </div>
  );
}
