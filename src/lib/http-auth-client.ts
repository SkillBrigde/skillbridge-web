/**
 * SkillBridge HTTP Client with Request/Response Interceptors
 * - Automatically attaches `Authorization: Bearer <accessToken>` from localStorage
 * - Automatically catches 401 Unauthorized, clears auth tokens, and redirects to /login
 */

import { actions, type AuthUser } from "./store";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Get access token from localStorage in client-side environment */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

/** Get stored auth user from localStorage in client-side environment */
export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Clear all auth data from localStorage and redirect to /login */
export function handleUnauthorized(redirectPath: string = "/login") {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("user");
  } catch {}

  // Clear global store auth state
  try {
    actions.logout();
  } catch {}

  // Redirect to login page
  if (window.location.pathname !== redirectPath) {
    window.location.href = redirectPath;
  }
}

/** Core HTTP Client with Interceptors */
export async function httpAuthClient(endpoint: string, options: RequestOptions = {}): Promise<Response> {
  let url = endpoint;

  // Append query params if provided
  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // --- REQUEST INTERCEPTOR ---
  const headers = new Headers(options.headers || {});

  // 1. Attach JWT Authorization Header if token exists
  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // 2. Default to JSON content type for body requests if not set
  if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, mergedOptions);

    // --- RESPONSE INTERCEPTOR ---
    // Handle 401 Unauthorized: Clear credentials and redirect
    if (response.status === 401) {
      handleUnauthorized("/login");
      throw new ApiError("Phiên đăng nhập đã hết hạn hoặc không hợp lệ.", 401);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

// Alias for apiClient compatibility
export const apiClient = httpAuthClient;

/** Helper methods for JSON API endpoints */
export const http = {
  get: async <T = unknown>(url: string, options?: RequestOptions): Promise<T> => {
    const res = await httpAuthClient(url, { ...options, method: "GET" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(res.statusText || "Lỗi yêu cầu máy chủ", res.status, errorData);
    }
    return res.json() as Promise<T>;
  },

  post: async <T = unknown>(url: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    const res = await httpAuthClient(url, {
      ...options,
      method: "POST",
      body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(res.statusText || "Lỗi yêu cầu máy chủ", res.status, errorData);
    }
    return res.json() as Promise<T>;
  },

  put: async <T = unknown>(url: string, body?: unknown, options?: RequestOptions): Promise<T> => {
    const res = await httpAuthClient(url, {
      ...options,
      method: "PUT",
      body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(res.statusText || "Lỗi yêu cầu máy chủ", res.status, errorData);
    }
    return res.json() as Promise<T>;
  },

  delete: async <T = unknown>(url: string, options?: RequestOptions): Promise<T> => {
    const res = await httpAuthClient(url, { ...options, method: "DELETE" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(res.statusText || "Lỗi yêu cầu máy chủ", res.status, errorData);
    }
    return res.json() as Promise<T>;
  },
};
