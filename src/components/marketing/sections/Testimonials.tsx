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

// Squiggly connector arrows between photos (draw themselves in).
const ARROW_PATH =
  "M6 14C70 -6 150 60 120 96C96 124 30 110 40 78C48 52 96 50 132 66";
const ARROW_HEAD = "M118 52L134 68L112 74";

type StickerSpec = {
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
  sticker?: StickerSpec;
};

// Tall vertical scatter — photos are spread down the section so you scroll to
// reveal each one. Placeholder portraits (3:4) / landscapes (4:3) at the same
// proportions as the reference; swap the src for real client photos later.
const PHOTOS: Photo[] = [
  {
    src: "/marketing/placeholders/p1.png",
    className: "left-[6%] top-0 w-[15rem] aspect-[3/4]",
    rotate: -4,
    z: 2,
  },
  {
    src: "/marketing/placeholders/p2.png",
    className: "left-[57%] top-[16rem] w-[14rem] aspect-[3/4]",
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
    className: "left-[24%] top-[40rem] w-[21rem] aspect-[4/3]",
    rotate: -2,
    z: 5,
    sticker: {
      name: "lets-go",
      size: 92,
      rotate: 8,
      className: "-right-7 top-1/4",
    },
  },
  {
    src: "/marketing/placeholders/p5.png",
    className: "left-[60%] top-[62rem] w-[15rem] aspect-[3/4]",
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
    className: "left-[6%] top-[84rem] w-[20rem] aspect-[4/3]",
    rotate: -3,
    z: 3,
  },
  {
    src: "/marketing/placeholders/p3.png",
    className: "left-[44%] top-[104rem] w-[14rem] aspect-[3/4]",
    rotate: 2,
    z: 4,
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

function ArrowSquiggle({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 150 130"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute text-ua-bg ${className}`}
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
      // Squiggly lines / circles / underlines draw themselves in, scrubbed to
      // scroll position so the draw is visible as each travels up the viewport.
      draws.forEach((path) => {
        if (typeof path.getTotalLength !== "function") return;
        const len = path.getTotalLength();
        if (!len) return;
        gsap.set(path, { strokeDasharray: len });
        gsap.fromTo(
          path,
          { strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path,
              start: "top 90%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      });

      // Each photo pops in with a bounce as it scrolls into view, so scrolling
      // down reveals the cards one after another.
      photos.forEach((ph) => {
        gsap.fromTo(
          ph,
          { opacity: 0, scale: 0.85, y: 36 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: ph, start: "top 82%", once: true },
          },
        );
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
          className="mx-auto max-w-5xl text-center text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
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
          in 5 days.
        </h2>

        {/* ───────── Desktop: tall vertical scatter (scroll to reveal) ───────── */}
        <div className="relative mt-20 hidden h-[126rem] md:block">
          {/* Organic blob low in the column (kept clear of the squiggle/sticker). */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-[5%] top-[80rem] h-[18rem] w-[18rem] bg-ua-blue"
            style={{ borderRadius: "48% 52% 42% 58% / 55% 44% 56% 45%" }}
          />

          {/* Squiggly connector arrows that draw themselves in — each arrowhead
              points at a nearby card rather than into empty space. */}
          {/* Points right into the cool-smiley card (card 2). */}
          <ArrowSquiggle className="left-[44%] top-[21rem] z-[7] h-[12rem] w-[12rem]" />
          {/* Points right into the join-the-club card (card 6). */}
          <ArrowSquiggle className="left-[32%] top-[110rem] z-[7] h-[11rem] w-[11rem]" />

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

        {/* ───────── Mobile: stacked scatter (scroll to reveal) ───────── */}
        <div className="relative mt-14 md:hidden">
          <div className="relative flex flex-col items-center gap-16">
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
