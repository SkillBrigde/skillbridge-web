export interface FeaturedMentorItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  sessions: number;
  verified: boolean;
  online: boolean;
  services: { label: string; price: string }[];
  availableSlot: string;
}

export const ALL_FEATURED_MENTORS: FeaturedMentorItem[] = [];
