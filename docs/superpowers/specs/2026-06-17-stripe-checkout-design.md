# Stripe Checkout (Enrolment Payment) — Design Spec

- **Date:** 2026-06-17
- **Status:** Approved (pending spec review)
- **Author:** Paul (Bridgeway Ai Bootcamp) with Claude

## Context

The bootcamp sells one thing: the full course at **£1,000 one-time**. A matching
product already exists in Stripe — **"Single 5-Day Training", £1,000 GBP, one-off**.
The marketing **pricing page** has a "full course" card whose CTA button already
says *"Secure checkout via Stripe"*, but it currently just links to `HERO.ctaHref`
— there is no real payment flow. The `stripe` v22 package is installed and
`STRIPE_SECRET_KEY` is saved in `.env.local`, but no Stripe code exists yet.

## Goal

A public **"Enrol — £1,000"** button on the pricing page that takes anyone (no
login) to Stripe's hosted checkout for the £1,000 product, then returns them to a
branded thank-you page. Payment is **collected only** — the owner onboards the
buyer manually (no automatic access, no webhook).

### In scope
- `src/lib/stripe.ts` — `createCheckoutSession()` wrapper (mock-safe, never throws).
- `src/app/(marketing)/pricing/actions.ts` — `startEnrolmentCheckout()` server action.
- `src/app/(marketing)/pricing/success/page.tsx` — thank-you page.
- Edit `src/app/(marketing)/pricing/page.tsx` — replace the full-course CTA with a
  form/button that triggers checkout; show a small error banner if checkout fails.
- New config `STRIPE_PRICE_ID` (the £1,000 price id), read from `process.env`.
- Make `STRIPE_WEBHOOK_SECRET` **optional** in `env.server.ts` (no webhook is used,
  so requiring it needlessly blocks boot); update `env.server.test.ts` to match.
- Unit tests.

### Out of scope (YAGNI)
- Stripe webhook + automatic access provisioning.
- Saving payments in our own DB (Stripe dashboard is the record of truth).
- The "group sessions" card (stays "enquire").
- Client-side Stripe.js / the publishable key (hosted Checkout redirect needs neither).
- Logged-in/account-linked checkout.

## Approach

**Chosen: in-app Stripe Checkout Session.** The button posts to a server action
that creates a Checkout Session for the existing price and redirects to Stripe's
hosted page; success/cancel return to our own pages. Uses the saved secret key,
keeps everything in version control, and is upgrade-ready (a webhook for
auto-access could be added later without rework).

Rejected: (B) no-code Payment Link — simplest, but the flow/return live in the
Stripe dashboard rather than the app; (C) custom Stripe Elements form — more code
and PCI surface than needed.

## Architecture & components

### 1. `src/lib/stripe.ts` (new), server-only
```
interface CheckoutResult { ok: boolean; url?: string; error?: string; mocked?: boolean }
async function createCheckoutSession(input: { successUrl: string; cancelUrl: string }): Promise<CheckoutResult>
```
- `IS_MOCK` → return `{ ok: true, url: input.successUrl, mocked: true }` (no Stripe call).
- Real: read `process.env.STRIPE_PRICE_ID` (if missing → `{ ok:false, error }`);
  `new Stripe(getServerEnv().STRIPE_SECRET_KEY)`; `stripe.checkout.sessions.create({ mode: "payment", line_items: [{ price: priceId, quantity: 1 }], success_url, cancel_url })`.
- Return `{ ok: true, url: session.url }`; never throws (try/catch → `{ ok:false, error }`).
- **Impl note:** confirm the `stripe` v22 `checkout.sessions.create` signature + that
  `Stripe` is the default import, against the installed types before coding.

### 2. `src/app/(marketing)/pricing/actions.ts` (new)
```
"use server"
async function startEnrolmentCheckout(): Promise<void>
```
- Build base URL from `process.env.NEXT_PUBLIC_APP_URL` (fallback `http://localhost:3000`).
- `createCheckoutSession({ successUrl: `${base}/pricing/success`, cancelUrl: `${base}/pricing?checkout=cancelled` })`.
- If `!ok` → `redirect("/pricing?error=<message>")`; else `redirect(res.url)`.
- Public — no auth guard. `redirect()` stays outside any try/catch.

### 3. `src/app/(marketing)/pricing/success/page.tsx` (new)
Branded thank-you: "Payment received — thank you! We'll email you shortly to set up
your access." Link back home. (Buyer name/email are captured by Stripe and visible
in the dashboard; Stripe also emails the owner per sale by default.)

### 4. Edit `src/app/(marketing)/pricing/page.tsx`
- Make the page read `searchParams` (async) to show an error/cancel banner.
- Replace the full-course card `<Link href={HERO.ctaHref}>…</Link>` with:
  `<form action={startEnrolmentCheckout}><button type="submit" …>Enrol — £1,000 →</button></form>`,
  styled identically (same orange pill). Keep the "Secure checkout via Stripe." note.
- If `?error=` present, render a small banner above the cards; `?checkout=cancelled`
  shows a gentle "Checkout cancelled — no charge was made." note.

## Data flow
Click **Enrol — £1,000** → `startEnrolmentCheckout` → Stripe hosted Checkout (card +
buyer name/email) → pay → `/pricing/success`. Owner sees the payment + buyer email in
the **Stripe dashboard** and grants access manually. Cancel → back to `/pricing`.

## Config / env
- `STRIPE_SECRET_KEY` — already saved (test). Live key added in Vercel later.
- `STRIPE_PRICE_ID` — the £1,000 price id; fetched via the Stripe API during the
  build and put in `.env.local` (test) / Vercel (live). Read via `process.env`, not
  the strict schema, so a missing value degrades gracefully instead of blocking boot.
- `STRIPE_WEBHOOK_SECRET` — changed to `.optional()` in `env.server.ts` (unused).

## Error handling & mock mode
Stripe failure or missing price id → friendly redirect to `/pricing?error=…`; no
crash. Mock mode never calls Stripe — the action redirects straight to
`/pricing/success`, so the whole flow is clickable locally without keys.

## Testing
- `createCheckoutSession`: mock-mode returns `{ ok, mocked, url:successUrl }` with no
  Stripe call; real-mode (Stripe SDK mocked) calls `checkout.sessions.create` with the
  right args and returns the session url; error path maps to `{ ok:false }`.
  **Mock the `stripe` constructor with a regular `function` (not arrow)** — Vitest 4
  `Reflect.construct` rejects arrow constructors (see the email feature's test).
- `startEnrolmentCheckout`: mock-mode redirects to `/pricing/success` (mock `redirect`
  as a throwing fn, as in the CRM action tests).

## Constraints / risks
- **Modified Next.js (`AGENTS.md`):** read the relevant `node_modules/next/dist/docs`
  guides before coding; follow current Server Action / `redirect` conventions
  (already proven by the existing CRM actions).
- Verify the installed `stripe` v22 API shape before coding.
- A real charge requires the live key + a verified business in Stripe; test mode uses
  Stripe test cards (e.g. 4242 4242 4242 4242).
