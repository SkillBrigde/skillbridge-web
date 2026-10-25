import { Suspense } from "react";
import { BookingWizardView } from "@/features/booking";

export default function MentorBookingPage() {
  return (
    <Suspense fallback={<div className="sb-page-state">Đang tải…</div>}>
      <BookingWizardView />
    </Suspense>
  );
}
