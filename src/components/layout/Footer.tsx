<<<<<<< HEAD
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
=======
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
export function Footer() {
  return (
    <footer className="sb-footer">
      <div className="sb-container">
        <div className="sb-footer-main">
          <div>
            <Link href="/" aria-label="SkillBridge — Trang chủ">
              <Logo />
            </Link>
            <p>
              Kết nối kinh nghiệm.
              <br />
              Cùng nhau tiến xa hơn.
            </p>
          </div>
          <nav aria-label="Liên kết cuối trang">
            <Link href="/mentors">
              Khám phá mentor <ArrowUpRight size={15} />
            </Link>
            <Link href="/#cach-hoat-dong">Cách hoạt động</Link>
            <Link href="/register?role=mentor">Trở thành mentor</Link>
            <Link href="/#cau-hoi">Câu hỏi thường gặp</Link>
          </nav>
          <div className="sb-footer-note">
            MỘT GÓC NHÌN MỚI.
            <br />
            <span>MỘT BƯỚC TIẾN MỚI.</span>
          </div>
        </div>
        <div className="sb-footer-bottom">
          <span>© 2026 SkillBridge. Kết nối để phát triển.</span>
          <span>
            Được tạo nên cho những bước tiến có ý nghĩa.{" "}
            <span aria-hidden="true">↗</span>
          </span>
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
        </div>
      </div>
    </footer>
  );
}
