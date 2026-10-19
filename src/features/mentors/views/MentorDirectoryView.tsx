"use client";
<<<<<<< HEAD

import { useState, useMemo, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Badge,
  Avatar,
  Button,
  EmptyState,
} from "@/components/ui";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { Star, BadgeCheck, Sparkles } from "lucide-react";
import { useAppState, useNow, publishedMentors, availableSlots } from "@/lib/store";
import { vndShort, slotDateLabel, slotTimeLabel } from "@/lib/domain";
import { MentorFilter } from "@/features/mentors/MentorFilter";
import { SKILL_SUGGESTIONS } from "@/constants/mentorFilters";

function MentorDirectoryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const state = useAppState();
  const now = useNow("minute");

  const [search, setSearch] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync initial query if URL changes
  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const allPublished = useMemo(() => publishedMentors(state), [state]);

  const filtered = useMemo(() => {
    return allPublished.filter((m) => {
      if (verifiedOnly && !m.isVerified) return false;

      if (activeCategory !== "Tất cả") {
        const matchesCategory =
          m.categories?.includes(activeCategory) ||
          m.skills?.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));
        if (!matchesCategory) return false;
      }

      if (priceFilter !== "all") {
        const minPrice = Math.min(...m.services.map((s) => s.priceVnd));
        if (priceFilter === "under_500" && minPrice > 500_000) return false;
        if (priceFilter === "500_to_1500" && (minPrice < 500_000 || minPrice > 1_500_000)) return false;
        if (priceFilter === "over_1500" && minPrice <= 1_500_000) return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const inName = m.fullName.toLowerCase().includes(q);
        const inRole = (m.title + " " + m.company).toLowerCase().includes(q);
        const inSkills = m.skills.some((s) => s.toLowerCase().includes(q));
        const inServices = m.services.some((s) => s.name.toLowerCase().includes(q));
        if (!inName && !inRole && !inSkills && !inServices) return false;
      }

      return true;
    });
  }, [allPublished, verifiedOnly, activeCategory, priceFilter, search]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageIndex = Math.min(currentPage, totalPages);
  const pagedMentors = filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Hero Section ── */}
      <section className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5E6AD2]/10 border border-[#5E6AD2]/25 text-[#7C87ED] text-xs font-medium mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bảo chứng 100% học phí qua Escrow Vault minh bạch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F0F2F5] mb-3">
          Kết nối 1-on-1 với Tech Lead &amp; Chuyên Gia Thực Chiến
        </h1>
        <p className="text-sm text-[#9BA1B0] mb-6 leading-relaxed max-w-xl mx-auto">
          Đặt lịch mentoring trực tiếp với các chuyên gia hàng đầu. Cam kết hoàn
          tiền 100% qua Smart Escrow nếu không hài lòng hoặc có vi phạm SLA.
        </p>
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Tìm kiếm mentor, kỹ năng, công nghệ..."
          suggestions={SKILL_SUGGESTIONS}
          onSuggestionClick={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          className="max-w-2xl mx-auto"
        />
      </section>

      {/* ── Filter Bar ── */}
      <MentorFilter
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setCurrentPage(1);
        }}
        priceFilter={priceFilter}
        onPriceFilterChange={(price) => {
          setPriceFilter(price);
          setCurrentPage(1);
        }}
        verifiedOnly={verifiedOnly}
        onVerifiedOnlyChange={(val) => {
          setVerifiedOnly(val);
          setCurrentPage(1);
        }}
      />

      {/* ── Mentor Grid or Empty ── */}
      {filtered.length === 0 ? (
        <div className="my-12">
          <EmptyState
            title="Không tìm thấy chuyên gia phù hợp"
            description="Hãy thử thay đổi từ khóa tìm kiếm, mức giá hoặc bỏ chọn lọc tích xanh để tìm thêm mentors."
            action={{
              label: "Xóa tất cả bộ lọc",
              onClick: () => {
                setSearch("");
                setActiveCategory("Tất cả");
                setPriceFilter("all");
                setVerifiedOnly(false);
              },
            }}
          />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {pagedMentors.map((mentor) => {
            const nextSlots = availableSlots(state, mentor.id, now || Date.now(), 1);
            const nextSlot = nextSlots[0];
            const nextSlotText = nextSlot
              ? `${slotTimeLabel(nextSlot.startMs, nextSlot.endMs)} ${slotDateLabel(nextSlot.startMs)}`
              : null;

            return (
              <div
                key={mentor.id}
                className="rounded-xl bg-[#14171D] border border-white/[0.08] p-5 transition-all hover:bg-[#171A21] hover:border-white/[0.14] group flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <Avatar
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      size="lg"
                      online={mentor.isOnline}
                      shape="rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-semibold text-[#F0F2F5] truncate">
                          {mentor.fullName}
                        </h3>
                        {mentor.isVerified && (
                          <BadgeCheck className="h-4 w-4 text-[#5E6AD2] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#9BA1B0] mt-0.5 truncate">
                        {mentor.title} @ {mentor.company} • {mentor.yearsOfExperience} YOE
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                        <span className="text-xs font-mono text-[#F0F2F5]">
                          {mentor.ratingAverage.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#5D6474]">
                          ({mentor.reviewCount} đánh giá) • {mentor.totalSessions} Buổi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {mentor.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-[#1F2022] px-2 py-0.5 text-[11px] font-mono text-[#9BA1B0] border border-white/[0.04]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Service tiers badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {mentor.services.map((s) => (
                      <Badge key={s.id} variant="neutral">
                        {s.name} ({vndShort(s.priceVnd)})
                      </Badge>
                    ))}
                  </div>

                  {/* Available slot */}
                  {nextSlotText ? (
                    <div className="mb-4">
                      <Badge variant="escrow" dot>
                        Trống: {nextSlotText}
                      </Badge>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <Badge variant="neutral">
                        Lịch theo yêu cầu
                      </Badge>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link href={`/mentors/${mentor.id}`}>
                  <Button variant="primary" size="sm" className="w-full">
                    Xem Hồ Sơ &amp; Đặt Lịch
                  </Button>
                </Link>
              </div>
            );
          })}
        </section>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Pagination
          currentPage={pageIndex}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export function MentorDirectoryView() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center font-mono text-sm text-[#9BA1B0]">
          Đang tải danh sách mentors...
        </div>
      }
    >
      <MentorDirectoryContent />
    </Suspense>
  );
}

=======
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Compass, Search, SlidersHorizontal } from "lucide-react";
const topics = [
  "Tất cả",
  "Backend",
  "Frontend",
  "Data",
  "Career",
  "Leadership",
];
function Directory() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") || "";
  const setQuery = (value: string) =>
    router.push(value ? "/mentors?q=" + encodeURIComponent(value) : "/mentors");
  return (
    <div className="sb-directory sb-container">
      <span className="sb-eyebrow">NHỮNG KẾT NỐI CÓ Ý NGHĨA</span>
      <h1>
        Đúng người.
        <br />
        <em>Đúng bước tiến.</em>
      </h1>
      <p>Khám phá góc nhìn mới cho điều bạn đang theo đuổi.</p>
      <form
        className="sb-directory-search"
        key={query}
        onSubmit={(event) => {
          event.preventDefault();
          const input = new FormData(event.currentTarget);
          setQuery(String(input.get("query") || "").trim());
        }}
      >
        <Search size={20} />
        <input
          type="search"
          name="query"
          defaultValue={query}
          aria-label="Tìm mentor theo kỹ năng hoặc lĩnh vực"
          placeholder="Bạn đang muốn phát triển điều gì?"
        />
        <button className="sb-button sb-button-small" type="submit">
          Tìm mentor <ArrowUpRight size={17} />
        </button>
      </form>
      <div className="sb-directory-filters">
        <span>
          <SlidersHorizontal size={16} /> Lĩnh vực
        </span>
        {topics.map((topic) => (
          <button
            type="button"
            aria-pressed={topic === "Tất cả" ? !query : query === topic}
            key={topic}
            onClick={() => setQuery(topic === "Tất cả" ? "" : topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      <section className="sb-directory-empty">
        <span className="sb-state-icon">
          <Compass size={32} />
        </span>
        <span className="sb-eyebrow">ĐANG CHUẨN BỊ NHỮNG KẾT NỐI ĐẦU TIÊN</span>
        <h2>Một cuộc gặp đáng chờ đợi.</h2>
        <p>
          Danh sách mentor đang được hoàn thiện. Bạn có thể tạo tài khoản trước,
          hoặc tham gia với vai trò mentor để chia sẻ kinh nghiệm của mình.
        </p>
        <Link className="sb-button" href="/register?role=mentor">
          Tham gia làm mentor <ArrowUpRight size={18} />
        </Link>
      </section>
    </div>
  );
}
export function MentorDirectoryView() {
  return (
    <Suspense fallback={<div className="sb-page-state">Đang tải…</div>}>
      <Directory />
    </Suspense>
  );
}
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
export { MentorDirectoryView as default };
