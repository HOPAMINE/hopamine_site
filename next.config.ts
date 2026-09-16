import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 blocks dev-only assets (HMR, hydration chunks) for any origin
  // other than localhost. Allow LAN addresses so the dev server can be opened
  // from a phone on the same network.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.16.*.*", "*.local"],
  async headers() {
    return [
      {
        // Mirrors the `robots` metadata on the page itself. /sponsor-tee is an
        // unlisted link we hand to sponsors, so keep it out of search indexes.
        source: "/sponsor-tee",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "**.convex.cloud" },
    ],
  },
};

export default nextConfig;
