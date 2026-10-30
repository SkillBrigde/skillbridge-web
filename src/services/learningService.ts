import { http, httpAuthClient } from "@/lib/http-auth-client";
import type { PagedResult } from "./common.types";

export interface LearningSessionDto {
  id: string;
  bookingId: string;
  bookingSessionId: string;
  sessionNumber: number;
  mentorId: string;
  menteeId: string;
  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
  roomUrl?: string | null;
  scheduledStartUtc: string;
  scheduledEndUtc: string;
  actualStartUtc?: string | null;
  actualEndUtc?: string | null;
}

export interface NoteDto {
  id: string;
  authorId: string;
  content: string;
  isPrivate: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface ActionItemDto {
  id: string;
  assignedTo: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  isCompleted: boolean;
  completedAtUtc?: string | null;
}

export interface MaterialDto {
  id: string;
  uploadedBy: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  sha256: string;
  downloadUrl?: string;
  createdAtUtc: string;
}

export const learningService = {
  getSessions: async (params?: {
    bookingId?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<LearningSessionDto>> => {
    return http.get<PagedResult<LearningSessionDto>>(
      "/api/v1/learning/sessions",
      {
        params: {
          bookingId: params?.bookingId,
          status: params?.status,
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
        },
      },
    );
  },

  getSession: async (sessionId: string): Promise<LearningSessionDto> => {
    return http.get<LearningSessionDto>(
      `/api/v1/learning/sessions/${sessionId}`,
    );
  },

  startSession: async (
    sessionId: string,
    roomUrl: string,
  ): Promise<void> => {
    await http.post(`/api/v1/learning/sessions/${sessionId}/start`, {
      roomUrl,
    });
  },

  endSession: async (sessionId: string): Promise<void> => {
    await http.post(`/api/v1/learning/sessions/${sessionId}/end`);
  },

  joinSession: async (sessionId: string): Promise<void> => {
    await http.post(`/api/v1/learning/sessions/${sessionId}/join`);
  },

  leaveSession: async (sessionId: string): Promise<void> => {
    await http.post(`/api/v1/learning/sessions/${sessionId}/leave`);
  },

  getNotes: async (
    sessionId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PagedResult<NoteDto>> => {
    return http.get<PagedResult<NoteDto>>(
      `/api/v1/learning/sessions/${sessionId}/notes`,
      {
        params: { page, pageSize },
      },
    );
  },

  createNote: async (
    sessionId: string,
    content: string,
    isPrivate = false,
  ): Promise<NoteDto> => {
    return http.post<NoteDto>(
      `/api/v1/learning/sessions/${sessionId}/notes`,
      {
        content,
        isPrivate,
      },
    );
  },

  updateNote: async (
    sessionId: string,
    noteId: string,
    content: string,
    isPrivate = false,
  ): Promise<void> => {
    await http.put(
      `/api/v1/learning/sessions/${sessionId}/notes/${noteId}`,
      {
        content,
        isPrivate,
      },
    );
  },

  deleteNote: async (sessionId: string, noteId: string): Promise<void> => {
    await http.delete(
      `/api/v1/learning/sessions/${sessionId}/notes/${noteId}`,
    );
  },

  getActionItems: async (
    sessionId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PagedResult<ActionItemDto>> => {
    return http.get<PagedResult<ActionItemDto>>(
      `/api/v1/learning/sessions/${sessionId}/action-items`,
      {
        params: { page, pageSize },
      },
    );
  },

  createActionItem: async (
    sessionId: string,
    item: {
      assignedTo: string;
      title: string;
      description?: string;
      dueDate?: string;
    },
  ): Promise<ActionItemDto> => {
    return http.post<ActionItemDto>(
      `/api/v1/learning/sessions/${sessionId}/action-items`,
      item,
    );
  },

  toggleActionItem: async (
    sessionId: string,
    itemId: string,
    isCompleted: boolean,
  ): Promise<void> => {
    await http.patch(
      `/api/v1/learning/sessions/${sessionId}/action-items/${itemId}`,
      { isCompleted },
    );
  },

  getMaterials: async (
    sessionId: string,
    page = 1,
    pageSize = 50,
  ): Promise<PagedResult<MaterialDto>> => {
    return http.get<PagedResult<MaterialDto>>(
      `/api/v1/learning/sessions/${sessionId}/materials`,
      {
        params: { page, pageSize },
      },
    );
  },

  uploadMaterial: async (
    sessionId: string,
    file: File,
  ): Promise<MaterialDto> => {
    const buffer = await file.arrayBuffer();
    const encodedName = encodeURIComponent(file.name);
    const res = await httpAuthClient(
      `/api/v1/learning/sessions/${sessionId}/materials`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodedName,
        },
        body: buffer,
      },
    );
    if (!res.ok) {
      throw new Error("Không thể tải lên tài liệu học tập.");
    }
    return res.json();
  },

  getMaterialDownloadUrl: (sessionId: string, materialId: string): string => {
    return `/api/v1/learning/sessions/${sessionId}/materials/${materialId}/download`;
  },
};
