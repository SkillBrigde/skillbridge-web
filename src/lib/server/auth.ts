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

interface BackendToken {
  accessToken: string;
  expiresIn: number;
}

export function parseRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const role = value.toLowerCase();
  return role === "mentee" || role === "mentor" || role === "admin"
    ? role
    : null;
}

export async function backendFetch(path: string, options: RequestInit = {}) {
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";
  return fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/identity/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

function parseUser(data: unknown): SessionUser {
  if (
    !data ||
    typeof data !== "object" ||
    !("role" in data) ||
    !("id" in data) ||
    !("fullName" in data) ||
    !("email" in data)
  )
    throw new Error("Invalid user response");
  const role = parseRole(data.role);
  if (
    !role ||
    typeof data.id !== "string" ||
    !data.id ||
    typeof data.fullName !== "string" ||
    typeof data.email !== "string"
  )
    throw new Error("Invalid user response");
  return { id: data.id, fullName: data.fullName, email: data.email, role };
}

function refreshTokenFrom(response: Response): string {
  const setCookie = response.headers
    .getSetCookie()
    .find((value) => value.startsWith("refreshToken="));
  const encoded = setCookie?.split(";", 1)[0].slice("refreshToken=".length);
  if (!encoded) throw new Error("Missing refresh token cookie");
  try {
    return decodeURIComponent(encoded);
  } catch {
    throw new Error("Invalid refresh token cookie");
  }
}

export function backendRefreshCookie(token: string): string {
  return `refreshToken=${encodeURIComponent(token)}`;
}

export async function saveSession(response: Response): Promise<SessionUser> {
  const data = (await response.json()) as BackendToken;
  if (
    !data ||
    typeof data.accessToken !== "string" ||
    !data.accessToken ||
    !Number.isFinite(data.expiresIn) ||
    data.expiresIn <= 0
  )
    throw new Error("Invalid authentication response");
  const refreshToken = refreshTokenFrom(response);
  const profile = await backendFetch("users/me", {
    headers: { Authorization: `Bearer ${data.accessToken}` },
  });
  if (!profile.ok) throw new Error("User service unavailable");
  const user = parseUser(await profile.json());
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, data.accessToken, {
    ...cookieOptions,
    maxAge: data.expiresIn,
  });
  jar.set(REFRESH_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });
  return user;
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

export async function readSession(): Promise<SessionUser | null> {
  const tokens = await sessionTokens();
  if (!tokens.access && !tokens.refresh) return null;
  if (tokens.access) {
    const response = await backendFetch("users/me", {
      headers: { Authorization: `Bearer ${tokens.access}` },
    });
    if (response.ok) {
      return parseUser(await response.json());
    }
    if (response.status !== 401) throw new Error("Session service unavailable");
  }
  if (tokens.refresh) {
    const response = await backendFetch("auth/refresh", {
      method: "POST",
      headers: { Cookie: backendRefreshCookie(tokens.refresh) },
    });
    if (response.ok) return saveSession(response);
    if (response.status !== 401 && response.status !== 400)
      throw new Error("Session service unavailable");
  }
  await clearSession();
  return null;
}
