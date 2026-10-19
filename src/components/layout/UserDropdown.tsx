"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
export interface UserDropdownProps {
  userAvatar: string | null;
}
export function UserDropdown(props: UserDropdownProps) {
  void props;
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  if (!user) return null;
  const destination =
    role === "mentor"
      ? "/mentor/studio"
      : role === "admin"
        ? "/admin/disputes"
        : "/bookings";
  return (
    <div className="sb-user-menu" ref={ref}>
      <button
        className="sb-user-trigger"
        type="button"
        aria-expanded={open}
        aria-label="Menu tài khoản"
        onClick={() => setOpen(!open)}
      >
        <span className="sb-user-initial">{user.name.charAt(0)}</span>
        <span>{user.name}</span>
        <ChevronDown size={15} />
      </button>
      {open && (
        <div className="sb-user-popover">
          <strong>{user.name}</strong>
          <small>{user.email}</small>
          <Link href={destination} onClick={() => setOpen(false)}>
            Không gian của tôi
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
              router.push("/");
            }}
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
