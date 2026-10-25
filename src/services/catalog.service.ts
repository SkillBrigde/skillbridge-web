/**
 * Catalog API service — calls BFF proxy `/api/v1/catalog/*`
 */
import { http } from "@/lib/http-auth-client";
import type {
  PagedResult,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  SkillResponse,
  CreateSkillRequest,
  UpdateSkillRequest,
  TagResponse,
  CreateTagRequest,
  MentorServiceResponse,
  MentorServiceRequest,
} from "@/types/api";

const BASE = "/api/v1/catalog";

/* ---- Categories ---- */

export function getCategories(isTree = false) {
  return http.get<CategoryResponse[]>(`${BASE}/categories`, {
    params: { isTree },
  });
}

export function getCategory(categoryId: string) {
  return http.get<CategoryResponse>(`${BASE}/categories/${categoryId}`);
}

export function createCategory(data: CreateCategoryRequest) {
  return http.post<CategoryResponse>(`${BASE}/categories`, data);
}

export function updateCategory(categoryId: string, data: UpdateCategoryRequest) {
  return http.put<void>(`${BASE}/categories/${categoryId}`, data);
}

export function deleteCategory(categoryId: string) {
  return http.delete<void>(`${BASE}/categories/${categoryId}`);
}

/* ---- Skills ---- */

export function getSkills(params?: {
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<SkillResponse>>(`${BASE}/skills`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getSkill(skillId: string) {
  return http.get<SkillResponse>(`${BASE}/skills/${skillId}`);
}

export function createSkill(data: CreateSkillRequest) {
  return http.post<SkillResponse>(`${BASE}/skills`, data);
}

export function updateSkill(skillId: string, data: UpdateSkillRequest) {
  return http.put<void>(`${BASE}/skills/${skillId}`, data);
}

/* ---- Tags ---- */

export function getTags() {
  return http.get<TagResponse[]>(`${BASE}/tags`);
}

export function createTag(data: CreateTagRequest) {
  return http.post<TagResponse>(`${BASE}/tags`, data);
}

/* ---- Mentor Services (Tier 1-3 Productized Services) ---- */

export function getMentorServices(
  mentorId: string,
  params?: { serviceType?: string; page?: number; pageSize?: number },
) {
  return http.get<PagedResult<MentorServiceResponse>>(
    `${BASE}/mentors/${mentorId}/services`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function getMentorService(serviceId: string) {
  return http.get<MentorServiceResponse>(`${BASE}/services/${serviceId}`);
}

export function getMyServices(params?: {
  serviceType?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<MentorServiceResponse>>(`${BASE}/services/me`, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function createMentorService(data: MentorServiceRequest) {
  return http.post<MentorServiceResponse>(`${BASE}/services`, data);
}

export function updateMentorService(
  serviceId: string,
  version: number,
  data: MentorServiceRequest,
) {
  return http.put<MentorServiceResponse>(`${BASE}/services/${serviceId}`, data, {
    headers: { "If-Match": `"${version}"` },
  });
}

export function deleteMentorService(serviceId: string, version: number) {
  return http.delete<void>(`${BASE}/services/${serviceId}`, {
    headers: { "If-Match": `"${version}"` },
  });
}
