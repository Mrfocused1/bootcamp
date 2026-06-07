"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Draggable from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(Draggable, InertiaPlugin);

// Type-pill labels, split across two opposing marquee rows.
const PILLS_ROW_1 = [
  "E-commerce Apps",
  "Subscription Stores",
  "Education Apps",
  "Booking Apps",
  "Portfolio Tools",
  "Travel Apps",
];
const PILLS_ROW_2 = [
  "Brand sites",
  "SaaS Apps",
  "Store Sites",
  "Restaurant ordering",
  "Fitness sites",
  "Author portfolios",
];

// Alternating brand backgrounds for the pills.
const PILL_BG = ["bg-ua-blue", "bg-ua-green", "bg-ua-pink", "bg-ua-orange"];

// TODO(owner): swap placeholder images
const PROJECT_TITLES = [
  "AI meal-planning app",
  "Coffee subscription store",
  "Online tutoring platform",
  "Handmade jewellery shop",
  "Barber booking site",
  "Indie game landing page",
  "Hot-sauce store",
  "Author portfolio",
  "Fitness coaching site",
  "SaaS dashboard",
  "Film review blog",
  "Restaurant ordering site",
  "Travel booking app",
  "Photography portfolio",
  "Newsletter landing page",
];

function Pill({ label, index }: { label: string; index: number }) {
  return (
    <span
      className={`shrink-0 rounded-full border-2 border-ua-ink px-5 py-2 font-bold text-ua-ink ${
        PILL_BG[index % PILL_BG.length]
      }`}
      style={{ fontFamily: "var(--font-epilogue)" }}
    >
      {label}
    </span>
  );
}

function MarqueeRow({
  items,
  reversed = false,
}: {
  items: string[];
  reversed?: boolean;
}) {
  // Duplicate the row so the translateX(-50%) loop is seamless.
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-3">
      <div
        className={`flex w-max gap-4 ${reversed ? "ua-marquee-rev" : "ua-marquee"}`}
      >
        {row.map((label, i) => (
          <Pill key={`${label}-${i}`} label={label} index={i} />
        ))}
      </div>
    </div>
  );
}

export function Build() {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // No-JS / reduced-motion fallback relies on native overflow-x-auto scroll.
    if (prefersReducedMotion()) return;

    const instances = Draggable.create(track, {
      type: "x",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      // Bounds: drag from 0 (start) to -(overflow) so you can't pass the ends.
      bounds: {
        minX: -(track.scrollWidth - track.offsetWidth),
        maxX: 0,
      },
      edgeResistance: 0.85,
    });
    draggableRef.current = instances[0] ?? null;

    return () => {
      draggableRef.current?.kill();
      draggableRef.current = null;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ua-bg px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2
              className="text-4xl font-black leading-[1.02] tracking-tight text-ua-ink sm:text-5xl md:text-7xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              what you&apos;ll build
            </h2>
          </Reveal>
          <Reveal>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-ua-ink/80 md:text-xl">
              real projects, shipped by people who&apos;d never coded before.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Part A — opposing type-pill marquees (full-bleed) */}
      <div className="mt-16 select-none">
        <MarqueeRow items={PILLS_ROW_1} />
        <MarqueeRow items={PILLS_ROW_2} reversed />
      </div>

      {/* Part B — draggable project-card carousel */}
      <div className="relative mt-20">
        <Sticker
          name="rock-on"
          size={96}
          rotate={-12}
          className="absolute -top-12 right-4 z-10 hidden sm:block md:right-10"
        />
        <p className="mb-4 px-6 text-center text-sm font-bold uppercase tracking-wide text-ua-ink/60 md:px-10">
          ← drag →
        </p>
        <div className="overflow-x-auto px-6 pb-6 md:px-10">
          <div
            ref={trackRef}
            className="flex w-max cursor-grab gap-6"
          >
            {PROJECT_TITLES.map((title) => (
              <article
                key={title}
                className="w-72 shrink-0 overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]"
              >
                {/* TODO(owner): swap placeholder images */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/marketing/bridgeway-hero.png"
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <h3
                    className="text-xl font-bold text-ua-ink"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {title}
                  </h3>
                  <a
                    href="#"
                    className="mt-3 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
                  >
                    View project →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
