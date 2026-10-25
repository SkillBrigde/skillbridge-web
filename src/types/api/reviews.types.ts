/**
 * Reviews Module DTOs — `/api/v1/reviews`
 *
 * Maps to .NET `SkillBridge.Modules.Reviews` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export interface CreateReviewRequest {
  bookingId: string;
  sessionId: string;
  mentorId: string;
  overallRating: number;
  communicationRating: number;
  expertiseRating: number;
  helpfulnessRating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  overallRating: number;
  comment: string;
  communicationRating?: number;
  expertiseRating?: number;
  helpfulnessRating?: number;
}

export interface ReplyReviewRequest {
  reply: string;
}

/* ------------------------------------------------------------------ */
/*  Responses                                                         */
/* ------------------------------------------------------------------ */

export interface PublicReviewResponse {
  id: string;
  mentorId: string;
  overallRating: number;
  communicationRating: number;
  expertiseRating: number;
  helpfulnessRating: number;
  comment: string;
  mentorReply?: string;
  mentorRepliedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ReviewSummaryResponse {
  mentorId: string;
  averageOverall: number;
  averageCommunication: number;
  averageExpertise: number;
  averageHelpfulness: number;
  totalReviews: number;
}

export interface PendingReviewItem {
  bookingId: string;
  mentorId: string;
  sessionId: string;
}
