"use client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="sb-page-state">
      <span className="sb-state-icon">
        <RefreshCw size={28} />
      </span>
      <span className="sb-eyebrow">MỘT CHÚT GIÁN ĐOẠN</span>
      <h1>Thử lại một lần nữa nhé.</h1>
      <p>
        Trang chưa thể tải lúc này. Bạn có thể thử lại hoặc quay về trang chủ.
      </p>
      <div className="sb-actions">
        <button className="sb-button" type="button" onClick={reset}>
          <RefreshCw size={17} /> Thử lại
        </button>
        <Link className="sb-button sb-button-secondary" href="/">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
