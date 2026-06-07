"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";
import { Sticker } from "@/components/marketing/Sticker";

gsap.registerPlugin(ScrollTrigger);

// Recreation of the original homepage's post-hero "horizontal words" moment:
// a big nowrap statement that sweeps horizontally across the screen while the
// section is pinned, with sticker accents over the words and a sub-line below.
// Mobile / reduced-motion fall back to a static, wrapped statement (no pin).
export function HorizontalWords() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const desktop =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 768px)").matches;
    if (prefersReducedMotion() || !desktop) return; // CSS handles the static layout

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, pin);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-ua-bg text-ua-ink">
      <div
        ref={pinRef}
        className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden py-24"
      >
        <div
          ref={trackRef}
          className="hw-track relative flex w-full justify-center px-6 will-change-transform md:w-max md:justify-start md:px-[10vw]"
        >
          <h2
            className="hw-h2 relative whitespace-normal text-center text-5xl font-bold leading-[1.05] md:whitespace-nowrap md:text-left md:text-[8.5rem] md:leading-none"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            No code. No agency. Just you and AI.
            <span className="pointer-events-none absolute left-[10%] top-0 hidden -translate-y-1/2 md:block">
              <Sticker name="cursor-star" size={96} rotate={-10} />
            </span>
            <span className="pointer-events-none absolute left-[52%] -bottom-10 hidden md:block">
              <Sticker name="sparkles" size={80} rotate={8} />
            </span>
            <span className="pointer-events-none absolute left-[86%] top-0 hidden -translate-y-1/3 md:block">
              <Sticker name="phone-hand" size={104} rotate={10} />
            </span>
          </h2>
        </div>

        <div className="mt-14 max-w-xl px-6 text-center">
          <p className="text-lg text-ua-ink/80 md:text-2xl">
            Building software used to take a developer <em>and</em> a big budget.
            With AI, you build and launch a real website yourself — in days, not
            months.
          </p>
        </div>
      </div>
    </section>
  );
}
