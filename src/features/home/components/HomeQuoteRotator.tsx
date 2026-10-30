"use client";

import { useEffect, useState } from "react";
import { homeQuotes } from "../content/home-content";

export function HomeQuoteRotator() {
  const [slide, setSlide] = useState<{
    current: number;
    previous: number | null;
  }>({
    current: 0,
    previous: null,
  });

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    function updateAutoplay() {
      clearInterval(timer);
      if (motion.matches || document.hidden) return;
      timer = setInterval(() => {
        setSlide(({ current }) => ({
          current: (current + 1) % homeQuotes.length,
          previous: current,
        }));
      }, 5500);
    }

    updateAutoplay();
    motion.addEventListener("change", updateAutoplay);
    document.addEventListener("visibilitychange", updateAutoplay);
    return () => {
      clearInterval(timer);
      motion.removeEventListener("change", updateAutoplay);
      document.removeEventListener("visibilitychange", updateAutoplay);
    };
  }, []);

  return (
    <section
      className="sb-philosophy"
      aria-label="Góc nhìn cùng SkillBridge"
      aria-roledescription="carousel"
    >
      <div className="sb-container">
        <span className="sb-section-index">01 / KẾT NỐI CÓ Ý NGHĨA</span>
        <div className="sb-quote-viewport">
          {homeQuotes.map((quote, index) => (
            <p
              key={quote.opening}
              className="sb-quote-slide"
              data-state={
                index === slide.current
                  ? "current"
                  : index === slide.previous
                    ? "previous"
                    : "waiting"
              }
              aria-hidden={index !== slide.current}
            >
              <span>{quote.opening}</span>
              <span>
                {quote.lead} <strong>{quote.emphasis}</strong>
              </span>
            </p>
          ))}
        </div>
        <div className="sb-quote-controls" aria-label="Điều khiển câu nói">
          <span className="sb-quote-count" aria-hidden="true">
            0{slide.current + 1}
            <span> / 0{homeQuotes.length}</span>
          </span>
          <div className="sb-quote-dots">
            {homeQuotes.map((quote, index) => (
              <button
                key={quote.opening}
                type="button"
                aria-label={`Xem câu nói ${index + 1}`}
                aria-pressed={index === slide.current}
                onClick={() =>
                  setSlide((state) =>
                    state.current === index
                      ? state
                      : { current: index, previous: state.current },
                  )
                }
              >
                <span />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
