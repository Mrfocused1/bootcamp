import type { NextConfig } from "next";

// Serve the original animated (Webflow) marketing site at clean URLs.
// Files live in public/site/; each page has <base href="/site/truus.co/">
// so relative assets resolve while the address bar stays clean.
const MARKETING = [
  ["/", "/site/truus.co/index.html"],
  ["/syllabus", "/site/truus.co/syllabus.html"],
  ["/pricing", "/site/truus.co/pricing.html"],
  ["/success-stories", "/site/truus.co/success-stories.html"],
  ["/faq", "/site/truus.co/faq.html"],
  ["/about", "/site/truus.co/about.html"],
  ["/contact", "/site/truus.co/contact.html"],
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
};

export default nextConfig;
