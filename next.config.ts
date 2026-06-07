import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Serve the original animated (Webflow) marketing homepage at "/".
      // Files live in public/site/; the page has <base href="/site/truus.co/">
      // so its relative assets resolve correctly while the URL stays "/".
      beforeFiles: [
        { source: "/", destination: "/site/truus.co/index.html" },
      ],
    };
  },
};

export default nextConfig;
