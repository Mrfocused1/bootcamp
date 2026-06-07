import type { NextConfig } from "next";

// Serve the original animated (Webflow) marketing site at clean URLs.
// Files live in public/site/; each page has <base href="/site/truus.co/">
// so relative assets resolve while the address bar stays clean.
const MARKETING = [
  ["/syllabus", "/site/truus.co/syllabus.html"],
  ["/pricing", "/site/truus.co/pricing.html"],
  ["/success-stories", "/site/truus.co/success-stories.html"],
  ["/faq", "/site/truus.co/faq.html"],
  ["/about", "/site/truus.co/about.html"],
  ["/contact", "/site/truus.co/contact.html"],
];

// Long-lived immutable caching for the static marketing ASSETS (not the html
// pages). These files never change at a given URL, so this eliminates the
// hundreds of revalidation (304) round-trips that were slowing every load.
const ASSET_DIRS = [
  "/site/cdn.prod.website-files.com/:path*",
  "/site/fonts/:path*",
  "/site/cdn.jsdelivr.net/:path*",
  "/site/code.jquery.com/:path*",
  "/site/d3e54v103j8qbb.cloudfront.net/:path*",
  "/site/slater.app/:path*",
  "/site/player.vimeo.com/:path*",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: MARKETING.map(([source, destination]) => ({
        source,
        destination,
      })),
    };
  },
  async headers() {
    return ASSET_DIRS.map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    }));
  },
};

export default nextConfig;
