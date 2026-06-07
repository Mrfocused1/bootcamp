"use client";

import { useEffect, useRef } from "react";

// Our own hand-authored squiggle path (original work).
const PATH =
  "M20 70 C 80 20, 140 120, 200 60 S 320 20, 380 80 S 500 130, 560 60";

export function Scribble({
  color = "var(--ua-blue)",
  strokeWidth = 14,
  durationMs = 1100,
  className,
}: {
  color?: string;
  strokeWidth?: number;
  durationMs?: number;
  className?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength?.() ?? 0;
    if (!len) return; // nothing to animate (e.g. jsdom) — leave fully drawn
    path.style.strokeDasharray = String(len);
    if (reduce) {
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDashoffset = String(len);
    path.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.65,0,0.35,1)`;
    const id = requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
    });
    return () => cancelAnimationFrame(id);
  }, [durationMs]);

  return (
    <svg viewBox="0 0 580 140" fill="none" className={className} aria-hidden="true">
      <path
        ref={pathRef}
        d={PATH}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
