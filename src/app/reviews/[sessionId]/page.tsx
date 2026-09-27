"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Textarea,
  Checkbox,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const CRITERIA = [
  { id: "expertise", label: "Chuyên Môn & Kiến Thức (Expertise)" },
  { id: "communication", label: "Kỹ Năng Sư Phạm & Truyền Đạt (Communication)" },
  { id: "helpfulness", label: "Độ Hữu Ích So Với Kỳ Vọng (Helpfulness)" },
  { id: "overall", label: "Đánh Giá Tổng Quan (Overall Rating)" },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function ReviewPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({
    expertise: 5,
    communication: 5,
    helpfulness: 5,
    overall: 5,
  });
  const [comment, setComment] = useState(
    "Anh An review rất sâu, chỉ đúng các điểm yếu về cache invalidation và deadlock trong PostgreSQL mà em hay bị vướng khi phỏng vấn Senior."
  );
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Modal-style Card ── */}
      <div className="rounded-xl bg-[#14171D] border border-white/[0.08] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-2">
            <Avatar alt="Nguyễn Văn An" size="md" />
            <div>
              <h1 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
                Đánh Giá Buổi Học Với Mentor Nguyễn Văn An
              </h1>
              <p className="text-xs text-[#5D6474] font-mono">
                Booking #SB-2026-98124
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
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
          <Button variant="ghost">Hủy</Button>
          <Button variant="primary">Gửi Đánh Giá &amp; Hoàn Tất</Button>
        </div>
      </div>
    </div>
  );
}
