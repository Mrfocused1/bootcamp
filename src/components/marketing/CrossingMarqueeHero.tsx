"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

// Brand words + our own stickers (not the reference's content) for the two
// crossing marquee bands.
type Item = { word: string; sticker: string };
const ITEMS_A: Item[] = [
  { word: "real", sticker: "hundred" },
  { word: "shipped", sticker: "rock-on" },
  { word: "live", sticker: "lightning" },
  { word: "launched", sticker: "lets-go" },
  { word: "built", sticker: "sparkles" },
];
const ITEMS_B: Item[] = [
  { word: "live", sticker: "peace" },
  { word: "launched", sticker: "high-five" },
  { word: "real", sticker: "cool-smiley" },
  { word: "shipped", sticker: "megaphone" },
  { word: "built", sticker: "starburst" },
];

const ARROW = "M10 10C46 60 96 60 130 14";
const ARROWHEAD = "M116 2L131 14L114 26";

function Band({ items, reverse }: { items: Item[]; reverse?: boolean }) {
  // Duplicate the row so the translateX(-50%) loop is seamless.
  const row = [...items, ...items, ...items, ...items];
  return (
    <div
      className={`flex w-max items-center gap-8 md:gap-12 ${reverse ? "ua-marquee-rev" : "ua-marquee"}`}
    >
      {row.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8 md:gap-12">
          <span
            className={
              i % 2 === 0
                ? "text-4xl font-black uppercase leading-none tracking-tight md:text-6xl"
                : "text-4xl italic leading-none md:text-6xl"
            }
            style={{
              fontFamily:
                i % 2 === 0 ? "var(--font-epilogue)" : "var(--font-lora)",
            }}
          >
            {it.word}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/marketing/stickers/${it.sticker}.png`}
            alt=""
            aria-hidden="true"
            className="h-11 w-11 shrink-0 object-contain md:h-16 md:w-16"
          />
        </span>
      ))}
    </div>
  );
}

export function CrossingMarqueeHero() {
  const band1 = useRef<HTMLDivElement>(null);
  const band2 = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const b1 = band1.current;
    const b2 = band2.current;
    const text = textRef.current;
    if (!b1 || !b2) return;

    const arrowPaths = arrowRef.current
      ? Array.from(arrowRef.current.querySelectorAll("path"))
      : [];

    if (prefersReducedMotion()) {
      gsap.set(b1, { rotate: -11, autoAlpha: 1, scale: 1 });
      gsap.set(b2, { rotate: 11, autoAlpha: 1, scale: 1 });
      if (text) gsap.set(text, { autoAlpha: 1, y: 0 });
      arrowPaths.forEach((p) => (p.style.strokeDashoffset = "0"));
      return;
    }

    // Initial: both bands flat (rotation 0), overlapping, hidden.
    gsap.set([b1, b2], { rotate: 0, scale: 0.85, autoAlpha: 0 });
    if (text) gsap.set(text, { autoAlpha: 0, y: 24 });

    let started = false;
    let ctx: gsap.Context | undefined;
    const start = () => {
      if (started) return;
      started = true;
      ctx = gsap.context(() => {
        // The two bands "scissor" open into the crossing X.
        gsap.to(b1, { rotate: -11, scale: 1, autoAlpha: 1, duration: 0.9, ease: "power3.out" });
        gsap.to(b2, { rotate: 11, scale: 1, autoAlpha: 1, duration: 0.9, ease: "power3.out" });
        if (text) {
          gsap.to(text, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.55 });
        }
        arrowPaths.forEach((p) => {
          if (typeof p.getTotalLength !== "function") return;
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(p, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut", delay: 0.9 });
        });
      });
    };

    // Start after the page-transition scribble finishes (with a fallback).
    window.addEventListener("ua:scribble-done", start, { once: true });
    const fallback = window.setTimeout(start, 3200);

    return () => {
      window.removeEventListener("ua:scribble-done", start);
      clearTimeout(fallback);
      ctx?.revert();
    };
  }, []);

  return (
    <section className="relative flex min-h-[90svh] flex-col overflow-hidden bg-ua-ink text-ua-bg">
      {/* Two crossing marquee bands */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[44%] w-[210%] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={band1}
            className="overflow-hidden border-y-2 border-ua-bg/70 py-3 md:py-5"
          >
            <Band items={ITEMS_A} />
          </div>
        </div>
        <div className="absolute left-1/2 top-[44%] w-[210%] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={band2}
            className="overflow-hidden border-y-2 border-ua-bg/70 py-3 md:py-5"
          >
            <Band items={ITEMS_B} reverse />
          </div>
        </div>
      </div>

      {/* Statement + arrow, lower in the hero */}
      <div ref={textRef} className="relative z-10 mt-auto px-6 pb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-bg/60">
          real people · real websites
        </p>
        <h1
          className="mt-2 text-4xl font-black lowercase tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          see what they built
        </h1>
        <svg
          viewBox="0 0 140 36"
          fill="none"
          aria-hidden="true"
          className="mx-auto mt-4 h-9 w-36 text-ua-bg"
        >
          <g ref={arrowRef}>
            <path d={ARROW} stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
            <path d={ARROWHEAD} stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </section>
  );
}
