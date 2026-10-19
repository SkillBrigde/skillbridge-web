"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Button,
  Textarea,
  Checkbox,
  EmptyState,
  NoticeBanner,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";
import { useAppState, actions } from "@/lib/store";

const CRITERIA = [
  { id: "expertise", label: "Chuyên Môn & Kiến Thức (Expertise)" },
  { id: "communication", label: "Kỹ Năng Sư Phạm & Truyền Đạt (Communication)" },
  { id: "helpfulness", label: "Độ Hữu Ích So Với Kỳ Vọng (Helpfulness)" },
  { id: "overall", label: "Đánh Giá Tổng Quan (Overall Rating)" },
];

export function SessionReviewView() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const state = useAppState();

  const sessionId = params.sessionId;
  const booking = useMemo(
    () =>
      state.bookings.find(
        (b) =>
          b.id === sessionId ||
          b.code === sessionId ||
          b.code === `#${sessionId}` ||
          b.code.toLowerCase().includes(sessionId.toLowerCase())
      ),
    [state.bookings, sessionId]
  );

  const existingReview = useMemo(
    () => (booking ? state.reviews.find((r) => r.bookingId === booking.id) : null),
    [state.reviews, booking]
  );

  const mentor = useMemo(
    () => (booking ? state.mentors.find((m) => m.id === booking.mentorId) : null),
    [state.mentors, booking]
  );

  const [ratings, setRatings] = useState<Record<string, number>>({
    expertise: existingReview?.ratings.technicalDepth || 5,
    communication: existingReview?.ratings.communication || 5,
    helpfulness: existingReview?.ratings.valueDelivered || 5,
    overall: existingReview?.ratings.overallSatisfaction || 5,
  });
  const [comment, setComment] = useState(
    existingReview?.comment ||
      "Buổi học rất hữu ích! Mentor giải thích cặn kẽ các vấn đề kỹ thuật và đưa ra giải pháp rõ ràng, thực chiến."
  );
  const [isPublic, setIsPublic] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  if (!booking || !mentor) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy buổi học"
          description="Đơn đặt lịch không tồn tại hoặc bạn không có quyền đánh giá."
          action={{
            label: "Quay về lịch học",
            onClick: () => router.push("/bookings"),
          }}
        />
      </div>
    );
  }

  const handleSubmit = () => {
    setErrorMsg("");
    if (!comment.trim()) {
      setErrorMsg("Vui lòng nhập nhận xét của bạn.");
      return;
    }

    const res = actions.submitReview(booking.id, {
      ratings: {
        technicalDepth: ratings.expertise || 5,
        communication: ratings.communication || 5,
        valueDelivered: ratings.helpfulness || 5,
        overallSatisfaction: ratings.overall || 5,
      },
      comment: comment.trim(),
      isPublic,
    });

    if (!res.ok) {
      setErrorMsg(res.error || "Gửi đánh giá không thành công.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/bookings");
      }, 1200);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Modal-style Card ── */}
      <div className="rounded-xl bg-[#14171D] border border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <Avatar src={mentor.avatarUrl} alt={mentor.fullName} size="md" />
            <div>
              <h1 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
                Đánh Giá Buổi Học Với Mentor {mentor.fullName}
              </h1>
              <p className="text-xs text-[#5D6474] font-mono">
                Booking #{booking.code} — {booking.serviceName}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {errorMsg && <NoticeBanner variant="error" message={errorMsg} />}
          {success && (
            <NoticeBanner
              variant="success"
              message="Cảm ơn bạn! Đánh giá đã được ghi nhận vào hồ sơ uy tín của Mentor."
            />
          )}

          {/* 4 Rating Criteria */}
          {CRITERIA.map((criterion) => (
            <div key={criterion.id}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#E3E2E5]">
                  {criterion.label}
                </label>
                <span className="text-xs font-mono text-[#F5A623]">
                  {ratings[criterion.id]}/5
                </span>
              </div>
              <StarRating
                value={ratings[criterion.id]}
                onChange={(val) =>
                  setRatings((prev) => ({ ...prev, [criterion.id]: val }))
                }
                size="md"
              />
            </div>
          ))}

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-[#E3E2E5] mb-2">
              Nhận xét chi tiết của bạn (Chia sẻ với cộng đồng)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Chia sẻ cảm nhận về buổi học..."
            />
          </div>

          {/* Public checkbox */}
          <Checkbox
            label="Hiển thị nhận xét công khai trên hồ sơ của Mentor"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06]">
          <Button variant="ghost" onClick={() => router.push("/bookings")}>
            Hủy
          </Button>
          <Button variant="primary" disabled={success} onClick={handleSubmit}>
            Gửi Đánh Giá &amp; Hoàn Tất
          </Button>
        </div>
      </div>
    </div>
  );
}
