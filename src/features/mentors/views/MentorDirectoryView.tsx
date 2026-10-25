"use client";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  Compass,
  Search,
  SlidersHorizontal,
  Star,
  Loader2,
} from "lucide-react";
import { searchPublicMentors } from "@/services/profiles.service";
import type { PublicMentorListItem } from "@/types/api";

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

  const [mentors, setMentors] = useState<PublicMentorListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    searchPublicMentors({
      searchTerm: query || undefined,
      page: 1,
      pageSize: 24,
    })
      .then((res) => {
        if (isMounted) {
          setMentors(res?.items ?? []);
        }
      })
      .catch(() => {
        if (isMounted) setMentors([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query]);

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

      {loading ? (
        <div className="flex items-center justify-center py-24 text-[var(--sb-muted)] gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--sb-purple)]" />
          <span>Đang tìm kiếm chuyên gia…</span>
        </div>
      ) : mentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {mentors.map((mentor) => (
            <Link
              key={mentor.id}
              href={`/mentors/${mentor.id}`}
              className="group block rounded-2xl border border-[var(--sb-line)] bg-white p-6 transition-all hover:border-[var(--sb-purple)] hover:shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#eee7f6] text-[var(--sb-purple)] font-semibold flex items-center justify-center text-lg flex-shrink-0">
                  {(mentor.fullName || mentor.headline || "M")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-medium text-[var(--sb-ink)] truncate text-base group-hover:text-[var(--sb-purple)] transition-colors">
                      {mentor.fullName || mentor.headline || "Mentor SkillBridge"}
                    </h3>
                    {mentor.verificationStatus === "Verified" && (
                      <BadgeCheck className="w-4 h-4 text-[var(--sb-purple)] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--sb-muted)] line-clamp-1 mt-0.5">
                    {mentor.fullName ? mentor.headline || "Chuyên gia Mentoring" : "Chuyên gia SkillBridge"}
                  </p>
                </div>
              </div>

              {mentor.skills && mentor.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.skills.slice(0, 3).map((s) => (
                    <span
                      key={s.id || s.skillName}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#faf9f6] text-[var(--sb-muted)] border border-[var(--sb-line)]"
                    >
                      {s.skillName}
                    </span>
                  ))}
                  {mentor.skills.length > 3 && (
                    <span className="text-[11px] px-2 py-0.5 text-[var(--sb-muted)]">
                      +{mentor.skills.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--sb-line)] text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#f5a623] text-[#f5a623]" />
                  <span className="font-semibold text-[var(--sb-ink)]">
                    {(mentor.ratingAverage || 0).toFixed(1)}
                  </span>
                  <span className="text-[var(--sb-muted)]">
                    ({mentor.totalReviews || 0})
                  </span>
                </div>
                <div className="font-medium text-[var(--sb-purple)] flex items-center gap-1">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: mentor.currency || "VND",
                  }).format(mentor.hourlyRate || 0)}
                  /giờ
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
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
