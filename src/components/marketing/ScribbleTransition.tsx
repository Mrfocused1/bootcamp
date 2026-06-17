"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

// Run the arrival reveal BEFORE paint so the page never flashes uncovered.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Marker-scribble PAGE TRANSITION.
 *
 * Sequence when navigating between pages:
 *   1. A link is clicked → the scribble draws ON to COVER the screen, while the
 *      navigation is held back.
 *   2. Once the screen is fully covered, we actually navigate (router.push).
 *   3. On the new page the scribble un-draws to REVEAL it, then fires
 *      "ua:scribble-done" so the page's own entrance animations can begin.
 *
 * The overlay lives in the (persistent) marketing layout and is NOT remounted
 * per route, so it can stay covering the screen across the route swap. Clicks on
 * internal links are intercepted in the capture phase and `preventDefault()`-ed;
 * Next's <Link> bails when the event is already default-prevented, so this takes
 * over navigation for every internal link without wiring each one up.
 *
 * The colour + diagonal sweep angle vary per destination, derived
 * deterministically from the pathname.
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

// Per-page colour (as a CSS variable value, so it can be applied imperatively
// the instant a transition begins) and a diagonal sweep angle.
const PAGE_STYLE: Record<string, { color: string; angle: number }> = {
  "/": { color: "var(--ua-blue)", angle: 58 },
  "/about": { color: "var(--ua-pink)", angle: -52 },
  "/pricing": { color: "var(--ua-green)", angle: 63 },
  "/syllabus": { color: "var(--ua-orange)", angle: -57 },
  "/success-stories": { color: "var(--ua-sky)", angle: 47 },
  "/work": { color: "var(--ua-green)", angle: -48 },
  "/faq": { color: "var(--ua-pink)", angle: -61 },
  "/contact": { color: "var(--ua-blue)", angle: 54 },
  "/privacy": { color: "var(--ua-sky)", angle: -49 },
  "/terms": { color: "var(--ua-green)", angle: 51 },
  "/login": { color: "var(--ua-orange)", angle: 56 },
};

// Fallback for any other route.
const COLORS = ["var(--ua-blue)", "var(--ua-pink)", "var(--ua-green)", "var(--ua-orange)", "var(--ua-sky)"];
const ANGLES = [58, -52, 74, -67, 47, 83, -61, 69, -78, 51];
function hashPath(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function styleFor(pathname: string): { color: string; angle: number } {
  if (PAGE_STYLE[pathname]) return PAGE_STYLE[pathname];
  const h = hashPath(pathname);
  return { color: COLORS[h % COLORS.length], angle: ANGLES[h % ANGLES.length] };
}

// Routes WITHOUT a ScribbleTransition (the logged-in app + onboarding). We only
// draw the cover-before-navigate when the destination has a reveal waiting, so
// navigating to one of these stays an instant, normal navigation.
const NON_SCRIBBLE_PREFIXES = [
  "/dashboard",
  "/admin",
  "/day",
  "/schedule",
  "/book",
  "/onboarding",
  "/api",
];
function isScribbleRoute(pathname: string): boolean {
  return !NON_SCRIBBLE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

const COVER_DUR = 0.9;
const REVEAL_DUR = 0.9;

export function ScribbleTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const pageStyle = styleFor(pathname);

  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const lenRef = useRef(0);
  // Guards against a second navigation being kicked off mid-transition.
  const navigatingRef = useRef(false);

  // Apply the per-page colour + angle to the SVG imperatively.
  const applyStyle = (pathForStyle: string) => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;
    const s = styleFor(pathForStyle);
    svg.style.color = s.color;
    path.setAttribute("transform", `rotate(${s.angle} 50 50)`);
  };

  const measure = () => {
    const path = pathRef.current;
    if (path && !lenRef.current && typeof path.getTotalLength === "function") {
      lenRef.current = path.getTotalLength();
    }
    return lenRef.current;
  };

  // COVER: draw the scribble on to fully hide the page.
  const cover = (onComplete?: () => void) => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    const len = measure();
    if (!overlay || !path || !len) {
      onComplete?.();
      return;
    }
    gsap.killTweensOf(path);
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, { strokeDashoffset: 0, duration: COVER_DUR, ease: "none", onComplete });
  };

  // REVEAL: from a covered state, un-draw the scribble, hide the overlay, and
  // let the page know it can start animating.
  const reveal = () => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    const done = () => window.dispatchEvent(new CustomEvent("ua:scribble-done"));
    const len = measure();
    if (!overlay || !path || !len) {
      if (overlay) gsap.set(overlay, { autoAlpha: 0 });
      done();
      return;
    }
    gsap.killTweensOf(path);
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
    gsap.to(path, {
      strokeDashoffset: len,
      duration: REVEAL_DUR,
      ease: "none",
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0 });
        done();
      },
    });
  };

  // Intercept internal-link clicks: cover the screen first, THEN navigate.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as Element | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const anchor = a as HTMLAnchorElement;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr || hrefAttr.startsWith("#") || hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) {
        return;
      }
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / hash only
      // Only cover-before-navigate when the destination has a reveal waiting;
      // otherwise let the normal (instant) navigation happen.
      if (!isScribbleRoute(url.pathname)) return;

      // Take over: stop <Link> from navigating, then cover → navigate.
      e.preventDefault();
      if (navigatingRef.current) return;
      navigatingRef.current = true;

      const dest = url.pathname + url.search + url.hash;
      applyStyle(url.pathname); // colour matches the destination's reveal
      cover(() => router.push(dest));
    };

    // Capture phase so we run before <Link>'s (bubble-phase) React handler.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // On first mount AND on every arrival, the overlay starts covered (the
  // gsap.set in reveal() runs before paint via the layout effect, so the page
  // never flashes uncovered) and the scribble un-draws to REVEAL the page. This
  // is identical for cold loads, intercepted navigations, and arrivals from
  // outside the marketing layout (e.g. coming from /login). Drawing the cover
  // ON only happens when LEAVING a page (the click interceptor below).
  useIsoLayoutEffect(() => {
    navigatingRef.current = false;
    applyStyle(pathname);
    reveal();
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {/* Near-full-size SVG (slight 130% oversize, axis-aligned) so the scribble
          renders fine yet still covers the corners. The diagonal angle is baked
          into the PATH (rotated within the viewBox), which already extends beyond
          0–100 so it covers when rotated. */}
      <svg
        ref={svgRef}
        className="absolute"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ top: "-15%", left: "-15%", width: "130%", height: "130%", overflow: "visible", color: pageStyle.color }}
      >
        <path
          ref={pathRef}
          d={SCRIBBLE_PATH}
          transform={`rotate(${pageStyle.angle} 50 50)`}
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
