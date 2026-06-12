"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

// Hand-drawn underline that draws itself in under the page title.
const UNDERLINE =
  "M4 22C90 9 200 7 300 13C360 16 340 24 300 26C420 18 520 14 632 20";

/**
 * Reusable page header band. Dark background so the fixed (cream) nav stays
 * readable. Eyebrow label, big lowercase title with a scribble that draws
 * itself in, intro line, and an optional sticker — matching the homepage feel.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  sticker,
  underlineColor = "text-ua-pink",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  sticker?: string;
  underlineColor?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      return;
    }
    const ctx = gsap.context(() => {
      if (typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      if (!len) return;
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.inOut",
        delay: 0.5,
      });
    }, path);
    return () => ctx.revert();
  }, []);

  return (
    <section
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ua-ink px-6 pb-20 pt-36 text-ua-bg md:px-10 md:pb-28 md:pt-44"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-bg/60">
          {eyebrow}
        </p>
        <h1
          className="relative mt-4 inline-block text-5xl font-black lowercase leading-[1.02] tracking-tight md:text-7xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {title}
          <svg
            viewBox="0 0 636 30"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
            className={`pointer-events-none absolute -bottom-5 left-0 w-full ${underlineColor}`}
          >
            <path
              ref={pathRef}
              d={UNDERLINE}
              stroke="currentColor"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </svg>
        </h1>
        {intro && (
          <p className="mx-auto mt-10 max-w-2xl text-lg text-ua-bg/80 md:text-xl">
            {intro}
          </p>
        )}
      </div>

      {sticker && (
        <Sticker
          name={sticker}
          size={120}
          rotate={-10}
          className="absolute right-4 top-28 z-10 hidden md:block md:right-16 md:top-32"
        />
      )}
    </section>
  );
}
