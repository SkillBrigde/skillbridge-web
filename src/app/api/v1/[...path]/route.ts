import { NextRequest, NextResponse } from "next/server";
import {
  getBackendBaseUrl,
  sessionTokens,
  tryRefreshTokens,
} from "@/lib/server/auth";

type Context = { params: Promise<{ path: string[] }> };

const FORWARD_HEADERS = [
  "content-type",
  "accept",
  "idempotency-key",
  "x-file-name",
  "x-request-id",
  "if-match",
];

async function proxyRequest(request: NextRequest, context: Context) {
  const { path } = await context.params;
  const baseUrl = getBackendBaseUrl();
  const search = request.nextUrl.search;
  const targetUrl = `${baseUrl}/api/v1/${path.join("/")}${search}`;

  const tokens = await sessionTokens();
  let accessToken = tokens.access;

  // Read body buffer once so we can re-send if retry is needed
  let bodyBuffer: ArrayBuffer | undefined = undefined;
  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      bodyBuffer = await request.arrayBuffer();
    } catch {
      bodyBuffer = undefined;
    }
  }

  const buildHeaders = (token?: string) => {
    const headers = new Headers();
    for (const name of FORWARD_HEADERS) {
      const val = request.headers.get(name);
      if (val) headers.set(name, val);
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  };

  const executeFetch = async (token?: string) => {
    return fetch(targetUrl, {
      method: request.method,
      headers: buildHeaders(token),
      body: bodyBuffer && bodyBuffer.byteLength > 0 ? bodyBuffer : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  };

  try {
    let response = await executeFetch(accessToken);

    // If 401 and we have refresh token, attempt silent token refresh and retry
    if (response.status === 401 && tokens.refresh) {
      const newAccessToken = await tryRefreshTokens();
      if (newAccessToken) {
        accessToken = newAccessToken;
        response = await executeFetch(accessToken);
      }
    }

    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) responseHeaders.set("Content-Type", contentType);

    const contentDisposition = response.headers.get("content-disposition");
    if (contentDisposition) {
      responseHeaders.set("Content-Disposition", contentDisposition);
    }

    const location = response.headers.get("location");
    if (location) responseHeaders.set("Location", location);

    responseHeaders.set("Cache-Control", "no-store");

    if (response.status === 204 || response.status === 205) {
      return new Response(null, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }

    const data = await response.arrayBuffer();
    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Không thể kết nối đến máy chủ";
    return NextResponse.json(
      {
        type: "https://tools.ietf.org/html/rfc7807",
        title: "Dịch vụ tạm thời không khả dụng",
        status: 503,
        detail: message,
      },
      { status: 503 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
