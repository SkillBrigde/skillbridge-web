"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { Search, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/mentors", label: "Khám Phá Mentors" },
  { href: "/bookings", label: "Lịch Học Của Tôi" },
  { href: "/wallet", label: "Ví Escrow" },
  { href: "/mentor/studio", label: "Studio Mentor" },
  { href: "/admin/disputes", label: "Admin SLA" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-white/[0.08] bg-[#0B0C0E]/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Search Bar with ⌘K */}
          <div className="hidden md:flex items-center gap-2 rounded-xl bg-[#0D0E10] border border-white/[0.08] px-3 py-1.5 text-sm text-[#9BA1B0] transition-colors hover:border-white/[0.16] w-64">
            <Search className="h-4 w-4 text-[#5D6474]" />
            <input
              type="text"
              placeholder="Tìm kiếm mentor, kỹ năng..."
              className="bg-transparent text-sm text-[#F0F2F5] placeholder:text-[#5D6474] focus:outline-none w-full"
            />
            <kbd className="rounded bg-[#1F2022] border border-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-[#5D6474]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Center: Navigation Pill Bar */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-[#0D0E10]/80 border border-white/[0.06] p-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-[#1F2022] text-[#F0F2F5] shadow-sm border border-white/[0.08]"
                    : "text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#14171D]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Escrow Wallet Badge + Auth + Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Escrow Shield Badge */}
          <Link
            href="/wallet"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-[#03BD84]/10 border border-[#27C98F]/30 px-3 py-1.5 transition-colors hover:bg-[#03BD84]/15"
          >
            <ShieldCheck className="h-4 w-4 text-[#27C98F]" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#27C98F]">
                Escrow Bảo Đảm
              </span>
              <span className="text-xs font-mono font-medium text-[#F0F2F5]">
                2.500.000 ₫
              </span>
            </div>
          </Link>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="text-xs font-medium text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors px-2 py-1.5"
          >
            Đăng Nhập
          </Link>

          <Link href="/register">
            <Button variant="primary" size="sm" className="h-8 text-xs font-medium px-3.5">
              Đăng Ký
            </Button>
          </Link>

          {/* User Profile Avatar */}
          <Link
            href="/mentor/studio"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F2022] border border-white/[0.12] text-[#9BA1B0] hover:border-[#5E6AD2] hover:text-[#F0F2F5] transition-all ml-1"
            title="Tài khoản / Studio"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
