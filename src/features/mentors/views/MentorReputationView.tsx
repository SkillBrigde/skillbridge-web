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
import { Star, MessageSquare, TrendingUp } from "lucide-react";
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

  const handleSendReply = async (reviewId: string) => {
    const text = responses[reviewId];
    if (!text || !text.trim()) return;

    try {
      const { reviewService } = await import("@/services/reviewService");
      await reviewService.replyReview(reviewId, text.trim());
    } catch {
      // Continue
    }

    const res = actions.replyReview(reviewId, text.trim());
    if (res.ok) {
      setSuccessMsg("Đã gửi phản hồi công khai cho học viên!");
      setEditingId(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <RequireRole role="mentor" title="Uy Tín & Đánh Giá" description="Đăng nhập tài khoản mentor để theo dõi đánh giá và phản hồi học viên.">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-[#ece5f5] flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-[#6551a4]" />
          </div>
          <div>
            <span className="sb-eyebrow">Trust & Reputation</span>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#27252d]">
              Quản Lý Uy Tín & Phản Hồi Đánh Giá
            </h1>
            <p className="text-sm text-[#5e5866] mt-0.5">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Overall rating */}
            <div className="text-center sm:w-48 shrink-0">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-7 w-7 fill-[#946200] text-[#946200]" />
                <span className="text-4xl font-mono font-bold text-[#27252d]">
                  {overallRating.toFixed(2)}
                </span>
                <span className="text-sm text-[#5e5866]">/ 5.0</span>
              </div>
              <p className="text-xs text-[#5e5866] mt-1">
                Dựa trên {reviewCount} đánh giá •{" "}
                <span className="text-[#1e7e45] font-semibold">
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
                  <span className="text-xs font-medium text-[#5e5866] w-24 text-right">
                    {item.label}
                  </span>
                  <ProgressBar
                    value={(item.score / 5) * 100}
                    variant="brand"
                    size="sm"
                    className="flex-1"
                  />
                  <span className="text-xs font-mono font-medium text-[#27252d] w-10 text-right">
                    {item.score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Reviews List ── */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#27252d] mb-5 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#6551a4]" />
            Đánh Giá Từ Học Viên ({reviews.length})
          </h2>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card className="p-8 text-center text-sm text-[#5e5866]">
                Chưa có đánh giá nào từ học viên.
              </Card>
            ) : (
              reviews.map((review) => {
                const isEditing = editingId === review.id;
                return (
                  <Card key={review.id} className="p-6">
                    {/* Review header */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar alt={review.menteeName} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[#27252d]">
                            {review.menteeName}
                          </span>
                          <StarRating value={review.averageRating} readOnly size="sm" />
                          <Badge variant="neutral">Gói {review.serviceName}</Badge>
                        </div>
                        <span className="text-xs text-[#5e5866] mt-0.5 block">
                          {slotDateLabel(new Date(review.createdAt).getTime())}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-[#27252d] leading-relaxed mb-4 italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>

                    {/* Mentor response or input */}
                    {review.mentorReply && !isEditing ? (
                      <div className="rounded-xl bg-[#ece5f5]/40 border border-[#6551a4]/20 p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6551a4]">
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
                            className="text-xs font-medium text-[#6551a4] hover:text-[#523e8f]"
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                        <p className="text-sm text-[#27252d]">
                          &ldquo;{review.mentorReply}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-3 border-t border-[#f1efea]">
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

export { MentorReputationView as default };
