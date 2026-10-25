import "server-only";
import {
  sessionTokens,
  backendFetch,
  backendRefreshCookie,
  saveSession,
  clearSession,
} from "./auth";

export function getBackendBaseUrl(): string {
  return (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000"
  ).replace(/\/$/, "");
}

const FORWARD_REQ_HEADERS = [
  "content-type",
  "accept",
  "idempotency-key",
  "if-match",
  "if-none-match",
  "x-file-name",
];

const FORWARD_RES_HEADERS = [
  "content-type",
  "etag",
  "cache-control",
  "content-disposition",
  "content-length",
];

export interface ProxyResult {
  response: Response;
  refreshed: boolean;
}

/**
 * Execute an authenticated HTTP request to the .NET backend.
 * Automatically attaches the Bearer token and refreshes it on 401.
 */
export async function executeBackendRequest(
  subPath: string,
  method: string,
  reqHeaders: Headers,
  body?: ArrayBuffer | null,
  timeoutMs = 15000,
): Promise<Response> {
  const baseUrl = getBackendBaseUrl();
  const cleanPath = subPath.startsWith("/") ? subPath.slice(1) : subPath;
  const targetUrl = `${baseUrl}/api/v1/${cleanPath}`;

  const { access, refresh } = await sessionTokens();

  const buildHeaders = (token?: string) => {
    const headers = new Headers();
    for (const name of FORWARD_REQ_HEADERS) {
      const val = reqHeaders.get(name);
      if (val !== null && val !== undefined) {
        headers.set(name, val);
      }
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  };

  const doFetch = (token?: string) =>
    fetch(targetUrl, {
      method,
      headers: buildHeaders(token),
      body: ["GET", "HEAD"].includes(method.toUpperCase()) ? undefined : body ?? undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

  let response: Response;
  try {
    response = await doFetch(access);
  } catch {
    return new Response(
      JSON.stringify({
        title: "Service.Unavailable",
        status: 503,
        detail: "Không thể kết nối đến máy chủ API.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/problem+json" },
      },
    );
  }

  // 401 Interception: Attempt silent refresh with refresh token
  if (response.status === 401 && refresh) {
    try {
      const refreshRes = await backendFetch("auth/refresh", {
        method: "POST",
        headers: { Cookie: backendRefreshCookie(refresh) },
      });

      if (refreshRes.ok) {
        await saveSession(refreshRes);
        const newTokens = await sessionTokens();
        // Retry the original request with the fresh access token
        response = await doFetch(newTokens.access);
      } else {
        await clearSession();
      }
    } catch {
      await clearSession();
    }
  }

  return response;
}

/**
 * Build a NextResponse forwarding headers from the backend response.
 */
export function buildProxiedResponse(backendRes: Response): Response {
  const headers = new Headers();
  for (const name of FORWARD_RES_HEADERS) {
    const val = backendRes.headers.get(name);
    if (val !== null) headers.set(name, val);
  }

  return new Response(backendRes.body, {
    status: backendRes.status,
    statusText: backendRes.statusText,
    headers,
  });
}
