"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/hooks/useAuth";
export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);
  if (previousPath !== pathname) {
    setPreviousPath(pathname);
    setOpen(false);
  }
  const close = () => setOpen(false);
  return (
    <header className="sb-header">
      <div className="sb-container sb-header-inner">
        <Link href="/" aria-label="SkillBridge — Trang chủ" onClick={close}>
          <Logo />
        </Link>
        <nav aria-label="Điều hướng chính" className="sb-desktop-nav">
          <Link
            href="/mentors"
            aria-current={pathname === "/mentors" ? "page" : undefined}
          >
            Khám phá mentor
          </Link>
          <Link href="/#cach-hoat-dong">Cách hoạt động</Link>
          <Link href="/#cho-mentor">Dành cho mentor</Link>
        </nav>
        <div className="sb-header-actions">
          {user ? (
            <UserDropdown userAvatar={null} />
          ) : (
            <>
              <Link href="/login" className="sb-login-link">
                Đăng nhập
              </Link>
              <Link className="sb-button sb-button-small" href="/register">
                Bắt đầu <ArrowUpRight size={16} />
              </Link>
            </>
          )}
          <button
            className="sb-mobile-toggle"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          className="sb-mobile-nav"
          id="mobile-nav"
          aria-label="Điều hướng trên điện thoại"
        >
          <Link onClick={close} href="/mentors">
            Khám phá mentor <ArrowUpRight size={18} />
          </Link>
          <Link onClick={close} href="/#cach-hoat-dong">
            Cách hoạt động
          </Link>
          <Link onClick={close} href="/#cho-mentor">
            Dành cho mentor
          </Link>
          {!user && (
            <Link onClick={close} href="/login">
              Đăng nhập
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
