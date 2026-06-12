import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Our Work — Bridgeway AI Bootcamp",
  description:
    "Websites we've designed, built and shipped with AI — case studies coming soon.",
};

// NOTE(owner): the project grid is hidden until real case studies are ready —
// see git history (StoriesGrid + PROJECTS) to restore it.
export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="portfolio"
        title="our work"
        intro="Real websites we've designed, built and shipped with AI — the same workflow we teach in the bootcamp."
        sticker="shooting-star"
      />

      <section className="bg-ua-bg px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="relative inline-block">
              <h2
                className="text-5xl font-black lowercase tracking-tight text-ua-ink md:text-7xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                coming soon
              </h2>
              <Sticker
                name="magnifier"
                size={96}
                rotate={12}
                className="pointer-events-none absolute -right-16 -top-10 z-10 hidden sm:block md:-right-28 md:-top-12"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ua-ink/70">
              We&apos;re putting the case studies together — check back shortly.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
