"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SCRIBBLE_PATH } from "@/components/marketing/ScribbleTransition";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

// Run before paint so returning visitors never see the splash flash.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SEEN_KEY = "ua-intro-seen";

/**
 * One-per-session homepage INTRO SPLASH.
 *
 *   1. The logo scribble-draws itself in (same stroke-dashoffset draw as the
 *      squiggle arrows — a thick handwritten mask stroke reveals the artwork).
 *   2. A script-font subtitle writes itself in beneath, left to right.
 *   3. The marker scribble (same path as the page transitions) draws ON to
 *      cover the splash, the dark backdrop drops away beneath it, and the
 *      scribble un-draws to reveal the homepage.
 *
 * The early "ua:scribble-done" from ScribbleTransition's arrival reveal is
 * swallowed while the splash is up (this component mounts before the Hero, so
 * its listener runs first), then re-dispatched as the final un-draw starts so
 * the hero entrance plays just as the page appears.
 */

// Thick handwritten back-and-forth sweep used as a reveal mask: animating its
// dashoffset "draws" whatever it masks. Deterministic, so SSR and client match.
function buildMaskScribble(w: number, h: number, rows: number): string {
  const step = h / rows;
  let d = `M ${-w * 0.06} ${step / 2}`;
  for (let i = 0; i < rows; i++) {
    const y = step / 2 + i * step;
    const ltr = i % 2 === 0;
    const x0 = ltr ? -w * 0.06 : w * 1.06;
    const x1 = ltr ? w * 1.06 : -w * 0.06;
    if (i > 0) d += ` C ${x0} ${y - step * 0.6}, ${x0} ${y - step * 0.25}, ${x0} ${y}`;
    d += ` C ${x0 + (x1 - x0) * 0.3} ${y - step * 0.3}, ${x0 + (x1 - x0) * 0.7} ${y + step * 0.3}, ${x1} ${y}`;
  }
  return d;
}

const LOGO_MASK = buildMaskScribble(200, 200, 8);
const SUB_MASK = buildMaskScribble(640, 100, 1);

export function IntroSplash() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const logoMaskRef = useRef<SVGPathElement>(null);
  const subMaskRef = useRef<SVGPathElement>(null);
  const scribbleSvgRef = useRef<SVGSVGElement>(null);
  const scribbleRef = useRef<SVGPathElement>(null);

  useIsoLayoutEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const logoMask = logoMaskRef.current;
    const subMask = subMaskRef.current;
    const scribbleSvg = scribbleSvgRef.current;
    const scribble = scribbleRef.current;
    if (!overlay || !backdrop || !logoMask || !subMask || !scribbleSvg || !scribble) {
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
    const logoLen = measure(logoMask);
    const subLen = measure(subMask);
    const scribLen = measure(scribble);
    if (!logoLen || !subLen || !scribLen) {
      // jsdom / very old browsers: skip straight to the page.
      handoff();
      finish();
      return;
    }

    // Hide both masked elements until the timeline takes over, so nothing
    // pops in while we wait for assets.
    gsap.set(logoMask, { strokeDasharray: logoLen, strokeDashoffset: logoLen });
    gsap.set(subMask, { strokeDasharray: subLen, strokeDashoffset: subLen });

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const play = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ onComplete: finish });
        // 1. logo draws in, unhurried
        tl.to(logoMask, { strokeDashoffset: 0, duration: 3.2, ease: "none" }, 0.5)
          // 2. subtitle writes in after a short beat
          .to(subMask, { strokeDashoffset: 0, duration: 1.8, ease: "none" }, "+=0.25")
          // long beat to take it in
          .to({}, { duration: 1.6 })
          // 3. marker scribble covers the splash…
          .set(scribbleSvg, { visibility: "visible" })
          .set(scribble, { strokeDasharray: scribLen, strokeDashoffset: scribLen })
          .to(scribble, { strokeDashoffset: 0, duration: 1.0, ease: "none" })
          // …the dark backdrop drops away beneath the full cover…
          .set(backdrop, { autoAlpha: 0 })
          .add(handoff)
          // …and un-draws to reveal the homepage.
          .to(scribble, { strokeDashoffset: scribLen, duration: 1.0, ease: "none" });
      }, overlay);
    };

    // Wait (briefly) for the logo art and the script font so the draw reveals
    // real pixels — capped so a slow connection never stalls the intro.
    const img = new Image();
    img.src = "/marketing/logo-cream.png";
    const assets = Promise.all([
      img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
      document.fonts?.ready?.catch?.(() => {}) ?? Promise.resolve(),
    ]);
    const cap = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1200);
    });
    Promise.race([assets, cap]).then(play);

    return () => {
      cancelled = true;
      window.removeEventListener("ua:scribble-done", suppress);
      document.body.style.overflow = prevOverflow;
      ctx?.revert();
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
        className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-ua-ink px-6"
      >
        {/* Logo, revealed by a thick handwritten mask stroke drawing in. */}
        <svg viewBox="0 0 200 200" className="w-[200px] md:w-[270px]">
          <defs>
            <mask
              id="ua-intro-logo-mask"
              maskUnits="userSpaceOnUse"
              x="-30"
              y="-30"
              width="260"
              height="260"
            >
              <path
                ref={logoMaskRef}
                d={LOGO_MASK}
                fill="none"
                stroke="#fff"
                strokeWidth={36}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          {/* Pre-recolored cream asset — Safari ignores CSS filters on SVG
              <image>, so the colour is baked into the file itself. */}
          <image
            href="/marketing/logo-cream.png"
            x="8"
            y="8"
            width="184"
            height="184"
            preserveAspectRatio="xMidYMid meet"
            mask="url(#ua-intro-logo-mask)"
          />
        </svg>

        {/* Script subtitle, written in left-to-right by the same mask trick. */}
        <svg viewBox="0 0 640 100" className="w-[320px] md:w-[470px]">
          <defs>
            <mask
              id="ua-intro-sub-mask"
              maskUnits="userSpaceOnUse"
              x="-50"
              y="-30"
              width="740"
              height="160"
            >
              <path
                ref={subMaskRef}
                d={SUB_MASK}
                fill="none"
                stroke="#fff"
                strokeWidth={140}
                strokeLinecap="round"
              />
            </mask>
          </defs>
          <text
            x="320"
            y="66"
            textAnchor="middle"
            fill="var(--ua-bg)"
            fontSize="52"
            mask="url(#ua-intro-sub-mask)"
            style={{ fontFamily: "var(--font-script), cursive" }}
          >
            premium websites, powered by ai
          </text>
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
