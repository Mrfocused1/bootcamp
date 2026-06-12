import Link from "next/link";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { HERO } from "@/lib/marketing/content";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ua-bg px-6 py-28 text-center md:px-10">
      <Sticker name="lets-go" size={130} className="absolute left-6 top-14 hidden md:block" rotate={-10} />
      <Sticker name="high-five" size={110} className="absolute bottom-14 right-8 hidden md:block" rotate={8} />
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="text-5xl font-bold text-ua-ink md:text-7xl" style={{ fontFamily: "var(--font-epilogue)" }}>
            ready to build?
          </h2>
        </Reveal>
        <Reveal>
          <p className="mx-auto mt-5 max-w-xl text-xl text-ua-ink/80">
            Five days from now you — or your whole tech team — could be building, refreshing and shipping real websites with AI. For founders, businesses, charities and organisations. No coding experience needed.
          </p>
        </Reveal>
        <Reveal>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={HERO.ctaHref}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ua-ink bg-white px-9 py-4 text-xl font-bold text-ua-ink shadow-[5px_5px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ua-ink hover:text-white hover:shadow-[8px_8px_0_var(--ua-ink)] active:translate-y-0 active:shadow-[2px_2px_0_var(--ua-ink)]"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              {HERO.ctaLabel}
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact#contact-form"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ua-ink bg-ua-sky px-9 py-4 text-xl font-bold text-ua-ink shadow-[5px_5px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ua-ink hover:text-white hover:shadow-[8px_8px_0_var(--ua-ink)] active:translate-y-0 active:shadow-[2px_2px_0_var(--ua-ink)]"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              enquire
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
