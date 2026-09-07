import { SystemStatus } from "@/components/system-status";

const modules = [
  "Identity",
  "Profiles",
  "Catalog",
  "Booking",
  "Scheduling",
  "Payments",
  "Learning",
  "Messaging",
  "Reviews",
  "Recommendations",
];

const flow = [
  "Đăng ký",
  "Cập nhật hồ sơ",
  "Tìm mentor",
  "Đặt khóa học",
  "Thanh toán sandbox",
  "Học và nhắn tin",
  "Hoàn thành",
  "Đánh giá",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <nav className="nav" aria-label="Điều hướng chính">
          <a className="brand" href="#top" aria-label="SkillBridge trang chủ">
            <span className="brandMark">S</span>
            <span>SkillBridge</span>
          </a>
          <span className="badge">Sprint 0 · Walking skeleton</span>
        </nav>

        <div className="heroGrid" id="top">
          <div>
            <p className="eyebrow">Mentoring marketplace</p>
            <h1>Kết nối đúng mentor, xây dựng đúng lộ trình.</h1>
            <p className="lead">
              Bộ khung ban đầu đã nối Next.js với API .NET Modular Monolith và
              sẵn sàng tích hợp hạ tầng local.
            </p>
            <div className="actions">
              <a className="primary" href="#flow">
                Xem luồng demo
              </a>
              <a className="secondary" href="#architecture">
                Xem kiến trúc
              </a>
            </div>
          </div>
          <SystemStatus />
        </div>
      </section>

      <section className="section" id="flow">
        <p className="eyebrow">Luồng quan trọng</p>
        <h2>Từ nhu cầu học đến đánh giá mentor</h2>
        <ol className="flow">
          {flow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="architecture">
        <p className="eyebrow">Backend boundaries</p>
        <h2>Một ứng dụng triển khai, nhiều module nghiệp vụ độc lập</h2>
        <div className="moduleGrid">
          {modules.map((module) => (
            <article className="moduleCard" key={module}>
              <span className="moduleDot" />
              <h3>{module}</h3>
              <p>Sẵn sàng nhận vertical slice đầu tiên.</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
