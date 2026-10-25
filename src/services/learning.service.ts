/**
 * Learning API service — calls BFF proxy `/api/v1/learning/sessions/*`
 */
import { http, httpAuthClient } from "@/lib/http-auth-client";
import type {
  PagedResult,
  LearningSessionResponse,
  StartSessionRequest,
  SessionNoteResponse,
  NoteRequest,
  SessionMaterialResponse,
  ActionItemResponse,
  ActionItemRequest,
  ActionCompletionRequest,
} from "@/types/api";

const BASE = "/api/v1/learning/sessions";

/* ---- Sessions ---- */

export function listLearningSessions(params?: {
  bookingId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return http.get<PagedResult<LearningSessionResponse>>(BASE, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getLearningSession(sessionId: string) {
  return http.get<LearningSessionResponse>(`${BASE}/${sessionId}`);
}

export function startLearningSession(
  sessionId: string,
  data: StartSessionRequest,
) {
  return http.post<void>(`${BASE}/${sessionId}/start`, data);
}

export function endLearningSession(sessionId: string) {
  return http.post<void>(`${BASE}/${sessionId}/end`);
}

export function joinLearningSession(sessionId: string) {
  return http.post<void>(`${BASE}/${sessionId}/join`);
}

export function leaveLearningSession(sessionId: string) {
  return http.post<void>(`${BASE}/${sessionId}/leave`);
}

/* ---- Notes ---- */

export function getSessionNotes(
  sessionId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<SessionNoteResponse>>(
    `${BASE}/${sessionId}/notes`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function addSessionNote(sessionId: string, data: NoteRequest) {
  return http.post<SessionNoteResponse>(`${BASE}/${sessionId}/notes`, data);
}

export function updateSessionNote(
  sessionId: string,
  noteId: string,
  data: NoteRequest,
) {
  return http.put<void>(`${BASE}/${sessionId}/notes/${noteId}`, data);
}

export function deleteSessionNote(sessionId: string, noteId: string) {
  return http.delete<void>(`${BASE}/${sessionId}/notes/${noteId}`);
}

/* ---- Materials ---- */

export function getSessionMaterials(
  sessionId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<SessionMaterialResponse>>(
    `${BASE}/${sessionId}/materials`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

/**
 * Upload a material file using raw binary transfer and X-File-Name header.
 * Maximum file size: 10 MiB.
 */
export async function uploadSessionMaterial(
  sessionId: string,
  file: File,
): Promise<SessionMaterialResponse> {
  const encodedName = encodeURIComponent(file.name);
  const response = await httpAuthClient(`${BASE}/${sessionId}/materials`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "X-File-Name": encodedName,
    },
    body: file,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || "Không thể tải lên tài liệu.");
  }

  return response.json();
}

export function deleteSessionMaterial(sessionId: string, materialId: string) {
  return http.delete<void>(`${BASE}/${sessionId}/materials/${materialId}`);
}

export function getMaterialDownloadUrl(sessionId: string, materialId: string): string {
  return `${BASE}/${sessionId}/materials/${materialId}/download`;
}

/* ---- Action Items ---- */

export function getActionItems(
  sessionId: string,
  params?: { page?: number; pageSize?: number },
) {
  return http.get<PagedResult<ActionItemResponse>>(
    `${BASE}/${sessionId}/action-items`,
    { params: params as Record<string, string | number | boolean | undefined> },
  );
}

export function addActionItem(sessionId: string, data: ActionItemRequest) {
  return http.post<ActionItemResponse>(
    `${BASE}/${sessionId}/action-items`,
    data,
  );
}

export function completeActionItem(
  sessionId: string,
  itemId: string,
  data: ActionCompletionRequest,
) {
  return http.patch<void>(`${BASE}/${sessionId}/action-items/${itemId}`, data);
}
