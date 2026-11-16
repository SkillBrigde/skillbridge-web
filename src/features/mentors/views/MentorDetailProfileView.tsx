"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAppState, useSession, actions } from "@/lib/store";
import { vnd, slotDateLabel } from "@/lib/domain";
import {
  mentorService,
  type MentorProfileDetailDto,
  type MentorServiceDto,
} from "@/services/mentorService";
import {
  reviewService,
  type ReviewDto,
  type ReviewSummaryDto,
} from "@/services/reviewService";

export function MentorDetailProfileView() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
  const state = useAppState();
  const session = useSession();

  const mentorId = params.mentorId;
  const [loading, setLoading] = useState(true);
  const [mentorData, setMentorData] = useState<MentorProfileDetailDto | null>(null);
  const [services, setServices] = useState<MentorServiceDto[]>([]);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryDto | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Local fallback mentor from seed
  const fallbackMentor = useMemo(
    () => state.mentors.find((m) => m.id === mentorId) || state.mentors[0],
    [state.mentors, mentorId],
  );

  useEffect(() => {
    if (!mentorId) return;

    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) setLoading(true);
    });

    // Fetch from backend API
    Promise.all([
      mentorService.getPublicMentorProfile(mentorId).catch(() => null),
      mentorService.getMentorServices(mentorId).catch(() => null),
      reviewService.getMentorReviews(mentorId, 1, 10).catch(() => null),
      reviewService.getMentorReviewSummary(mentorId).catch(() => null),
    ])
      .then(([profileRes, servicesRes, reviewsRes, summaryRes]) => {
        if (!isMounted) return;

        if (profileRes) {
          setMentorData(profileRes);
          if (servicesRes && servicesRes.items) {
            setServices(servicesRes.items);
          }
          if (reviewsRes && reviewsRes.items) {
            setReviews(reviewsRes.items);
          }
          if (summaryRes) {
            setSummary(summaryRes);
          }
          setIsUsingFallback(false);
        } else {
          // Use fallback
          setIsUsingFallback(true);
        }
      })
      .catch(() => {
        if (isMounted) setIsUsingFallback(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Record interaction view
    mentorService.recordInteraction(mentorId, undefined, "ViewProfile");

    return () => {
      isMounted = false;
    };
  }, [mentorId]);

  if (loading) {
    return (
      <div className="sb-container py-24 flex flex-col items-center justify-center gap-3 text-[#5e5866]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6551a4]" />
        <p className="text-sm">Đang tải thông tin chuyên gia...</p>
      </div>
    );
  }

  // Display either API data or fallback
  const isVerified = mentorData
    ? mentorData.verificationStatus === "Verified"
    : fallbackMentor?.isVerified ?? true;
  const fullName = mentorData?.fullName || fallbackMentor?.fullName || "Chuyên gia SkillBridge";
  const avatarUrl = mentorData?.avatarUrl || fallbackMentor?.avatarUrl;
  const headline = mentorData?.headline || `${fallbackMentor?.title} @ ${fallbackMentor?.company}`;
  const bio = mentorData?.bio || fallbackMentor?.bio || "";
  const ratingAverage = summary?.averageOverall ?? mentorData?.ratingAverage ?? fallbackMentor?.ratingAverage ?? 5.0;
  const totalReviews = summary?.totalReviews ?? mentorData?.totalReviews ?? fallbackMentor?.reviewCount ?? 0;
  const totalSessions = mentorData?.totalSessions || fallbackMentor?.totalSessions || 12;

  const displaySkills: string[] = mentorData?.skills && mentorData.skills.length > 0
    ? mentorData.skills.map((s) => s.name || "Kỹ năng")
    : fallbackMentor?.skills || ["Backend", "Architecture", "System Design"];

  const handleSelectTier = (serviceId: string) => {
    if (!session.user) {
      router.push("/login?next=" + encodeURIComponent("/mentors/" + mentorId));
      return;
    }

    // Try starting booking through actions or navigate to intake
    const res = actions.startBooking(mentorId, serviceId);
    const bookingId = res.ok && res.bookingId ? res.bookingId : serviceId;
    router.push(`/bookings/${bookingId}/intake?serviceId=${serviceId}&mentorId=${mentorId}`);
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

      {isUsingFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-xl text-xs mb-6 flex items-center justify-between">
          <span>
            Đang hiển thị hồ sơ mẫu. Khi máy chủ backend hoạt động, dữ liệu chuyên gia sẽ được đồng bộ trực tiếp.
          </span>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 font-semibold hover:underline"
          >
            <RefreshCw size={13} /> Làm mới
          </button>
        </div>
      )}

      {/* ── Bio Card ── */}
      <section className="rounded-2xl bg-white border border-[#e5e2de] p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <Avatar
              src={avatarUrl}
              alt={fullName}
              size="xl"
              online={true}
              shape="rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#27252d] tracking-tight">
                  {fullName}
                </h1>
                {isVerified && (
                  <Badge variant="brand" dot>
                    <BadgeCheck className="h-3.5 w-3.5 mr-0.5 text-[#6551a4]" />
                    Đã Xác Minh KYC
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-[#5e5866] mb-3">
                {headline}
              </p>
              <p className="text-sm text-[#27252d] leading-relaxed mb-4 max-w-2xl whitespace-pre-line">
                {bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {displaySkills.map((skill) => (
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
                    {ratingAverage.toFixed(2)}
                  </span>
                  <span>({totalReviews} đánh giá)</span>
                </div>
                <span>•</span>
                <span>{totalSessions} Buổi cố vấn</span>
                <span>•</span>
                <span className="text-[#1e7e45] font-semibold">
                  100% Hoàn thành
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-[#5e5866]" />
                  <span>Phản hồi dưới 2h</span>
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
          {services.length > 0
            ? services.map((tier, idx) => (
                <ServiceTierCard
                  key={tier.id}
                  tier={((idx % 3) + 1) as 1 | 2 | 3}
                  title={tier.title}
                  duration={`${tier.durationMinutes} phút / ${tier.totalSessions} buổi`}
                  price={vnd(tier.price)}
                  featured={idx === 1}
                  deliverables={
                    tier.deliverables
                      ? tier.deliverables.split("\n").filter(Boolean).map((d) => ({ label: d }))
                      : [{ label: "Hỗ trợ 1:1 giải đáp toàn diện" }]
                  }
                  ctaLabel={idx === 0 ? "Chọn Gói Này" : idx === 1 ? "Đăng Ký Phỏng Vấn" : "Đăng Ký Lộ Trình"}
                  onSelect={() => handleSelectTier(tier.id)}
                  className="h-full"
                />
              ))
            : fallbackMentor?.services.map((tier) => (
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
                  <Avatar alt="Học viên" size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-base font-semibold text-[#27252d]">
                        Học viên SkillBridge
                      </span>
                      <Badge variant="escrow">Buổi Học Đã Nghiệm Thu</Badge>
                      <span className="text-xs text-[#5e5866] ml-auto font-mono">
                        {slotDateLabel(new Date(review.createdAtUtc).getTime())}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <StarRating value={review.overallRating} readOnly size="sm" />
                      <span className="text-xs text-[#5e5866]">
                        • Đánh giá trải nghiệm
                      </span>
                    </div>
                    <p className="text-sm text-[#27252d] leading-relaxed">
                      {review.comment}
                    </p>

                    {review.mentorReply && (
                      <div className="mt-3.5 rounded-lg bg-[#faf9f6] border border-[#e5e2de] p-4 text-xs text-[#5e5866]">
                        <span className="font-semibold text-[#6551a4] block mb-1">
                          Phản hồi từ {fullName}:
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
