"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Avatar,
  Button,
  Checkbox,
} from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Star, BadgeCheck, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const SKILL_SUGGESTIONS = [
  "System Design",
  ".NET 10",
  "DevOps AWS",
  "Frontend Next.js",
  "Kafka",
  "PostgreSQL",
  "AI/ML",
];

const CATEGORIES = [
  "Tất cả",
  "Backend",
  "Cloud & DevOps",
  "Mobile",
  "AI/ML",
  "Frontend",
  "Data Engineering",
];

const MENTORS = [
  {
    id: "mentor-an-nguyen",
    name: "Nguyễn Văn An",
    role: "Tech Lead @ VNG • 9 YOE",
    rating: 4.98,
    reviews: 142,
    sessions: 218,
    verified: true,
    online: true,
    services: [
      { label: "Review CV", price: "300k" },
      { label: "Mock Interview", price: "450k" },
      { label: "Lộ Trình 1 Tháng", price: "2Tr" },
    ],
    availableSlot: "19:30 Thứ 6",
  },
  {
    id: "mentor-hoang-nam",
    name: "Lê Hoàng Nam",
    role: "Staff Engineer @ Techcombank • 12 YOE",
    rating: 4.95,
    reviews: 89,
    sessions: 156,
    verified: true,
    online: false,
    services: [
      { label: "Review System Design", price: "500k" },
      { label: "Career Coaching", price: "400k" },
      { label: "Mentoring 1 Tháng", price: "1.8Tr" },
    ],
    availableSlot: "09:00 Thứ 7",
  },
  {
    id: "mentor-thanh-tung",
    name: "Trần Thanh Tùng",
    role: "Cloud Architect @ FPT Software • 8 YOE",
    rating: 4.92,
    reviews: 67,
    sessions: 124,
    verified: true,
    online: true,
    services: [
      { label: "AWS Solutions", price: "550k" },
      { label: "DevOps Pipeline", price: "450k" },
      { label: "Cloud Migration", price: "2.5Tr" },
    ],
    availableSlot: "20:00 Thứ 4",
  },
  {
    id: "mentor-minh-chau",
    name: "Phạm Minh Châu",
    role: "Engineering Manager @ Momo • 10 YOE",
    rating: 4.89,
    reviews: 53,
    sessions: 98,
    verified: false,
    online: false,
    services: [
      { label: "Mock Interview", price: "400k" },
      { label: "Leadership Coaching", price: "600k" },
    ],
    availableSlot: "14:00 Thứ 7",
  },
  {
    id: "mentor-duc-anh",
    name: "Vũ Đức Anh",
    role: "Senior ML Engineer @ VinAI • 6 YOE",
    rating: 4.96,
    reviews: 45,
    sessions: 82,
    verified: true,
    online: true,
    services: [
      { label: "ML System Design", price: "500k" },
      { label: "Research Paper Review", price: "350k" },
      { label: "AI Career Path", price: "1.5Tr" },
    ],
    availableSlot: "19:00 Thứ 5",
  },
  {
    id: "mentor-thu-ha",
    name: "Ngô Thu Hà",
    role: "Mobile Lead @ Tiki • 7 YOE",
    rating: 4.91,
    reviews: 38,
    sessions: 71,
    verified: true,
    online: false,
    services: [
      { label: "Flutter Review", price: "300k" },
      { label: "App Architecture", price: "450k" },
    ],
    availableSlot: "10:00 Thứ 7",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MENTORS.filter((m) => {
    if (verifiedOnly && !m.verified) return false;
    if (activeCategory !== "Tất cả") {
      // Simple category matching for demo
      return true;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.services.some((s) => s.label.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Hero Section ── */}
      <section className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F0F2F5] mb-3">
          Kết nối 1-on-1 với Tech Lead &amp; Chuyên Gia Thực Chiến
        </h1>
        <p className="text-sm text-[#9BA1B0] mb-6 leading-relaxed max-w-xl mx-auto">
          Đặt lịch mentoring trực tiếp với các chuyên gia hàng đầu. Cam kết hoàn
          tiền 100% qua Smart Escrow nếu không hài lòng.
        </p>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm kiếm mentor, kỹ năng, công nghệ..."
          suggestions={SKILL_SUGGESTIONS}
          onSuggestionClick={setSearch}
          className="max-w-2xl mx-auto"
        />
      </section>

      {/* ── Filter Bar ── */}
      <section className="flex flex-wrap items-center gap-3 mb-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer select-none ${
                activeCategory === cat
                  ? "bg-[#5E6AD2] text-white border border-[#5E6AD2] shadow-sm shadow-[#5E6AD2]/20"
                  : "bg-[#14171D] text-[#9BA1B0] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#F0F2F5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price range */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171D] text-[#9BA1B0] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#F0F2F5] transition-all cursor-pointer">
          Mức giá
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Availability */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171D] text-[#9BA1B0] border border-white/[0.08] hover:border-white/[0.14] hover:text-[#F0F2F5] transition-all cursor-pointer">
          Lịch trống
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Verified only checkbox */}
        <Checkbox
          label="Chỉ hiện Verified Mentor (Tích Xanh)"
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
          className="ml-auto"
        />
      </section>

      {/* ── Mentor Grid ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {filtered.map((mentor) => (
          <div
            key={mentor.id}
            className="rounded-xl bg-[#14171D] border border-white/[0.08] p-5 transition-all hover:bg-[#171A21] hover:border-white/[0.14] group"
          >
            {/* Header */}
            <div className="flex items-start gap-3.5 mb-3.5">
              <Avatar
                alt={mentor.name}
                size="lg"
                online={mentor.online}
                shape="rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-semibold text-[#F0F2F5] truncate">
                    {mentor.name}
                  </h3>
                  {mentor.verified && (
                    <BadgeCheck className="h-4 w-4 text-[#5E6AD2] flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-[#9BA1B0] mt-0.5">{mentor.role}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="text-xs font-mono text-[#F0F2F5]">
                    {mentor.rating.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#5D6474]">
                    ({mentor.reviews} reviews) • {mentor.sessions} Sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Service badges */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {mentor.services.map((s) => (
                <Badge key={s.label} variant="neutral">
                  {s.label} ({s.price})
                </Badge>
              ))}
            </div>

            {/* Available slot */}
            {mentor.availableSlot && (
              <div className="mb-3.5">
                <Badge variant="escrow" dot>
                  Trống {mentor.availableSlot}
                </Badge>
              </div>
            )}

            {/* CTA */}
            <Link href={`/mentors/${mentor.id}`}>
              <Button variant="primary" size="sm" className="w-full">
                Xem Hồ Sơ &amp; Đặt Lịch
              </Button>
            </Link>
          </div>
        ))}
      </section>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={3}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
