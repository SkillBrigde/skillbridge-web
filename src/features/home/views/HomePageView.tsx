import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { areas, questions } from "../content/home-content";
import { HomeHeroArtwork } from "../components/HomeHeroArtwork";
import { HomeGoalSelector } from "../components/HomeGoalSelector";
import { HomeQuoteRotator } from "../components/HomeQuoteRotator";

export function HomePageView() {
  return (
    <div className="sb-home">
      <section className="sb-hero sb-container" aria-labelledby="home-title">
        <div className="sb-hero-copy">
          <span className="sb-eyebrow sb-hero-eyebrow">
            <span className="sb-dot" /> KẾT NỐI KINH NGHIỆM. MỞ LỐI TIẾN XA.
          </span>
          <h1 id="home-title">
            Đi xa hơn.
            <br />
            Cùng người
            <br />
            <em>đã đi qua.</em>
            <span className="sb-heading-star" aria-hidden="true">
              <Asterisk />
            </span>
          </h1>
          <p className="sb-hero-description">
            Một góc nhìn mới có thể mở ra cả một hướng đi.
            <br className="sb-desktop-break" /> Kết nối 1:1 với mentor, tháo gỡ
            điều đang vướng
            <br className="sb-desktop-break" /> và tự tin tiến đến mục tiêu của
            bạn.
          </p>
          <div className="sb-actions">
            <Link href="/mentors" className="sb-button">
              Khám phá mentor <ArrowUpRight size={18} />
            </Link>
            <a className="sb-text-link" href="#cach-hoat-dong">
              Cách SkillBridge hoạt động <ArrowRight size={16} />
            </a>
          </div>
          <div className="sb-hero-note">
            <span>
              <Check size={14} /> Theo mục tiêu của bạn
            </span>
            <span>
              <Check size={14} /> Trao đổi 1:1
            </span>
            <span>
              <Check size={14} /> Góc nhìn thực tế
            </span>
          </div>
        </div>
        <div className="sb-hero-art">
          <div className="sb-art-topline">
            <span>YOUR NEXT CHAPTER</span>
            <MoveUpRight size={19} />
          </div>
          <HomeHeroArtwork />
          <HomeGoalSelector />
        </div>
        <a className="sb-scroll-cue" href="#linh-vuc">
          <span>KHÁM PHÁ NHỮNG KHẢ NĂNG</span>
          <ArrowDown size={15} />
        </a>
      </section>

      <HomeQuoteRotator />

      <section className="sb-section sb-container" id="linh-vuc" data-reveal>
        <div className="sb-section-heading">
          <div>
            <span className="sb-eyebrow">BẮT ĐẦU TỪ ĐIỀU BẠN QUAN TÂM</span>
            <h2>
              Bước tiến của bạn,
              <br />
              bắt đầu từ đâu?
            </h2>
          </div>
          <p>
            Một vấn đề cụ thể hay một định hướng dài hạn.
            <br />
            Luôn có một góc nhìn đáng để khám phá.
          </p>
        </div>
        <div className="sb-area-grid">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <Link
                href={"/mentors?q=" + area.query}
                key={area.number}
                className={"sb-area sb-area-" + area.theme}
              >
                <div className="sb-area-top">
                  <span>{area.number}</span>
                  <ArrowUpRight size={23} />
                </div>
                <div className="sb-area-symbol" aria-hidden="true">
                  <Icon strokeWidth={1.1} />
                </div>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="sb-process-section" id="cach-hoat-dong">
        <div className="sb-container sb-process" data-reveal>
          <div className="sb-process-intro">
            <span className="sb-eyebrow">
              ÍT MƠ HỒ HƠN. NHIỀU ĐỊNH HƯỚNG HƠN.
            </span>
            <h2>
              Một kết nối.
              <br />
              Một khởi đầu mới.
            </h2>
            <p>
              Mentoring bắt đầu bằng việc lắng nghe.
              <br />
              Từ câu chuyện của bạn, đến bước tiếp theo
              <br />
              mà bạn có thể chủ động thực hiện.
            </p>
            <a href="#cau-hoi" className="sb-text-link">
              Tìm hiểu thêm <ArrowRight size={17} />
            </a>
            <div className="sb-process-mark" aria-hidden="true">
              <Route />
              <span>
                A LITTLE DIRECTION.
                <br />A BIG DIFFERENCE.
              </span>
            </div>
          </div>
          <div className="sb-process-steps">
            {[
              {
                icon: Target,
                title: "Bắt đầu từ mục tiêu của bạn",
                text: "Xác định điều bạn muốn cải thiện, câu hỏi đang vướng hoặc cơ hội đang muốn nắm bắt.",
              },
              {
                icon: Compass,
                title: "Tìm người có góc nhìn phù hợp",
                text: "Khám phá lĩnh vực và kinh nghiệm của mentor để tìm sự đồng điệu với mục tiêu của bạn.",
              },
              {
                icon: Sparkles,
                title: "Biến góc nhìn thành bước tiến",
                text: "Mang theo câu hỏi, cởi mở trao đổi và rời cuộc trò chuyện với một hướng đi rõ ràng hơn.",
              },
            ].map((step, index) => (
              <div className="sb-process-step" key={step.title}>
                <span className="sb-step-icon">
                  <step.icon size={22} />
                </span>
                <div>
                  <span className="sb-step-number">BƯỚC 0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sb-container sb-mentor-section"
        id="cho-mentor"
        data-reveal
      >
        <div className="sb-mentor-banner">
          <div>
            <span className="sb-eyebrow">DÀNH CHO NGƯỜI MUỐN SẺ CHIA</span>
            <h2>
              Kinh nghiệm của bạn.
              <br />
              <em>Bước ngoặt của ai đó.</em>
            </h2>
            <p>
              Những điều bạn đã học qua thực tế có thể là lời gợi mở
              <br className="sb-desktop-break" /> mà một người khác đang tìm
              kiếm.
            </p>
            <Link
              className="sb-button sb-button-white"
              href="/register?role=mentor"
            >
              Trở thành mentor <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="sb-mentor-art" aria-hidden="true">
            <span className="sb-mentor-orbit" />
            <span className="sb-mentor-orbit sb-orbit-two" />
            <Asterisk />
            <span className="sb-mentor-art-caption">GROW TOGETHER.</span>
          </div>
        </div>
      </section>

      <section
        className="sb-section sb-container sb-faq"
        id="cau-hoi"
        data-reveal
      >
        <div>
          <span className="sb-eyebrow">MỘT CHÚT RÕ RÀNG TRƯỚC KHI BẮT ĐẦU</span>
          <h2>
            Bạn có thể
            <br />
            đang tự hỏi.
          </h2>
          <p>Những điều nhỏ giúp bạn yên tâm hơn.</p>
        </div>
        <div className="sb-faq-list">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <Plus size={19} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="sb-final-cta sb-container" data-reveal>
        <span className="sb-eyebrow">CHƯƠNG TIẾP THEO LÀ CỦA BẠN</span>
        <h2>
          Sẵn sàng cho
          <br />
          <em>một bước tiến mới?</em>
        </h2>
        <Link href="/register" className="sb-button">
          Bắt đầu cùng SkillBridge <ArrowUpRight size={19} />
        </Link>
      </section>
    </div>
  );
}
