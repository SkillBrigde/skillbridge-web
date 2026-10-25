/**
 * Messaging Module DTOs — `/api/v1/messaging`
 *
 * Maps to .NET `SkillBridge.Modules.Messaging` response shapes.
 */

/* ------------------------------------------------------------------ */
/*  Requests                                                          */
/* ------------------------------------------------------------------ */

export interface CreateConversationRequest {
  participantId: string;
  bookingId?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface EditMessageRequest {
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Responses                                                         */
/* ------------------------------------------------------------------ */

export interface ConversationResponse {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: MessageResponse;
  unreadCount: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface ConversationParticipant {
  userId: string;
  fullName: string;
  role: string;
  joinedAtUtc: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sequence: number;
  isFlagged: boolean;
  isEdited: boolean;
  createdAtUtc: string;
  updatedAtUtc?: string;
}

export interface CursorPagedMessages {
  items: MessageResponse[];
  nextCursor?: string;
  hasMore: boolean;
}
