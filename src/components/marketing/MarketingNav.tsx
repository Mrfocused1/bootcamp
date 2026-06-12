"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { NAV_LINKS, SOCIALS, SITE } from "@/lib/marketing/content";
import { BrandLogo } from "./BrandLogo";

// y-offset (px from top) sampled to decide what sits behind the nav. Just below
// the fixed nav band.
const NAV_LINE = 70;

// A brand colour accent per menu row (cycled).
const ROW_COLORS = [
  "var(--ua-blue)",
  "var(--ua-green)",
  "var(--ua-orange)",
  "var(--ua-pink)",
  "var(--ua-sky)",
  "var(--ua-blue)",
];

export function MarketingNav({ hideLogin = false }: { hideLogin?: boolean }) {
  const [open, setOpen] = useState(false);
  // Pages open over a dark hero, so start dark to avoid a flash of the wrong
  // colour before the first scroll sample runs.
  const [onDark, setOnDark] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Watch which section sits behind the nav: a dark hero (logo → cream) or
  // light page content (logo → ink). Dark sections are tagged
  // data-nav-theme="dark".
  useEffect(() => {
    let raf = 0;
    const sample = () => {
      raf = 0;
      const darks = document.querySelectorAll('[data-nav-theme="dark"]');
      let dark = false;
      darks.forEach((s) => {
        const r = s.getBoundingClientRect();
        if (r.top <= NAV_LINE && r.bottom >= NAV_LINE) dark = true;
      });
      setOnDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Build the open/close timeline once.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = gsap.context(() => {
      const rows = overlay.querySelectorAll("[data-menu-row]");
      const feet = overlay.querySelectorAll("[data-menu-foot]");
      gsap.set(overlay, { yPercent: -100, visibility: "hidden" });
      const tl = gsap.timeline({
        paused: true,
        onStart: () => gsap.set(overlay, { visibility: "visible" }),
        onReverseComplete: () => gsap.set(overlay, { visibility: "hidden" }),
      });
      tl.to(overlay, { yPercent: 0, duration: 0.55, ease: "power4.inOut" })
        .fromTo(
          rows,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
          "-=0.18",
        )
        .fromTo(
          feet,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          "-=0.25",
        );
      tlRef.current = tl;
    }, overlay);
    return () => ctx.revert();
  }, []);

  // Play / reverse on open change + lock scroll + ESC to close.
  useEffect(() => {
    const tl = tlRef.current;
    if (tl) (open ? tl.play() : tl.reverse());
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const fg = onDark ? "var(--ua-bg)" : "var(--ua-ink)";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav aria-label="Primary" className="flex items-center justify-between px-4 py-5 md:px-10">
        <button
          type="button"
          aria-expanded={open}
          aria-label="menu"
          aria-controls="nav-menu"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2.5 rounded-lg border-2 border-ua-ink bg-white px-4 py-2.5 shadow-[4px_4px_0_var(--ua-ink)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-ua-ink hover:shadow-[7px_7px_0_var(--ua-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--ua-ink)]"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {/* Animated hamburger — bars ripple on hover */}
          <span aria-hidden="true" className="flex w-5 flex-col gap-[4px]">
            <span className="h-[3px] w-full rounded-full bg-ua-ink transition-[transform,background-color] duration-200 ease-out group-hover:translate-x-1.5 group-hover:bg-white" />
            <span className="h-[3px] w-full rounded-full bg-ua-ink transition-[transform,background-color] delay-75 duration-200 ease-out group-hover:-translate-x-1.5 group-hover:bg-white" />
            <span className="h-[3px] w-full rounded-full bg-ua-ink transition-[transform,background-color] delay-150 duration-200 ease-out group-hover:translate-x-1.5 group-hover:bg-white" />
          </span>
          <span className="text-sm font-black uppercase tracking-wider text-ua-ink transition-colors duration-200 group-hover:text-white">menu</span>
        </button>

        <Link href="/" aria-label={SITE.name} className="shrink-0">
          <BrandLogo color={fg} className="h-16 w-[74px] md:h-20 md:w-[93px]" />
        </Link>

        {hideLogin ? (
          <span aria-hidden className="select-none font-semibold opacity-0">log in</span>
        ) : (
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            style={
              {
                borderColor: fg,
                "--lf": fg,
                "--la": onDark ? "var(--ua-ink)" : "var(--ua-bg)",
              } as React.CSSProperties
            }
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-left scale-x-0 bg-[color:var(--lf)] transition-transform duration-300 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100"
            />
            <span className="relative z-10 text-[color:var(--lf)] transition-colors duration-200 group-hover:text-[color:var(--la)]">
              log in
            </span>
            <span className="relative z-10 text-[color:var(--lf)] transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-[color:var(--la)]">
              →
            </span>
          </Link>
        )}
      </nav>

      {/* ── Full-screen brutalist menu ── */}
      <div
        id="nav-menu"
        ref={overlayRef}
        className="fixed inset-0 z-[60] flex flex-col bg-ua-ink text-ua-bg"
        style={{ visibility: "hidden" }}
      >
        {/* overlay top bar */}
        <div className="flex items-center justify-between border-b-2 border-ua-bg/15 px-4 py-5 md:px-10">
          <Link href="/" aria-label={SITE.name} onClick={() => setOpen(false)} className="shrink-0">
            <BrandLogo color="var(--ua-bg)" className="h-12 w-[56px] md:h-14 md:w-[65px]" />
          </Link>
          <button
            type="button"
            aria-label="close menu"
            onClick={() => setOpen(false)}
            className="rounded-full border-2 border-ua-bg bg-transparent px-5 py-2 font-bold tracking-tight text-ua-bg transition-colors hover:bg-ua-bg hover:text-ua-ink"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            close ✕
          </button>
        </div>

        {/* rows */}
        <nav aria-label="Menu" className="flex flex-1 flex-col justify-center overflow-y-auto">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              data-menu-row
              className="group relative block overflow-hidden border-b-2 border-ua-bg/15 first:border-t-2 active:scale-[0.99]"
            >
              {/* colour sweep that fills on hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100"
                style={{ backgroundColor: "var(--ua-bg)" }}
              />
              <span className="relative z-10 flex items-center gap-4 px-5 py-4 transition-transform duration-300 group-hover:translate-x-3 md:gap-6 md:px-10 md:py-5">
                <span
                  className="flex-1 text-3xl font-black lowercase leading-none text-ua-bg transition-colors duration-300 group-hover:text-ua-ink sm:text-5xl md:text-6xl"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {l.label}
                </span>
                <span
                  className="-translate-x-3 text-2xl opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:text-3xl"
                  style={{ color: ROW_COLORS[i % ROW_COLORS.length] }}
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </nav>

        {/* footer: login + socials */}
        <div className="flex flex-col gap-4 border-t-2 border-ua-bg/15 px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            data-menu-foot
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ua-bg px-6 py-2.5 text-sm font-bold transition-colors hover:bg-ua-bg hover:text-ua-ink"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            log in →
          </Link>
          <div data-menu-foot className="flex flex-wrap gap-5 text-sm font-semibold text-ua-bg/70">
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ua-bg"
              >
                {s.label}
              </a>
            ))}
            <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-ua-bg">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
