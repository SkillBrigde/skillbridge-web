"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Textarea,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Star, MessageSquare, TrendingUp } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const OVERALL = {
  rating: 4.98,
  total: 142,
  completion: 99.1,
};

const BREAKDOWN = [
  { label: "Chuyên môn", score: 4.99 },
  { label: "Sư phạm", score: 4.97 },
  { label: "Hữu ích", score: 4.98 },
];

const REVIEWS = [
  {
    id: 1,
    mentee: "Trần Minh Tuấn",
    rating: 5,
    package: "Mock Interview",
    comment:
      "Anh An hỏi cực kỳ hóc búa đúng trọng tâm những câu mình vừa gặp khi phỏng vấn Senior. Rubric PDF rất chi tiết, chỉ rõ từng điểm yếu.",
    date: "15/09/2026",
    response:
      "Cảm ơn Tuấn nhé, chúc em tự tin pass vòng System Design tuần tới!",
  },
  {
    id: 2,
    mentee: "Lê Hoàng Nam",
    rating: 5,
    package: "Review CV",
    comment:
      "CV sau khi được anh An review đã giúp em nhận được 3 lời mời phỏng vấn từ Techcombank, Momo và Tiki. Template Markdown rất chuyên nghiệp.",
    date: "12/09/2026",
    response: null,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function ReputationPage() {
  const [responses, setResponses] = useState<Record<number, string>>({});

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="h-5 w-5 text-[#5E6AD2]" />
        <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
          Quản Lý Uy Tín &amp; Phản Hồi Đánh Giá
        </h1>
      </div>

      {/* ── Top Summary ── */}
      <Card className="p-6 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Overall rating */}
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-5 w-5 fill-[#F5A623] text-[#F5A623]" />
              <span className="text-3xl font-mono font-bold text-[#F0F2F5]">
                {OVERALL.rating.toFixed(2)}
              </span>
              <span className="text-sm text-[#9BA1B0]">/ 5.0</span>
            </div>
            <p className="text-xs text-[#5D6474]">
              Dựa trên {OVERALL.total} đánh giá •{" "}
              <span className="text-[#27C98F]">
                {OVERALL.completion}% Completion rate
              </span>
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-3 w-full">
            {BREAKDOWN.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-[#9BA1B0] w-24 text-right">
                  {item.label}
                </span>
                <ProgressBar
                  value={(item.score / 5) * 100}
                  variant="brand"
                  size="sm"
                  className="flex-1"
                />
                <span className="text-xs font-mono text-[#F0F2F5] w-10">
                  {item.score.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Reviews List ── */}
      <section>
        <h2 className="text-base font-semibold text-[#F0F2F5] mb-4 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#5E6AD2]" />
          Đánh Giá Từ Học Viên
        </h2>

        <div className="space-y-4">
          {REVIEWS.map((review) => (
            <Card key={review.id} className="p-5">
              {/* Review header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar alt={review.mentee} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#F0F2F5]">
                      {review.mentee}
                    </span>
                    <StarRating value={review.rating} readOnly size="sm" />
                    <Badge variant="neutral">Gói {review.package}</Badge>
                  </div>
                  <span className="text-xs text-[#5D6474]">{review.date}</span>
                </div>
              </div>

              {/* Comment */}
              <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4">
                &ldquo;{review.comment}&rdquo;
              </p>

              {/* Mentor response or input */}
              {review.response ? (
                <div className="rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/20 p-3">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#5E6AD2] mb-1">
                    Phản hồi của bạn
                  </p>
                  <p className="text-sm text-[#E3E2E5]">
                    &ldquo;{review.response}&rdquo;
                  </p>
                  <button className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF] mt-2 cursor-pointer">
                    Chỉnh sửa phản hồi
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Viết phản hồi công khai cho Mentee..."
                    rows={2}
                    value={responses[review.id] || ""}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [review.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm">
                      Gửi Phản Hồi
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
