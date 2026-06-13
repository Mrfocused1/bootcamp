"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type CaseStudy = {
  name: string;
  /** Brand logo (transparent PNG/SVG) shown above the copy. */
  logo: string;
  /** Short, 1–2 sentence description of the build. */
  blurb: string;
  /** Looping/clickable demo clip. */
  video: string;
  /** First-frame still shown before the clip plays. */
  poster?: string;
  /** Live site URL for the "view website" button. */
  href: string;
  /** Accent colour behind the logo + button (a --ua-* token value). */
  accent?: string;
};

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const blocks = el.querySelectorAll<HTMLElement>("[data-cs]");
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, rotateX: 0 });
      gsap.set(blocks, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      // Card lifts and settles in…
      tl.fromTo(
        el,
        { opacity: 0, y: 48, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
      )
        // …then the media + copy stagger in behind it.
        .fromTo(
          blocks,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.12 },
          "-=0.35",
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, willChange: "transform" }}
      className="grid overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[8px_8px_0_var(--ua-ink)] md:grid-cols-2"
    >
      {/* Demo video — playable, fills its half (16:9 banner on mobile, full
          column height on desktop) so there are no letterbox gaps. */}
      <div
        data-cs
        className="relative aspect-video border-b-2 border-ua-ink bg-ua-ink md:aspect-auto md:border-b-0 md:border-r-2"
      >
        <video
          src={study.video}
          poster={study.poster}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Copy */}
      <div className="flex flex-col items-start gap-3.5 p-5 md:p-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-cs
          src={study.logo}
          alt={`${study.name} logo`}
          className="h-10 w-auto md:h-12"
        />

        <h3
          data-cs
          className="text-xl font-black text-ua-ink md:text-2xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {study.name}
        </h3>

        <p data-cs className="text-base leading-relaxed text-ua-ink/75">
          {study.blurb}
        </p>

        <a
          data-cs
          href={study.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-0.5 inline-flex items-center gap-2 rounded-full border-2 border-ua-ink bg-ua-ink px-6 py-2.5 text-sm font-bold text-ua-bg shadow-[4px_4px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ua-orange hover:text-ua-bg hover:shadow-[6px_6px_0_var(--ua-ink)] active:translate-y-0 active:shadow-[2px_2px_0_var(--ua-ink)]"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          view website
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
