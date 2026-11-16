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
