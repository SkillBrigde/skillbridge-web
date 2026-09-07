"use client";

import { useEffect, useState } from "react";

type ApiState = "checking" | "online" | "offline";

export function SystemStatus() {
  const [state, setState] = useState<ApiState>("checking");
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

  useEffect(() => {
    const controller = new AbortController();

    async function checkApi() {
      try {
        const response = await fetch(`${apiBaseUrl}/health/live`, {
          cache: "no-store",
          signal: controller.signal,
        });
        setState(response.ok ? "online" : "offline");
      } catch {
        if (!controller.signal.aborted) {
          setState("offline");
        }
      }
    }

    void checkApi();
    return () => controller.abort();
  }, [apiBaseUrl]);

  const labels: Record<ApiState, string> = {
    checking: "Đang kiểm tra API",
    online: "API đang hoạt động",
    offline: "API chưa được khởi động",
  };

  return (
    <aside className="statusCard" aria-live="polite">
      <div className="statusHeading">
        <span className={`statusDot ${state}`} />
        <strong>{labels[state]}</strong>
      </div>
      <dl>
        <div>
          <dt>Frontend</dt>
          <dd>Next.js App Router</dd>
        </div>
        <div>
          <dt>Backend</dt>
          <dd>.NET Modular Monolith</dd>
        </div>
        <div>
          <dt>API URL</dt>
          <dd>{apiBaseUrl}</dd>
        </div>
      </dl>
    </aside>
  );
}
