import Link from "next/link";
import { FOOTER_LINKS, SOCIALS, SITE, HERO } from "@/lib/marketing/content";

export function MarketingFooter() {
  return (
    <footer className="bg-ua-blue text-ua-bg">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Ready to start?</p>
            <Link
              href={HERO.ctaHref}
              className="mt-2 inline-block text-3xl font-bold hover:text-ua-pink"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              enrol now →
            </Link>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Explore</p>
            <ul className="mt-2 space-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-lg hover:text-ua-pink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Contact</p>
            <a href={`mailto:${SITE.email}`} className="mt-2 block text-lg hover:text-ua-pink">
              {SITE.email}
            </a>
            <ul className="mt-3 flex gap-4">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ua-pink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-16 text-center text-5xl font-extrabold md:text-7xl"
          style={{ fontFamily: "var(--font-chewy)" }}
        >
          {SITE.name}
        </p>
      </div>
    </footer>
  );
}
