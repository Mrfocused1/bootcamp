"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

// A wide hand-drawn scribble swept across the cover panel.
const SCRIBBLE =
  "M20 70C120 18 220 120 340 64S560 14 700 76S920 124 1060 60";

/**
 * Page-entry transition: a full-screen panel covers the viewport with a
 * hand-drawn scribble that draws itself in, then the panel sweeps away to
 * reveal the page. Plays on EVERY marketing route (incl. home). Keyed on the
 * pathname so it remounts (and starts covering) on each navigation, avoiding a
 * flash of the incoming page.
 *
 * Note: this brand intro intentionally plays even with the OS "reduce motion"
 * setting on, so it's always visible; the rest of the site's scroll/entrance
 * animations still respect that preference.
 */
export function ScribbleTransition() {
  const pathname = usePathname();
  return <ScribbleOverlay key={pathname} />;
}

function ScribbleOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      // Scribble draws itself in across the covering panel…
      if (path && typeof path.getTotalLength === "function") {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" });
      } else {
        tl.to({}, { duration: 0.4 });
      }
      // …then the panel sweeps up and off, revealing the page.
      tl.to(overlay, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, "+=0.05");
      tl.set(overlay, { autoAlpha: 0 });
    }, overlay);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ua-ink"
    >
      <svg
        viewBox="0 0 1080 140"
        fill="none"
        preserveAspectRatio="none"
        className="w-[82%] max-w-3xl text-ua-pink"
      >
        <path
          ref={pathRef}
          d={SCRIBBLE}
          stroke="currentColor"
          strokeWidth={11}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
