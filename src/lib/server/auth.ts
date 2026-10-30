import "server-only";
import { cookies } from "next/headers";
import type { Role } from "@/lib/domain";

const ACCESS_COOKIE = "sb_access";
const REFRESH_COOKIE = "sb_refresh";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt?: string;
}

export interface BackendAuth {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function parseRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const role = value.toLowerCase();
  return role === "mentee" || role === "mentor" || role === "admin"
    ? role
    : null;
}

export function getBackendBaseUrl(): string {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";
  return baseUrl.replace(/\/$/, "");
}

export async function backendFetch(path: string, options: RequestInit = {}) {
  const baseUrl = getBackendBaseUrl();
  return fetch(`${baseUrl}/api/v1/identity/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

export async function saveSession(data: BackendAuth): Promise<SessionUser> {
  const role = parseRole(data.role);
  if (
    !role ||
    typeof data.userId !== "string" ||
    !data.userId ||
    typeof data.fullName !== "string" ||
    typeof data.email !== "string" ||
    typeof data.accessToken !== "string" ||
    !data.accessToken ||
    typeof data.refreshToken !== "string" ||
    !data.refreshToken ||
    !Number.isFinite(data.expiresIn) ||
    data.expiresIn <= 0
  ) {
    throw new Error("Invalid authentication response");
  }
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, data.accessToken, {
    ...cookieOptions,
    maxAge: data.expiresIn,
  });
  jar.set(REFRESH_COOKIE, data.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });
  return { id: data.userId, fullName: data.fullName, email: data.email, role };
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  jar.set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export async function sessionTokens() {
  const jar = await cookies();
  return {
    access: jar.get(ACCESS_COOKIE)?.value,
    refresh: jar.get(REFRESH_COOKIE)?.value,
  };
}

export async function tryRefreshTokens(): Promise<string | null> {
  const tokens = await sessionTokens();
  if (!tokens.refresh) return null;
  try {
    const response = await backendFetch("auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: tokens.refresh }),
    });
    if (response.ok) {
      const data: BackendAuth = await response.json();
      await saveSession(data);
      return data.accessToken;
    }
  } catch {
    /* Silent refresh failure */
  }
  return null;
}

export async function readSession(): Promise<SessionUser | null> {
  const tokens = await sessionTokens();
  if (!tokens.access && !tokens.refresh) return null;
  if (tokens.access) {
    const response = await backendFetch("users/me", {
      headers: { Authorization: `Bearer ${tokens.access}` },
    });
    if (response.ok) {
      const data = await response.json();
      const role = parseRole(data.role);
      if (!data.id || !role) throw new Error("Invalid user response");
      return {
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role,
        avatar: data.avatarUrl,
        createdAt: data.createdAtUtc,
      };
    }
    if (response.status !== 401) throw new Error("Session service unavailable");
  }
  if (tokens.refresh) {
    const response = await backendFetch("auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: tokens.refresh }),
    });
    if (response.ok) return saveSession(await response.json());
    if (response.status !== 401 && response.status !== 400)
      throw new Error("Session service unavailable");
  }
  await clearSession();
  return null;
}
