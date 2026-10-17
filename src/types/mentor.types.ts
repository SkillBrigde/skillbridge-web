export * from "./mentor";
import type { MentorRec } from "@/lib/domain";
export type { MentorRec };

export interface MentorSocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface MentorReviewStats {
  averageRating: number;
  totalReviews: number;
  completionRate: number;
}
