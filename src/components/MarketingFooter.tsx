import Link from "next/link";

const EXPLORE_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/pricing", label: "Pricing" },
  { href: "/success-stories", label: "Success Stories" },
];

const CONTACT_LINKS = [
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "mailto:hello@urbanai.co", label: "hello@urbanai.co", external: true },
  { href: "https://instagram.com/urbanai", label: "Instagram", external: true },
  { href: "https://tiktok.com/@urbanai", label: "TikTok", external: true },
];

export function MarketingFooter() {
  return (
    <footer
      className="border-t border-[var(--ua-ink)]/10 mt-auto"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <span
              className="font-genty text-5xl leading-none tracking-tight"
              style={{ color: "var(--ua-blue)" }}
            >
              Urban AI
            </span>
            <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
              Build real websites with AI — in 5 days. No code experience required.
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.45 }}
            >
              Explore
            </p>
            <ul className="flex flex-col gap-2">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium transition-opacity hover:opacity-60"
                    style={{ color: "var(--ua-ink)" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.45 }}
            >
              Contact
            </p>
            <ul className="flex flex-col gap-2">
              {CONTACT_LINKS.map(({ href, label, external }) =>
                external ? (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition-opacity hover:opacity-60"
                      style={{ color: "var(--ua-ink)" }}
                    >
                      {label}
                    </a>
                  </li>
                ) : (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-medium transition-opacity hover:opacity-60"
                      style={{ color: "var(--ua-ink)" }}
                    >
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t border-[var(--ua-ink)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <p className="text-xs" style={{ color: "var(--ua-ink)", opacity: 0.4 }}>
            © {new Date().getFullYear()} Urban AI. All rights reserved.
          </p>
          <Link
            href="/login"
            className="text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-60"
            style={{ color: "var(--ua-ink)", opacity: 0.5 }}
          >
            Student login
          </Link>
        </div>
      </div>
    </footer>
  );
}
