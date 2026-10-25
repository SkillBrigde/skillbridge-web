import { FeatureUnavailable } from "@/components/layout/FeatureUnavailable";
import { BookingCheckoutView } from "@/features/booking";

export default async function BookingCheckoutPage(props: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await props.params;
  if (bookingId === "fixture") {
    return <FeatureUnavailable />;
  }
  return <BookingCheckoutView />;
}
