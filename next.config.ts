import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

// Vercel and standard cloud environments bundle natively.
// Only emit standalone output when explicitly targeted for container builds.
const isVercel = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NOW_BUILDER
);

const useStandaloneOutput =
  !isVercel &&
  Boolean(process.env.STANDALONE === "1" || process.env.DOCKER_BUILD === "1");

const nextConfig: NextConfig = {
  output: useStandaloneOutput ? "standalone" : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
