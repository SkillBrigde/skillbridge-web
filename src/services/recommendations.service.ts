/**
 * Recommendations API service — calls BFF proxy `/api/v1/recommendations/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  RecommendedMentorResponse,
  MentorMetricsResponse,
  TrendingSkillResponse,
  InteractionRequest,
} from "@/types/api";

const BASE = "/api/v1/recommendations";

export function getRecommendedMentors(params?: {
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<RecommendedMentorResponse>>(`${BASE}/mentors`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getRecommendedMentorsForSkill(
  skillId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<RecommendedMentorResponse>>(
    `${BASE}/mentors/for-skill/${skillId}`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function recordInteraction(data: InteractionRequest) {
  return http.post<void>(`${BASE}/interactions`, data);
}

export function getMentorMetrics(mentorId: string) {
  return http.get<MentorMetricsResponse>(`${BASE}/mentors/${mentorId}/metrics`);
}

export function getTrendingSkills() {
  return http.get<TrendingSkillResponse[]>(`${BASE}/trending-skills`);
}
