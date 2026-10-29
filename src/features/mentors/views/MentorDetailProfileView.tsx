"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
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
  ArrowLeft,
} from "lucide-react";
import { useAppState, useSession, actions } from "@/lib/store";
import { vnd, slotDateLabel } from "@/lib/domain";

export function MentorDetailProfileView() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
  const state = useAppState();
  const session = useSession();

  const mentorId = params.mentorId;
  const mentor = useMemo(
    () => state.mentors.find((m) => m.id === mentorId),
    [state.mentors, mentorId]
  );

  const reviews = useMemo(
    () => state.reviews.filter((r) => r.mentorId === mentorId),
    [state.reviews, mentorId]
  );

  if (!mentor) {
    return (
      <div className="sb-container py-16">
        <EmptyState
          title="Không tìm thấy chuyên gia"
          description="Hồ sơ mentor không tồn tại hoặc đã tạm dừng nhận lịch."
          action={{
            label: "Quay lại danh sách chuyên gia",
            onClick: () => router.push("/mentors"),
          }}
        />
      </div>
    );
  }

  const handleSelectTier = (serviceId: string) => {
    if (!session.user) {
      router.push("/login?next=" + encodeURIComponent("/mentors/" + mentorId));
      return;
    }
    const res = actions.startBooking(mentor.id, serviceId);
    if (res.ok && res.bookingId) {
      router.push(`/bookings/${res.bookingId}/intake`);
    }
  };

  return (
    <div className="sb-container py-10 sm:py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/mentors"
          className="sb-text-link text-xs text-[#5e5866] hover:text-[#6551a4] transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại danh sách chuyên gia
        </Link>
      </div>

      {/* ── Bio Card ── */}
      <section className="rounded-2xl bg-white border border-[#e5e2de] p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <Avatar
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              size="xl"
              online={mentor.isOnline}
              shape="rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#27252d] tracking-tight">
                  {mentor.fullName}
                </h1>
                {mentor.isVerified && (
                  <Badge variant="brand" dot>
                    <BadgeCheck className="h-3.5 w-3.5 mr-0.5 text-[#6551a4]" />
                    Đã Xác Minh KYC
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-[#5e5866] mb-3">
                {mentor.title} @ {mentor.company} • {mentor.yearsOfExperience} Năm kinh nghiệm
              </p>
              <p className="text-sm text-[#27252d] leading-relaxed mb-4 max-w-2xl">
                {mentor.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-[#f1efea] px-2.5 py-1 text-xs font-mono text-[#5e5866] border border-[#e5e2de]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5e5866] pt-3 border-t border-[#f1efea]">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#f5a623] text-[#f5a623]" />
                  <span className="font-mono text-[#27252d] font-semibold">
                    {mentor.ratingAverage.toFixed(2)}
                  </span>
                  <span>
                    ({mentor.reviewCount} đánh giá)
                  </span>
                </div>
                <span>•</span>
                <span>
                  {mentor.totalSessions} Buổi cố vấn
                </span>
                <span>•</span>
                <span className="text-[#1e7e45] font-semibold">
                  {mentor.satisfactionRate}% Hài lòng
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#5e5866]" />
                  <span>
                    Phản hồi {mentor.slaResponseTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Escrow Shield */}
          <div className="lg:w-80 flex-shrink-0">
            <EscrowShield />
          </div>
        </div>
      </section>

      {/* ── 3 Gói Dịch Vụ Đóng Gói (Chương 4.1) ── */}
      <section className="mb-12">
        <div className="flex items-center gap-2.5 mb-6">
          <Shield className="h-5 w-5 text-[#6551a4]" />
          <div>
            <h2 className="text-xl font-bold text-[#27252d] tracking-tight">
              Gói Dịch Vụ Đóng Gói <em>(Productized Mentorship)</em>
            </h2>
            <p className="text-xs text-[#5e5866] mt-0.5">
              Cam kết đầu ra rõ ràng, giá trọn gói minh bạch, giải ngân qua Két Escrow từng buổi
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mentor.services.map((tier) => (
            <ServiceTierCard
              key={tier.id}
              tier={tier.tierNumber}
              title={tier.name}
              duration={tier.durationLabel}
              price={vnd(tier.priceVnd)}
              featured={tier.isFeatured}
              deliverables={tier.deliverables.map((d) => ({ label: d }))}
              ctaLabel={tier.tierNumber === 1 ? "Chọn Gói Này" : tier.tierNumber === 2 ? "Đăng Ký Phỏng Vấn" : "Đăng Ký Lộ Trình"}
              onSelect={() => handleSelectTier(tier.id)}
              className="h-full"
            />
          ))}
        </div>
      </section>

      {/* ── Đánh Giá Từ Mentee ── */}
      <section>
        <div className="flex items-center gap-2.5 mb-6">
          <MessageSquare className="h-5 w-5 text-[#6551a4]" />
          <h2 className="text-xl font-bold text-[#27252d] tracking-tight">
            Đánh Giá Từ Học Viên ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <Card className="p-8 text-center text-sm text-[#5e5866]">
            Chưa có đánh giá nào cho chuyên gia này.
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar alt={review.menteeName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-base font-semibold text-[#27252d]">
                        {review.menteeName}
                      </span>
                      <Badge variant="escrow">Buổi Học Đã Nghiệm Thu</Badge>
                      <span className="text-xs text-[#5e5866] ml-auto font-mono">
                        {slotDateLabel(new Date(review.createdAt).getTime())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <StarRating value={review.averageRating} readOnly size="sm" />
                      <span className="text-xs text-[#5e5866]">
                        • Gói: {review.serviceName}
                      </span>
                    </div>
                    <p className="text-sm text-[#27252d] leading-relaxed">
                      {review.comment}
                    </p>

                    {review.mentorReply && (
                      <div className="mt-3.5 rounded-lg bg-[#faf9f6] border border-[#e5e2de] p-4 text-xs text-[#5e5866]">
                        <span className="font-semibold text-[#6551a4] block mb-1">
                          Phản hồi từ {mentor.fullName}:
                        </span>
                        {review.mentorReply}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export { MentorDetailProfileView as default };
