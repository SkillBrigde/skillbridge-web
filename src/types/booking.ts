export type BookingStatus =
  | "Draft"
  | "PendingPayment"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "Disputed";

export interface IntakeSurvey {
  coreIssue: string;
  repoOrDriveUrl?: string;
  outputExpectation: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  menteeId: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  serviceTierId: string;
  serviceTitle: string;
  amountVnd: number;
  scheduledStartUtc: string;
  scheduledEndUtc: string;
  status: BookingStatus;
  intakeSurvey?: IntakeSurvey;
  escrowStatus: "Holding" | "Released" | "Refunded" | "Disputed";
  escrowContractId?: string;
  createdAt: string;
}
