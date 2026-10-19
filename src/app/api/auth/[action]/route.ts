import {
  backendFetch,
  clearSession,
  readSession,
  saveSession,
  sessionTokens,
} from "@/lib/server/auth";
import {
  validateRegistration,
  type RegistrationErrors,
} from "@/lib/registration";

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
    if (!input || typeof input !== "object" || Array.isArray(input))
      return json({ error: "Dữ liệu không hợp lệ." }, 400);
    if (action === "register") {
      const fieldErrors = validateRegistration(input);
      if (Object.keys(fieldErrors).length)
        return json(
          { error: "Vui lòng kiểm tra lại thông tin đăng ký.", fieldErrors },
          400,
        );
    }
    if (
      typeof input.email !== "string" ||
      typeof input.password !== "string" ||
      !input.email.trim() ||
      !input.password
    ) {
      return json({ error: "Vui lòng nhập email và mật khẩu." }, 400);
    }
    if (input.email.trim().length > 256 || input.password.length > 256)
      return json({ error: "Dữ liệu không hợp lệ." }, 400);
    const payload: Record<string, string> = {
      email: input.email.trim(),
      password: input.password,
    };
    if (action === "register") {
      payload.fullName = input.name.trim();
      payload.role = input.role === "mentor" ? "Mentor" : "Mentee";
      if (typeof input.phoneNumber === "string" && input.phoneNumber.trim())
        payload.phoneNumber = input.phoneNumber.trim();
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
      let errorMsg =
        messages[status] || "Dịch vụ tài khoản tạm thời chưa sẵn sàng.";
      const fieldErrors: RegistrationErrors = {};
      if (
        status === 400 &&
        problem?.errors &&
        typeof problem.errors === "object"
      ) {
        const fields = {
          FullName: "name",
          Email: "email",
          Password: "password",
          PhoneNumber: "phoneNumber",
          Role: "role",
        } as const;
        for (const [key, value] of Object.entries(problem.errors)) {
          if (!Object.hasOwn(fields, key)) continue;
          const field = fields[key as keyof typeof fields];
          if (field && Array.isArray(value)) {
            const message = value.find(
              (item): item is string => typeof item === "string",
            );
            if (message) fieldErrors[field] = message;
          }
        }
        const errorList = Object.values(problem.errors)
          .flat()
          .filter((item): item is string => typeof item === "string");
        if (errorList.length > 0 && typeof errorList[0] === "string") {
          errorMsg = errorList[0];
        } else if (typeof problem.detail === "string") {
          errorMsg = problem.detail;
        }
      } else if (status === 409 && typeof problem?.detail === "string") {
        errorMsg = problem.detail;
      }
      if (action === "register" && status === 409) fieldErrors.email = errorMsg;
      return json(
        {
          error: errorMsg,
          ...(action === "register" && Object.keys(fieldErrors).length
            ? { fieldErrors }
            : {}),
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
