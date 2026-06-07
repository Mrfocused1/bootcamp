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
            Five days from now you could have a real website, live on the internet. No coding experience needed.
          </p>
        </Reveal>
        <Reveal>
          <Link
            href={HERO.ctaHref}
            className="mt-10 inline-block rounded-full bg-ua-orange px-9 py-4 text-xl font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {HERO.ctaLabel} →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
