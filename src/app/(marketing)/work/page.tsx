import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { CaseStudyCard, type CaseStudy } from "@/components/marketing/CaseStudyCard";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Our Work — Bridgeway AI Bootcamp",
  description:
    "Websites we've designed, built and shipped with AI — including charity sites for Youth n Rise, Commonwell, Stepping Stones and Springboard. The same workflow we teach in the bootcamp.",
};

const CHARITIES: CaseStudy[] = [
  {
    name: "Youth n Rise",
    logo: "/marketing/work/youthnrise-logo.png",
    blurb:
      "A warm, motion-rich site for a youth & community charity giving every young person a fair start through mentoring, learning and community. Full-bleed video hero, scroll-driven storytelling and a friction-light path to donate or become a mentor.",
    video: "/marketing/work/youthnrise-demo.mp4",
    poster: "/marketing/work/youthnrise-poster.jpg",
    href: "https://www.youthnrise.site",
  },
  {
    name: "Commonwell",
    logo: "/marketing/work/commonwell-logo.svg",
    blurb:
      "A site for a community wellbeing charity that grows green spaces, supports young people and elders, and brings neighbours together. Full-bleed video hero, scroll-driven programme breakdowns and easy ways to volunteer, donate or host an event.",
    video: "/marketing/work/commonwell-demo.mp4",
    poster: "/marketing/work/commonwell-poster.jpg",
    href: "https://www.commonwell.site",
  },
  {
    name: "Stepping Stones",
    logo: "/marketing/work/stepping-logo.svg",
    blurb:
      "A bold, high-energy site for a London youth charity turning disused buildings into youth centres — and running the mentoring, training and clubs inside them. Stat-driven hero, scroll-driven storytelling and a clear path to back the mission.",
    video: "/marketing/work/stepping-demo.mp4",
    poster: "/marketing/work/stepping-poster.jpg",
    href: "https://www.steppingstonescharity.site",
  },
  {
    name: "Springboard",
    logo: "/marketing/work/springboard-logo.svg",
    blurb:
      "A warm community-charity site backing young people with mentoring, learning, wellbeing and opportunity — so every young person can rise. Full-bleed video hero, scroll-driven impact storytelling and easy ways to donate, fundraise or become a mentor.",
    video: "/marketing/work/springboard-demo.mp4",
    poster: "/marketing/work/springboard-poster.jpg",
    href: "https://www.springboardcharity.site",
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
        <div className="mx-auto max-w-3xl">
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
