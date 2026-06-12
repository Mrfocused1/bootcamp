"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type Story = {
  name: string;
  category: string;
  title: string;
  result: string;
  /** Optional looping clip shown in the card's media slot instead of a photo. */
  video?: string;
};

// Per-card resting tilt + vertical stagger (scattered, like the reference), and
// a per-card scroll-parallax amount so they "budge" and shift against each
// other as you scroll.
const ROT = [-3, 2.5, -2, 3, -1.5, 2, -3, 1.5];
const BASE_Y = [0, -28, 18, -14, 24, -10, 6, -22];
const PARALLAX = [34, -26, 42, -20, 30, -40, 22, -32];

export function StoriesGrid({ stories }: { stories: Story[] }) {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(
      (c): c is HTMLDivElement => c !== null,
    );
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const rot = ROT[i % ROT.length];
        const base = BASE_Y[i % BASE_Y.length];
        const par = PARALLAX[i % PARALLAX.length];
        // Resting tilt + stagger (applied with or without reduced motion).
        gsap.set(card, { rotation: rot, y: base });
        if (reduce) return;
        // Scroll-linked budge: y drifts as the card passes through the viewport.
        gsap.fromTo(
          card,
          { y: base + par },
          {
            y: base - par,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
      {stories.map((story, i) => {
        const img = `/marketing/placeholders/p${(i % 8) + 1}.png`;
        return (
          <div
            key={story.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="relative h-full will-change-transform"
          >
            {i === 0 && (
              <Sticker
                name="hundred"
                size={76}
                rotate={10}
                className="absolute -right-3 -top-6 z-10"
              />
            )}
            {i === 4 && (
              <Sticker
                name="sparkles"
                size={72}
                rotate={-12}
                className="absolute -left-4 -top-6 z-10"
              />
            )}
            <div className="h-full overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
              {story.video ? (
                <video
                  src={story.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt=""
                  aria-hidden="true"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <div className="p-6">
                <span className="inline-block rounded-full bg-ua-sky px-3 py-1 text-xs font-bold text-ua-ink">
                  {story.category}
                </span>
                <p className="mt-4 text-sm text-ua-ink/60">{story.name}</p>
                <h3
                  className="mt-1 text-2xl font-bold lowercase text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {story.title}
                </h3>
                <p className="mt-3 text-lg text-ua-ink/80">{story.result}</p>
                <Link
                  href="#"
                  className="mt-5 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
                >
                  View site →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
