import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";

export interface ReviewDto {
  id: string;
  mentorId: string;
  overallRating: number;
  communicationRating: number;
  expertiseRating: number;
  helpfulnessRating: number;
  comment: string;
  mentorReply?: string | null;
  mentorRepliedAtUtc?: string | null;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface ReviewSummaryDto {
  mentorId: string;
  averageOverall: number;
  averageCommunication: number;
  averageExpertise: number;
  averageHelpfulness: number;
  totalReviews: number;
}

export interface PendingReviewDto {
  bookingId: string;
  mentorId: string;
  sessionId: string;
}

export interface SubmitReviewInput {
  bookingId: string;
  sessionId: string;
  mentorId: string;
  overallRating: number;
  communicationRating: number;
  expertiseRating: number;
  helpfulnessRating: number;
  comment: string;
}

export const reviewService = {
  submitReview: async (input: SubmitReviewInput): Promise<ReviewDto> => {
    return http.post<ReviewDto>("/api/v1/reviews", input);
  },

  getReview: async (reviewId: string): Promise<ReviewDto> => {
    return http.get<ReviewDto>(`/api/v1/reviews/${reviewId}`);
  },

  updateReview: async (
    reviewId: string,
    data: {
      overallRating: number;
      communicationRating?: number;
      expertiseRating?: number;
      helpfulnessRating?: number;
      comment: string;
    },
  ): Promise<void> => {
    await http.put(`/api/v1/reviews/${reviewId}`, data);
  },

  replyReview: async (reviewId: string, reply: string): Promise<void> => {
    await http.post(`/api/v1/reviews/${reviewId}/reply`, { reply });
  },

  getMentorReviews: async (
    mentorId: string,
    page = 1,
    pageSize = 10,
  ): Promise<PagedResult<ReviewDto>> => {
    return http.get<PagedResult<ReviewDto>>(
      `/api/v1/reviews/mentors/${mentorId}`,
      {
        params: { page, pageSize },
      },
    );
  },

  getMentorReviewSummary: async (
    mentorId: string,
  ): Promise<ReviewSummaryDto> => {
    return http.get<ReviewSummaryDto>(
      `/api/v1/reviews/mentors/${mentorId}/summary`,
    );
  },

  getMyPendingReviews: async (
    page = 1,
    pageSize = 10,
  ): Promise<PagedResult<PendingReviewDto>> => {
    return http.get<PagedResult<PendingReviewDto>>(
      "/api/v1/reviews/my-pending",
      {
        params: { page, pageSize },
      },
    );
  },
};
