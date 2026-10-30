"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const query = params.get("q") || "";
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState<MentorListItemDto[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_TOPICS);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const setQuery = (value: string) =>
    router.push(value ? "/mentors?q=" + encodeURIComponent(value) : "/mentors");

  // Load categories from API
  useEffect(() => {
    catalogService
      .getCategories()
      .then((cats: CategoryDto[]) => {
        if (cats && cats.length > 0) {
          const names = ["Tất cả", ...cats.map((c) => c.name)];
          setCategories(names);
        }
      })
      .catch(() => {
        // Keep DEFAULT_TOPICS
      });
  }, []);

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
