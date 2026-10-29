import {
  backendFetch,
  clearSession,
  readSession,
  saveSession,
  sessionTokens,
} from "@/lib/server/auth";

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
type Context = { params: Promise<{ action: string }> };

export async function GET(_request: Request, context: Context) {
  const { action } = await context.params;
  if (action !== "session")
    return json({ error: "Không tìm thấy yêu cầu." }, 404);
  try {
    return json({ user: await readSession() });
  } catch {
    return json(
      { error: "Chưa thể kết nối dịch vụ tài khoản. Vui lòng thử lại sau." },
      503,
    );
  }
}

export async function POST(request: Request, context: Context) {
  const { action } = await context.params;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const source = new URL(origin);
      // Next can normalize request.url to localhost even when the browser uses
      // 127.0.0.1. Compare against the incoming HTTP host instead.
      const host = request.headers.get("host") || new URL(request.url).host;
      if (
        !["http:", "https:"].includes(source.protocol) ||
        source.host !== host
      )
        return json({ error: "Yêu cầu không hợp lệ." }, 403);
    } catch {
      return json({ error: "Yêu cầu không hợp lệ." }, 403);
    }
  }
  if (!["login", "register", "logout"].includes(action))
    return json({ error: "Không tìm thấy yêu cầu." }, 404);
  try {
    if (action === "logout") {
      const tokens = await sessionTokens();
      try {
        if (tokens.access)
          await backendFetch("auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${tokens.access}` },
            body: JSON.stringify({ refreshToken: tokens.refresh }),
          });
      } finally {
        await clearSession();
      }
      return json({ ok: true });
    }
    let input;
    try {
      input = await request.json();
    } catch {
      return json({ error: "Dữ liệu không hợp lệ." }, 400);
    }
    if (
      !input ||
      typeof input.email !== "string" ||
      typeof input.password !== "string" ||
      !input.email.trim() ||
      !input.password
    ) {
      return json({ error: "Vui lòng nhập email và mật khẩu." }, 400);
    }
    if (input.email.length > 254 || input.password.length > 256)
      return json({ error: "Dữ liệu không hợp lệ." }, 400);
    const payload: Record<string, string> = {
      email: input.email.trim(),
      password: input.password,
    };
    if (action === "register") {
      if (
        typeof input.name !== "string" ||
        input.name.trim().length < 2 ||
        input.name.length > 160 ||
        !["mentee", "mentor"].includes(input.role)
      ) {
        return json(
          { error: "Vui lòng nhập họ tên và chọn loại tài khoản hợp lệ." },
          400,
        );
      }
      payload.fullName = input.name.trim();
      payload.role = input.role === "mentor" ? "Mentor" : "Mentee";
    }
    const response = await backendFetch(`auth/${action}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      // Identity currently reports invalid credentials as a not-found problem.
      const status =
        action === "login" &&
        response.status === 404 &&
        problem?.title === "Identity.InvalidCredentials"
          ? 401
          : response.status;
      const messages: Record<number, string> = {
        400: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
        401: "Email hoặc mật khẩu không chính xác.",
        409: "Email này đã được đăng ký.",
        429: "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.",
      };
      return json(
        {
          error:
            messages[status] || "Dịch vụ tài khoản tạm thời chưa sẵn sàng.",
        },
        status >= 500 ? 503 : status,
      );
    }
    return json({ user: await saveSession(await response.json()) });
  } catch {
    return json(
      { error: "Chưa thể kết nối dịch vụ tài khoản. Vui lòng thử lại sau." },
      503,
    );
  }
}
