import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Mirrors the `robots` metadata on the page itself. /sponsor-tee is an
        // unlisted link we hand to sponsors, so keep it out of search indexes.
        source: "/sponsor-tee",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Covers /sponsor-tee/wall and any future pages nested under it —
        // same reasoning, unlisted links rather than browsed-to pages.
        source: "/sponsor-tee/:path*",
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
