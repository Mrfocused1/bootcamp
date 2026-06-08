"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sticker } from "@/components/marketing/Sticker";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Hand-drawn circle that loops around the emphasised word (draws itself in).
const CIRCLE_PATH =
  "M120 18C70 10 18 26 14 52C10 80 78 96 150 92C214 88 244 64 232 42C220 22 150 14 96 22";

// Hand-drawn underline squiggle under the serif phrase (draws itself in).
const UNDERLINE_PATH =
  "M4 20C70 9 150 7 220 12C260 15 244 22 214 24C300 18 360 14 420 19";

// Squiggly connector arrow between two photos (draws itself in).
const ARROW_PATH =
  "M6 14C70 -6 150 60 120 96C96 124 30 110 40 78C48 52 96 50 132 66";
const ARROW_HEAD = "M118 52L134 68L112 74";

type Sticker = {
  name: string;
  size: number;
  rotate: number;
  className: string;
};

type Photo = {
  src: string;
  className: string; // size + absolute position (desktop)
  rotate: number;
  z: number;
  sticker?: Sticker;
};

// Scattered, overlapping collage — placeholder portraits/landscapes at the same
// proportions as the reference (portrait 3:4, landscape 4:3). Swap the src for
// real client photos later.
const PHOTOS: Photo[] = [
  {
    src: "/marketing/placeholders/p1.png",
    className: "left-[1%] top-[3rem] w-[15rem] aspect-[3/4]",
    rotate: -4,
    z: 2,
  },
  {
    src: "/marketing/placeholders/p2.png",
    className: "left-[22%] top-[0.5rem] w-[13rem] aspect-[3/4]",
    rotate: 3,
    z: 3,
    sticker: {
      name: "cool-smiley",
      size: 84,
      rotate: -8,
      className: "-right-5 -top-6",
    },
  },
  {
    src: "/marketing/placeholders/p4.png",
    className: "left-[38%] top-[18rem] w-[20rem] aspect-[4/3]",
    rotate: -2,
    z: 6,
    sticker: {
      name: "lets-go",
      size: 92,
      rotate: 8,
      className: "-right-7 top-1/4",
    },
  },
  {
    src: "/marketing/placeholders/p5.png",
    className: "left-[70%] top-[2.5rem] w-[15rem] aspect-[3/4]",
    rotate: 3,
    z: 4,
    sticker: {
      name: "rock-on",
      size: 92,
      rotate: -10,
      className: "-right-6 top-1/4",
    },
  },
  {
    src: "/marketing/placeholders/p7.png",
    className: "left-[71%] top-[25rem] w-[16rem] aspect-[4/3]",
    rotate: -3,
    z: 3,
  },
  {
    src: "/marketing/placeholders/p3.png",
    className: "left-[5%] top-[26rem] w-[13rem] aspect-[3/4]",
    rotate: 2,
    z: 5,
    sticker: {
      name: "join-the-club",
      size: 98,
      rotate: -6,
      className: "-left-7 -bottom-4",
    },
  },
];

function PhotoCard({
  src,
  rotate,
  alt = "",
}: {
  src: string;
  rotate: number;
  alt?: string;
}) {
  return (
    <div
      className="h-full w-full overflow-hidden rounded-2xl border-2 border-ua-ink bg-white shadow-[8px_8px_0_rgba(0,0,0,0.45)]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* TODO(owner): swap placeholder for a real client photo. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === "" ? true : undefined}
        draggable={false}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const draws = section.querySelectorAll<SVGPathElement>("[data-draw]");
    const photos = section.querySelectorAll<HTMLElement>("[data-photo]");

    if (prefersReducedMotion()) {
      draws.forEach((p) => {
        p.style.strokeDashoffset = "0";
      });
      gsap.set(photos, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Squiggly lines / circles / underlines draw themselves in on scroll.
      draws.forEach((path) => {
        if (typeof path.getTotalLength !== "function") return;
        const len = path.getTotalLength();
        if (!len) return;
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: path, start: "top 88%", once: true },
        });
      });

      // Photos pop in with a gentle bounce + stagger as the collage enters.
      gsap.to(photos, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.4)",
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-ua-ink px-6 py-24 text-ua-bg md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <h2
          className="mx-auto max-w-4xl text-center text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-7xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          meet the{" "}
          <span className="relative inline-block">
            people
            <svg
              viewBox="0 0 250 110"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -left-[12%] -top-[28%] h-[156%] w-[124%] text-ua-pink"
            >
              <path
                data-draw
                d={CIRCLE_PATH}
                stroke="currentColor"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>{" "}
          who shipped a{" "}
          <span className="relative inline-block">
            <span style={{ fontFamily: "var(--font-lora)" }} className="italic">
              real website
            </span>
            <svg
              viewBox="0 0 424 30"
              fill="none"
              aria-hidden="true"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -bottom-4 left-0 w-full text-ua-sky"
            >
              <path
                data-draw
                d={UNDERLINE_PATH}
                stroke="currentColor"
                strokeWidth={5}
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          in 5 days.{" "}
          <span className="whitespace-nowrap">proud of them!</span>
        </h2>

        {/* ───────── Desktop collage (absolute scatter) ───────── */}
        <div className="relative mt-20 hidden h-[46rem] md:block">
          {/* Organic blobs behind the photos */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[40%] top-[1rem] h-[24rem] w-[24rem] bg-ua-green"
            style={{ borderRadius: "60% 40% 55% 45% / 52% 48% 52% 48%" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[4%] top-[22rem] h-[16rem] w-[16rem] bg-ua-blue"
            style={{ borderRadius: "48% 52% 42% 58% / 55% 44% 56% 45%" }}
          />

          {/* Squiggly connector arrow that draws itself in */}
          <svg
            viewBox="0 0 150 130"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute left-[34%] top-[12rem] z-[7] h-[12rem] w-[12rem] text-ua-bg"
          >
            <path
              data-draw
              d={ARROW_PATH}
              stroke="currentColor"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              data-draw
              d={ARROW_HEAD}
              stroke="currentColor"
              strokeWidth={3.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              data-photo
              className={`ua-reveal absolute ${photo.className}`}
              style={{ zIndex: photo.z, opacity: 0 }}
            >
              <PhotoCard src={photo.src} rotate={photo.rotate} />
              {photo.sticker && (
                <Sticker
                  name={photo.sticker.name}
                  size={photo.sticker.size}
                  rotate={photo.sticker.rotate}
                  className={`absolute z-20 ${photo.sticker.className}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ───────── Mobile collage (stacked scatter) ───────── */}
        <div className="relative mt-14 md:hidden">
          {/* Single blob behind the stack */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[18%] h-[18rem] w-[18rem] -translate-x-1/2 bg-ua-green"
            style={{ borderRadius: "60% 40% 55% 45% / 52% 48% 52% 48%" }}
          />
          <div className="relative flex flex-col items-center gap-10">
            {PHOTOS.map((photo, i) => (
              <div
                key={i}
                data-photo
                className="ua-reveal relative w-[72%] max-w-[17rem] aspect-[3/4]"
                style={{
                  opacity: 0,
                  alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                }}
              >
                <PhotoCard src={photo.src} rotate={photo.rotate} />
                {photo.sticker && (
                  <Sticker
                    name={photo.sticker.name}
                    size={photo.sticker.size * 0.8}
                    rotate={photo.sticker.rotate}
                    className={`absolute z-20 ${photo.sticker.className}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
