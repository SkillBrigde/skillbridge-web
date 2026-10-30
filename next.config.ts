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

// Adapters produce platform-specific output; Docker uses standalone output.
const useStandaloneOutput =
  process.env.VERCEL !== "1" && !process.env.NEXT_ADAPTER_PATH;

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
