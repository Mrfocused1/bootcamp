"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";

gsap.registerPlugin(ScrollTrigger);

type Day = {
  day: string;
  color: string;
  sticker: string;
  bullets: string[];
};

const DAYS: Day[] = [
  {
    day: "Day 1 — Build the look",
    color: "bg-ua-green",
    sticker: "cursor-star",
    bullets: [
      "Clone any website from a link",
      "Recreate a design from a screenshot",
      "Generate images with ChatGPT",
      "AI icons, logos & graphics",
      "Voice-control coding with Whisper",
      "Set up & build in Cursor",
      "Ship your first live page",
    ],
  },
  {
    day: "Day 2 — Make it real",
    color: "bg-ua-blue text-ua-bg",
    sticker: "lightning",
    bullets: [
      "Databases with Supabase",
      "Store & fetch your data",
      "User sign-up & login",
      "Connect your front-end",
      "Version control with GitHub",
      "Save & roll back changes",
      "Work safely with AI",
    ],
  },
  {
    day: "Day 3 — Get paid",
    color: "bg-ua-orange",
    sticker: "hundred",
    bullets: [
      "Take payments with Stripe",
      "Send emails with Resend",
      "Set up a CRM",
      "Capture & manage leads",
    ],
  },
  {
    day: "Day 4 — Launch it live",
    color: "bg-ua-pink",
    sticker: "earth",
    bullets: [
      "Hosting your site",
      "Connect a custom domain",
      "Go live to the world",
      "Debug like a pro",
    ],
  },
  {
    day: "Day 5 — Get found & grow",
    color: "bg-ua-sky",
    sticker: "megaphone",
    bullets: [
      "SEO fundamentals",
      "Rank on Google",
      "Analytics & iteration",
      "Recap + live Q&A",
    ],
  },
];

// Resting rotations per card — alternating so the stack looks hand-placed and the
// buried cards peek out at the edges. Shared by both layouts.
const REST_ROTATIONS = [3, -2, 4, -1, -3];

// Desktop hover-fan: each card's resting rotation + vertical stagger (px), so the
// row reads like a hand-fanned deck rather than a flat strip.
const DESKTOP_LAYOUT = [
  { rot: -4, ty: 0 },
  { rot: 3, ty: 30 },
  { rot: -2, ty: 8 },
  { rot: 4, ty: 34 },
  { rot: -3, ty: 12 },
];

