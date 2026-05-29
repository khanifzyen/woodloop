import type { NextConfig } from "next";

let nextConfig: NextConfig = {
  allowedDevOrigins: ["10.100.7.31", "*.pasarjepara.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pb-woodloop.pasarjepara.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
      },
    ],
  },
};

// Bundle analyzer (opt-in via ANALYZE=true)
if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
