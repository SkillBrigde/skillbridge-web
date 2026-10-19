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
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          title="Không tìm thấy chuyên gia"
          description="Hồ sơ mentor không tồn tại hoặc đã tạm dừng nhận lịch."
          action={{
            label: "Quay lại danh sách mentors",
            onClick: () => router.push("/mentors"),
          }}
        />
      </div>
    );
  }

  const handleSelectTier = (serviceId: string) => {
    // If user is not logged in, log in as Linh (demo mentee) or prompt
    if (!session.user) {
      actions.loginAs("u-linh");
    }
    const res = actions.startBooking(mentor.id, serviceId);
    if (res.ok && res.bookingId) {
      router.push(`/bookings/${res.bookingId}/intake`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/mentors"
          className="inline-flex items-center gap-1.5 text-xs text-[#9BA1B0] hover:text-[#F0F2F5] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại danh sách chuyên gia
        </Link>
      </div>

      {/* ── Bio Card ── */}
      <section className="rounded-xl bg-[#14171D] border border-white/[0.08] p-6 sm:p-8 mb-10">
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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-[#F0F2F5] tracking-tight">
                  {mentor.fullName}
                </h1>
                {mentor.isVerified && (
                  <Badge variant="brand" dot>
                    <BadgeCheck className="h-3 w-3 mr-0.5" />
                    Verified Mentor
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#9BA1B0] mb-3">
                {mentor.title} @ {mentor.company} • {mentor.yearsOfExperience} Năm kinh nghiệm
              </p>
              <p className="text-sm text-[#E3E2E5] leading-relaxed mb-4 max-w-2xl">
                {mentor.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-[#1F2022] px-2.5 py-1 text-xs font-mono text-[#9BA1B0] border border-white/[0.06]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="font-mono text-[#F0F2F5] font-medium">
                    {mentor.ratingAverage.toFixed(2)}
                  </span>
                  <span className="text-[#5D6474]">
                    ({mentor.reviewCount} đánh giá)
                  </span>
                </div>
                <span className="text-[#5D6474]">•</span>
                <span className="text-[#9BA1B0]">
                  {mentor.totalSessions} Buổi học
                </span>
                <span className="text-[#5D6474]">•</span>
                <span className="text-[#27C98F] font-medium">
                  {mentor.satisfactionRate}% Hài lòng
                </span>
                <span className="text-[#5D6474]">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#9BA1B0]" />
                  <span className="text-[#9BA1B0]">
                    Phản hồi {mentor.slaResponseTime}
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

      {/* ── 3 Gói Dịch Vụ Đóng Gói ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Gói Dịch Vụ Đóng Gói (Productized Services)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-5 w-5 text-[#5E6AD2]" />
          <h2 className="text-lg font-semibold text-[#F0F2F5] tracking-tight">
            Đánh Giá Từ Học Viên ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <Card className="p-6 text-center text-xs text-[#9BA1B0]">
            Chưa có đánh giá nào cho chuyên gia này.
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar alt={review.menteeName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-[#F0F2F5]">
                        {review.menteeName}
                      </span>
                      <Badge variant="escrow">Verified Session</Badge>
                      <span className="text-xs text-[#5D6474] ml-auto">
                        {slotDateLabel(new Date(review.createdAt).getTime())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating value={review.averageRating} readOnly size="sm" />
                      <span className="text-xs text-[#9BA1B0]">
                        • Gói {review.serviceName}
                      </span>
                    </div>
                    <p className="text-sm text-[#E3E2E5] leading-relaxed">
                      {review.comment}
                    </p>

                    {review.mentorReply && (
                      <div className="mt-3 rounded-lg bg-[#0D0E10] border border-white/[0.06] p-3 text-xs text-[#9BA1B0]">
                        <span className="font-semibold text-[#7C87ED] block mb-1">
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
