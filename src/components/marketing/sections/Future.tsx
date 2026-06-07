"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

const TITLE_WORDS = ["A", "course", "built", "for", "the", "AI", "era."];
const EMPHASIS_WORDS = ["from", "idea", "to", "live", "site."];

const UNDERLINE_PATH =
  "M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436";

const FLYING_TAGS = [
  { label: "no code required!", bg: "bg-ua-pink", rotate: -6, className: "left-2 top-0 md:left-8" },
  {
    label: "AI is your unfair advantage",
    bg: "bg-ua-green",
    rotate: 4,
    className: "right-2 top-10 md:right-12",
  },
  {
    label: "shipping > perfect",
    bg: "bg-ua-blue text-ua-bg",
    rotate: -3,
    className: "left-1/2 top-28 -translate-x-1/2",
  },
];

const CARDS = [
  { sticker: "earth", label: "A real website", bg: "bg-ua-pink" },
  { sticker: "hundred", label: "Live payments", bg: "bg-ua-green" },
  { sticker: "lightning", label: "On the internet, fast", bg: "bg-ua-blue" },
  { sticker: "camera", label: "Every session recorded", bg: "bg-ua-orange" },
];

export function Future() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const path = pathRef.current;
    const tagsContainer = tagsRef.current;
    if (!section) return;

    const words = title?.querySelectorAll("[data-word]");
    const tags = tagsContainer?.querySelectorAll("[data-tag]");

    if (prefersReducedMotion()) {
      if (words) gsap.set(words, { opacity: 1, y: 0 });
      if (path) gsap.set(path, { strokeDashoffset: 0 });
      if (tags) gsap.set(tags, { y: 0, rotation: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (words && words.length) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          },
        );
      }

      if (path && typeof path.getTotalLength === "function") {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length });
        gsap.from(path, {
          strokeDashoffset: length,
          duration: 0.8,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
      }

      if (tags && tags.length) {
        tags.forEach((tag, i) => {
          gsap.to(tag, {
            y: "+=10",
            rotation: "+=2",
            duration: 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.3,
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ua-bg px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-6xl">
        {/* Title block */}
        <div className="relative">
          <Sticker
            name="heart-hands"
            size={120}
            rotate={-8}
            className="absolute -top-16 right-0 hidden md:block"
          />
          <h2
            ref={titleRef}
            className="max-w-4xl text-4xl font-bold leading-[1.05] text-ua-ink md:text-7xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {TITLE_WORDS.map((w, i) => (
              <span
                key={`t-${w}-${i}`}
                data-word
                className="ua-reveal inline-block whitespace-pre"
                style={{ opacity: 0 }}
              >
                {w}{" "}
              </span>
            ))}
            <span className="relative inline-block">
              <em>
                {EMPHASIS_WORDS.map((w, i) => (
                  <span
                    key={`e-${w}-${i}`}
                    data-word
                    className="ua-reveal inline-block whitespace-pre not-italic"
                    style={{ opacity: 0 }}
                  >
                    <em>{w}</em>{" "}
                  </span>
                ))}
              </em>
              {/* Hand-drawn underline that draws in on scroll */}
              <svg
                viewBox="0 0 634 28"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 left-0 w-full text-ua-pink"
                preserveAspectRatio="none"
              >
                <path
                  ref={pathRef}
                  d={UNDERLINE_PATH}
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Flying tags */}
        <div
          ref={tagsRef}
          className="relative mt-10 h-44 md:mt-12 md:h-40"
        >
          {FLYING_TAGS.map((tag) => (
            <span
              key={tag.label}
              data-tag
              className={`absolute rounded-full border-2 border-ua-ink px-5 py-2 font-bold whitespace-nowrap ${tag.bg} ${tag.className}`}
              style={{ transform: `rotate(${tag.rotate}deg)` }}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Paragraph */}
        <Reveal>
          <p className="mt-6 max-w-3xl text-lg text-ua-ink/80 md:text-xl">
            Over five 1-hour live sessions you&apos;ll learn the exact stack we use to
            ship real products with AI — Cursor, Supabase, Stripe, Resend, GitHub,
            hosting, domains and SEO. Every session is recorded, so you can rewatch
            anytime.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <Reveal key={card.label}>
              <div
                className={`flex h-full flex-col items-start gap-4 rounded-3xl border-2 border-ua-ink p-6 ${card.bg}`}
              >
                <Sticker name={card.sticker} size={64} rotate={6} />
                <span
                  className="text-xl font-bold text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {card.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
