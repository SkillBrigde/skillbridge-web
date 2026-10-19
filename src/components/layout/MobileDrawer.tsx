"use client";

import React, { useEffect } from "react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Search, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "@/constants/navigation";
import { useHydrated } from "@/lib/store";
import { useHydrated } from "@/lib/store";


export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  pathname: string;
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  badgeLabel: string;
  badgeAmount: string;
  badgeHref: string;
}

export function MobileDrawer({
  isOpen,
  onClose,
  navItems,
  pathname,
  searchVal,
  setSearchVal,
  onSearchSubmit,
  badgeLabel,
  badgeAmount,
  badgeHref,
}: MobileDrawerProps) {
  const mounted = useHydrated();
  const mounted = useHydrated();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Full-Screen Blocking Overlay (z-[9998]) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Mobile Navigation Drawer (100% Solid Background, z-[9999]) */}
      <aside
        style={{ backgroundColor: "#09090b", opacity: 1 }}
        className={`fixed top-0 left-0 bottom-0 z-[9999] w-72 max-w-[85vw] h-[100dvh] bg-[#09090b] border-r border-neutral-800 p-4 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-4">
          {/* Top Bar with Logo and Close button */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng menu"
              className="p-1.5 rounded-xl border border-white/[0.08] bg-[#14171D] text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Search Bar in Drawer */}
          <form
            onSubmit={(e) => {
              onSearchSubmit(e);
              onClose();
            }}
            className="md:hidden"
          >
            <div className="flex items-center gap-2 rounded-xl bg-[#14171D] border border-neutral-800 px-3 py-2 text-sm text-[#9BA1B0] w-full">
              <Search className="h-4 w-4 text-[#5D6474] flex-shrink-0" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Tìm mentor..."
                className="bg-transparent text-sm text-[#F0F2F5] placeholder:text-[#5D6474] focus:outline-none w-full"
              />
            </div>
          </form>

          {/* Navigation Links */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] px-3 py-1.5">
              Menu Điều Hướng
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#181926] text-white border border-[#5E6AD2] font-semibold"
                        : "text-[#9BA1B0] hover:text-white hover:bg-[#14171D]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#5E6AD2]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer: Escrow info & Quick role */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <Link
            href={badgeHref}
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl bg-[#03BD84]/15 border border-[#27C98F]/30"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#27C98F]" />
              <span className="text-xs font-mono uppercase text-[#27C98F]">{badgeLabel}</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">{badgeAmount}</span>
          </Link>
        </div>
      </aside>
    </>,
    document.body
  );
}
