# Marketing Shell + Homepage Hero — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cloned homepage with an original Next.js/React marketing shell — a `(marketing)` route group with our own Nav, Footer, and an animated Hero — serving at `/`.

**Architecture:** New `src/app/(marketing)/` route group sharing the existing root layout (Tailwind v4 brand tokens + DM Sans/Epilogue fonts already configured). Server Components compose the page; small `"use client"` islands handle the scribble reveal and scroll-entrance motion via GSAP. The `/` rewrite to the clone is removed so the React route serves.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, GSAP 3.13 (added), Vitest + Testing Library, Playwright.

**Scope note:** This is the first of several plans. It delivers the shell + hero only. Follow-up plans add the homepage body sections (features/syllabus/testimonials/CTA) and the other 6 pages (about, pricing, syllabus, success-stories, faq, contact), then final clone deletion.

**Branch:** Work on `feat/marketing-rebuild` (create from current branch before Task 1).

---

## File Structure

- Create: `src/lib/marketing/content.ts` — typed nav/footer/hero content + image paths (single source).
- Create: `src/components/marketing/MarketingNav.tsx` — top nav (client; menu toggle).
- Create: `src/components/marketing/MarketingFooter.tsx` — footer incl. FAQ link (server).
- Create: `src/components/marketing/Scribble.tsx` — reusable scribble SVG (client; stroke-dashoffset reveal, reduced-motion aware).
- Create: `src/components/marketing/Reveal.tsx` — scroll-entrance wrapper (client; GSAP ScrollTrigger, reduced-motion aware).
- Create: `src/components/marketing/Hero.tsx` — hero (client; image + animated heading + scribble + arrow accent).
- Create: `src/app/(marketing)/layout.tsx` — marketing layout (Nav + children + Footer).
- Create: `src/app/(marketing)/page.tsx` — homepage (Hero for now).
- Tests: `src/components/marketing/__tests__/{MarketingNav,MarketingFooter,Hero,Scribble}.test.tsx`, `tests/e2e/marketing-home.spec.ts`.
- Modify: `next.config.ts` (remove `/` rewrite), `src/app/globals.css` (remove Genty @font-face + `.font-genty`), `src/app/layout.tsx` (metadata → Bridgeway), `package.json` (add `gsap`).

---

