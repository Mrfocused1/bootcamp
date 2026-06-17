// src/lib/marketing/content.ts

export type NavLink = { label: string; href: string };

export const SITE = {
  name: "Bridgeway AI Bootcamp",
  email: "hello@bridgewayaibootcamp.com",
};

// FAQ intentionally lives in the footer, not the nav.
export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

// Flip to true when the social accounts are ready to be public.
export const SHOW_SOCIALS = false;

export const SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export const HERO = {
  words: ["we", "teach", "you", "how", "to", "build", "premium", "websites", "powered", "by", "ai"],
  emphasis: "premium",
  ctaLabel: "enrol now",
  ctaHref: "/pricing",
  // Background slideshow images (cross-fade through dark). Add more here later.
  // Hero background slides — images or videos (.mp4). Cross-fade through dark.
  // (Single image for now.)
  images: ["/marketing/bridgeway-hero.png"],
  image: "/marketing/bridgeway-hero.png",
  imageAlt: "Founder learning to build websites with AI",
};

export const STATS = [
  { value: "5 days", label: "live, hands-on" },
  { value: "0", label: "coding experience needed" },
  { value: "100%", label: "you build something real" },
];

export type Feature = { sticker: string; title: string; body: string };
export const FEATURES: Feature[] = [
  { sticker: "lightning", title: "Build fast with AI", body: "Use modern AI tools to design, write and ship a real website — without months of tutorials." },
  { sticker: "earth", title: "Launch it live", body: "Domains, hosting and going live on the internet, walked through step by step." },
  { sticker: "megaphone", title: "Payments & growth", body: "Add a database, take real payments, and learn the basics of getting your first visitors." },
  { sticker: "heart", title: "Live support", body: "A small cohort, live on Zoom, with help whenever you get stuck." },
];

export type Day = { day: string; title: string; body: string; sticker: string };
export const SYLLABUS_DAYS: Day[] = [
  { day: "Day 1", title: "Foundations & your idea", body: "Set up your tools and turn an idea into a clear plan.", sticker: "sparkles" },
  { day: "Day 2", title: "Build with AI", body: "Generate and shape your first real pages.", sticker: "cursor-star" },
  { day: "Day 3", title: "Data & payments", body: "Add a database and take real payments.", sticker: "hundred" },
  { day: "Day 4", title: "Launch", body: "Domains, hosting and going live.", sticker: "earth" },
  { day: "Day 5", title: "Grow & ship", body: "Polish, get feedback and plan what's next.", sticker: "high-five" },
];

export const MARQUEE_ITEMS = ["build with ai", "launch for real", "no code needed", "5 days live", "ship something real"];
