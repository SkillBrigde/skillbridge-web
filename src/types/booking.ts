import type {
  BookingRec,
  BookingStatus,
  BookingStatusRec,
  Slot,
  EscrowState,
} from "@/lib/domain";

export type {
  BookingRec,
  BookingStatus,
  BookingStatusRec,
  Slot as BookingSessionSlot,
  EscrowState,
};

export type Booking = BookingRec;

export interface IntakeSurvey {
  coreIssue: string;
  repoOrDriveUrl?: string;
  outputExpectation: string;
}
