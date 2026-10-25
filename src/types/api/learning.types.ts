/**
 * Learning Module DTOs — `/api/v1/learning/sessions`
 *
 * Maps to .NET `SkillBridge.Modules.Learning` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Session                                                           */
/* ------------------------------------------------------------------ */

export type LearningSessionStatus =
  | "Scheduled"
  | "InProgress"
  | "Completed"
  | "Cancelled";

export interface LearningSessionResponse {
  id: string;
  bookingId: string;
  bookingSessionId: string;
  sessionNumber: number;
  mentorId: string;
  menteeId: string;
  status: LearningSessionStatus;
  roomUrl?: string;
  scheduledStartUtc: string;
  scheduledEndUtc: string;
  actualStartUtc?: string;
  actualEndUtc?: string;
  attendances: SessionAttendanceResponse[];
  createdAtUtc: string;
}

export interface SessionAttendanceResponse {
  userId: string;
  role: string;
  joinedAtUtc?: string;
  leftAtUtc?: string;
}

/* ------------------------------------------------------------------ */
/*  Notes                                                             */
/* ------------------------------------------------------------------ */

export interface SessionNoteResponse {
  id: string;
  sessionId: string;
  authorId: string;
  content: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface NoteRequest {
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Materials                                                         */
/* ------------------------------------------------------------------ */

export interface SessionMaterialResponse {
  id: string;
  sessionId: string;
  uploadedBy: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  createdAtUtc: string;
}

/* ------------------------------------------------------------------ */
/*  Action Items                                                      */
/* ------------------------------------------------------------------ */

export interface ActionItemResponse {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdByUserId: string;
  createdAtUtc: string;
  completedAtUtc?: string;
}

export interface ActionItemRequest {
  title: string;
  description?: string;
}

export interface ActionCompletionRequest {
  isCompleted: boolean;
}

/* ------------------------------------------------------------------ */
/*  Start Session                                                     */
/* ------------------------------------------------------------------ */

export interface StartSessionRequest {
  roomUrl: string;
}
