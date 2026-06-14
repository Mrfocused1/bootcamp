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
    logoClass: "h-7 md:h-8",
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

function CategoryHeading({
  title,
  blurb,
  sticker,
  stickerRotate = -10,
}: {
  title: string;
  blurb: string;
  sticker: string;
  stickerRotate?: number;
}) {
  return (
    <>
      <Reveal>
        <div className="relative inline-block">
          <h2
            className="text-4xl font-black lowercase tracking-tight text-ua-ink md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {title}
          </h2>
          <Sticker
            name={sticker}
            size={84}
            rotate={stickerRotate}
            className="pointer-events-none absolute -right-14 -top-9 z-10 hidden sm:block md:-right-24 md:-top-11"
          />
        </div>
      </Reveal>
      <Reveal>
        <p className="mt-3 max-w-xl text-lg text-ua-ink/70">{blurb}</p>
      </Reveal>
    </>
  );
}

function ComingSoon({ label }: { label: string }) {
  return (
    <Reveal>
      <div className="mt-10 rounded-3xl border-2 border-dashed border-ua-ink/25 bg-white/50 px-6 py-16 text-center md:py-20">
        <p
          className="text-2xl font-black lowercase tracking-tight text-ua-ink md:text-3xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          coming soon
        </p>
        <p className="mx-auto mt-2 max-w-md text-ua-ink/60">{label}</p>
      </div>
    </Reveal>
  );
}

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
          <CategoryHeading
            title="charities"
            blurb="Mission-driven sites that turn visitors into supporters."
            sticker="heart-hands"
          />

          {/* Scroll-stack: each card pins below the nav and the next stacks on
              top as you scroll. Reduced motion → plain spaced list. */}
          <div className="mt-12 flex flex-col">
            {CHARITIES.map((study, i) => (
              <div
                key={study.href}
                className="sticky h-[calc(100svh-9rem)] max-h-[40rem] motion-reduce:static motion-reduce:mb-10 md:max-h-[46rem]"
                style={{ top: `calc(6rem + ${i * 0.8}rem)`, zIndex: i + 1 }}
              >
                <CaseStudyCard study={study} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creatives */}
      <section className="bg-ua-bg px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <CategoryHeading
            title="creatives"
            blurb="Portfolio sites for artists, designers and makers — built to get them booked."
            sticker="cursor-star"
            stickerRotate={8}
          />
          <ComingSoon label="Creative portfolios are landing here shortly." />
        </div>
      </section>

      {/* Sports */}
      <section className="bg-ua-bg px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <CategoryHeading
            title="sports"
            blurb="Sites for teams, clubs and athletes — fixtures, fans and signups in one place."
            sticker="high-five"
            stickerRotate={-8}
          />
          <ComingSoon label="Team and club sites are landing here shortly." />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
