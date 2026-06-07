"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

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

// Resting rotations per card index (matches the original "services" fanned deck).
const REST_ROTATIONS = [3, 0, 6, -1, -8];

export function Curriculum() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The fanned deck only runs on md+ pointer screens with motion allowed.
    // Below that we fall back to a plain readable stacked/grid layout.
    const mqlDesktop = window.matchMedia?.("(min-width: 768px)");
    const enabled = () => !!mqlDesktop?.matches && !prefersReducedMotion();

    let activeIndex = -1;
    let containerWidth = container.getBoundingClientRect().width;

    const ELASTIC = { ease: "elastic.out(1, 0.75)", duration: 0.8 };

    const setResting = (immediate = false) => {
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const props = { rotation: REST_ROTATIONS[idx] ?? 0, scale: 1 };
        if (immediate) gsap.set(card, props);
        else gsap.to(card, { ...props, ...ELASTIC });
      });
      contentRefs.current.forEach((content) => {
        if (!content) return;
        if (immediate) gsap.set(content, { xPercent: 0 });
        else gsap.to(content, { xPercent: 0, ...ELASTIC });
      });
    };

    const ctx = gsap.context(() => {
      // Lay z-index so later cards sit on top (deck look) + initial resting state.
      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        card.style.zIndex = String(idx + 1);
      });
      setResting(true);
    }, container);

    if (!enabled()) {
      // Reduced motion / mobile: flatten everything so content is fully readable.
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { rotation: 0, scale: 1, clearProps: "zIndex" });
      });
      contentRefs.current.forEach((content) => {
        if (content) gsap.set(content, { xPercent: 0 });
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!enabled()) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const activePortion = Math.ceil((mouseX / containerWidth) * 5);
      const i = Math.min(Math.max(activePortion, 1), 5) - 1; // clamp to 0..4
      if (i === activeIndex) return;

      // Reset the previously active card to its resting offset.
      if (activeIndex >= 0) {
        const prev = cardRefs.current[activeIndex];
        if (prev) {
          gsap.to(prev, {
            rotation: REST_ROTATIONS[activeIndex] ?? 0,
            scale: 1,
            ...ELASTIC,
          });
        }
      }

      activeIndex = i;

      // Bring the new active card forward: pop upright + enlarge.
      const active = cardRefs.current[i];
      if (active) {
        gsap.to(active, { rotation: 0, scale: 1.1, ...ELASTIC });
      }

      // Spread the other cards' inner content away from the active one.
      contentRefs.current.forEach((content, idx) => {
        if (!content) return;
        const xPercent = idx === i ? 0 : 70 / (idx - i);
        gsap.to(content, { xPercent, ...ELASTIC });
      });
    };

    const onMouseLeave = () => {
      if (!enabled()) return;
      activeIndex = -1;
      setResting(false);
    };

    const onResize = () => {
      containerWidth = container.getBoundingClientRect().width;
      if (!enabled()) {
        activeIndex = -1;
        cardRefs.current.forEach((card, idx) => {
          if (card) {
            gsap.set(card, { rotation: 0, scale: 1 });
            card.style.zIndex = String(idx + 1);
          }
        });
        contentRefs.current.forEach((content) => {
          if (content) gsap.set(content, { xPercent: 0 });
        });
      } else {
        setResting(true);
      }
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section className="overflow-hidden bg-ua-bg px-6 py-24 md:px-10">
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
          Mobile (< md): vertical/grid stack — full-width, non-overlapping,
          non-rotated cards with all content visible.
          Desktop (md+): horizontal overlapping fanned deck with mouse interaction.
        */}
        <div
          ref={containerRef}
          className="mt-14 flex flex-col gap-6 md:mt-20 md:flex-row md:justify-center md:gap-0"
        >
          {DAYS.map((d, i) => {
            const dark = d.color.includes("text-ua-bg");
            return (
              <div
                key={d.day}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`relative w-full origin-bottom rounded-3xl border-2 border-ua-ink ${d.color} p-7 shadow-[6px_6px_0_var(--ua-ink)] will-change-transform md:min-h-[30rem] md:w-[19.25em] md:-ml-[4.9em] md:p-8 md:first:ml-0`}
              >
                <div
                  ref={(el) => {
                    contentRefs.current[i] = el;
                  }}
                  className="flex h-full flex-col will-change-transform"
                >
                  <Sticker
                    name={d.sticker}
                    size={64}
                    className="absolute -right-3 -top-7"
                    rotate={8}
                  />
                  <h3
                    className="pr-8 text-2xl font-bold"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {d.day}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {d.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-base leading-snug"
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
