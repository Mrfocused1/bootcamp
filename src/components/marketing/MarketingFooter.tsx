import Link from "next/link";
import { FOOTER_LINKS, SHOW_SOCIALS, SOCIALS, SITE, HERO } from "@/lib/marketing/content";
import { BrandLogo } from "./BrandLogo";

export function MarketingFooter() {
  return (
    <footer data-nav-theme="dark" className="bg-ua-ink text-ua-bg">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">Ready to start?</p>
            <Link
              href={HERO.ctaHref}
              className="mt-2 inline-block text-3xl font-bold ua-wiggle-link"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              enrol now →
            </Link>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">Explore</p>
            <ul className="mt-2 space-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-lg font-bold ua-wiggle-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">Contact</p>
            <a href={`mailto:${SITE.email}`} className="mt-2 block text-lg font-bold ua-wiggle-link">
              {SITE.email}
            </a>
            {SHOW_SOCIALS && (
              <ul className="mt-3 flex gap-4">
                {SOCIALS.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-bold ua-wiggle-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-ua-bg/20 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <Link href="/" aria-label="Bridgeway AI Bootcamp" className="ua-wiggle-link">
            <BrandLogo
              color="var(--ua-bg)"
              className="h-20 w-[93px] md:h-28 md:w-[130px]"
            />
          </Link>
          <div className="flex flex-col gap-3 text-sm text-ua-bg/80 sm:items-end">
            <nav className="flex gap-5 font-semibold">
              <Link href="/privacy" className="ua-wiggle-link">Privacy</Link>
              <Link href="/terms" className="ua-wiggle-link">Terms</Link>
            </nav>
            <p className="opacity-70">© 2026 {SITE.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
