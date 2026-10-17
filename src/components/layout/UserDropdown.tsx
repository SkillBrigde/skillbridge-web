"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  ChevronDown,
  Briefcase,
  ShieldAlert,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";

export interface UserDropdownProps {
  userAvatar: string | null;
}

export function UserDropdown({ userAvatar }: UserDropdownProps) {
  const router = useRouter();
  const { user, role, switchRole, upgradeToMentor, loginAs, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setDropdownOpen(false), dropdownOpen);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/[0.06] transition-colors"
      >
        <Avatar src={userAvatar || undefined} alt={user.name} size="sm" />
        <div className="hidden text-left md:block">
          <p className="text-xs font-medium text-[#F0F2F5] whitespace-nowrap">
            {user.name}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                role === "mentor"
                  ? "bg-[#7C87ED]"
                  : role === "admin"
                  ? "bg-[#FF5C5C]"
                  : "bg-[#27C98F]"
              }`}
            />
            <span className="text-[10px] font-mono text-[#5D6474] uppercase">
              {(role || "mentee").toUpperCase()}
            </span>
          </div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-[#5D6474] flex-shrink-0" />
      </button>

      {/* Dropdown popup */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/[0.1] bg-[#14171D] p-2 shadow-2xl backdrop-blur-xl z-50">
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <p className="text-sm font-semibold text-[#F0F2F5]">
              {user.name}
            </p>
            <p className="text-xs text-[#9BA1B0] truncate">
              {user.email}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] text-[#5D6474]">Đang đóng vai:</span>
              <span className="text-[11px] font-semibold text-[#27C98F]">
                {role === "mentee"
                  ? "Học viên (Mentee)"
                  : role === "mentor"
                  ? "Chuyên gia (Mentor)"
                  : "Quản trị viên (Admin)"}
              </span>
            </div>
          </div>

          {/* Switch role section */}
          <div className="p-1.5">
            <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
              Chuyển đổi vai trò
            </p>
            <button
              type="button"
              onClick={() => {
                switchRole("mentee");
                setDropdownOpen(false);
                router.push("/bookings");
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                role === "mentee"
                  ? "bg-[#1F2022] text-[#27C98F]"
                  : "text-[#9BA1B0] hover:bg-[#0D0E10] hover:text-[#F0F2F5]"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" />
              Giao diện Mentee (Học viên)
            </button>

            {user.mentorId ? (
              <button
                type="button"
                onClick={() => {
                  switchRole("mentor");
                  setDropdownOpen(false);
                  router.push("/mentor/studio");
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  role === "mentor"
                    ? "bg-[#1F2022] text-[#7C87ED]"
                    : "text-[#9BA1B0] hover:bg-[#0D0E10] hover:text-[#F0F2F5]"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                Giao diện Mentor (Chuyên gia)
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  upgradeToMentor();
                  switchRole("mentor");
                  setDropdownOpen(false);
                  router.push("/mentor/onboarding");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#F5A623] hover:bg-[#0D0E10] transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Đăng ký thành Mentor
              </button>
            )}

            {user.roles?.includes("admin") && (
              <button
                type="button"
                onClick={() => {
                  switchRole("admin");
                  setDropdownOpen(false);
                  router.push("/admin/disputes");
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  role === "admin"
                    ? "bg-[#1F2022] text-[#FF5C5C]"
                    : "text-[#9BA1B0] hover:bg-[#0D0E10] hover:text-[#F0F2F5]"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Bảng điều khiển Admin SLA
              </button>
            )}
          </div>

          {/* Switch quick demo account */}
          <div className="border-t border-white/[0.06] p-1.5">
            <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
              Đổi nhanh tài khoản demo
            </p>
            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                type="button"
                onClick={() => {
                  loginAs("u-linh");
                  setDropdownOpen(false);
                }}
                className="rounded bg-[#0D0E10] py-1 text-[10px] text-[#27C98F] hover:bg-[#1F2022]"
              >
                Linh
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs("u-an");
                  setDropdownOpen(false);
                }}
                className="rounded bg-[#0D0E10] py-1 text-[10px] text-[#7C87ED] hover:bg-[#1F2022]"
              >
                An (Mentor)
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAs("u-admin");
                  setDropdownOpen(false);
                }}
                className="rounded bg-[#0D0E10] py-1 text-[10px] text-[#FF5C5C] hover:bg-[#1F2022]"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-white/[0.06] p-1.5">
            <button
              type="button"
              onClick={() => {
                logout();
                setDropdownOpen(false);
                router.push("/");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
