import {
  Zap,
  Terminal,
  ShieldCheck,
  Sparkles,
  Award,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface PopularDomain {
  name: string;
  mentors: string;
  icon: LucideIcon;
}

export const POPULAR_DOMAINS: PopularDomain[] = [
  { name: "System Design & Architecture", mentors: "28 Mentors", icon: Zap },
  { name: "Cloud, DevOps & Kubernetes", mentors: "34 Mentors", icon: Terminal },
  { name: "Backend (.NET, Go, Java, Node)", mentors: "45 Mentors", icon: ShieldCheck },
  { name: "AI / ML & Data Engineering", mentors: "22 Mentors", icon: Sparkles },
  { name: "Frontend & Fullstack Next.js", mentors: "30 Mentors", icon: Award },
  { name: "Mock Interview & CV Tuning", mentors: "38 Mentors", icon: Users },
];
