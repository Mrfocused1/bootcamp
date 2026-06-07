// src/lib/marketing/content.ts

export type NavLink = { label: string; href: string };

export const SITE = {
  name: "Bridgeway AI Bootcamp",
  // TODO(owner): replace with the real contact email before launch
  email: "hello@bridgewayai.co",
};

// FAQ intentionally lives in the footer, not the nav.
export const NAV_LINKS: NavLink[] = [
  { label: "Syllabus", href: "/syllabus" },
  { label: "Pricing", href: "/pricing" },
  { label: "Success stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export const HERO = {
  words: ["we", "teach", "you", "how", "to", "build", "real", "websites", "powered", "by", "ai"],
  emphasis: "real",
  ctaLabel: "enrol now",
  ctaHref: "/pricing",
  image: "/marketing/bridgeway-hero.png",
  imageAlt: "Student smiling while learning to build websites with AI",
};
