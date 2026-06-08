"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/**
 * Page-entry transition (marker-scribble style, à la the reference site):
 * a thick hand-drawn scribble zig-zags up the whole screen to COVER it, holds
 * briefly, then un-draws (erases) to REVEAL the page. No solid panel — the
 * thick overlapping stroke itself is the cover. Plays on every marketing route
 * (incl. home) and regardless of the OS reduced-motion preference.
 */

// Deterministic so server and client render the same path (no hydration
// mismatch). A small seeded RNG drives the chaotic zig-zag.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateScribblePath(): string {
  const rng = mulberry32(42);
  let path = "M 50 120";
  let y = 120;
  const stepY = 9;
  while (y > -30) {
    // zig right
    y -= stepY;
    path += ` C ${30 + rng() * 30} ${y + 5}, ${80 - rng() * 20} ${y + 5}, 130 ${y}`;
    // loop right edge
    y -= stepY / 3;
    path += ` C 140 ${y}, 120 ${y - 5}, 90 ${y}`;
    // zag left
    y -= stepY;
    path += ` C ${60 + rng() * 20} ${y + 5}, ${20 - rng() * 20} ${y - 5}, -30 ${y}`;
    // loop left edge
    y -= stepY / 3;
    path += ` C -40 ${y}, -10 ${y - 5}, 10 ${y}`;
  }
  return path;
}

const SCRIBBLE_PATH = generateScribblePath();

export function ScribbleTransition() {
  const pathname = usePathname();
  // Remount on every navigation so the cover→reveal replays each time.
  return <ScribbleOverlay key={pathname} />;
}

function ScribbleOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path || typeof path.getTotalLength !== "function") {
      if (overlay) gsap.set(overlay, { autoAlpha: 0 });
      return;
    }
    const len = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline();
      // Draw the scribble on to cover the page…
      tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: "none" });
      // …hold, then un-draw it to reveal the page.
      tl.to(path, { strokeDashoffset: len, duration: 0.8, ease: "none" }, "+=0.05");
      tl.set(overlay, { autoAlpha: 0 });
    }, overlay);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200]"
    >
      <svg
        className="h-full w-full text-ua-blue"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={SCRIBBLE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={26}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
