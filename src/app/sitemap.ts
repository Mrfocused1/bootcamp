import type { MetadataRoute } from "next";

const BASE_URL = "https://www.bridgewayaibootcamp.com";

// Public marketing routes only — the gated app (/dashboard, /day, /admin, …)
// is intentionally excluded.
const ROUTES = [
  "/",
  "/pricing",
  "/syllabus",
  "/faq",
  "/work",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
