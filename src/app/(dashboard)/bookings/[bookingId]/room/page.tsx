import { FeatureUnavailable } from "@/components/layout/FeatureUnavailable";
import { BookingMeetingRoomView } from "@/features/booking";

export default async function MeetingRoomPage(props: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await props.params;
  if (bookingId === "fixture") {
    return <FeatureUnavailable />;
  }
  return <BookingMeetingRoomView />;
}
