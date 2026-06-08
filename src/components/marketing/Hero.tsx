"use client";

import { Fragment, useEffect, useRef } from "react";
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
  const scribbleRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    const words = el.querySelectorAll("[data-word]");
    const circle = circleRef.current;
    const scribble = scribbleRef.current;

    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 });
      if (circle) circle.style.strokeDashoffset = "0";
      if (scribble) scribble.style.strokeDashoffset = "0";
      return;
    }

    // Keep the hand-drawn lines hidden until the entrance starts.
    [scribble, circle].forEach((p) => {
      if (p && typeof p.getTotalLength === "function") {
        const len = p.getTotalLength();
        if (len) gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      }
    });

    const drawIn = (path: SVGPathElement | null, delay: number) => {
      if (!path || typeof path.getTotalLength !== "function") return;
      const len = path.getTotalLength();
      if (!len) return;
      gsap.to(path, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", delay });
    };

    // Start the hero entrance only AFTER the page-transition scribble has
    // finished revealing the page (fires "ua:scribble-done"). Fallback timer in
    // case the event is missed.
    let ctx: gsap.Context | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      ctx = gsap.context(() => {
        gsap.fromTo(
          words,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" },
        );
        // The "websites" scribble draws in alongside the words.
        drawIn(scribble, 0.25);
        drawIn(circle, 0.6);
      }, el);
    };

    window.addEventListener("ua:scribble-done", start, { once: true });
    const fallback = window.setTimeout(start, 3200);

    return () => {
      window.removeEventListener("ua:scribble-done", start);
      clearTimeout(fallback);
      ctx?.revert();
    };
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

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-end px-6 pb-8 text-center md:px-10">
        <h1
          ref={wordsRef}
          className="mx-auto max-w-5xl text-3xl font-bold lowercase leading-[1.05] text-ua-bg sm:text-4xl md:text-5xl"
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

            // "websites" gets a white hand-drawn scribble loop that draws in.
            if (w === "websites") {
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
                      className="pointer-events-none absolute -left-[13%] -top-[52%] h-[204%] w-[142%] text-ua-bg"
                    >
                      <path
                        ref={scribbleRef}
                        d={CIRCLE_PATH}
                        stroke="currentColor"
                        strokeWidth={5}
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
              <Fragment key={`${w}-${i}`}>
                <span
                  data-word
                  className="ua-reveal inline-block whitespace-pre"
                  style={{ opacity: 0 }}
                >
                  {w}
                  {space}
                </span>
                {/* Force the heading onto two lines: break after "build". */}
                {w === "build" && <br aria-hidden="true" />}
              </Fragment>
            );
          })}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-ua-bg/90 md:text-lg">
          For founders, entrepreneurs, teams and organisations — even charities —
          who want to build with AI in-house, not wait on an agency.
        </p>

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
