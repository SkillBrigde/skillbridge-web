/**
 * Recommendations Module DTOs — `/api/v1/recommendations`
 *
 * Maps to .NET `SkillBridge.Modules.Recommendations` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export interface InteractionRequest {
  mentorId: string;
  type: string;
}

/* ------------------------------------------------------------------ */
/*  Responses                                                         */
/* ------------------------------------------------------------------ */

export interface RecommendedMentorResponse {
  mentorId: string;
  fullName: string;
  headline: string;
  hourlyRate: number;
  currency: string;
  ratingAverage: number;
  totalReviews: number;
  totalSessions: number;
  verificationStatus: string;
  score: number;
  skills: string[];
}

export interface MentorMetricsResponse {
  mentorId: string;
  totalSessions: number;
  totalReviews: number;
  averageRating: number;
  completionRate: number;
  repeatMenteeRate: number;
  updatedAtUtc: string;
}

export interface TrendingSkillResponse {
  skillId: string;
  skillName: string;
  interactionCount: number;
}
