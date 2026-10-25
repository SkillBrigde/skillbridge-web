/**
 * Catalog Module DTOs — `/api/v1/catalog`
 *
 * Maps to .NET `SkillBridge.Modules.Catalog` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Categories                                                        */
/* ------------------------------------------------------------------ */

export interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
  children?: CategoryResponse[];
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentId?: string;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name: string;
  description: string;
  parentId?: string;
  displayOrder?: number;
}

/* ------------------------------------------------------------------ */
/*  Skills                                                            */
/* ------------------------------------------------------------------ */

export interface SkillResponse {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  isActive: boolean;
  tags: TagResponse[];
}

export interface CreateSkillRequest {
  name: string;
  description: string;
  categoryId: string;
  tagIds?: string[];
}

export interface UpdateSkillRequest {
  name: string;
  description: string;
  categoryId: string;
  tagIds?: string[];
}

/* ------------------------------------------------------------------ */
/*  Tags                                                              */
/* ------------------------------------------------------------------ */

export interface TagResponse {
  id: string;
  name: string;
}

export interface CreateTagRequest {
  name: string;
}

/* ------------------------------------------------------------------ */
/*  Mentor Services (Productized Services — Tier 1-3)                 */
/* ------------------------------------------------------------------ */

export type ServiceType =
  | "Tier1_ReviewCV"
  | "Tier2_MockInterview"
  | "Tier3_Roadmap";

export interface MentorServiceResponse {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  durationMinutes: number;
  price: number;
  currency: string;
  totalSessions: number;
  deliverables: string;
  isActive: boolean;
  version: number;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
}

export interface MentorServiceRequest {
  title: string;
  description: string;
  serviceType: ServiceType;
  durationMinutes: number;
  price: number;
  currency?: string;
  totalSessions: number;
  deliverables: string;
  isActive?: boolean;
}
