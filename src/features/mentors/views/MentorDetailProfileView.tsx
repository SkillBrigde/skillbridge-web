"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  EmptyState,
} from "@/components/ui";
import { StarRating } from "@/components/ui/star-rating";
import { EscrowShield } from "@/components/ui/escrow-shield";
import { ServiceTierCard } from "@/components/service-tier-card";
import {
  BadgeCheck,
  Star,
  MessageSquare,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/store";
import {
  getPublicMentorProfile,
  getMentorServices,
  getMentorReviewSummary,
  getMentorReviews,
} from "@/services";
import type {
  PublicMentorProfileResponse,
  MentorServiceResponse,
  ReviewSummaryResponse,
  PublicReviewResponse,
} from "@/types/api";

export function MentorDetailProfileView() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
  const session = useSession();

  const mentorId = params.mentorId;

  const [mentor, setMentor] = useState<PublicMentorProfileResponse | null>(null);
  const [services, setServices] = useState<MentorServiceResponse[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryResponse | null>(null);
  const [reviews, setReviews] = useState<PublicReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mentorId) return;
    let isMounted = true;

    Promise.all([
      getPublicMentorProfile(mentorId).catch(() => null),
      getMentorServices(mentorId).catch(() => ({ items: [] })),
      getMentorReviewSummary(mentorId).catch(() => null),
      getMentorReviews(mentorId, { page: 1, pageSize: 10 }).catch(() => ({
        items: [],
      })),
    ])
      .then(([mentorRes, servicesRes, summaryRes, reviewsRes]) => {
        if (!isMounted) return;
        if (!mentorRes) {
          setError(true);
        } else {
          setMentor(mentorRes);
          setServices(servicesRes?.items ?? []);
          setSummary(summaryRes);
          setReviews(reviewsRes?.items ?? []);
        }
      })
      .catch(() => {
        if (isMounted) setError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [mentorId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-[var(--sb-muted)]">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--sb-purple)]" />
        <p className="text-sm">Đang tải hồ sơ chuyên gia…</p>
      </div>
    );
  }

  if (error || !mentor) {
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

  const handleSelectTier = (service: MentorServiceResponse) => {
    if (!session.user) {
      router.push("/login?next=" + encodeURIComponent(`/mentors/${mentorId}/book?serviceId=${service.id}`));
      return;
    }
    router.push(`/mentors/${mentorId}/book?serviceId=${service.id}`);
  };

  const getTierNumber = (serviceType: string): 1 | 2 | 3 => {
    if (serviceType === "Tier1_ReviewCV") return 1;
    if (serviceType === "Tier2_MockInterview") return 2;
    return 3;
  };

  const parseDeliverables = (raw: string): string[] => {
    if (!raw) return [];
    return raw
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const displayName = mentor.fullName || mentor.headline || "Mentor SkillBridge";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/mentors"
          className="inline-flex items-center gap-1.5 text-xs text-[#9BA1B0] hover:text-[var(--sb-ink)] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại danh sách chuyên gia
        </Link>
      </div>

      {/* ── Bio Card ── */}
      <section className="rounded-2xl bg-white border border-[var(--sb-line)] p-6 sm:p-8 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <div className="w-20 h-20 rounded-2xl bg-[#eee7f6] text-[var(--sb-purple)] font-semibold flex items-center justify-center text-2xl flex-shrink-0">
              {displayName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-[var(--sb-ink)] tracking-tight">
                  {displayName}
                </h1>
                {mentor.verificationStatus === "Verified" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#eee7f6] text-[var(--sb-purple)] font-medium">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Mentor
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--sb-muted)] mb-3">
                {mentor.fullName ? mentor.headline || "Chuyên gia Mentoring" : "Chuyên gia SkillBridge"}
              </p>
              {mentor.bio && (
                <p className="text-sm text-[var(--sb-ink)] leading-relaxed mb-4 max-w-2xl whitespace-pre-line">
                  {mentor.bio}
                </p>
              )}

              {/* Skills */}
              {mentor.skills && mentor.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {mentor.skills.map((skill) => (
                    <span
                      key={skill.id || skill.skillName}
                      className="rounded-lg bg-[#faf9f6] px-2.5 py-1 text-xs font-mono text-[var(--sb-muted)] border border-[var(--sb-line)]"
                    >
                      {skill.skillName}
                      {skill.proficiencyLevel ? ` • ${skill.proficiencyLevel}` : ""}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-[var(--sb-line)]">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="font-semibold text-[var(--sb-ink)]">
                    {(summary?.averageOverall ?? mentor.ratingAverage ?? 0).toFixed(1)}
                  </span>
                  <span className="text-[var(--sb-muted)]">
                    ({summary?.totalReviews ?? mentor.totalReviews ?? 0} đánh giá)
                  </span>
                </div>
                <span className="text-[var(--sb-line)]">•</span>
                <span className="text-[var(--sb-muted)]">
                  {mentor.totalSessions || 0} Buổi học đã hoàn thành
                </span>
                <span className="text-[var(--sb-line)]">•</span>
                <div className="flex items-center gap-1 text-[var(--sb-purple)] font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: mentor.currency || "VND",
                  }).format(mentor.hourlyRate || 0)}
                  /giờ
                </div>
              </div>
            </div>
          </div>

          {/* Right: Escrow Shield */}
          <div className="lg:w-72 flex-shrink-0">
            <EscrowShield />
          </div>
        </div>

        {/* Experience & Certifications */}
        {((mentor.experiences && mentor.experiences.length > 0) ||
          (mentor.certifications && mentor.certifications.length > 0)) && (
          <div className="mt-8 pt-6 border-t border-[var(--sb-line)] grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {mentor.experiences && mentor.experiences.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--sb-ink)] mb-3 flex items-center gap-1.5">
                  Kinh nghiệm làm việc
                </h3>
                <div className="space-y-3">
                  {mentor.experiences.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <p className="font-medium text-[var(--sb-ink)]">
                        {exp.position} @ {exp.company}
                      </p>
                      <p className="text-[var(--sb-muted)]">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {mentor.certifications && mentor.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold text-[var(--sb-ink)] mb-3">Chứng chỉ & Bằng cấp</h3>
                <div className="space-y-2">
                  {mentor.certifications.map((cert) => (
                    <div key={cert.id} className="text-xs">
                      <p className="font-medium text-[var(--sb-ink)]">{cert.name}</p>
                      <p className="text-[var(--sb-muted)]">{cert.issuingOrganization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 3 Gói Dịch Vụ Đóng Gói (Catalog Tier 1-3) ── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-[var(--sb-purple)]" />
          <h2 className="text-xl font-semibold text-[var(--sb-ink)] tracking-tight">
            Gói Dịch Vụ Đóng Gói (Productized Services)
          </h2>
        </div>

        {services.length === 0 ? (
          <Card className="p-8 text-center text-sm text-[var(--sb-muted)] bg-white border-[var(--sb-line)]">
            Chuyên gia đang cập nhật các gói dịch vụ. Vui lòng quay lại sau.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              const tierNum = getTierNumber(service.serviceType);
              const deliverableList = parseDeliverables(service.deliverables);
              const formattedPrice = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: service.currency || "VND",
              }).format(service.price);

              return (
                <ServiceTierCard
                  key={service.id}
                  tier={tierNum}
                  title={service.title}
                  duration={`${service.durationMinutes} phút • ${service.totalSessions} buổi`}
                  price={formattedPrice}
                  featured={tierNum === 2}
                  deliverables={deliverableList.map((d) => ({ label: d }))}
                  ctaLabel={tierNum === 1 ? "Chọn Gói Này" : tierNum === 2 ? "Đăng Ký Phỏng Vấn" : "Đăng Ký Lộ Trình"}
                  onSelect={() => handleSelectTier(service)}
                  className="h-full bg-white border-[var(--sb-line)]"
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ── Đánh Giá Từ Mentee ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-5 w-5 text-[var(--sb-purple)]" />
          <h2 className="text-xl font-semibold text-[var(--sb-ink)] tracking-tight">
            Đánh Giá Từ Học Viên ({reviews.length})
          </h2>
        </div>

        {reviews.length === 0 ? (
          <Card className="p-8 text-center text-sm text-[var(--sb-muted)] bg-white border-[var(--sb-line)]">
            Chưa có đánh giá nào cho chuyên gia này.
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-5 bg-white border-[var(--sb-line)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#eee7f6] text-[var(--sb-purple)] font-semibold flex items-center justify-center text-sm flex-shrink-0">
                    H
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-[var(--sb-ink)]">
                        Học viên SkillBridge
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f8f0] text-[#1e824c] font-medium">
                        Đã xác thực qua Escrow
                      </span>
                      <span className="text-xs text-[var(--sb-muted)] ml-auto">
                        {review.createdAtUtc ? new Date(review.createdAtUtc).toLocaleDateString("vi-VN") : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating value={review.overallRating} readOnly size="sm" />
                      {review.expertiseRating && (
                        <span className="text-xs text-[var(--sb-muted)]">
                          • Chuyên môn: {review.expertiseRating}/5 • Truyền đạt: {review.communicationRating}/5
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--sb-ink)] leading-relaxed">
                      {review.comment}
                    </p>

                    {review.mentorReply && (
                      <div className="mt-3 rounded-xl bg-[#faf9f6] border border-[var(--sb-line)] p-3 text-xs text-[var(--sb-muted)]">
                        <span className="font-semibold text-[var(--sb-purple)] block mb-1">
                          Phản hồi từ {displayName}:
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
