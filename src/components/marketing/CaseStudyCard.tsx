"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type CaseStudy = {
  name: string;
  /** Brand logo (transparent PNG/SVG) shown in the overlay. */
  logo: string;
  /** Short, 1–2 sentence description of the build. */
  blurb: string;
  /** Clickable demo clip. */
  video: string;
  /** Thumbnail still shown before the clip plays. */
  poster?: string;
  /** Live site URL for the "view website" button. */
  href: string;
};

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 48, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => void videoRef.current?.play().catch(() => {}));
  };

  return (
    <div
      ref={ref}
      style={{ opacity: 0, willChange: "transform" }}
      className="relative overflow-hidden rounded-3xl border-2 border-ua-ink bg-ua-ink shadow-[8px_8px_0_var(--ua-ink)]"
    >
      {/* Video area — always 16:9; the thumbnail shows until it's played. */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={study.video}
          poster={study.poster}
          controls={playing}
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {!playing && (
          <>
            {/* Click-anywhere-to-play surface. */}
            <button
              type="button"
              onClick={play}
              aria-label={`Play ${study.name} demo`}
              className="absolute inset-0 z-0 cursor-pointer"
            />
            {/* Play badge — right side on desktop, centred on mobile. */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ua-ink bg-ua-bg shadow-[3px_3px_0_var(--ua-ink)] sm:left-auto sm:right-[8%] sm:translate-x-0 sm:h-16 sm:w-16">
              <span className="ml-1 inline-block border-y-[9px] border-l-[15px] border-y-transparent border-l-ua-ink" />
            </span>
          </>
        )}
      </div>

      {/* Copy — overlaid bottom-left on desktop, stacked below on mobile.
          No dark layer over the video; the copy sits in a solid panel. */}
      {!playing && (
        <div className="relative z-20 border-t-2 border-ua-ink bg-ua-bg p-4 sm:absolute sm:bottom-6 sm:left-6 sm:max-w-md sm:rounded-2xl sm:border-2 sm:p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.logo}
            alt={`${study.name} logo`}
            className="h-8 w-auto md:h-9"
          />
          <h3
            className="mt-3 text-lg font-black text-ua-ink md:text-xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {study.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ua-ink/75">
            {study.blurb}
          </p>
          <a
            href={study.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ua-ink bg-ua-ink px-5 py-2 text-sm font-bold text-ua-bg shadow-[3px_3px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-ua-orange hover:shadow-[5px_5px_0_var(--ua-ink)] active:translate-y-0 active:shadow-[1px_1px_0_var(--ua-ink)]"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            view website
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
