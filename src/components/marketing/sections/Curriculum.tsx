"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

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
// buried cards peek out at the edges.
const REST_ROTATIONS = [3, -2, 4, -1, -3];

export function Curriculum() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion: leave the cards as a plain, fully readable vertical stack.
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(
        (c): c is HTMLDivElement => c !== null,
      );
      if (!cards.length) return;

      // The whole stack releases at one shared point — the last card's wrapper.
      // Anchoring every pin's end here is what makes earlier cards HOLD their
      // position (just below the nav) while later cards scroll up and stack on
      // top, instead of each card scrolling away as soon as its own bottom hits.
      const lastWrapper = cards[cards.length - 1].parentElement;

      cards.forEach((card, i) => {
        const wrapper = card.parentElement;
        if (!wrapper) return;

        // Rest the card at a small hand-placed rotation.
        gsap.set(card, { rotation: REST_ROTATIONS[i] ?? 0 });

        // Each card pins a little further down so the stack fans toward the top:
        // 6rem below the nav, plus 1.2rem per card so lower cards peek out.
        const offset = 6 + i * 1.2;

        ScrollTrigger.create({
          trigger: wrapper,
          start: `top top+=${offset}rem`,
          // Hold the pin until the entire stack has scrolled past, so every card
          // stays parked below the nav rather than releasing at its own bottom.
          endTrigger: lastWrapper ?? wrapper,
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          id: `curriculum-card-${i}`,
        });

        // Covered cards scale down slightly for depth as the next ones stack over.
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: cardRefs.current[i + 1]?.parentElement ?? wrapper,
              start: `top top+=${offset}rem`,
              end: `+=${typeof window !== "undefined" ? window.innerHeight : 800}`,
              scrub: true,
            },
          });
        }
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-ua-bg px-6 py-24 md:px-10"
    >
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
          Scroll-driven stacking deck. Each card lives in a tall wrapper so there's
          a viewport of scroll between pins. ScrollTrigger pins each card near the
          top of the viewport with pinSpacing:false so the next card scrolls up and
          stacks on top. Without JS / with reduced motion this is just a normal,
          fully readable vertical stack (no overlap, nothing hidden).
        */}
        <div className="mt-14 flex flex-col gap-6 md:mt-20 md:gap-0">
          {DAYS.map((d, i) => {
            const dark = d.color.includes("text-ua-bg");
            return (
              <div
                key={d.day}
                className="curriculum-card-wrapper relative flex justify-center md:h-screen md:items-start"
              >
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`relative w-full max-w-[22rem] origin-center rounded-3xl border-2 border-ua-ink ${d.color} px-6 pb-6 pt-14 shadow-[6px_6px_0_var(--ua-ink)] will-change-transform min-h-[30rem]`}
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
                  {/* Thin hand-drawn divider under the heading. */}
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
                  <ul className="mt-6 space-y-3 md:mt-8 md:space-y-4">
                    {d.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-xl leading-tight"
                      >
                        <span
                          aria-hidden
                          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                            dark ? "bg-ua-bg" : "bg-ua-ink"
                          }`}
                        />
                        <span className={dark ? "text-ua-bg" : "text-ua-ink/90"}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
