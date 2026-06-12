import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";

// Slim footer for the logged-in app — just the brand mark, a copyright line, and
// a few legal/support links.
const LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function AppFooter() {
  return (
    <footer className="border-t-2 border-ua-ink/10 bg-ua-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Bridgeway AI Bootcamp">
            <BrandLogo color="var(--ua-ink)" className="h-7 w-[33px]" />
          </Link>
          <span className="text-sm text-ua-ink/55">
            © 2026 Bridgeway AI Bootcamp
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm font-semibold text-ua-ink/70">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-ua-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
