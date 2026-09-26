"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Star,
  BadgeCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Chip, Currency } from "@/components/ui";
import { MOCK_MENTORS } from "@/lib/mock-data";
import type { MentorProfile } from "@/types/mentor";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "backend", label: "Backend" },
  { id: "cloud", label: "Cloud & DevOps" },
  { id: "mobile", label: "Mobile" },
  { id: "ai", label: "AI / ML" },
  { id: "frontend", label: "Frontend" },
];

const SEARCH_CHIPS = [
  "System Design",
  ".NET 10",
  "DevOps AWS",
  "Frontend Next.js",
  "Kafka",
  "Kubernetes",
];

function MentorCard({ mentor }: { mentor: MentorProfile }) {
  return (
    <Link href={`/mentors/${mentor.id}`}>
      <Card hoverable className="p-0 h-full flex flex-col overflow-hidden group">
        {/* Top: Avatar + Basic Info */}
        <div className="p-5 pb-4 flex items-start gap-4">
          <Avatar
            size="lg"
            alt={mentor.fullName}
            online={mentor.isOnline}
            shape="rounded"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-sm font-semibold text-[#F0F2F5] truncate">
                {mentor.fullName}
              </h3>
              {mentor.isVerified && (
                <BadgeCheck className="h-4 w-4 text-[#5E6AD2] flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-[#9BA1B0] truncate">
              {mentor.title} • {mentor.yearsOfExperience} YOE
            </p>
            {/* Rating Row */}
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#9BA1B0]">
              <Star className="h-3 w-3 fill-[#F5A623] text-[#F5A623]" />
              <span className="font-mono text-[#F0F2F5] font-medium">
                {mentor.ratingAverage}
              </span>
              <span>({mentor.reviewCount} reviews)</span>
              <span className="text-white/10">•</span>
              <span>{mentor.totalSessions} Sessions</span>
            </div>
          </div>
        </div>

        {/* Service Badges */}
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {mentor.services.map((svc) => (
            <span
              key={svc.id}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono border ${
                svc.isFeatured
                  ? "bg-[#5E6AD2]/10 text-[#BDC2FF] border-[#5E6AD2]/25"
                  : "bg-[#0F1115] text-[#9BA1B0] border-white/[0.06]"
              }`}
            >
              {svc.name.length > 18
                ? svc.name.substring(0, 18) + "…"
                : svc.name}
              <span className="text-[#5D6474]">
                ({new Intl.NumberFormat("vi-VN").format(svc.priceVnd / 1000)}k)
              </span>
            </span>
          ))}
        </div>

        {/* Bottom: Availability + CTA */}
        <div className="mt-auto border-t border-white/[0.06] px-5 py-3 flex items-center justify-between gap-2">
          {mentor.nextAvailableSlot && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#27C98F]">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{mentor.nextAvailableSlot}</span>
            </div>
          )}
          <span className="text-[11px] text-[#5E6AD2] font-medium ml-auto group-hover:translate-x-0.5 transition-transform">
            Xem Hồ Sơ & Đặt Lịch →
          </span>
        </div>
      </Card>
    </Link>
  );
}

export default function MentorsPage() {
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <Badge variant="brand" dot pulse className="mb-4">
          200+ Mentors Verified
        </Badge>
        <h1 className="text-2xl sm:text-3xl lg:text-display-lg font-bold text-[#F0F2F5] tracking-tight mb-3">
          Kết nối 1-on-1 với Tech Lead
          <br className="hidden sm:block" />
          <span className="text-[#5E6AD2]"> & Chuyên Gia Thực Chiến</span>
        </h1>
        <p className="text-sm text-[#9BA1B0] leading-relaxed mb-6 max-w-xl mx-auto">
          Tìm chuyên gia phù hợp, đặt lịch minh bạch với Escrow bảo vệ 100%.
          Cam kết hoàn tiền nếu không hài lòng.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="flex items-center gap-2 rounded-2xl bg-[#14171D] border border-white/[0.08] px-4 py-3 transition-all focus-within:border-[#5E6AD2]/60 focus-within:shadow-[0_0_0_1px_rgba(94,106,210,0.25)]">
            <Search className="h-5 w-5 text-[#5D6474] flex-shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm mentor, kỹ năng, công ty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#F0F2F5] placeholder:text-[#5D6474] focus:outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 rounded-lg bg-[#0F1115] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-[#5D6474]">
              Ctrl+K
            </kbd>
          </div>
          {/* Auto-complete chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            {SEARCH_CHIPS.map((chip) => (
              <Chip
                key={chip}
                variant="tag"
                onClick={() => setSearchQuery(chip)}
                active={searchQuery === chip}
              >
                {chip}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
                activeCategory === cat.id
                  ? "bg-[#5E6AD2] text-white shadow-sm shadow-[#5E6AD2]/20"
                  : "bg-[#14171D] text-[#9BA1B0] hover:text-[#F0F2F5] hover:bg-[#1F2022] border border-white/[0.08]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Verified toggle */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-[#1F2022] border border-white/[0.12] transition-colors peer-checked:bg-[#5E6AD2] peer-checked:border-[#5E6AD2]" />
              <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[#9BA1B0] transition-all peer-checked:translate-x-4 peer-checked:bg-white" />
            </div>
            <span className="text-xs text-[#9BA1B0] flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-[#5E6AD2]" />
              Verified Mentor
            </span>
          </label>

          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Bộ lọc</span>
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#9BA1B0]">
          Hiển thị <span className="text-[#F0F2F5] font-medium">{MOCK_MENTORS.length}</span> mentors
        </p>
        <p className="text-[11px] font-mono text-[#5D6474]">
          Sắp xếp: Đánh giá cao nhất
        </p>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_MENTORS.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-10">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5D6474] hover:bg-[#14171D] hover:text-[#F0F2F5] transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              page === 1
                ? "bg-[#5E6AD2] text-white shadow-sm"
                : "text-[#9BA1B0] hover:bg-[#14171D] hover:text-[#F0F2F5]"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5D6474] hover:bg-[#14171D] hover:text-[#F0F2F5] transition-colors cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
