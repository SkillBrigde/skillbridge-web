import "server-only";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { cookies, headers } from "next/headers";
import type { Role } from "@/lib/domain";

/**
 * Zero-token-in-browser session (BFF token handler).
 *
 * The browser only ever holds one opaque `__Host-session` cookie. It contains
 * the Identity access token and refresh token encrypted with AES-256-GCM, so
 * JavaScript (and therefore XSS) can never read either token.
 */
const SESSION_COOKIE = "__Host-session";
/** Cookies written by previous BFF versions; removed on every session write. */
const LEGACY_COOKIES = ["sb_access", "sb_refresh"];
const REFRESH_LIFETIME_SECONDS = 7 * 24 * 60 * 60;
/** Refresh slightly before the JWT really expires to avoid edge 401s. */
const ACCESS_SKEW_MS = 30_000;
const cookieOptions = {
  httpOnly: true,
  // `__Host-` requires Secure, Path=/ and no Domain. Browsers accept Secure
  // cookies on http://localhost, so this also works during development.
  secure: true,
  sameSite: "strict" as const,
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

interface SessionTokens {
  /** Access token (JWT, 15 minutes). */
  a: string;
  /** Raw `refreshToken` cookie value issued by Identity (7 days). */
  r: string;
  /** Access token expiry, epoch ms. */
  e: number;
  /** Absolute session expiry, epoch ms (refresh rotation never extends it). */
  x: number;
}

/** Raised for upstream failures that must surface as "service unavailable". */
export class AuthServiceError extends Error {}

/** Raised when Identity rejects a request with a client error. */
export class AuthProblemError extends Error {
  constructor(
    public status: number,
    public problem: Record<string, unknown> | null,
  ) {
    super(`Identity responded with ${status}`);
  }
}

export function parseRole(value: unknown): Role | null {
  if (typeof value !== "string") return null;
  const role = value.toLowerCase();
  return role === "mentee" || role === "mentor" || role === "admin"
    ? role
    : null;
}

/* ------------------------------------------------------------------ */
/* Cookie encryption                                                   */
/* ------------------------------------------------------------------ */

const DEV_SECRET = "skillbridge-development-session-secret-do-not-use";

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production")
      throw new AuthServiceError("SESSION_SECRET must be at least 32 chars");
    return createHash("sha256").update(DEV_SECRET).digest();
  }
  return createHash("sha256").update(secret).digest();
}

function seal(tokens: SessionTokens) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sessionKey(), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(tokens), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

function unseal(value: string): SessionTokens | null {
  try {
    const raw = Buffer.from(value, "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv(
      "aes-256-gcm",
      sessionKey(),
      raw.subarray(0, 12),
    );
    decipher.setAuthTag(raw.subarray(12, 28));
    const json = Buffer.concat([
      decipher.update(raw.subarray(28)),
      decipher.final(),
    ]).toString("utf8");
    const data = JSON.parse(json);
    if (
      typeof data?.a !== "string" ||
      typeof data?.r !== "string" ||
      !Number.isFinite(data?.e) ||
      !Number.isFinite(data?.x)
    )
      return null;
    return data;
  } catch (error) {
    if (error instanceof AuthServiceError) throw error;
    return null;
  }
}

async function writeSession(tokens: SessionTokens) {
  const maxAge = Math.floor((tokens.x - Date.now()) / 1000);
  if (maxAge <= 0) return clearSession();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, seal(tokens), { ...cookieOptions, maxAge });
  for (const name of LEGACY_COOKIES)
    if (jar.has(name)) jar.set(name, "", { path: "/", maxAge: 0 });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  for (const name of LEGACY_COOKIES)
    if (jar.has(name)) jar.set(name, "", { path: "/", maxAge: 0 });
}

async function readTokens(): Promise<SessionTokens | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;
  const tokens = unseal(value);
  if (!tokens || tokens.x <= Date.now()) {
    await clearSession();
    return null;
  }
  return tokens;
}

/* ------------------------------------------------------------------ */
/* Identity API                                                        */
/* ------------------------------------------------------------------ */

