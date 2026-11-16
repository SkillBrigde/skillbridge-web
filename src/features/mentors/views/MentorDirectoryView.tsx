"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  Compass,
  Search,
  SlidersHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { MentorCard } from "@/components/mentor-card";
import { mentorService, type MentorListItemDto } from "@/services/mentorService";
import { catalogService, type CategoryDto } from "@/services/catalogService";
import { useAppState, publishedMentors } from "@/lib/store";
import { vnd } from "@/lib/domain";

const DEFAULT_TOPICS = [
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
  const state = useAppState();

  const [search, setSearch] = useState(initialQuery);
  const [previousQuery, setPreviousQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  if (previousQuery !== initialQuery) {
    setPreviousQuery(initialQuery);
    setSearch(initialQuery);
    setCurrentPage(1);
  }

  // Fetch mentors from API with fallback to seed data
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await mentorService.searchMentors({
          searchTerm: query || undefined,
          sortBy: "rating",
          sortDesc: true,
          page: 1,
          pageSize: 20,
        });

        if (ignore) return;

        if (res && res.items && res.items.length > 0) {
          setMentors(res.items);
          setIsUsingFallback(false);
        } else {
          // Fallback to seed state if no items returned from fresh DB
          const fallbackList = publishedMentors(state).filter((m) => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
              m.fullName.toLowerCase().includes(q) ||
              m.title.toLowerCase().includes(q) ||
              m.skills.some((s) => s.toLowerCase().includes(q))
            );
          });

          if (fallbackList.length > 0) {
            setMentors(
              fallbackList.map((m) => ({
                id: m.id,
                fullName: m.fullName,
                headline: `${m.title} tại ${m.company}`,
                hourlyRate: m.services[0]?.priceVnd || 500000,
                currency: "VND",
                ratingAverage: m.ratingAverage,
                totalReviews: m.reviewCount,
                verificationStatus: m.isVerified ? "Verified" : "Unverified",
                avatarUrl: m.avatarUrl,
              })),
            );
            setIsUsingFallback(true);
          } else {
            setMentors([]);
          }
        }
      } catch {
        if (ignore) return;
        // Offline fallback
        const fallbackList = publishedMentors(state);
        setMentors(
          fallbackList.map((m) => ({
            id: m.id,
            fullName: m.fullName,
            headline: `${m.title} tại ${m.company}`,
            hourlyRate: m.services[0]?.priceVnd || 500000,
            currency: "VND",
            ratingAverage: m.ratingAverage,
            totalReviews: m.reviewCount,
            verificationStatus: m.isVerified ? "Verified" : "Unverified",
            avatarUrl: m.avatarUrl,
          })),
        );
        setIsUsingFallback(true);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [query, state, refreshTick]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setRefreshTick((t) => t + 1);
  }, []);

  return (
    <div className="sb-directory sb-container">
      <span className="sb-eyebrow">NHỮNG KẾT NỐI CÓ Ý NGHĨA</span>
      <h1>
        Đúng người.
        <br />
        <em>Đúng bước tiến.</em>
      </h1>
      <p>Khám phá góc nhìn mới cho điều bạn đang theo đuổi.</p>

      {/* Search Form */}
      <form
        className="sb-directory-search"
        key={query}
        onSubmit={(event) => {
          event.preventDefault();
          const input = new FormData(event.currentTarget);
          setQuery(String(input.get("query") || "").trim());
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
            const nextSlots = availableSlots(state, mentor.id, now, 1);
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

      {/* Filters */}
      <div className="sb-directory-filters">
        <span>
          <SlidersHorizontal size={16} /> Lĩnh vực
        </span>
        {categories.map((topic) => (
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

      {isUsingFallback && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs mb-6">
          <span>
            Đang hiển thị danh sách chuyên gia mẫu. Kết nối trực tiếp máy chủ để đồng bộ dữ liệu thời gian thực.
          </span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            <RefreshCw size={13} /> Thử lại
          </button>
        </div>
      )}

      {/* Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#5e5866]">
          <Loader2 className="h-8 w-8 animate-spin text-[#6551a4]" />
          <p className="text-sm">Đang tải danh sách chuyên gia...</p>
        </div>
      ) : mentors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              name={mentor.fullName || mentor.headline || "Chuyên gia SkillBridge"}
              avatarSrc={mentor.avatarUrl}
              verified={mentor.verificationStatus === "Verified"}
              online={true}
              role={mentor.headline}
              rating={mentor.ratingAverage || 5.0}
              reviewCount={mentor.totalReviews || 0}
              sessionCount={mentor.totalReviews ? mentor.totalReviews * 2 : 12}
              services={[
                {
                  label: "Gói tư vấn",
                  price: vnd(mentor.hourlyRate || 500000),
                },
              ]}
              availableSlot="Có lịch tuần này"
              onViewProfile={() => router.push(`/mentors/${mentor.id}`)}
            />
          ))}
        </div>
      ) : (
        <section className="sb-directory-empty">
          <span className="sb-state-icon">
            <Compass size={32} />
          </span>
          <span className="sb-eyebrow">CHƯA TÌM THẤY KẾT QUẢ PHÙ HỢP</span>
          <h2>Không tìm thấy mentor nào phù hợp</h2>
          <p>
            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách chuyên gia.
          </p>
          <button className="sb-button" onClick={() => setQuery("")}>
            Xem tất cả mentor <ArrowUpRight size={18} />
          </button>
        </section>
      )}
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

export { MentorDirectoryView as default };
