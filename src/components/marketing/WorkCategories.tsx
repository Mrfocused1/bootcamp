"use client";

import { useState } from "react";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { CaseStudyCard, type CaseStudy } from "@/components/marketing/CaseStudyCard";

type TabId = "charities" | "creatives" | "sports" | "other";

const DECKS: Record<TabId, CaseStudy[]> = {
  charities: [
    {
      name: "Forever Family",
      logo: "/marketing/work/forever-family-logo.png",
      blurb:
        "A bold, cinematic site for a community-safety charity building safer, stronger and more united communities through trained intervention, youth mentorship and emergency response. Full-bleed video hero, scroll-driven chapter storytelling and clear ways to join the movement or become a stepper.",
      video: "/marketing/work/forever-family-demo.mp4",
      poster: "/marketing/work/forever-family-poster.jpg",
      href: "https://www.foreverfamilyuk.co.uk",
      logoClass: "h-8 md:h-10",
    },
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
  ],
  creatives: [],
  sports: [
    {
      name: "Chuks Fitness",
      logo: "/marketing/work/chuks-logo.png",
      blurb:
        "A bold, high-energy site for a strength coach — coach-led training online and in person. Full-screen video hero, scroll-driven programmes and a friction-light path to book a free session.",
      video: "/marketing/work/chuks-demo.mp4",
      poster: "/marketing/work/chuks-poster.jpg",
      href: "https://www.chuksfitness.site",
    },
  ],
  other: [
    {
      name: "Clearway Driving School",
      logo: "/marketing/work/clearway-logo.svg",
      blurb:
        "A friendly, pass-focused site for a London driving school — DVSA-approved instructors, structured courses and easy lesson booking. Punchy hero, scroll-driven course breakdowns and clear calls to book.",
      video: "/marketing/work/clearway-demo.mp4",
      poster: "/marketing/work/clearway-poster.jpg",
      href: "https://www.clearwaydrivingschool.site",
      logoClass: "h-12 md:h-14",
    },
  ],
};

const TABS: {
  id: TabId;
  label: string;
  blurb: string;
  sticker: string;
  stickerRotate: number;
  soon?: string;
}[] = [
  {
    id: "charities",
    label: "charities",
    blurb: "Mission-driven sites that turn visitors into supporters.",
    sticker: "heart-hands",
    stickerRotate: -10,
  },
  {
    id: "creatives",
    label: "creatives",
    blurb: "Portfolio sites for artists, designers and makers — built to get them booked.",
    sticker: "cursor-star",
    stickerRotate: 8,
    soon: "Creative portfolios are landing here shortly.",
  },
  {
    id: "sports",
    label: "sports",
    blurb: "Sites for teams, clubs, coaches and athletes — built to fill sessions and grow a following.",
    sticker: "high-five",
    stickerRotate: -8,
    soon: "Team and club sites are landing here shortly.",
  },
  {
    id: "other",
    label: "other",
    blurb: "Everything else — local services and businesses that turn clicks into customers.",
    sticker: "rock-on",
    stickerRotate: 8,
    soon: "More work is landing here shortly.",
  },
];

export function WorkCategories() {
  const [active, setActive] = useState<TabId>("charities");
  const tab = TABS.find((t) => t.id === active)!;
  const studies = DECKS[active];

  return (
    <section className="bg-ua-bg px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Title row + tab switcher */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="relative inline-block">
            <h2
              className="text-4xl font-black lowercase tracking-tight text-ua-ink md:text-6xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              {tab.label}
            </h2>
            <Sticker
              key={tab.id}
              name={tab.sticker}
              size={78}
              rotate={tab.stickerRotate}
              className="pointer-events-none absolute -right-12 -top-8 z-10 hidden sm:block md:-right-16 md:-top-9"
            />
          </div>

          <div
            role="tablist"
            aria-label="Work categories"
            className="inline-flex shrink-0 flex-wrap gap-1 rounded-full border-2 border-ua-ink/15 bg-white/60 p-1.5"
          >
            {TABS.map((t) => {
              const on = t.id === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(t.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold lowercase transition-colors md:px-5 ${
                    on ? "bg-ua-ink text-ua-bg" : "text-ua-ink/55 hover:text-ua-ink"
                  }`}
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 max-w-xl text-lg text-ua-ink/70">{tab.blurb}</p>

        {/* Active content — keyed so it fades in on switch */}
        <div key={active} className="ua-tab-panel mt-12">
          {studies.length > 0 ? (
            <div className="flex flex-col">
              {studies.map((study, i) => (
                <div
                  key={study.href}
                  className="sticky h-[calc(100svh-9rem)] max-h-[40rem] motion-reduce:static motion-reduce:mb-10 md:max-h-[46rem]"
                  style={{ top: `calc(6rem + ${i * 0.8}rem)`, zIndex: i + 1 }}
                >
                  <CaseStudyCard study={study} />
                </div>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="rounded-3xl border-2 border-dashed border-ua-ink/25 bg-white/50 px-6 py-16 text-center md:py-20">
                <p
                  className="text-2xl font-black lowercase tracking-tight text-ua-ink md:text-3xl"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  coming soon
                </p>
                <p className="mx-auto mt-2 max-w-md text-ua-ink/60">{tab.soon}</p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
