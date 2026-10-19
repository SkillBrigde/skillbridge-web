import { buildSeed } from "@/lib/seed";
import { vndShort } from "@/lib/domain";

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

// Derive dynamically from single source of truth in seed.ts
const initialSeed = buildSeed(0);

export const ALL_FEATURED_MENTORS: FeaturedMentorItem[] = initialSeed.mentors.map((m) => ({
  id: m.id,
  name: m.fullName,
  role: `${m.title} • ${m.yearsOfExperience} YOE`,
  rating: m.ratingAverage,
  reviews: m.reviewCount,
  sessions: m.totalSessions,
  verified: m.isVerified,
  online: m.isOnline,
  services: m.services.map((s) => ({
    label: s.name.length > 22 ? s.name.slice(0, 22) + "..." : s.name,
    price: vndShort(s.priceVnd),
  })),
  availableSlot: "19:30 Thứ 6",
}));
