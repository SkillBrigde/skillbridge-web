export interface MentorServiceTier {
  id: string;
  tierNumber: 1 | 2 | 3;
  name: string;
  durationMinutes: number;
  durationLabel: string;
  priceVnd: number;
  deliverables: string[];
  isFeatured?: boolean;
  category: "QUICK_WIN" | "FEATURED" | "TRANSFORMATION";
}

export interface MentorProfile {
  id: string;
  fullName: string;
  title: string;
  company: string;
  yearsOfExperience: number;
  avatarUrl: string;
  ratingAverage: number;
  reviewCount: number;
  totalSessions: number;
  satisfactionRate: number;
  slaResponseTime: string;
  skills: string[];
  bio: string;
  isVerified: boolean;
  isOnline: boolean;
  nextAvailableSlot?: string;
  services: MentorServiceTier[];
}
