import Link from "next/link";
import {
  Avatar,
  Badge,
  Card,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";
import { EscrowShield } from "@/components/ui/escrow-shield";
import { ServiceTierCard } from "@/components/service-tier-card";
import {
  BadgeCheck,
  Star,
  Clock,
  MessageSquare,
  Shield,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                         */
/* ------------------------------------------------------------------ */

const MENTOR = {
  name: "Nguyễn Văn An",
  role: "Tech Lead @ VNG • 9 YOE",
  bio: "Chuyên sâu Kiến trúc Hệ thống Phân tán, .NET 10, Microservices. Đã mentor 200+ kỹ sư từ Junior tới Staff level qua các buổi 1-on-1 chuyên sâu.",
  rating: 4.98,
  reviews: 142,
  sessions: 218,
  satisfaction: 99.1,
  responseTime: "< 15 phút",
  verified: true,
  online: true,
};

const TIERS = [
  {
    tier: 1 as const,
    title: "Review CV & Tối Ưu Portfolio",
    duration: "45 phút",
    price: "300.000 ₫",
    featured: false,
    deliverables: [
      { label: "1-on-1 Deep Dive 45 phút" },
      { label: "Notion Checklist sửa từng dòng CV" },
      { label: "Template Senior Markdown chuẩn FAANG" },
    ],
    ctaLabel: "Chọn Gói Này",
  },
  {
    tier: 2 as const,
    title: "Mock Interview System Design & .NET",
    duration: "60 phút",
    price: "450.000 ₫",
    featured: true,
    deliverables: [
      { label: "Mô phỏng phỏng vấn FAANG 60 phút" },
      { label: "Rubric 10 tiêu chí chấm điểm PDF" },
      { label: "Video ghi hình toàn bộ buổi học" },
      { label: "Bản thiết kế kiến trúc mẫu (Draw.io)" },
    ],
    ctaLabel: "Đăng Ký Phỏng Vấn",
  },
  {
    tier: 3 as const,
    title: "Lộ Trình Software Architect",
    duration: "1 Tháng (4 Buổi)",
    price: "2.000.000 ₫",
    featured: false,
    deliverables: [
      { label: "4 buổi 1-on-1 hàng tuần (60 phút/buổi)" },
      { label: "Review PR GitHub thực tế" },
      { label: "Telegram Async Q&A 24/7" },
    ],
    ctaLabel: "Đăng Ký 1 Tháng",
  },
];

const REVIEWS = [
  {
    id: 1,
    mentee: "Trần Minh Tuấn",
    rating: 5,
    package: "Mock Interview System Design & .NET",
    comment:
      "Anh An review rất sâu, chỉ đúng các điểm yếu về cache invalidation và deadlock trong PostgreSQL mà em hay bị vướng khi phỏng vấn Senior. Rubric chấm điểm cực kỳ chi tiết.",
    date: "15/09/2026",
    verified: true,
  },
  {
    id: 2,
    mentee: "Lê Hoàng Nam",
    rating: 5,
    package: "Review CV & Tối Ưu Portfolio",
    comment:
      "CV sau khi được anh An review đã giúp em nhận được 3 lời mời phỏng vấn từ các công ty lớn chỉ trong tuần đầu tiên. Template Markdown rất chuyên nghiệp.",
    date: "12/09/2026",
    verified: true,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE COMPONENT                                                    */
/* ------------------------------------------------------------------ */

export default function MentorProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* ── Bio Card ── */}
      <section className="rounded-xl bg-[#14171D] border border-white/[0.08] p-6 sm:p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <Avatar
              alt={MENTOR.name}
              size="xl"
              online={MENTOR.online}
              shape="rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
                  {MENTOR.name}
                </h1>
                {MENTOR.verified && (
                  <Badge variant="brand" dot>
                    <BadgeCheck className="h-3 w-3 mr-0.5" />
                    Verified Mentor
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#9BA1B0] mb-3">{MENTOR.role}</p>
              <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4 max-w-2xl">
                {MENTOR.bio}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="font-mono text-[#F0F2F5] font-medium">
                    {MENTOR.rating.toFixed(2)}
                  </span>
                  <span className="text-[#5D6474]">
                    ({MENTOR.reviews} reviews)
                  </span>
                </div>
                <span className="text-[#5D6474]">•</span>
                <span className="text-[#9BA1B0]">
                  {MENTOR.sessions} Buổi học
                </span>
                <span className="text-[#5D6474]">•</span>
                <span className="text-[#27C98F] font-medium">
                  {MENTOR.satisfaction}% Hài lòng
                </span>
                <span className="text-[#5D6474]">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#9BA1B0]" />
                  <span className="text-[#9BA1B0]">
                    Phản hồi {MENTOR.responseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Escrow Shield */}
          <div className="lg:w-72 flex-shrink-0">
            <EscrowShield />
          </div>
        </div>
      </section>

      {/* ── 3 Gói Dịch Vụ ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Gói Dịch Vụ Đóng Gói (Productized Services)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((tier) => (
            <Link
              key={tier.tier}
              href="/bookings/sb-2026-98124/intake"
            >
              <ServiceTierCard {...tier} className="h-full" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Đánh Giá Từ Mentee ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Đánh Giá Từ Học Viên
          </h2>
        </div>

        <div className="space-y-4">
          {REVIEWS.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar alt={review.mentee} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-[#F0F2F5]">
                      {review.mentee}
                    </span>
                    {review.verified && (
                      <Badge variant="escrow">Verified Session</Badge>
                    )}
                    <span className="text-xs text-[#5D6474] ml-auto">
                      {review.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating value={review.rating} readOnly size="sm" />
                    <span className="text-xs text-[#9BA1B0]">
                      • Gói {review.package}
                    </span>
                  </div>
                  <p className="text-sm text-[#E3E2E5] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
