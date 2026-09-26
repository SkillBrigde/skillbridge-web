"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Award,
  CheckCircle2,
  MessageSquare,
  Send,
  Edit3,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Textarea } from "@/components/ui";

interface ReviewItem {
  id: string;
  mentee: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  rating: number;
  packageTitle: string;
  date: string;
  comment: string;
  reply?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    mentee: {
      name: "Trần Minh Tuấn",
      role: "Senior Backend Developer @ Tiki",
    },
    rating: 5,
    packageTitle: "Mock Interview System Design & .NET",
    date: "15/09/2026",
    comment:
      "Anh An hỏi cực kỳ hóc búa đúng trọng tâm những câu mình vừa gặp khi phỏng vấn Senior. Đặc biệt phần phân tích trade-off giữa Kafka và RabbitMQ trong kiến trúc sự kiện giúp mình vỡ ra rất nhiều điều. Đáng đồng tiền bát gạo!",
    reply:
      "Cảm ơn Tuấn nhé! Em nắm kiến trúc rất chắc, chỉ cần tự tin hơn khi giải thích phần distributed transaction rollback là chắc chắn pass vòng Final!",
  },
  {
    id: "rev-2",
    mentee: {
      name: "Lê Hoàng Nam",
      role: "DevOps Engineer @ Viettel Solutions",
    },
    rating: 5,
    packageTitle: "Review CV & Tối Ưu Portfolio",
    date: "12/09/2026",
    comment:
      "Trước đây CV của mình liệt kê công nghệ như từ điển, anh An sửa lại theo format Google XYZ định lượng được business impact rõ ràng. Nộp lại 3 chỗ thì 2 chỗ gọi phỏng vấn ngay trong tuần.",
    reply: "", // Awaiting reply
  },
  {
    id: "rev-3",
    mentee: {
      name: "Nguyễn Mai Trang",
      role: "Software Architect Aspiring @ One Mount",
    },
    rating: 5,
    packageTitle: "Lộ Trình Software Architect (1 Tháng)",
    date: "05/09/2026",
    comment:
      "Gói 1 tháng đồng hành rất xứng đáng. Anh An review từng dòng PR thiết kế, chỉ ra lỗ hổng bảo mật và bottleneck ở database caching mà team mình trước đó không nhìn ra. Đã học xong và áp dụng ngay vào production.",
    reply:
      "Cảm ơn Trang! Tư duy thiết kế Module Monolith trước khi nhảy sang Microservices của team em rất chuẩn. Chúc dự án go-live thành công rực rỡ!",
  },
];

