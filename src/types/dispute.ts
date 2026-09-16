export type DisputeStatus =
  | "PendingReview"
  | "MentorResponded"
  | "UnderAdminReview"
  | "Resolved";

export type DisputeReason =
  | "MentorLate"
  | "NoShow"
  | "WrongContent"
  | "TechnicalIssue";

export type DisputeRuling =
  | "FullRefund"
  | "Split5050"
  | "MakeUpSession"
  | "ReleaseMentor";

export interface DisputeEvidence {
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedBy: "Mentee" | "Mentor";
  uploadedAt: string;
}

export interface DisputeRecord {
  id: string;
  disputeCode: string;
  bookingId: string;
  bookingCode: string;
  menteeName: string;
  mentorName: string;
  reason: DisputeReason;
  menteeStatement: string;
  mentorStatement?: string;
  evidences: DisputeEvidence[];
  amountVnd: number;
  status: DisputeStatus;
  ruling?: DisputeRuling;
  slaExpiresAtUtc: string;
  createdAtUtc: string;
}
