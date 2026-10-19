import { FeatureUnavailable } from "@/components/layout/FeatureUnavailable";

// Transactional screens stay unavailable until their server integrations exist.
export default function DashboardLayout() {
  return <FeatureUnavailable />;
}
