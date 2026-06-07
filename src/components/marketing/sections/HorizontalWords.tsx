"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";
import { Sticker } from "@/components/marketing/Sticker";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "No code. No agency. Just you and AI.";

// Faithful recreation of the original homepage's post-hero section
// ("Made With GSAP" effect #11): the statement track scrubs horizontally while
// pinned (sticky), and each letter + sticker bounces in (elastic, from a random
// vertical offset + rotation) as it sweeps across the viewport. Mobile /
// reduced-motion fall back to a static, wrapped statement (handled in CSS).
export function HorizontalWords() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const desktop =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (prefersReducedMotion() || !desktop) return; // CSS renders the static layout

    const ctx = gsap.context(() => {
      // 1) Horizontal scrub of the whole track, tied to scroll through the tall section.
      const scrollTween = gsap.fromTo(
        track,
        { xPercent: 50 },
        {
          xPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "-30% top",
            end: "125% bottom",
            scrub: 0.5,
          },
        },
      );

      // 2) Each letter bounces in from a random vertical position + rotation as it
      //    sweeps across the viewport (driven by the horizontal scrollTween).
      track.querySelectorAll<HTMLElement>(".letter").forEach((el) => {
        gsap.from(el, {
          yPercent: (Math.random() - 0.5) * 500,
          rotation: (Math.random() - 0.5) * 60,
          ease: "elastic.out(1.2, 1)",
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollTween,
            start: "left 90%",
            end: "left 10%",
            scrub: 0.5,
          },
        });
      });

      // 3) Each sticker scales up from nothing (also random y + rotation) as it sweeps in.
      track.querySelectorAll<HTMLElement>(".hw-sticker").forEach((el) => {
        gsap.from(el, {
          scale: 0,
          yPercent: (Math.random() - 0.5) * 400,
          rotation: (Math.random() - 0.5) * 60,
          ease: "elastic.out(1.2, 1)",
          scrollTrigger: {
            trigger: el,
            containerAnimation: scrollTween,
            start: "left 90%",
            end: "left 10%",
            scrub: 0.5,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hw-section relative bg-ua-bg text-ua-ink">
      <div className="hw-content">
        <div ref={trackRef} className="hw-relative">
          <h2
            className="hw-h2 text-5xl font-bold leading-none md:text-[8.5rem]"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {HEADLINE.split("").map((c, i) =>
              c === " " ? (
                <span key={i}> </span>
              ) : (
                <span key={i} className="letter inline-block">
                  {c}
                </span>
              ),
            )}
          </h2>

          <span className="hw-sticker pointer-events-none absolute left-[17%] top-1/2 -translate-x-1/2 -translate-y-[110%]">
            <Sticker name="sparkles" size={92} />
          </span>
          <span className="hw-sticker pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[10%]">
            <Sticker name="cursor-star" size={110} />
          </span>
          <span className="hw-sticker pointer-events-none absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-[100%]">
            <Sticker name="phone-hand" size={104} />
          </span>
        </div>

        <div className="hw-bottom">
          <p className="mx-auto max-w-xl px-6 text-lg text-ua-ink/80 md:text-2xl">
            Building software used to take a developer <em>and</em> a big budget.
            With AI, you build and launch a real website yourself — in days, not
            months.
          </p>
        </div>
      </div>
    </section>
  );
}