## Task 1: Branch, add GSAP, remove commercial font, fix metadata

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/app/globals.css` (remove Genty block + `.font-genty`)
- Modify: `src/app/layout.tsx` (metadata)

- [ ] **Step 1: Create the feature branch**

```bash
cd "/Users/paulbridges/Desktop/online coaching/urban-ai-app"
git checkout -b feat/marketing-rebuild
```

- [ ] **Step 2: Install GSAP**

```bash
npm install gsap@^3.13.0
```
Expected: `gsap` appears in `package.json` dependencies; no errors.

- [ ] **Step 3: Remove the commercial Genty font from `globals.css`**

Delete this block (the `@font-face` for Genty) near the top of `src/app/globals.css`:

```css
/* ── Genty custom font (logo only) ── */
@font-face {
  font-family: "Genty";
  src: url("/fonts/GentyDemo-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

And delete the utility:

```css
/* ── Genty logo utility ── */
.font-genty {
  font-family: "Genty", sans-serif;
}
```

- [ ] **Step 4: Update root metadata** in `src/app/layout.tsx`

Replace the `metadata` export with:

```tsx
export const metadata: Metadata = {
  title: "Bridgeway AI Bootcamp — Learn to build websites with AI in 5 days",
  description:
    "A 5-day live course that teaches you to build and launch real websites using AI — databases, payments, hosting, domains and more. No coding experience needed.",
};
```

- [ ] **Step 5: Verify build still compiles**

Run: `npm run build`
Expected: build succeeds (the app still uses the existing fonts; Genty was logo-only and the marketing wordmark will use Epilogue).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/globals.css src/app/layout.tsx
git commit -m "chore(marketing): add gsap, remove commercial Genty font, update metadata"
```

---

## Task 2: Marketing content module

Single source of truth for nav/footer/hero copy + image paths. No JSX here — pure data.

**Files:**
- Create: `src/lib/marketing/content.ts`

- [ ] **Step 1: Write the content module**

```ts
// src/lib/marketing/content.ts

export type NavLink = { label: string; href: string };

export const SITE = {
  name: "Bridgeway AI Bootcamp",
  // TODO(owner): replace with the real contact email before launch
  email: "hello@bridgewayai.co",
};

// FAQ intentionally lives in the footer, not the nav.
export const NAV_LINKS: NavLink[] = [
  { label: "Syllabus", href: "/syllabus" },
  { label: "Pricing", href: "/pricing" },
  { label: "Success stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export const SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "TikTok", href: "https://www.tiktok.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
];

export const HERO = {
  // Rendered lowercase by the heading style; words animate in individually.
  words: ["we", "teach", "you", "how", "to", "build", "real", "websites", "powered", "by", "ai"],
  emphasis: "real", // rendered italic
  ctaLabel: "enrol now",
  ctaHref: "/pricing",
  // Current image kept as a swappable placeholder.
  image: "/site/truus.co/custom/bridgeway-hero.png",
  imageAlt: "Student smiling while learning to build websites with AI",
};
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/marketing/content.ts
git commit -m "feat(marketing): add content module (nav/footer/hero data)"
```

---

## Task 3: MarketingNav (TDD)

**Files:**
- Create: `src/components/marketing/MarketingNav.tsx`
- Test: `src/components/marketing/__tests__/MarketingNav.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/__tests__/MarketingNav.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketingNav } from "../MarketingNav";

describe("MarketingNav", () => {
  it("renders the wordmark and a login link", () => {
    render(<MarketingNav />);
    expect(screen.getByText("Bridgeway AI Bootcamp")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  });

  it("does not show nav links until the menu is opened", () => {
    render(<MarketingNav />);
    expect(screen.queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
  });

  it("does NOT include an FAQ link in the menu", () => {
    render(<MarketingNav />);
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.queryByRole("link", { name: "FAQ" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/marketing/__tests__/MarketingNav.test.tsx`
Expected: FAIL — cannot find module `../MarketingNav`.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/marketing/MarketingNav.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/marketing/content";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          aria-expanded={open}
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
          className="font-bold tracking-tight text-ua-bg bg-ua-orange rounded-full px-5 py-2"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {open ? "close" : "menu"}
        </button>

        <Link
          href="/"
          className="text-ua-bg text-lg md:text-2xl font-bold italic tracking-tight"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {SITE.name}
        </Link>

        <Link href="/login" className="text-ua-bg/90 hover:text-ua-bg font-semibold">
          log in
        </Link>
      </nav>

      {open && (
        <div className="mx-4 rounded-3xl bg-ua-ink/95 p-6 backdrop-blur">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold text-ua-bg hover:text-ua-pink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/marketing/__tests__/MarketingNav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/MarketingNav.tsx src/components/marketing/__tests__/MarketingNav.test.tsx
git commit -m "feat(marketing): MarketingNav with menu toggle (FAQ excluded)"
```

---

## Task 4: MarketingFooter (TDD)

**Files:**
- Create: `src/components/marketing/MarketingFooter.tsx`
- Test: `src/components/marketing/__tests__/MarketingFooter.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/__tests__/MarketingFooter.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketingFooter } from "../MarketingFooter";

describe("MarketingFooter", () => {
  it("includes an FAQ link", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  });

  it("shows the enrol CTA and the wordmark", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: /enrol now/i })).toHaveAttribute("href", "/pricing");
    expect(screen.getByText("Bridgeway AI Bootcamp")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/marketing/__tests__/MarketingFooter.test.tsx`
Expected: FAIL — cannot find module `../MarketingFooter`.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/marketing/MarketingFooter.tsx
import Link from "next/link";
import { FOOTER_LINKS, SOCIALS, SITE, HERO } from "@/lib/marketing/content";

export function MarketingFooter() {
  return (
    <footer className="bg-ua-blue text-ua-bg">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Ready to start?</p>
            <Link
              href={HERO.ctaHref}
              className="mt-2 inline-block text-3xl font-bold hover:text-ua-pink"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              enrol now →
            </Link>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Explore</p>
            <ul className="mt-2 space-y-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-lg hover:text-ua-pink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm uppercase tracking-widest opacity-70">Contact</p>
            <a href={`mailto:${SITE.email}`} className="mt-2 block text-lg hover:text-ua-pink">
              {SITE.email}
            </a>
            <ul className="mt-3 flex gap-4">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-ua-pink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className="mt-16 text-center text-5xl font-bold italic md:text-7xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {SITE.name}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/marketing/__tests__/MarketingFooter.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/MarketingFooter.tsx src/components/marketing/__tests__/MarketingFooter.test.tsx
git commit -m "feat(marketing): MarketingFooter with FAQ link + enrol CTA"
```

---

## Task 5: Scribble component (TDD)

Original scribble SVG, revealed via `stroke-dashoffset`. Respects reduced motion.

**Files:**
- Create: `src/components/marketing/Scribble.tsx`
- Test: `src/components/marketing/__tests__/Scribble.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/__tests__/Scribble.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Scribble } from "../Scribble";

describe("Scribble", () => {
  it("renders an svg path with the given color", () => {
    const { container } = render(<Scribble color="#4b69f0" />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute("stroke", "#4b69f0");
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/marketing/__tests__/Scribble.test.tsx`
Expected: FAIL — cannot find module `../Scribble`.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/marketing/Scribble.tsx
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    if (reduce) {
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDashoffset = String(len);
    path.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.65,0,0.35,1)`;
    // next frame -> animate to drawn
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
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/marketing/__tests__/Scribble.test.tsx`
Expected: PASS. (jsdom returns 0 for `getTotalLength`; the component must not throw — it doesn't.)

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/Scribble.tsx src/components/marketing/__tests__/Scribble.test.tsx
git commit -m "feat(marketing): original Scribble component with stroke-dashoffset reveal"
```

---

## Task 6: Reveal (scroll-entrance) component

Wraps children; fades/translates them in on scroll via GSAP ScrollTrigger. Reduced-motion shows them immediately.

**Files:**
- Create: `src/components/marketing/Reveal.tsx`

- [ ] **Step 1: Implement the component**

```tsx
// src/components/marketing/Reveal.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Reveal({
  children,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/Reveal.tsx
git commit -m "feat(marketing): Reveal scroll-entrance wrapper (reduced-motion aware)"
```

---

## Task 7: Hero (TDD)

**Files:**
- Create: `src/components/marketing/Hero.tsx`
- Test: `src/components/marketing/__tests__/Hero.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/marketing/__tests__/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "../Hero";

describe("Hero", () => {
  it("renders the full heading and the enrol CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("heading").textContent?.toLowerCase()).toContain(
      "we teach you how to build real websites powered by ai",
    );
    expect(screen.getByRole("link", { name: /enrol now/i })).toHaveAttribute("href", "/pricing");
  });

  it("renders the hero image with alt text", () => {
    render(<Hero />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/learning/i));
  });
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/marketing/__tests__/Hero.test.tsx`
Expected: FAIL — cannot find module `../Hero`.

- [ ] **Step 3: Implement the component**

```tsx
// src/components/marketing/Hero.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { HERO } from "@/lib/marketing/content";
import { Scribble } from "./Scribble";

export function Hero() {
  const wordsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = wordsRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = el.querySelectorAll("[data-word]");
    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out", delay: 0.2 },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-svh w-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO.image}
        alt={HERO.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ua-ink/70 via-ua-ink/10 to-transparent" />

      <div className="relative z-10 flex min-h-svh flex-col justify-end px-6 pb-16 md:px-10">
        <h1
          ref={wordsRef}
          className="max-w-5xl text-5xl font-bold lowercase leading-[0.95] text-ua-bg md:text-8xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {HERO.words.map((w, i) => (
            <span key={`${w}-${i}`} data-word className="inline-block" style={{ opacity: 0 }}>
              {w === HERO.emphasis ? <em>{w}</em> : w}
              {i < HERO.words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <div className="mt-8 flex items-center gap-5">
          <Link
            href={HERO.ctaHref}
            className="rounded-full bg-ua-orange px-7 py-3 text-lg font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {HERO.ctaLabel} →
          </Link>
          <Scribble className="hidden h-12 w-40 md:block" color="var(--ua-pink)" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npx vitest run src/components/marketing/__tests__/Hero.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/Hero.tsx src/components/marketing/__tests__/Hero.test.tsx
git commit -m "feat(marketing): animated Hero (word reveal + scribble + CTA)"
```

---

## Task 8: Marketing layout + homepage route; remove `/` rewrite

**Files:**
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Create the marketing layout**

```tsx
// src/app/(marketing)/layout.tsx
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </>
  );
}
```

- [ ] **Step 2: Create the homepage route**

```tsx
// src/app/(marketing)/page.tsx
import { Hero } from "@/components/marketing/Hero";

export default function HomePage() {
  return <Hero />;
}
```

- [ ] **Step 3: Remove the `/` rewrite** in `next.config.ts`

Delete this line from the `MARKETING` array (leave the other six for now):

```ts
  ["/", "/site/truus.co/index.html"],
```

- [ ] **Step 4: Run the dev server and verify the homepage serves React (not the clone)**

```bash
pkill -f "next dev" 2>/dev/null; sleep 1; (npm run dev > /tmp/uadev.log 2>&1 &) ; sleep 6
curl -s http://localhost:3000/ | grep -c "data-wf-page" || true
```
Expected: `0` (no Webflow clone markup — the React page is serving).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)" next.config.ts
git commit -m "feat(marketing): serve original React homepage at / (remove clone rewrite)"
```

---

## Task 9: Playwright smoke test for `/`

**Files:**
- Create: `tests/e2e/marketing-home.spec.ts`

- [ ] **Step 1: Write the smoke test**

```ts
// tests/e2e/marketing-home.spec.ts
import { test, expect } from "@playwright/test";

test("homepage renders original marketing shell", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("/");

  // Hero heading + CTA
  await expect(page.getByRole("heading")).toContainText(/build real websites/i);
  await expect(page.getByRole("link", { name: /enrol now/i }).first()).toBeVisible();

  // Footer FAQ link present
  await expect(page.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");

  // No leftover clone markup
  expect(await page.locator("[data-wf-page]").count()).toBe(0);
  expect(errors).toEqual([]);
});
```

- [ ] **Step 2: Run the smoke test**

Run: `npx playwright test tests/e2e/marketing-home.spec.ts`
Expected: PASS. (If Playwright needs a webServer/baseURL, confirm `playwright.config.ts` points at `http://localhost:3000` and starts `npm run dev`; if not configured, run dev first and set `baseURL`.)

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/marketing-home.spec.ts
git commit -m "test(marketing): playwright smoke for original homepage"
```

---

## Task 10: Full verification pass

- [ ] **Step 1: Unit tests**

Run: `npm run test`
Expected: all tests pass (existing + new marketing tests).

- [ ] **Step 2: Lint + typecheck + build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: no type errors, no lint errors, build succeeds.

- [ ] **Step 3: Manual visual check (Puppeteer or browser)**

Load `http://localhost:3000/`, confirm: nav wordmark + menu toggle (no FAQ in menu), hero image with animated heading + scribble + enrol CTA, footer with FAQ link + big wordmark. Confirm reduced-motion still shows all content.

- [ ] **Step 4: Final commit (if any tidy-ups)**

```bash
git add -A && git commit -m "chore(marketing): phase 1 shell + hero complete" || echo "nothing to commit"
```

---

## Self-Review (author checklist — done)

- **Spec coverage:** route group ✓ (T8), nav ✓ (T3), footer + FAQ ✓ (T4), scribble reveal ✓ (T5/T7), scroll motion primitive ✓ (T6), reduced-motion ✓ (T5/T6/T7), content reuse + image placeholder ✓ (T2), remove clone `/` rewrite ✓ (T8), remove commercial font + metadata ✓ (T1), tests ✓ (T3/T4/T5/T7/T9). Homepage body sections + other 6 pages + final clone deletion + self-hosted favicon/OG are **explicitly deferred to follow-up plans** (noted in scope).
- **Placeholders:** the only `TODO` is the owner-supplied contact email in content.ts (intentional, owner action) — all code is complete.
- **Type consistency:** `MarketingNav`/`MarketingFooter`/`Hero`/`Scribble`/`Reveal` named exports match imports; `HERO`, `NAV_LINKS`, `FOOTER_LINKS`, `SOCIALS`, `SITE` names consistent across content module and consumers.

## Follow-up plans (not in this plan)
1. Homepage body sections (value props, syllabus preview, testimonials, final CTA) — extract real copy from current `index.html`.
2. Pricing + Contact pages (Stripe + Resend server action).
3. About, Syllabus, Success-stories, FAQ pages.
4. Final cleanup: delete `public/site/truus.co/`, remove remaining rewrites, self-host favicon/OG image, strip all truus/Webflow artifacts, performance pass.
