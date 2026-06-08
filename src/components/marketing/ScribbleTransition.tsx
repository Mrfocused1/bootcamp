"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

/**
 * Page-entry transition (marker-scribble style): a thick hand-drawn scribble
 * zig-zags across the whole screen to COVER it, holds briefly, then un-draws to
 * REVEAL the page. The colour and the diagonal direction (angle) vary per page,
 * derived deterministically from the pathname. Plays on every marketing route
 * (incl. home) and regardless of the OS reduced-motion preference.
 */

// Deterministic so server and client render the same path (no hydration mismatch).
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
  // Dense rows so the thin stroke still covers even when the path is rotated.
  const stepY = 4;
  while (y > -30) {
    y -= stepY;
    path += ` C ${30 + rng() * 30} ${y + 5}, ${80 - rng() * 20} ${y + 5}, 130 ${y}`;
    y -= stepY / 3;
    path += ` C 140 ${y}, 120 ${y - 5}, 90 ${y}`;
    y -= stepY;
    path += ` C ${60 + rng() * 20} ${y + 5}, ${20 - rng() * 20} ${y - 5}, -30 ${y}`;
    y -= stepY / 3;
    path += ` C -40 ${y}, -10 ${y - 5}, 10 ${y}`;
  }
  return path;
}

const SCRIBBLE_PATH = generateScribblePath();

// Per-page variety: each route gets its own brand colour and a diagonal sweep
// angle (mixed magnitudes between ~45–90°, both directions). Colour covers the
// whole screen, so these are solid brand colours.
const PAGE_STYLE: Record<string, { color: string; angle: number }> = {
  "/": { color: "text-ua-blue", angle: 58 },
  "/about": { color: "text-ua-pink", angle: -52 },
  "/pricing": { color: "text-ua-green", angle: 63 },
  "/syllabus": { color: "text-ua-orange", angle: -57 },
  "/success-stories": { color: "text-ua-sky", angle: 47 },
  "/faq": { color: "text-ua-pink", angle: -61 },
  "/contact": { color: "text-ua-blue", angle: 54 },
};

// Fallback for any other route.
const COLORS = ["text-ua-blue", "text-ua-pink", "text-ua-green", "text-ua-orange", "text-ua-sky"];
const ANGLES = [58, -52, 74, -67, 47, 83, -61, 69, -78, 51];
function hashPath(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function ScribbleTransition() {
  const pathname = usePathname();
  const style =
    PAGE_STYLE[pathname] ??
    (() => {
      const h = hashPath(pathname);
      return { color: COLORS[h % COLORS.length], angle: ANGLES[h % ANGLES.length] };
    })();
  // Remount on every navigation so the cover→reveal replays each time.
  return <ScribbleOverlay key={pathname} color={style.color} angle={style.angle} />;
}

function ScribbleOverlay({ color, angle }: { color: string; angle: number }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Let the page (e.g. the hero) know the transition has finished revealing,
    // so its own entrance animations can start only after this completes.
    const fireDone = () =>
      window.dispatchEvent(new CustomEvent("ua:scribble-done"));

    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path || typeof path.getTotalLength !== "function") {
      if (overlay) gsap.set(overlay, { autoAlpha: 0 });
      fireDone();
      return;
    }
    const len = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({ onComplete: fireDone });
      // Draw the scribble on to cover the page…
      tl.to(path, { strokeDashoffset: 0, duration: 1.2, ease: "none" });
      // …hold, then un-draw it to reveal the page.
      tl.to(path, { strokeDashoffset: len, duration: 1.2, ease: "none" }, "+=0.1");
      tl.set(overlay, { autoAlpha: 0 });
    }, overlay);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
    >
      {/* Near-full-size SVG (slight 130% oversize, axis-aligned) so the scribble
          renders fine (not magnified like a big oversize) yet still covers the
          corners. The diagonal angle is baked into the PATH (rotated within the
          viewBox), which already extends beyond 0–100 so it covers when rotated. */}
      <svg
        className={`absolute ${color}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ top: "-15%", left: "-15%", width: "130%", height: "130%", overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={SCRIBBLE_PATH}
          transform={`rotate(${angle} 50 50)`}
          fill="none"
          stroke="currentColor"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
