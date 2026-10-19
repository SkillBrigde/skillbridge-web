"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShieldCheck, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { Navbar } from "./Navbar";
import { MobileDrawer } from "./MobileDrawer";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAppState, menteeEscrowSummary } from "@/lib/store";
import { vnd } from "@/lib/domain";
import { getNavItemsForRole } from "@/constants/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const state = useAppState();
  const { user, role, mentor, wallet } = useAuth();

  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset the drawer before rendering a new route.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setMobileMenuOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/mentors?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push("/mentors");
    }
  };

  // Role-based Nav items
  const activeRole = role || "mentee";
  const navItems = getNavItemsForRole(activeRole);

  // Escrow balance display
  let badgeLabel = "SỐ DƯ";
  let badgeAmount = "0 ₫";
  let badgeHref = "/wallet";

  if (user) {
    if (role === "mentor" && user.mentorId) {
      badgeLabel = "SỐ DƯ";
      badgeAmount = vnd(wallet);
      badgeHref = "/mentor/wallet";
    } else if (role === "admin") {
      const pendingTotal = state.bookings
        .filter((b) => b.escrow.state === "Holding")
        .reduce((sum, b) => sum + b.escrow.heldVnd, 0);
      badgeLabel = "KÝ QUỸ SLA";
      badgeAmount = vnd(pendingTotal);
      badgeHref = "/admin/escrow";
    } else {
      const summary = menteeEscrowSummary(state, user.id);
      badgeLabel = "SỐ DƯ";
      badgeAmount = vnd(summary.holding);
      badgeHref = "/wallet";
    }
  }

  const userAvatar = mentor?.avatarUrl || null;

  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full border-b border-white/[0.08] bg-[#0B0C0E]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-3">
          {/* Left: Hamburger Button + Brand + Search */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-5 flex-shrink-0">
            {/* Hamburger Toggle Button (lg:hidden) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Mở menu điều hướng"
              className="flex lg:hidden items-center justify-center p-2 rounded-xl border border-white/[0.08] bg-[#14171D] text-[#9BA1B0] hover:text-[#F0F2F5] hover:border-white/[0.16] transition-all flex-shrink-0"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Logo />
            </Link>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center">
              <div className="flex items-center gap-2 rounded-xl bg-[#14171D] border border-white/[0.08] px-3 py-1.5 text-sm text-[#9BA1B0] hover:border-white/[0.16] focus-within:border-[#5E6AD2]/60 focus-within:ring-1 focus-within:ring-[#5E6AD2]/30 transition-all w-48 lg:w-64">
                <Search className="h-3.5 w-3.5 text-[#5D6474] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Tìm mentor..."
                  className="bg-transparent text-xs text-[#F0F2F5] placeholder:text-[#5D6474] focus:outline-none w-full"
                />
                <kbd className="rounded bg-[#1F2022] border border-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-[#5D6474] flex-shrink-0">
                  ⌘K
                </kbd>
              </div>
            </form>
          </div>

          {/* Center: Navigation Pill Bar */}
          <Navbar navItems={navItems} />

          {/* Right: Escrow Wallet Badge + Auth / User Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Escrow Shield Badge */}
            <Link
              href={badgeHref}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-[#03BD84]/10 border border-[#27C98F]/30 px-2.5 py-1.5 transition-colors hover:bg-[#03BD84]/15 flex-shrink-0"
            >
              <ShieldCheck className="h-4 w-4 text-[#27C98F] flex-shrink-0" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#27C98F] whitespace-nowrap">
                  {badgeLabel}
                </span>
                <span className="text-xs font-mono font-medium text-[#F0F2F5] whitespace-nowrap">
                  {badgeAmount}
                </span>
              </div>
            </Link>

            {!user ? (
              /* Logged-out buttons */
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href="/login"
                  className="text-xs font-medium text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors px-2 py-1.5 whitespace-nowrap"
                >
                  Đăng Nhập
                </Link>

                <Link href="/register">
                  <Button variant="primary" size="sm" className="h-8 text-xs font-medium px-3.5 whitespace-nowrap">
                    Đăng Ký
                  </Button>
                </Link>
              </div>
            ) : (
              /* Logged-in Profile Menu */
              <UserDropdown userAvatar={userAvatar} />
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer & Backdrop Portaled outside <header> to escape stacking context */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        pathname={pathname}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        onSearchSubmit={handleSearchSubmit}
        badgeLabel={badgeLabel}
        badgeAmount={badgeAmount}
        badgeHref={badgeHref}
      />
    </>
  );
}
