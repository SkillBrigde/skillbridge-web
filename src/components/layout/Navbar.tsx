"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/constants/navigation";

export interface NavbarProps {
  navItems: NavItem[];
}

export function Navbar({ navItems }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-[#0D0E10]/80 border border-white/[0.06] p-1 flex-shrink-0">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-2.5 lg:px-3 py-1.5 text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
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
  );
}
