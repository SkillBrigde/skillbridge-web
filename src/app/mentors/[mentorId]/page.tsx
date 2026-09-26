import Link from "next/link";
import {
  Star,
  BadgeCheck,
  ShieldCheck,
  Clock,
  MessageCircle,
  Zap,
  Crown,
  Rocket,
  Check,
  ArrowRight,
  Users,
  ThumbsUp,
} from "lucide-react";
import { Avatar, Badge, Button, Card, Currency } from "@/components/ui";
import { MOCK_MENTORS } from "@/lib/mock-data";
import type { MentorServiceTier } from "@/types/mentor";

function ServiceTierCard({
  service,
  mentorId,
}: {
  service: MentorServiceTier;
  mentorId: string;
}) {
  const tierStyles = {
    QUICK_WIN: {
      icon: Zap,
      label: "Quick Win",
      accent: "text-[#9BA1B0]",
      border: "border-white/[0.08]",
      bg: "bg-[#14171D]",
      iconBg: "bg-[#1F2022] text-[#9BA1B0]",
    },
    FEATURED: {
      icon: Crown,
      label: "Top Pick ✦",
      accent: "text-[#BDC2FF]",
      border: "border-[#5E6AD2]/40",
      bg: "bg-[#14171D] ring-1 ring-[#5E6AD2]/20",
      iconBg: "bg-[#5E6AD2]/15 text-[#BDC2FF]",
    },
    TRANSFORMATION: {
      icon: Rocket,
      label: "Transformation",
      accent: "text-[#27C98F]",
      border: "border-[#27C98F]/20",
      bg: "bg-[#14171D]",
      iconBg: "bg-[#27C98F]/10 text-[#27C98F]",
    },
  };

  const style = tierStyles[service.category];
  const IconComp = style.icon;

  return (
    <div
      className={`rounded-xl ${style.bg} border ${style.border} p-5 flex flex-col h-full transition-all hover:translate-y-[-2px] hover:shadow-lg`}
    >
      {/* Tier Label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${style.iconBg}`}
          >
            <IconComp className="h-3.5 w-3.5" />
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${style.accent}`}>
            Tier {service.tierNumber} — {style.label}
          </span>
        </div>
        {service.isFeatured && (
          <Badge variant="brand">Phổ biến nhất</Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-[#F0F2F5] tracking-tight mb-2 leading-snug">
        {service.name}
      </h3>

      {/* Duration + Price */}
      <div className="flex items-baseline gap-2 mb-4">
        <Currency
          amount={service.priceVnd}
          highlight={service.isFeatured ? "indigo" : "default"}
          size="lg"
        />
        <span className="text-[11px] text-[#5D6474] font-mono">
          / {service.durationLabel}
        </span>
      </div>

      {/* Deliverables */}
      <div className="space-y-2 flex-1 mb-5">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474] mb-2">
          Cam kết đầu ra:
        </p>
        {service.deliverables.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-[#E3E2E5]">
            <Check className="h-3.5 w-3.5 text-[#27C98F] flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href={`/bookings/${mentorId}/intake`}>
        <Button
          variant={service.isFeatured ? "primary" : "secondary"}
          className="w-full"
          size="md"
        >
          {service.tierNumber === 1 && "Chọn Gói Này"}
          {service.tierNumber === 2 && "Đăng Ký Phỏng Vấn"}
          {service.tierNumber === 3 && "Đăng Ký 1 Tháng"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

const MOCK_REVIEWS = [
  {
    id: "rev-1",
    menteeName: "Trần Minh Tuấn",
    menteeTitle: "Junior Backend Developer @ FPT Software",
    rating: 5,
    serviceName: "Mock Interview System Design",
    comment:
      "Anh An review rất sâu, chỉ đúng các điểm yếu về cache invalidation và deadlock trong PostgreSQL mà em hay bị vướng khi phỏng vấn Senior. Rubric PDF rất chi tiết, em dùng để ôn lại hàng ngày.",
    date: "3 ngày trước",
    isVerified: true,
  },
  {
    id: "rev-2",
    menteeName: "Đỗ Minh Trí",
    menteeTitle: "Fullstack Dev @ Techcombank",
    rating: 5,
    serviceName: "Review CV & Tối Ưu Portfolio",
    comment:
      "CV trước khi gặp anh An rất chung chung, sau buổi 1-on-1 em đã có bản CV chuẩn senior với số liệu impact rõ ràng. Đã nhận offer tăng lương 40% sau 2 tuần apply lại.",
    date: "1 tuần trước",
    isVerified: true,
  },
];

export default async function MentorProfilePage({
  params,
}: {
  params: Promise<{ mentorId: string }>;
}) {
  const { mentorId } = await params;
  const mentor = MOCK_MENTORS.find((m) => m.id === mentorId) || MOCK_MENTORS[0];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bio Card */}
      <Card className="p-0 mb-8 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 bg-gradient-to-r from-[#5E6AD2] via-[#27C98F] to-[#5E6AD2]" />

        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <Avatar
              size="xl"
              alt={mentor.fullName}
              online={mentor.isOnline}
              shape="rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#F0F2F5] tracking-tight">
                  {mentor.fullName}
                </h1>
                {mentor.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-[#5E6AD2]" />
                )}
                <Badge variant="brand">Verified Mentor</Badge>
              </div>
              <p className="text-sm text-[#9BA1B0] mb-3">{mentor.bio}</p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center gap-1 text-[#F5A623]">
                  <Star className="h-3.5 w-3.5 fill-[#F5A623]" />
                  <span className="font-mono font-bold text-[#F0F2F5]">
                    {mentor.ratingAverage}
                  </span>
                  <span className="text-[#9BA1B0]">
                    ({mentor.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#9BA1B0]">
                  <Users className="h-3.5 w-3.5 text-[#5E6AD2]" />
                  <span>{mentor.totalSessions} Buổi học</span>
                </div>
                <div className="flex items-center gap-1 text-[#9BA1B0]">
                  <ThumbsUp className="h-3.5 w-3.5 text-[#27C98F]" />
                  <span>{mentor.satisfactionRate}% Hài lòng</span>
                </div>
                <div className="flex items-center gap-1 text-[#9BA1B0]">
                  <MessageCircle className="h-3.5 w-3.5 text-[#F5A623]" />
                  <span>Phản hồi {mentor.slaResponseTime}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-md bg-[#0F1115] border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-[#9BA1B0]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Escrow Shield */}
          <div className="flex-shrink-0 lg:w-56">
            <div className="rounded-xl bg-[#03BD84]/[0.08] border border-[#27C98F]/20 p-4 text-center">
              <ShieldCheck className="h-8 w-8 text-[#27C98F] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#27C98F] uppercase font-mono tracking-wider mb-1">
                100% Escrow Bảo Chứng
              </p>
              <p className="text-[11px] text-[#9BA1B0] leading-relaxed">
                Tiền giữ an toàn tại Escrow.
                <br />
                Mentor chỉ nhận tiền khi bạn hài lòng hoặc sau 24h không khiếu nại.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Productized Services Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-lg font-bold text-[#F0F2F5] tracking-tight">
            Gói Dịch Vụ Đóng Gói
          </h2>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5D6474]">
            Productized Services
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentor.services.map((svc) => (
            <ServiceTierCard
              key={svc.id}
              service={svc}
              mentorId={mentor.id}
            />
          ))}
        </div>
      </div>

      {/* Escrow Protection Flow */}
      <Card className="p-5 mb-10">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#5E6AD2] mb-4 flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Quy trình bảo vệ Escrow 4 chặng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: "01", label: "Đặt cọc", desc: "Tiền vào tài khoản Escrow bảo chứng" },
            { step: "02", label: "Học 1-on-1", desc: "Phiên học WebRTC có ghi hình" },
            { step: "03", label: "Nghiệm thu", desc: "24h xác nhận hoặc khiếu nại SLA" },
            { step: "04", label: "Giải ngân", desc: "Mentor nhận tiền sau nghiệm thu" },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-lg bg-[#0F1115] border border-white/[0.04] p-3 text-center"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#5E6AD2]/15 text-[#BDC2FF] text-[11px] font-mono font-bold mb-2">
                {item.step}
              </span>
              <p className="text-xs font-medium text-[#F0F2F5] mb-0.5">
                {item.label}
              </p>
              <p className="text-[10px] text-[#5D6474] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-bold text-[#F0F2F5] tracking-tight mb-5">
          Đánh Giá Từ Học Viên
        </h2>
        <div className="space-y-4">
          {MOCK_REVIEWS.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start gap-4">
                <Avatar size="md" alt={review.menteeName} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-[#F0F2F5]">
                      {review.menteeName}
                    </span>
                    {review.isVerified && (
                      <Badge variant="escrow" className="text-[9px]">
                        Verified Session
                      </Badge>
                    )}
                    <Badge variant="neutral" className="text-[9px]">
                      {review.serviceName}
                    </Badge>
                  </div>
                  {review.menteeTitle && (
                    <p className="text-[11px] text-[#5D6474] mb-2">
                      {review.menteeTitle}
                    </p>
                  )}
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating
                            ? "fill-[#F5A623] text-[#F5A623]"
                            : "text-[#5D6474]"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-[#5D6474] ml-2">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-xs text-[#E3E2E5] leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
