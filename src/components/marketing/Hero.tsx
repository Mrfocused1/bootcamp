"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { HERO } from "@/lib/marketing/content";
import { Scribble } from "./Scribble";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

export function Hero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    const words = el.querySelectorAll("[data-word]");
    if (prefersReducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out", delay: 0.2 },
      );
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

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-16 md:px-10">
        <h1
          ref={wordsRef}
          className="max-w-5xl text-5xl font-bold lowercase leading-[0.95] text-ua-bg md:text-8xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {HERO.words.map((w, i) => (
            <span key={`${w}-${i}`} data-word className="inline-block whitespace-pre" style={{ opacity: 0 }}>
              {w === HERO.emphasis ? <em>{w}</em> : w}{i < HERO.words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex items-center gap-5">
          <Link
            href={HERO.ctaHref}
            className="rounded-full bg-ua-orange px-7 py-3 text-lg font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {HERO.ctaLabel} →
          </Link>
          <Scribble className="hidden h-12 w-40 md:block" color="var(--ua-pink)" />
        </div>
      </div>
    </section>
  );
}
