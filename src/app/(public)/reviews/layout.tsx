import type { ReactNode } from "react";

export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <div className="sb-reviews-shell min-h-[70vh]">{children}</div>;
}
