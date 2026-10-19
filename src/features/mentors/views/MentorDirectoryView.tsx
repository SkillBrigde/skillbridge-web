"use client";
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
export { MentorDirectoryView as default };
