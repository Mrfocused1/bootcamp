"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SCRIBBLE_PATH } from "@/components/marketing/ScribbleTransition";
import {
  INTRO_LOGO_PATHS,
  INTRO_LOGO_VIEWBOX,
} from "@/lib/marketing/introLogoTrace";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

// Run before paint so returning visitors never see the splash flash.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SEEN_KEY = "ua-intro-seen";

/**
 * One-per-session homepage INTRO SPLASH.
 *
 *   1. The logo draws itself in — a genuine stroke trace along the vectorised
 *      badge artwork (same stroke-dashoffset technique as the squiggle
 *      arrows), then the crisp cream artwork inks in over the line work.
 *   2. The marker scribble (same path as the page transitions) draws ON to
 *      cover the splash, the dark backdrop drops away beneath it, and the
 *      scribble un-draws to reveal the homepage.
 *
 * The early "ua:scribble-done" from ScribbleTransition's arrival reveal is
 * swallowed while the splash is up (this component mounts before the Hero, so
 * its listener runs first), then re-dispatched as the final un-draw starts so
 * the hero entrance plays just as the page appears.
 */
export function IntroSplash() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<SVGGElement>(null);
  const scribbleSvgRef = useRef<SVGSVGElement>(null);
  const scribbleRef = useRef<SVGPathElement>(null);

  useIsoLayoutEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const group = logoGroupRef.current;
    const scribbleSvg = scribbleSvgRef.current;
    const scribble = scribbleRef.current;
    if (!overlay || !backdrop || !group || !scribbleSvg || !scribble) {
      return;
    }

    const skip =
      prefersReducedMotion() || sessionStorage.getItem(SEEN_KEY) === "1";
    if (skip) {
      gsap.set(overlay, { display: "none" });
      return;
    }

    // Swallow the arrival reveal's "done" while the splash covers the page;
    // we re-fire it ourselves when the splash hands off.
    const suppress = (e: Event) => e.stopImmediatePropagation();
    window.addEventListener("ua:scribble-done", suppress);
    const handoff = () => {
      window.removeEventListener("ua:scribble-done", suppress);
      window.dispatchEvent(new CustomEvent("ua:scribble-done"));
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const finish = () => {
      document.body.style.overflow = prevOverflow;
      sessionStorage.setItem(SEEN_KEY, "1");
      gsap.set(overlay, { display: "none" });
    };

    const measure = (p: SVGPathElement) =>
      typeof p.getTotalLength === "function" ? p.getTotalLength() : 0;
    const paths = Array.from(group.querySelectorAll("path"));
    const lens = paths.map(measure);
    const totalLen = lens.reduce((a, b) => a + b, 0);
    const scribLen = measure(scribble);
    if (!totalLen || !scribLen) {
      // jsdom / very old browsers: skip straight to the page.
      handoff();
      finish();
      return;
    }

    // Hide the line work until the timeline takes over.
    paths.forEach((p, i) => {
      gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] });
    });

    const ctx = gsap.context(() => {
      const DRAW_TOTAL = 3.4;
      const tl = gsap.timeline({ onComplete: finish, delay: 0.5 });
      // 1. the pen draws each piece of the badge in turn, time shared
      //    proportionally to its length…
      paths.forEach((p, i) => {
        tl.to(p, {
          strokeDashoffset: 0,
          duration: DRAW_TOTAL * (lens[i] / totalLen),
          ease: "none",
        });
      });
      // …then the solid artwork inks in over the line work
      tl.to(group, { fillOpacity: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
        .to(group, { strokeOpacity: 0, duration: 0.5, ease: "power2.out" }, "<+0.3")
        // long beat to take it in
        .to({}, { duration: 1.6 })
        // 2. marker scribble covers the splash…
        .set(scribbleSvg, { visibility: "visible" })
        .set(scribble, { strokeDasharray: scribLen, strokeDashoffset: scribLen })
        .to(scribble, { strokeDashoffset: 0, duration: 1.0, ease: "none" })
        // …the dark backdrop drops away beneath the full cover…
        .set(backdrop, { autoAlpha: 0 })
        .add(handoff)
        // …and un-draws to reveal the homepage.
        .to(scribble, { strokeDashoffset: scribLen, duration: 1.0, ease: "none" });
    }, overlay);

    return () => {
      window.removeEventListener("ua:scribble-done", suppress);
      document.body.style.overflow = prevOverflow;
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="ua-intro fixed inset-0 z-[300] overflow-hidden"
    >
      <noscript>
        <style>{`.ua-intro{display:none !important}`}</style>
      </noscript>

      <div
        ref={backdropRef}
        className="absolute inset-0 flex items-center justify-center bg-ua-ink px-6"
      >
        {/* The badge: the brand SVG's own paths draw in pen-style, one piece
            after another, then the solid cream fill inks in and the line work
            fades away. */}
        <svg viewBox={INTRO_LOGO_VIEWBOX} className="w-[250px] md:w-[330px]">
          <g
            ref={logoGroupRef}
            fill="var(--ua-bg)"
            fillOpacity={0}
            stroke="var(--ua-bg)"
            strokeWidth={0.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {INTRO_LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>

      {/* Marker scribble — same path + sizing trick as ScribbleTransition, in
          the homepage's transition colour. */}
      <svg
        ref={scribbleSvgRef}
        className="absolute"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          top: "-15%",
          left: "-15%",
          width: "130%",
          height: "130%",
          overflow: "visible",
          color: "var(--ua-blue)",
          visibility: "hidden",
        }}
      >
        <path
          ref={scribbleRef}
          d={SCRIBBLE_PATH}
          transform="rotate(58 50 50)"
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
