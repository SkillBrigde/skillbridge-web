import React from "react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#0B0C0E] py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row text-xs text-[#5D6474]">
        {/* Live System Telemetry */}
        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C98F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27C98F]"></span>
            </span>
            <span className="text-[#9BA1B0]">
              Smart Contract Escrow v2.4 Active (0 SLA Disputes)
            </span>
          </div>
          <span className="text-white/20">•</span>
          <span className="text-[#5D6474]">SLA Lock Response: &lt; 15m</span>
        </div>

        {/* Legal & Compliance */}
        <div>
          © 2026 SkillBridge Technologies Inc. Tuân thủ tiêu chuẩn ký quỹ bảo mật P2P.
        </div>
      </div>
    </footer>
  );
}
