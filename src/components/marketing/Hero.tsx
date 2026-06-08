"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { HERO } from "@/lib/marketing/content";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

// Our own hand-drawn loop (original) — circles the final word for emphasis.
const CIRCLE_PATH =
  "M44 96C12 84 6 44 70 26C134 8 196 30 188 64C181 94 96 112 40 92C18 84 18 62 40 50";

export function Hero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);
  const circleRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    const words = el.querySelectorAll("[data-word]");
    const circle = circleRef.current;

    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 });
      if (circle) circle.style.strokeDashoffset = "0";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out", delay: 0.2 },
      );

      // Draw the hand-drawn circle in, after the words have appeared.
      if (circle && typeof circle.getTotalLength === "function") {
        const len = circle.getTotalLength();
        if (len) {
          gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(circle, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", delay: 1 });
        }
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO.image}
        alt={HERO.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ua-ink/70 via-ua-ink/10 to-transparent" />

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-end px-6 pb-20 text-center md:px-10">
        <h1
          ref={wordsRef}
          className="mx-auto max-w-5xl text-5xl font-bold lowercase leading-[0.95] text-ua-bg md:text-8xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {HERO.words.map((w, i) => {
            const space = i < HERO.words.length - 1 ? " " : "";

            // Emphasised word: serif italic (Lora), like the original.
            if (w === HERO.emphasis) {
              return (
                <span
                  key={`${w}-${i}`}
                  data-word
                  className="ua-reveal inline-block whitespace-pre italic"
                  style={{ opacity: 0, fontFamily: "var(--font-lora)" }}
                >
                  {w}
                  {space}
                </span>
              );
            }

            // "ai" gets the hand-drawn circle around it.
            if (w === "ai") {
              return (
                <span
                  key={`${w}-${i}`}
                  data-word
                  className="ua-reveal relative inline-block whitespace-pre"
                  style={{ opacity: 0 }}
                >
                  <span className="relative inline-block">
                    {w}
                    <svg
                      viewBox="0 0 230 120"
                      fill="none"
                      aria-hidden="true"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute -left-[18%] -top-[22%] h-[150%] w-[140%] text-ua-pink"
                    >
                      <path
                        ref={circleRef}
                        d={CIRCLE_PATH}
                        stroke="currentColor"
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {space}
                </span>
              );
            }

            return (
              <span
                key={`${w}-${i}`}
                data-word
                className="ua-reveal inline-block whitespace-pre"
                style={{ opacity: 0 }}
              >
                {w}
                {space}
              </span>
            );
          })}
        </h1>

        <div className="mt-8">
          <Link
            href={HERO.ctaHref}
            className="inline-block rounded-full bg-ua-orange px-7 py-3 text-lg font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {HERO.ctaLabel} →
          </Link>
        </div>
      </div>
    </section>
  );
}