function HandDivider({ dark }: { dark: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`mt-4 h-[10px] w-40 ${dark ? "text-ua-bg" : "text-ua-ink"}`}
      viewBox="0 0 200 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M2 6C40 3 70 8 100 5C130 2 160 7 198 4"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Bullets({
  bullets,
  dark,
  dense = false,
}: {
  bullets: string[];
  dark: boolean;
  dense?: boolean;
}) {
  return (
    <ul className={dense ? "mt-4 space-y-1.5" : "mt-6 space-y-3"}>
      {bullets.map((b) => (
        <li
          key={b}
          className={`flex items-start leading-tight ${
            dense ? "gap-2 text-sm" : "gap-3"
          }`}
        >
          <span
            aria-hidden
            className={`${dense ? "mt-1.5" : "mt-2"} h-2 w-2 shrink-0 rounded-full ${
              dark ? "bg-ua-bg" : "bg-ua-ink"
            }`}
          />
          <span className={dark ? "text-ua-bg" : "text-ua-ink/90"}>{b}</span>
        </li>
      ))}
    </ul>
  );
}

export function Curriculum() {
  const sectionRef = useRef<HTMLElement>(null);
  // Refs for the mobile scroll-stack cards only (desktop deck is pure-CSS hover).
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // The scroll-stack only applies to mobile. gsap.matchMedia scopes the
    // ScrollTriggers to the (max-width:767px) query and auto-reverts them when
    // the viewport grows past it (or on unmount). Desktop gets the CSS hover-fan.
    const mm = gsap.matchMedia();
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = mobileCardRefs.current.filter(
          (c): c is HTMLDivElement => c !== null,
        );
        if (!cards.length) return;

        const lastWrapper = cards[cards.length - 1].parentElement;

        // ScrollTrigger start/end strings don't parse "rem", so compute px. The
        // fixed nav is ~80px tall; park the topmost card just below it.
        const rootFontPx =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const NAV_GAP = 6 * rootFontPx; // ~96px — clears the 80px fixed header
        const FAN = 0.9 * rootFontPx; // ~14px peek between stacked cards

        cards.forEach((card, i) => {
          const wrapper = card.parentElement;
          if (!wrapper) return;

          gsap.set(card, { rotation: REST_ROTATIONS[i] ?? 0 });
          const offset = Math.round(NAV_GAP + i * FAN);

          ScrollTrigger.create({
            trigger: wrapper,
            start: `top top+=${offset}`,
            // Hold each pin until the whole stack has scrolled past, so earlier
            // cards stay parked below the nav rather than scrolling away.
            endTrigger: lastWrapper ?? wrapper,
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            id: `curriculum-card-${i}`,
          });

          if (i < cards.length - 1) {
            gsap.to(card, {
              scale: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: mobileCardRefs.current[i + 1]?.parentElement ?? wrapper,
                start: `top top+=${offset}`,
                end: `+=${window.innerHeight}`,
                scrub: true,
              },
            });
          }
        });

        ScrollTrigger.refresh();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ua-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            className="text-center text-4xl font-bold text-ua-ink md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            what you&apos;ll learn
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ua-ink/70">
            five 1-hour live sessions, from idea to launch.
          </p>
        </Reveal>

        {/*
          Desktop (md+): horizontal hover-fan deck. Cards overlap in a fanned row;
          hovering one straightens + lifts it and nudges the cards after it right
          to reveal it (see .cur-card rules in globals.css). Pure CSS, no JS.
        */}
        <div className="cur-deck mt-20 hidden justify-center md:flex">
          {DAYS.map((d, i) => {
            const dark = d.color.includes("text-ua-bg");
            const { rot, ty } = DESKTOP_LAYOUT[i] ?? { rot: 0, ty: 0 };
            return (
              <article
                key={d.day}
                className={`cur-card relative flex h-[30rem] w-[17rem] shrink-0 flex-col justify-end rounded-3xl border-2 border-ua-ink ${d.color} px-6 pb-6 pt-16 shadow-[6px_6px_0_var(--ua-ink)] ${
                  i > 0 ? "-ml-24" : ""
                }`}
                style={
                  {
                    zIndex: i + 1,
                    "--rot": `${rot}deg`,
                    "--ty": `${ty}px`,
                  } as React.CSSProperties
                }
              >
                <Sticker
                  name={d.sticker}
                  size={72}
                  className="absolute -left-2 -top-7"
                  rotate={-8}
                />
                <div>
                  <h3
                    className="text-2xl font-bold leading-tight"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {d.day}
                  </h3>
                  <HandDivider dark={dark} />
                  <Bullets bullets={d.bullets} dark={dark} dense />
                </div>
              </article>
            );
          })}
        </div>

        {/*
          Mobile (< md): GSAP scroll-driven stacking deck. Each card lives in a
          tall wrapper; ScrollTrigger pins it just below the nav and the next card
          scrolls up and stacks over it. With reduced motion this is a plain,
          fully readable vertical stack.
        */}
        <div className="mt-14 flex flex-col gap-6 md:hidden">
          {DAYS.map((d, i) => {
            const dark = d.color.includes("text-ua-bg");
            return (
              <div
                key={d.day}
                className="curriculum-card-wrapper relative flex h-screen justify-center"
              >
                <div
                  ref={(el) => {
                    mobileCardRefs.current[i] = el;
                  }}
                  className={`relative min-h-[30rem] w-full max-w-[22rem] origin-center rounded-3xl border-2 border-ua-ink ${d.color} px-6 pb-6 pt-14 shadow-[6px_6px_0_var(--ua-ink)] will-change-transform`}
                  style={{ zIndex: i + 1 }}
                >
                  <Sticker
                    name={d.sticker}
                    size={72}
                    className="absolute -right-3 -top-7"
                    rotate={8}
                  />
                  <h3
                    className="pr-8 text-3xl font-bold"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {d.day}
                  </h3>
                  <HandDivider dark={dark} />
                  <div className="text-xl">
                    <Bullets bullets={d.bullets} dark={dark} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