export default function MentorReputationPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [newReplyText, setNewReplyText] = useState("");

  const handleSendReply = (reviewId: string) => {
    if (!newReplyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: newReplyText } : r))
    );
    setNewReplyText("");
    setEditingReplyId(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5D6474] mb-1">
            <Link href="/mentor/studio" className="hover:text-[#F0F2F5] transition-colors">
              Mentor Studio
            </Link>
            <span>/</span>
            <span className="text-[#9BA1B0]">Reputation & Reviews</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
            Quản Lý Uy Tín & Phản Hồi Đánh Giá
          </h1>
          <p className="text-xs text-[#9BA1B0] mt-1">
            Chỉ số hài lòng học viên, phản hồi công khai và huy hiệu Tích Xanh thẩm định
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 px-3 py-1.5 text-xs font-mono text-[#BDC2FF]">
          <Award className="h-4 w-4 text-[#5E6AD2]" />
          <span>Top Rated Mentor #1</span>
        </div>
      </div>

      {/* Top Summary Banner */}
      <Card className="p-6 mb-8 bg-[#14171D] border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Star Score (4 Cols) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-[#0D0E10] rounded-xl border border-white/[0.06] text-center">
            <div className="text-4xl sm:text-5xl font-bold font-mono text-[#F0F2F5] mb-2 flex items-center gap-2">
              <span>4.98</span>
              <span className="text-xl text-[#5D6474]">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-[#F5A623] text-[#F5A623]"
                />
              ))}
            </div>
            <div className="text-xs text-[#9BA1B0] font-mono">
              Dựa trên 142 lượt đánh giá học viên
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#27C98F] font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>99.1% Tỷ lệ hoàn tất buổi học</span>
            </div>
          </div>

          {/* Breakdown bars (8 Cols) */}
          <div className="md:col-span-8 space-y-4">
            <h3 className="text-xs font-semibold text-[#F0F2F5] uppercase tracking-wider font-mono">
              Điểm Đánh Giá Theo 3 Tiêu Chí Cốt Lõi
            </h3>

            {/* Criteria 1 */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-[#F0F2F5]">Chuyên Môn & Kiến Thức Thực Chiến</span>
                <span className="text-[#27C98F] font-bold">4.99 / 5.0</span>
              </div>
              <div className="h-2 rounded-full bg-[#0D0E10] overflow-hidden">
                <div className="h-full bg-[#27C98F] rounded-full w-[99.8%]" />
              </div>
            </div>

            {/* Criteria 2 */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-[#F0F2F5]">Kỹ Năng Sư Phạm & Truyền Đạt</span>
                <span className="text-[#5E6AD2] font-bold">4.97 / 5.0</span>
              </div>
              <div className="h-2 rounded-full bg-[#0D0E10] overflow-hidden">
                <div className="h-full bg-[#5E6AD2] rounded-full w-[99.4%]" />
              </div>
            </div>

            {/* Criteria 3 */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-[#F0F2F5]">Độ Hữu Ích So Với Kỳ Vọng Ban Đầu</span>
                <span className="text-[#F5A623] font-bold">4.98 / 5.0</span>
              </div>
              <div className="h-2 rounded-full bg-[#0D0E10] overflow-hidden">
                <div className="h-full bg-[#F5A623] rounded-full w-[99.6%]" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#F0F2F5] flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#5E6AD2]" />
            Đánh Giá Chi Tiết Từ Mentee
          </h2>
          <span className="text-xs text-[#5D6474] font-mono">
            Hiển thị 3 nhận xét gần nhất
          </span>
        </div>

        {reviews.map((rev) => (
          <Card
            key={rev.id}
            className="p-6 bg-[#14171D] border-white/[0.08] space-y-4"
          >
            {/* Header: Mentee info + Stars + Package */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar size="md" alt={rev.mentee.name} />
                <div>
                  <div className="text-sm font-semibold text-[#F0F2F5]">
                    {rev.mentee.name}
                  </div>
                  <div className="text-xs text-[#9BA1B0]">{rev.mentee.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="brand" className="text-[10px]">
                  {rev.packageTitle}
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]"
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-[#5D6474]">
                  {rev.date}
                </span>
              </div>
            </div>

            {/* Mentee Comment */}
            <p className="text-xs text-[#F0F2F5] leading-relaxed bg-[#0D0E10] p-4 rounded-xl border border-white/[0.04]">
              {rev.comment}
            </p>

            {/* Mentor Reply Box */}
            {rev.reply && editingReplyId !== rev.id ? (
              <div className="ml-4 sm:ml-8 p-4 rounded-xl bg-[#1C2028] border-l-2 border-[#5E6AD2] border-t border-r border-b border-white/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F2F5]">
                      Phản hồi từ bạn (Mentor Nguyễn Văn An)
                    </span>
                    <Badge variant="escrow" className="text-[10px]">
                      Verified Mentor
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingReplyId(rev.id);
                      setNewReplyText(rev.reply || "");
                    }}
                    className="text-[11px] h-6 px-2 text-[#9BA1B0] hover:text-white"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Chỉnh sửa
                  </Button>
                </div>
                <p className="text-xs text-[#9BA1B0] leading-relaxed">{rev.reply}</p>
              </div>
            ) : (
              <div className="ml-4 sm:ml-8 space-y-2">
                <label className="text-[11px] text-[#9BA1B0] block">
                  {rev.reply ? "Chỉnh sửa phản hồi công khai:" : "Nhập phản hồi công khai tới học viên:"}
                </label>
                <Textarea
                  rows={2}
                  value={editingReplyId === rev.id ? newReplyText : ""}
                  onChange={(e) => {
                    setEditingReplyId(rev.id);
                    setNewReplyText(e.target.value);
                  }}
                  placeholder="Cảm ơn bạn... Rất vui vì buổi học đã mang lại giá trị cho bạn!"
                  className="text-xs bg-[#0D0E10]"
                />
                <div className="flex items-center justify-end gap-2">
                  {editingReplyId === rev.id && rev.reply && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingReplyId(null)}
                      className="text-xs"
                    >
                      Hủy
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleSendReply(rev.id)}
                    className="text-xs gap-1.5"
                    disabled={editingReplyId !== rev.id || !newReplyText.trim()}
                  >
                    <Send className="h-3 w-3" />
                    <span>{rev.reply ? "Cập Nhật Phản Hồi" : "Gửi Phản Hồi Công Khai"}</span>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
