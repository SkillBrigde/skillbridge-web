# SkillBridge Web

Next.js frontend for the SkillBridge mentoring platform.

## Local development

```powershell
Copy-Item .env.example .env.local
npm ci
npm run dev
```

The application runs at `http://localhost:3000` and expects the API at `http://localhost:8080`.

## Quality checks

```powershell
npm run lint
npm run typecheck
npm run build
```

Authentication will use short-lived access tokens in memory and rotating refresh tokens in `HttpOnly`, `Secure`, `SameSite` cookies. Do not store tokens in `localStorage`.
