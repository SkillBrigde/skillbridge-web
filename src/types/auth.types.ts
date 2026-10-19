import type { Role, User, Session } from "@/lib/domain";

export type UserRole = Role;
export type UserAccount = User;
export type UserSessionState = Session;

export interface AuthSessionUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
  balance?: number;
  mentorId?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthSessionUser;
}
