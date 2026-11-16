import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export function FeatureUnavailable() {
  return (
    <section className="sb-page-state">
      <span className="sb-state-icon">
        <Compass size={30} />
      </span>
      <span className="sb-eyebrow">MỘT TRẢI NGHIỆM ĐANG THÀNH HÌNH</span>
      <h1>Hẹn bạn ở bước tiếp theo.</h1>
      <p>
        Không gian này đang được hoàn thiện để mang đến trải nghiệm chỉn chu
        hơn. Bạn có thể khám phá SkillBridge hoặc tạo tài khoản trong lúc chờ.
      </p>
      <div className="sb-actions">
        <Link className="sb-button" href="/register">
          Tạo tài khoản
        </Link>
        <Link className="sb-button sb-button-secondary" href="/">
          <ArrowLeft size={17} /> Về trang chủ
        </Link>
      </div>
    </section>
  );
}
