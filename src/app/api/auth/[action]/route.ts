import {
  AuthProblemError,
  loginWithPassword,
  logout,
  readSession,
  registerAccount,
} from "@/lib/server/auth";

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
type Context = { params: Promise<{ action: string }> };

const UNAVAILABLE = "Chưa thể kết nối dịch vụ tài khoản. Vui lòng thử lại sau.";

export async function GET(_request: Request, context: Context) {
  const { action } = await context.params;
  if (action !== "session")
    return json({ error: "Không tìm thấy yêu cầu." }, 404);
  try {
    return json({ user: await readSession() });
  } catch {
    return json({ error: UNAVAILABLE }, 503);
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    // Next can normalize request.url to localhost even when the browser uses
    // 127.0.0.1. Compare against the incoming HTTP host instead.
    const host = request.headers.get("host") || new URL(request.url).host;
    return ["http:", "https:"].includes(source.protocol) && source.host === host;
  } catch {
    return false;
  }
}

/** Maps Identity ProblemDetails (RFC 7807) to a Vietnamese UI message. */
function problemResponse(action: string, error: AuthProblemError) {
  const { problem } = error;
  // Older Identity builds report invalid credentials as a not-found problem.
  const status =
    action === "login" &&
    error.status === 404 &&
    problem?.title === "Identity.InvalidCredentials"
      ? 401
      : error.status;
  const messages: Record<number, string> = {
    400: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
    401: "Email hoặc mật khẩu không chính xác.",
    409: "Email này đã được đăng ký.",
    429: "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.",
  };
  let message = messages[status] || "Dịch vụ tài khoản tạm thời chưa sẵn sàng.";
  if (status === 400 && problem?.errors && typeof problem.errors === "object") {
    const first = Object.values(problem.errors).flat()[0];
    if (typeof first === "string") message = first;
    else if (typeof problem.detail === "string") message = problem.detail;
  }
  return json({ error: message }, status >= 500 ? 503 : status);
}

export async function POST(request: Request, context: Context) {
  const { action } = await context.params;
  if (!sameOrigin(request)) return json({ error: "Yêu cầu không hợp lệ." }, 403);
  if (!["login", "register", "logout"].includes(action))
    return json({ error: "Không tìm thấy yêu cầu." }, 404);

  if (action === "logout") {
    try {
      await logout();
    } catch {
      /* Cookie is cleared regardless; Identity revocation is best effort. */
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
  )
    return json({ error: "Vui lòng nhập email và mật khẩu." }, 400);
  const email = input.email.trim();
  const password: string = input.password;
  if (
    email.length > 256 ||
    password.length > 256 ||
    email.includes("\0") ||
    password.includes("\0")
  )
    return json({ error: "Dữ liệu không hợp lệ." }, 400);

  try {
    if (action === "login")
      return json({ user: await loginWithPassword(email, password) });

    if (
      typeof input.name !== "string" ||
      input.name.trim().length < 2 ||
      input.name.length > 200 ||
      input.name.includes("\0") ||
      !["mentee", "mentor"].includes(input.role)
    )
      return json(
        { error: "Vui lòng nhập họ tên và chọn loại tài khoản hợp lệ." },
        400,
      );
    if (Buffer.byteLength(password, "utf8") > 72)
      return json({ error: "Mật khẩu tối đa 72 byte." }, 400);
    const user = await registerAccount({
      email,
      password,
      fullName: input.name.trim(),
      role: input.role === "mentor" ? "Mentor" : "Mentee",
    });
    return json({ user });
  } catch (error) {
    if (error instanceof AuthProblemError)
      return problemResponse(action, error);
    return json({ error: UNAVAILABLE }, 503);
  }
}
