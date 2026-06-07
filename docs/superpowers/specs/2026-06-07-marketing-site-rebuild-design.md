# Marketing Site Rebuild — Design Spec

- **Date:** 2026-06-07
- **Status:** Approved (pending final spec review)
- **Owner:** Bridgeway AI Bootcamp

## Context & Goal

The public marketing site (home, about, pricing, syllabus, success-stories, faq,
contact) is currently a **clone of `truus.co`** — a real Webflow agency site —
served as static HTML from `public/site/truus.co/` via rewrites in
`next.config.ts`. The content and images have been changed, but the underlying
HTML structure, CSS, design, and bespoke animation engine (`slater.app/.../40171.js`)
are copied. Changing content/images does **not** remove the copyright /
look-and-feel risk of launching commercially.

The product app itself (`src/app/(app)/`: dashboard, schedule, lessons, admin,
booking, AI assistant — backed by Supabase/Stripe/Resend, with tests) is already
original work and is **out of scope**; it stays untouched.

**Goal:** Rebuild the 7 marketing pages as **original** Next.js/React components
so the full site can be launched and sold without IP risk, while keeping the
visual *vibe* the owner has tuned.

## Locked Decisions

1. **Fidelity:** Keep the *vibe* (bold editorial type, hand-drawn scribble motif,
   dark hero imagery, playful sticker accents, cream/dark palette) but with our
   own layouts, spacing, components, and scribble treatment — clearly original,
   not a recreation of truus's specific design.
2. **Scope:** All 7 marketing pages, **homepage first** (phased). Nothing left
   cloned at the end.
3. **Motion:** Reimplement the hero scribble reveal on load + scroll/entrance
   animations as our own GSAP code. **No** cross-page full-screen scribble wipe.
4. **Content:** Reuse the owner's current copy (extracted from existing pages)
   and current images as swappable placeholders.

## Architecture & Routing

- New route group `src/app/(marketing)/` with shared `layout.tsx` (marketing nav
  + footer + fonts + scribble providers) and pages:
  - `page.tsx` (home), `about/page.tsx`, `pricing/page.tsx`,
    `syllabus/page.tsx`, `success-stories/page.tsx`, `faq/page.tsx`,
    `contact/page.tsx`.
- As each page is rebuilt, **remove its entry from `rewrites()` in
  `next.config.ts`** so the new React route serves instead of the clone.
- When all 7 are rebuilt: delete `public/site/truus.co/`, remove the marketing
  rewrites and the clone asset cache headers entirely.
- Server Components by default; `"use client"` only for animated islands.
- Target: Next.js 16 App Router conventions (read `node_modules/next/dist/docs/`
  before coding per repo `AGENTS.md`).

## Design System (`globals.css` + Tailwind theme)

- **Palette (our own tokens):** warm cream/off-white surface, near-black ink, +
  two playful accents (a blue and a pink — our chosen values, not copied). Defined
  as CSS variables + Tailwind theme.
- **Typography (licensed/free — replaces commercial 'Genty'):**
  - Headings: a bold characterful display (e.g. **Bricolage Grotesque**, OFL).
  - Body: a clean grotesk (e.g. **Inter**, OFL).
  - Wordmark: a free display/script face.
  - All self-hosted via `next/font` (no external font CDN, no licensing risk).
- **Scribble:** an original hand-drawn SVG path, animated with plain
  `stroke-dashoffset` (no GSAP plugin required → fully original, zero licensing).
  Reusable `<Scribble>` component.
- **Accents:** our own simple SVGs (up-right arrow, smiley) — drawn fresh.

## Component Inventory

- `MarketingNav` — wordmark, menu, login + enrol CTAs.
- `MarketingFooter` — CTA, contact, **FAQ link**, socials, big wordmark.
- `Hero` — image + heading with animated words + scribble reveal + accents.
- `ScribbleReveal` — client component, the on-load intro.
- `Reveal` — scroll-entrance wrapper (GSAP ScrollTrigger).
- `Marquee` — scrolling text band.
- `PricingCard`, `FaqAccordion`, and `Section` layout primitives.

## Motion (our own GSAP code)

- Hero scribble reveal on load → heading words animate in.
- Scroll-triggered entrances (text reveals, fades, sticker pops) via ScrollTrigger.
- `prefers-reduced-motion` fully respected (content visible, animations skipped).
- No cross-page transition wipe.
- GSAP 3.13+ added as a dependency (all plugins free under Webflow ownership).

## Content & Images

- Extract the owner's current copy from the existing cloned pages into the new
  components (no rewriting).
- Keep current images as swappable placeholders; image `src`s centralized so they
  can be replaced in one place.

## Integrations (reuse existing app infra)

- Enrol / pricing CTAs → existing **Stripe** checkout.
- Login → existing `/login`.
- Contact form → **server action** using existing **Resend** setup, validated
  with **Zod**.

## Clone Cleanup (phased, per page + final)

- Per page: remove its rewrite as the React version ships.
- Final: delete `public/site/truus.co/`, remove all `data-wf-*` / "Last Published"
  / truus identifiers, original-creator credit links, and external CDN deps.
- Self-host our own favicon, OG/social image, and fonts.

## Testing

- **Vitest** component tests for key components (nav, FAQ accordion, contact form
  validation).
- **Playwright** smoke: each marketing route renders, nav/footer present, no
  console errors, hero visible; reduced-motion path.

## Phasing

1. **Phase 1:** Design system + shared nav/footer + **Home** → review.
2. **Phase 2:** **Pricing + Contact** (revenue + leads).
3. **Phase 3:** About, Syllabus, Success-stories, FAQ.
4. **Phase 4:** Final cleanup — delete clone, strip all truus/Webflow artifacts,
   self-host favicon/OG/fonts, performance + full test pass.

## Non-Goals / Out of Scope

- The product app (`src/app/(app)/`, login, dashboard, lessons, admin, booking) —
  already original, untouched.
- Cross-page full-screen scribble wipe transition.
- Backend/schema changes (Supabase/Stripe/Resend already wired).
- Rewriting marketing copy.

## Risks & Notes

- **Look-and-feel:** keep layouts/spacing/components genuinely our own; "keep the
  vibe" must not drift into a near-recreation.
- **Next.js 16 breaking changes:** consult `node_modules/next/dist/docs/` before
  coding (per `AGENTS.md`).
- **Fonts:** confirm chosen display/script faces are OFL/free for commercial use
  before shipping.
- **Images:** current placeholders are the owner's to finalize; some may still be
  AI-generated stock to be replaced.
