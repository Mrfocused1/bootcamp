import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { CaseStudyCard, type CaseStudy } from "@/components/marketing/CaseStudyCard";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Our Work — Bridgeway AI Bootcamp",
  description:
    "Websites we've designed, built and shipped with AI — including Youth n Rise, a youth & community charity site. The same workflow we teach in the bootcamp.",
};

const CHARITIES: CaseStudy[] = [
  {
    name: "Youth n Rise",
    logo: "/marketing/work/youthnrise-logo.png",
    blurb:
      "A warm, motion-rich site for a youth & community charity giving every young person a fair start through mentoring, learning and community. Full-bleed video hero, scroll-driven storytelling and a friction-light path to donate or become a mentor — built with AI using GSAP and Lenis.",
    video: "/marketing/work/youthnrise-demo.mp4",
    poster: "/marketing/work/youthnrise-poster.jpg",
    href: "https://www.youthnrise.site",
    accent: "var(--ua-bg)",
  },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="portfolio"
        title="our work"
        intro="Real websites we've designed, built and shipped with AI — the same workflow we teach in the bootcamp."
        sticker="shooting-star"
      />

      {/* Charities */}
      <section className="bg-ua-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="relative inline-block">
              <h2
                className="text-4xl font-black lowercase tracking-tight text-ua-ink md:text-6xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                charities
              </h2>
              <Sticker
                name="heart-hands"
                size={84}
                rotate={-10}
                className="pointer-events-none absolute -right-14 -top-9 z-10 hidden sm:block md:-right-24 md:-top-11"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="mt-3 max-w-xl text-lg text-ua-ink/70">
              Mission-driven sites that turn visitors into supporters.
            </p>
          </Reveal>

          <div className="mt-12 space-y-10">
            {CHARITIES.map((study) => (
              <CaseStudyCard key={study.href} study={study} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
