"use client";

import { useState, useMemo } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Textarea,
  NoticeBanner,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";
import { ProgressBar } from "@/components/ui/progress-bar";
<<<<<<< HEAD
import { Star, MessageSquare, TrendingUp, CheckCircle2 } from "lucide-react";
=======
import { Star, MessageSquare, TrendingUp } from "lucide-react";
>>>>>>> 61e2e93070d5da971e2d688117daa9ff6f0b57da
import { RequireRole } from "@/components/auth/require-role";
import { useAppState, useSession, actions } from "@/lib/store";
import { slotDateLabel } from "@/lib/domain";

export function MentorReputationView() {
  const state = useAppState();
  const session = useSession();

  const mentor = session.mentor;
  const mentorId = mentor?.id || "mentor-an-nguyen";

  const reviews = useMemo(() => {
    return state.reviews.filter((r) => r.mentorId === mentorId);
  }, [state.reviews, mentorId]);

  const [responses, setResponses] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const overallRating = mentor?.ratingAverage || 4.98;
  const reviewCount = reviews.length || mentor?.reviewCount || 0;
  const completionRate = mentor?.satisfactionRate || 99.1;

  const handleSendReply = (reviewId: string) => {
    const text = responses[reviewId];
    if (!text || !text.trim()) return;

    const res = actions.replyReview(reviewId, text.trim());
    if (res.ok) {
      setSuccessMsg("Đã gửi phản hồi công khai cho học viên!");
      setEditingId(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <RequireRole role="mentor" title="Uy Tín &amp; Đánh Giá" description="Đăng nhập tài khoản mentor để theo dõi đánh giá và phản hồi học viên.">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-5 w-5 text-[#5E6AD2]" />
          <div>
            <h1 className="text-xl font-bold text-[#F0F2F5] tracking-tight">
              Quản Lý Uy Tín &amp; Phản Hồi Đánh Giá
            </h1>
            <p className="text-xs text-[#9BA1B0] mt-0.5">
              Phản hồi tận tâm giúp nâng cao điểm tín nhiệm và thu hút nhiều học viên hơn
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6">
            <NoticeBanner variant="success" message={successMsg} />
          </div>
        )}

        {/* ── Top Summary ── */}
        <Card className="p-6 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Overall rating */}
            <div className="text-center sm:w-48 flex-shrink-0">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-6 w-6 fill-[#F5A623] text-[#F5A623]" />
                <span className="text-3xl font-mono font-bold text-[#F0F2F5]">
                  {overallRating.toFixed(2)}
                </span>
                <span className="text-sm text-[#9BA1B0]">/ 5.0</span>
              </div>
              <p className="text-xs text-[#5D6474]">
                Dựa trên {reviewCount} đánh giá •{" "}
                <span className="text-[#27C98F]">
                  {completionRate}% Hài lòng
                </span>
              </p>
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 space-y-3 w-full">
              {[
                { label: "Chuyên môn", score: 4.99 },
                { label: "Sư phạm", score: 4.97 },
                { label: "Hữu ích", score: 4.98 },
              ].map((item) => (
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
            Đánh Giá Từ Học Viên ({reviews.length})
          </h2>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="p-8 text-center text-xs text-[#9BA1B0]">
                Chưa có đánh giá nào từ học viên.
              </Card>
            ) : (
              reviews.map((review) => {
                const isEditing = editingId === review.id;
                return (
                  <Card key={review.id} className="p-5">
                    {/* Review header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar alt={review.menteeName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#F0F2F5]">
                            {review.menteeName}
                          </span>
                          <StarRating value={review.averageRating} readOnly size="sm" />
                          <Badge variant="neutral">Gói {review.serviceName}</Badge>
                        </div>
                        <span className="text-xs text-[#5D6474]">
                          {slotDateLabel(new Date(review.createdAt).getTime())}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* Mentor response or input */}
                    {review.mentorReply && !isEditing ? (
                      <div className="rounded-xl bg-[#5E6AD2]/5 border border-[#5E6AD2]/20 p-3.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-[#7C87ED]">
                            Phản hồi của bạn
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(review.id);
                              setResponses((prev) => ({
                                ...prev,
                                [review.id]: review.mentorReply || "",
                              }));
                            }}
                            className="text-xs text-[#5E6AD2] hover:text-[#BDC2FF]"
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                        <p className="text-sm text-[#E3E2E5]">
                          &ldquo;{review.mentorReply}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                        <Textarea
                          placeholder="Viết phản hồi công khai cho Mentee..."
                          rows={2}
                          value={responses[review.id] ?? (review.mentorReply || "")}
                          onChange={(e) =>
                            setResponses((prev) => ({
                              ...prev,
                              [review.id]: e.target.value,
                            }))
                          }
                        />
                        <div className="flex justify-end gap-2">
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                            >
                              Hủy
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSendReply(review.id)}
                          >
                            Gửi Phản Hồi
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </section>
      </div>
    </RequireRole>
  );
}
