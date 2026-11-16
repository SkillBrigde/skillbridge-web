import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <section className="sb-page-state">
      <span className="sb-state-icon">
        <Compass size={30} />
      </span>
      <span className="sb-eyebrow">404 / ĐƯỜNG DẪN CHƯA ĐƯỢC TÌM THẤY</span>
      <h1>Có lẽ bạn đã đi hơi xa.</h1>
      <p>
        Trang này không tồn tại hoặc đã đổi địa chỉ. Cùng quay lại và bắt đầu từ
        một hướng đi mới.
      </p>
      <Link className="sb-button" href="/">
        <ArrowLeft size={17} /> Về trang chủ
      </Link>
    </section>
  );
}
