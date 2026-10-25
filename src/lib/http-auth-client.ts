import { clearAuthSession } from "./store";
export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
export function handleUnauthorized(redirectPath = "/login") {
  clearAuthSession();
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== redirectPath
  )
    window.location.assign(redirectPath);
}
/** Browser requests stay on the same-origin BFF; credentials are HttpOnly cookies. */
export async function httpAuthClient(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Response> {
  if (!endpoint.startsWith("/api/") || endpoint.includes("\\"))
    throw new ApiError("Đường dẫn yêu cầu không hợp lệ.", 400);
  const { params, ...init } = options;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {}))
    if (value !== undefined) search.set(key, String(value));
  const suffix = search.toString();
  const url =
    endpoint + (suffix ? (endpoint.includes("?") ? "&" : "?") + suffix : "");
  const headers = new Headers(init.headers);
  if (typeof init.body === "string" && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
  });
  if (response.status === 401) {
    handleUnauthorized();
    throw new ApiError("Phiên đăng nhập đã hết hạn.", 401);
  }
  return response;
}
export const apiClient = httpAuthClient;

async function parseResponseBody<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null as T;
  }
  const text = await res.text();
  if (!text) return null as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

/** Helper methods for JSON API endpoints */
export const http = {
  get: async <T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<T> => {
    const res = await httpAuthClient(url, { ...options, method: "GET" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(
        res.statusText || "Lỗi yêu cầu máy chủ",
        res.status,
        errorData,
      );
    }
    return parseResponseBody<T>(res);
  },

  post: async <T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => {
    const res = await httpAuthClient(url, {
      ...options,
      method: "POST",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(
        res.statusText || "Lỗi yêu cầu máy chủ",
        res.status,
        errorData,
      );
    }
    return parseResponseBody<T>(res);
  },

  put: async <T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => {
    const res = await httpAuthClient(url, {
      ...options,
      method: "PUT",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(
        res.statusText || "Lỗi yêu cầu máy chủ",
        res.status,
        errorData,
      );
    }
    return parseResponseBody<T>(res);
  },

  patch: async <T = unknown>(
    url: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> => {
    const res = await httpAuthClient(url, {
      ...options,
      method: "PATCH",
      body:
        body !== undefined
          ? typeof body === "string"
            ? body
            : JSON.stringify(body)
          : undefined,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(
        res.statusText || "Lỗi yêu cầu máy chủ",
        res.status,
        errorData,
      );
    }
    return parseResponseBody<T>(res);
  },

  delete: async <T = unknown>(
    url: string,
    options?: RequestOptions,
  ): Promise<T> => {
    const res = await httpAuthClient(url, { ...options, method: "DELETE" });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new ApiError(
        res.statusText || "Lỗi yêu cầu máy chủ",
        res.status,
        errorData,
      );
    }
    return parseResponseBody<T>(res);
  },
};
