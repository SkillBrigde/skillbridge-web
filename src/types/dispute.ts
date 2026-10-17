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

import type { DisputeRec } from "@/lib/domain";

export type DisputeRecord = DisputeRec;

