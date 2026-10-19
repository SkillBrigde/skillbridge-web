export interface NavItem {
  href: string;
  label: string;
}

export const MENTEE_NAV: NavItem[] = [
  { href: "/mentors", label: "Tìm Mentor" },
  { href: "/bookings", label: "Lịch học" },
  { href: "/wallet", label: "Ví cá nhân" },
];

export const MENTOR_NAV: NavItem[] = [
  { href: "/mentor/studio", label: "Dịch vụ" },
  { href: "/mentor/schedule", label: "Lịch dạy" },
  { href: "/mentor/wallet", label: "Doanh thu" },
  { href: "/mentor/reputation", label: "Đánh giá" },
  { href: "/mentors", label: "Tìm Mentor" },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin/disputes", label: "Tranh chấp SLA" },
  { href: "/admin/kyc", label: "Duyệt KYC" },
  { href: "/admin/escrow", label: "Sổ cái Escrow" },
  { href: "/mentors", label: "Sàn Mentors" },
];

export function getNavItemsForRole(role: string): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "mentor") return MENTOR_NAV;
  return MENTEE_NAV;
}
