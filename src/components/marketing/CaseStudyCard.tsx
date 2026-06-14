"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type CaseStudy = {
  name: string;
  /** Brand logo (transparent PNG/SVG). */
  logo: string;
  /** Short, 1–2 sentence description of the build. */
  blurb: string;
  /** Playable demo clip (16:9). */
  video: string;
  /** Thumbnail still (16:9, matches the video so it never crops). */
  poster?: string;
  /** Live site URL for the "view website" button. */
  href: string;
  /** Optional override for the logo's height classes (default h-10 md:h-12). */
  logoClass?: string;
};

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const blocks = el.querySelectorAll<HTMLElement>("[data-cs]");
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      gsap.set(blocks, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 82%", once: true } })
        .fromTo(
          el,
          { opacity: 0, y: 44, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
        )
        .fromTo(
          blocks,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 },
          "-=0.4",
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      style={{ opacity: 0, willChange: "transform" }}
      className="overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[8px_8px_0_var(--ua-ink)]"
    >
      {/* Playable demo — full width, 16:9, never cropped. */}
      <div data-cs className="border-b-2 border-ua-ink bg-ua-ink">
        <video
          src={study.video}
          poster={study.poster}
          controls
          playsInline
          preload="metadata"
          className="block aspect-video w-full object-cover"
        />
      </div>

      {/* Copy — always visible, below the video. */}
      <div className="flex flex-col items-start gap-3 p-5 md:p-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-cs
          src={study.logo}
          alt={`${study.name} logo`}
          className={`w-auto ${study.logoClass ?? "h-10 md:h-12"}`}
        />
        <h3
          data-cs
          className="text-xl font-black text-ua-ink md:text-2xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {study.name}
        </h3>
        <p data-cs className="max-w-2xl text-base leading-relaxed text-ua-ink/75">
          {study.blurb}
        </p>
        <a
          data-cs
          href={study.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-1 inline-flex items-center gap-2 rounded-full border-2 border-ua-ink bg-ua-ink px-6 py-2.5 text-sm font-bold text-ua-bg shadow-[4px_4px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ua-orange hover:shadow-[6px_6px_0_var(--ua-ink)] active:translate-y-0 active:shadow-[2px_2px_0_var(--ua-ink)]"
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
