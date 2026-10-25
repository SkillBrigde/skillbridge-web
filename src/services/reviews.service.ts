/**
 * Reviews API service — calls BFF proxy `/api/v1/reviews/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  PublicReviewResponse,
  ReviewSummaryResponse,
  PendingReviewItem,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReplyReviewRequest,
} from "@/types/api";

const BASE = "/api/v1/reviews";

export function createReview(data: CreateReviewRequest) {
  return http.post<PublicReviewResponse>(BASE, data);
}

export function getReview(reviewId: string) {
  return http.get<PublicReviewResponse>(`${BASE}/${reviewId}`);
}

export function updateReview(reviewId: string, data: UpdateReviewRequest) {
  return http.put<void>(`${BASE}/${reviewId}`, data);
}

export function replyReview(reviewId: string, data: ReplyReviewRequest) {
  return http.post<void>(`${BASE}/${reviewId}/reply`, data);
}

export function getMentorReviews(
  mentorId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<PublicReviewResponse>>(
    `${BASE}/mentors/${mentorId}`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function getMentorReviewSummary(mentorId: string) {
  return http.get<ReviewSummaryResponse>(`${BASE}/mentors/${mentorId}/summary`);
}

export function getMyPendingReviews(params?: {
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<PendingReviewItem>>(`${BASE}/my-pending`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