export async function backendFetch(path: string, options: RequestInit = {}): Promise<Response> {

  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000";
  const incoming = await headers();
  // Identity rate-limits /auth per client IP; forward the browser's address
  // so all users are not throttled as the single BFF host.
  const forwardedFor =
    incoming.get("x-forwarded-for") || incoming.get("x-real-ip");
  return fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/identity/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
      ...options.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

async function readProblem(response: Response) {
  const data = await response.json().catch(() => null);
  return data && typeof data === "object"
    ? (data as Record<string, unknown>)
    : null;
}

/** Extracts the raw `refreshToken` value from Identity's Set-Cookie headers. */
function refreshTokenFrom(response: Response) {
  for (const header of response.headers.getSetCookie()) {
    const match = /^\s*refreshToken=([^;]*)/.exec(header);
    if (match && match[1]) return match[1];
  }
  return null;
}

/** Turns a login/refresh response into session tokens or throws. */
async function tokensFrom(
  response: Response,
  absoluteExpiry: number,
): Promise<SessionTokens> {
  const data = await response.json().catch(() => null);
  const refresh = refreshTokenFrom(response);
  if (
    typeof data?.accessToken !== "string" ||
    !data.accessToken ||
    !Number.isFinite(data?.expiresIn) ||
    data.expiresIn <= 0 ||
    !refresh
  )
    throw new AuthServiceError("Invalid authentication response");
  return {
    a: data.accessToken,
    r: refresh,
    e: Date.now() + data.expiresIn * 1000,
    x: absoluteExpiry,
  };
}

async function fetchMe(accessToken: string): Promise<SessionUser | null> {
  const response = await backendFetch("users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new AuthServiceError("Session service unavailable");
  const data = await response.json().catch(() => null);
  const role = parseRole(data?.role);
  if (
    typeof data?.id !== "string" ||
    !data.id ||
    typeof data.email !== "string" ||
    typeof data.fullName !== "string" ||
    !role
  )
    throw new AuthServiceError("Invalid user response");
  return {
    id: data.id,
    fullName: data.fullName,
    email: data.email,
    role,
    avatar: typeof data.avatarUrl === "string" ? data.avatarUrl : undefined,
    createdAt:
      typeof data.createdAtUtc === "string" ? data.createdAtUtc : undefined,
  };
}

/*
 * Identity treats reuse of a rotated refresh token as replay and revokes every
 * session of the account. Parallel requests carrying the same (old) cookie
 * must therefore share a single rotation and its result.
 */
const ROTATION_REUSE_MS = 60_000;
const rotations = new Map<
  string,
  { promise: Promise<SessionTokens | null>; settledAt?: number }
>();

function rotate(tokens: SessionTokens): Promise<SessionTokens | null> {
  const now = Date.now();
  for (const [key, entry] of rotations)
    if (entry.settledAt && now - entry.settledAt > ROTATION_REUSE_MS)
      rotations.delete(key);
  const existing = rotations.get(tokens.r);
  if (existing) return existing.promise;
  const entry: { promise: Promise<SessionTokens | null>; settledAt?: number } =
    {
      promise: (async () => {
        const response = await backendFetch("auth/refresh", {
          method: "POST",
          headers: { Cookie: `refreshToken=${tokens.r}` },
        });
        if (response.status === 401 || response.status === 400) return null;
        if (!response.ok) throw new AuthServiceError("Refresh unavailable");
        return tokensFrom(response, tokens.x);
      })(),
    };
  entry.promise.then(
    () => (entry.settledAt = Date.now()),
    () => rotations.delete(tokens.r),
  );
  rotations.set(tokens.r, entry);
  return entry.promise;
}

/* ------------------------------------------------------------------ */
/* Public session operations                                           */
/* ------------------------------------------------------------------ */

/** Email/password login: Identity login → users/me → encrypted cookie. */
export async function loginWithPassword(
  email: string,
  password: string,
): Promise<SessionUser> {
  const response = await backendFetch("auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const problem = await readProblem(response);
    if (response.status >= 500)
      throw new AuthServiceError("Identity unavailable");
    throw new AuthProblemError(response.status, problem);
  }
  const tokens = await tokensFrom(
    response,
    Date.now() + REFRESH_LIFETIME_SECONDS * 1000,
  );
  const user = await fetchMe(tokens.a);
  if (!user) throw new AuthServiceError("Fresh access token was rejected");
  await writeSession(tokens);
  return user;
}

/** Creates the account; Identity returns only `{ id }`, so log in afterwards. */
export async function registerAccount(input: {
  email: string;
  password: string;
  fullName: string;
  role: "Mentor" | "Mentee";
}) {
  const response = await backendFetch("auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const problem = await readProblem(response);
    if (response.status >= 500)
      throw new AuthServiceError("Identity unavailable");
    throw new AuthProblemError(response.status, problem);
  }
  return loginWithPassword(input.email, input.password);
}

/** Returns valid tokens, rotating the access token when it has expired. */
async function activeTokens(): Promise<SessionTokens | null> {
  const tokens = await readTokens();
  if (!tokens) return null;
  if (tokens.e - ACCESS_SKEW_MS > Date.now()) return tokens;
  const rotated = await rotate(tokens);
  if (!rotated) {
    await clearSession();
    return null;
  }
  await writeSession(rotated);
  return rotated;
}

export async function readSession(): Promise<SessionUser | null> {
  let tokens = await activeTokens();
  if (!tokens) return null;
  let user = await fetchMe(tokens.a);
  if (user) return user;
  // Access token rejected early (e.g. security stamp changed): try one rotation.
  tokens = await rotate(tokens);
  if (tokens) {
    await writeSession(tokens);
    user = await fetchMe(tokens.a);
    if (user) return user;
  }
  await clearSession();
  return null;
}

/** Revokes every session of the account at Identity, then drops the cookie. */
export async function logout() {
  try {
    const tokens = await activeTokens();
    if (tokens)
      await backendFetch("auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.a}`,
          Cookie: `refreshToken=${tokens.r}`,
        },
      });
  } finally {
    await clearSession();
  }
}
