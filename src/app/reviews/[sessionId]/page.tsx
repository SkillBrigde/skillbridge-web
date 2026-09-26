"use client";

import React from "react";
import { Star, MessageSquare, Check } from "lucide-react";
import { Avatar, Badge, Button, Card, Checkbox, Textarea } from "@/components/ui";

const CRITERIA = [
  { id: "expertise", label: "Chuyên Môn & Kiến Thức (Expertise)" },
  { id: "communication", label: "Kỹ Năng Sư Phạm & Truyền Đạt (Communication)" },
  { id: "helpfulness", label: "Độ Hữu Ích So Với Kỳ Vọng (Helpfulness)" },
  { id: "overall", label: "Đánh Giá Tổng Quan (Overall Rating)" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Star
            className={`h-5 w-5 ${
              i <= value ? "fill-[#F5A623] text-[#F5A623]" : "text-[#5D6474] hover:text-[#9BA1B0]"
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-mono text-[#9BA1B0] ml-2">{value}/5</span>
    </div>
  );
}

export default function ReviewPage() {
  const [ratings, setRatings] = React.useState<Record<string, number>>({
    expertise: 5, communication: 5, helpfulness: 5, overall: 5,
  });
  const [comment, setComment] = React.useState(
    "Anh An review rất sâu, chỉ đúng các điểm yếu về cache invalidation và deadlock trong PostgreSQL mà em hay bị vướng khi phỏng vấn Senior."
  );
  const [isPublic, setIsPublic] = React.useState(true);

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-8">
      <Card className="p-0 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#F5A623] to-[#5E6AD2]" />
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
            <Avatar size="md" alt="Nguyễn Văn An" />
            <div>
              <h1 className="text-sm font-bold text-[#F0F2F5]">
                Đánh Giá Buổi Học Với Mentor Nguyễn Văn An
              </h1>
              <p className="text-[11px] text-[#5D6474] font-mono">Booking #SB-2026-98124</p>
            </div>
          </div>

          {/* Rating Criteria */}
          <div className="space-y-4 mb-6">
            {CRITERIA.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#E3E2E5] flex-1">{c.label}</span>
                <StarRating
                  value={ratings[c.id]}
                  onChange={(v) => setRatings({ ...ratings, [c.id]: v })}
                />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-2 mb-4">
            <label className="text-xs font-medium text-[#9BA1B0] flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Nhận xét chi tiết của bạn (Chia sẻ với cộng đồng):
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Checkbox
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            label={<span className="text-xs text-[#9BA1B0]">Hiển thị nhận xét công khai trên hồ sơ của Mentor</span>}
            className="mb-6"
          />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="flex-1">Hủy</Button>
            <Button variant="primary" className="flex-1">
              <Check className="h-4 w-4" />
              Gửi Đánh Giá & Hoàn Tất
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
