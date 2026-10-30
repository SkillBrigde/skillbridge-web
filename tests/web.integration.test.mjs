import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));

test("production pages and server-owned authentication", async (t) => {
  let authUnavailable = false;
  let invalidAuthResponse = false;
  let identityInvalidCredentials = false;
  let lastRegistration;
  let revoked = false;
  const user = {
    id: "test-user",
    email: "mentor@example.test",
    fullName: "Integration Account",
    role: "Mentor",
  };
  const tokenResponse = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    accessToken: "fixture-access",
    refreshToken: "fixture-refresh",
    expiresIn: 900,
  };
  const backend = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    const input = body ? JSON.parse(body) : {};
    response.setHeader("Content-Type", "application/json");
    if (authUnavailable) {
      response.writeHead(503).end(JSON.stringify({ detail: "Offline" }));
      return;
    }
    if (request.url.endsWith("/auth/login")) {
      if (input.password !== "integration-password") {
        response
          .writeHead(identityInvalidCredentials ? 404 : 401)
          .end(
            JSON.stringify(
              identityInvalidCredentials
                ? { title: "Identity.InvalidCredentials" }
                : {},
            ),
          );
        return;
      }
      response.end(
        JSON.stringify(
          invalidAuthResponse ? { fullName: "Invalid" } : tokenResponse,
        ),
      );
    } else if (request.url.endsWith("/auth/register")) {
      lastRegistration = input;
      response.end(JSON.stringify(tokenResponse));
    } else if (request.url.endsWith("/users/me")) {
      if (request.headers.authorization !== "Bearer fixture-access") {
        response.writeHead(401).end("{}");
        return;
      }
      response.end(
        JSON.stringify({ ...user, createdAtUtc: "2026-01-01T00:00:00Z" }),
      );
    } else if (request.url.endsWith("/auth/refresh")) {
      assert.equal(input.refreshToken, "fixture-refresh");
      response.end(JSON.stringify(tokenResponse));
    } else if (request.url.endsWith("/auth/logout")) {
      revoked = input.refreshToken === "fixture-refresh";
      response.end("{}");
    } else response.writeHead(404).end("{}");
  });
  await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
  t.after(() => {
    backend.closeAllConnections();
    backend.close();
  });
  const freePort = createServer();
  await new Promise((resolve) => freePort.listen(0, "127.0.0.1", resolve));
  const port = freePort.address().port;
  await new Promise((resolve) => freePort.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  const app = spawn(
    process.execPath,
    [
      require.resolve("next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: root,
      env: {
        ...process.env,
        API_BASE_URL: `http://127.0.0.1:${backend.address().port}`,
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  let output = "";
  app.stdout.on("data", (chunk) => {
    output += chunk;
  });
  app.stderr.on("data", (chunk) => {
    output += chunk;
  });
  t.after(async () => {
    if (app.exitCode !== null) return;
    const stopped = new Promise((resolve) => app.once("exit", resolve));
    app.kill();
    await stopped;
  });
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (app.exitCode !== null)
      throw new Error(`App exited before readiness: ${output}`);
    try {
      ready = (await fetch(origin + "/api/health")).ok;
    } catch {
      /* Waiting for owned test server. */
    }
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, "Production server started");
  const post = (action, data, headers = {}) =>
    fetch(origin + "/api/auth/" + action, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(data),
    });
  let cookie = "";

  await t.test(
    "homepage contains no invented statistics or seeded mentor profiles",
    async () => {
      const response = await fetch(origin);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /Đi xa hơn/);
      assert.doesNotMatch(
        html,
        /99\.4%|u-linh|u-admin|Smart Contract Escrow v2\.4|200\+ Tech Lead/,
      );
    },
  );
  await t.test(
    "old transactional routes do not expose simulations",
    async () => {
      for (const path of [
        "/wallet",
        "/checkout/fixture",
        "/bookings/fixture/room",
        "/mentor/wallet",
        "/admin/kyc",
      ]) {
        const response = await fetch(origin + path);
        assert.equal(response.status, 200);
        const html = await response.text();
        assert.match(html, /Hẹn bạn ở bước tiếp theo/);
        assert.doesNotMatch(
          html,
          /Giả Lập Mentee|OTP demo|Cổng thanh toán demo|Đổi nhanh tài khoản demo/,
        );
      }
    },
  );
  await t.test(
    "rejects foreign origins, invalid input and admin registration",
    async () => {
      assert.equal(
        (
          await post(
            "login",
            { email: user.email, password: "integration-password" },
            { Origin: "https://untrusted.example" },
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await post("register", {
            name: user.fullName,
            email: user.email,
            password: "integration-password",
            role: "admin",
          })
        ).status,
        400,
      );
      assert.equal(
        (await post("login", { email: 123, password: "value" })).status,
        400,
      );
      const malformed = await fetch(origin + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      });
      assert.equal(malformed.status, 400);
    },
  );
  await t.test("incorrect passwords never create a session", async () => {
    const response = await post("login", {
      email: user.email,
      password: "wrong-password",
    });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("set-cookie"), null);
  });
  await t.test(
    "Identity invalid-credentials problems become a clear login error",
    async () => {
      identityInvalidCredentials = true;
      try {
        const response = await post("login", {
          email: user.email,
          password: "wrong-password",
        });
        assert.equal(response.status, 401);
        assert.equal(
          (await response.json()).error,
          "Email hoặc mật khẩu không chính xác.",
        );
        assert.equal(response.headers.get("set-cookie"), null);
      } finally {
        identityInvalidCredentials = false;
      }
    },
  );
  await t.test(
    "login keeps server tokens out of the JSON response",
    async () => {
      const response = await post(
        "login",
        { email: user.email, password: "integration-password" },
        { Origin: origin },
      );
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.user.role, "mentor");
      assert.equal(body.accessToken, undefined);
      assert.equal(body.refreshToken, undefined);
      const cookies = response.headers.getSetCookie();
      assert.equal(cookies.length, 2);
      for (const value of cookies) {
        assert.match(value, /HttpOnly/i);
        assert.match(value, /Secure/i);
        assert.match(value, /SameSite=lax/i);
      }
      cookie = cookies.map((value) => value.split(";")[0]).join("; ");
    },
  );
  await t.test("session validates the account with the backend", async () => {
    const response = await fetch(origin + "/api/auth/session", {
      headers: { Cookie: cookie },
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).user.id, user.id);
    assert.match(response.headers.get("cache-control"), /no-store/);
  });
  await t.test(
    "expired access tokens use the server refresh token",
    async () => {
      const response = await fetch(origin + "/api/auth/session", {
        headers: { Cookie: "sb_access=expired; sb_refresh=fixture-refresh" },
      });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).user.id, user.id);
      assert.equal(response.headers.getSetCookie().length, 2);
    },
  );
  await t.test(
    "register maps only supported roles to the existing API contract",
    async () => {
      const response = await post("register", {
        name: user.fullName,
        email: user.email,
        password: "integration-password",
        role: "mentor",
      });
      assert.equal(response.status, 200);
      assert.equal(lastRegistration.role, "Mentor");
      assert.equal(lastRegistration.fullName, user.fullName);
    },
  );
  await t.test(
    "logout revokes the refresh token and removes both cookies",
    async () => {
      const response = await post("logout", {}, { Cookie: cookie });
      assert.equal(response.status, 200);
      assert.ok(revoked);
      for (const value of response.headers.getSetCookie())
        assert.match(value, /Max-Age=0/);
      const anonymous = await fetch(origin + "/api/auth/session");
      assert.equal((await anonymous.json()).user, null);
    },
  );
  await t.test(
    "backend failures and invalid token responses never fall back to local accounts",
    async () => {
      authUnavailable = true;
      let response = await post("login", {
        email: user.email,
        password: "integration-password",
      });
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("set-cookie"), null);
      authUnavailable = false;
      invalidAuthResponse = true;
      response = await post("login", {
        email: user.email,
        password: "integration-password",
      });
      assert.equal(response.status, 503);
      assert.equal(response.headers.get("set-cookie"), null);
    },
  );
});
