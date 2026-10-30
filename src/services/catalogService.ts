import { http } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  children?: CategoryDto[];
}

export interface SkillDto {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  isActive: boolean;
}

export interface TrendingSkillDto {
  skillId: string;
  name: string;
  trendingScore: number;
}

export const catalogService = {
  getCategories: async (isTree = false): Promise<CategoryDto[]> => {
    return http.get<CategoryDto[]>("/api/v1/catalog/categories", {
      params: { isTree },
    });
  },

  getSkills: async (params?: {
    categoryId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<SkillDto>> => {
    return http.get<PagedResult<SkillDto>>("/api/v1/catalog/skills", {
      params: {
        categoryId: params?.categoryId,
        search: params?.search,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 50,
      },
    });
  },

  getTrendingSkills: async (): Promise<TrendingSkillDto[]> => {
    try {
      return await http.get<TrendingSkillDto[]>(
        "/api/v1/recommendations/trending-skills",
      );
    } catch {
      return [];
    }
  },
};
