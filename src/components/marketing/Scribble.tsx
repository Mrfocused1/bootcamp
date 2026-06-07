"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

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
    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      return;
    }
    // Path starts hidden in SSR HTML (dasharray:1 / dashoffset:1 with pathLength=1).
    // Double rAF guarantees a style recalc between the hidden state and the
    // animated state so the CSS transition reliably fires (incl. Safari iOS).
    path.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.65,0,0.35,1)`;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        path.style.strokeDashoffset = "0";
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [durationMs]);

  return (
    <svg viewBox="0 0 580 140" fill="none" className={className} aria-hidden="true">
      <path
        ref={pathRef}
        d={PATH}
        pathLength={1}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
    </svg>
  );
}
