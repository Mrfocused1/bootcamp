# Wave 1 — Notification Emails + Audit Quick-Fixes — Design Spec

- **Date:** 2026-06-17
- **Status:** Approved (fix-all mandate)
- **Author:** Paul (Bridgeway Ai Bootcamp) with Claude

## Context
First wave of the post-audit "fix all" program. Bundles the two notification-email
features we'd already designed plus the small, well-defined fixes the audit surfaced.
All email reuses the existing `sendEmail` helper (`src/lib/email.ts`, mock-safe,
never throws) and the now-verified domain (`RESEND_FROM=hello@bridgewayaibootcamp.com`).
Larger items (auth, real-mode admin writes, AI, booking, video) are later waves.

## In scope (6 items)

### 1. Contact form → email
- New `src/app/(marketing)/contact/actions.ts` — `submitContactForm(formData)` (`"use server"`):
  - Reads `name`, `email`, `message`. Requires `email` + `message`; if missing/invalid email → `redirect("/contact?error=…")`.
  - **Honeypot:** a hidden field (e.g. `company`); if non-empty, silently `redirect("/contact?sent=1")` without sending (bot).
  - `sendEmail({ to: SITE.email, subject: "New enquiry from <name|email>", text: name+email+message, replyTo: <submitter email> })` (`SITE.email` = hello@bridgewayaibootcamp.com).
  - Success → `redirect("/contact?sent=1")`; failure → log real error, `redirect("/contact?error=…")` with a generic message. Mock mode → `?sent=1` (no send). `redirect` stays outside try/catch.
- Edit `src/app/(marketing)/contact/page.tsx`: wrap the name/email/message inputs in `<form action={submitContactForm}>`, add the hidden honeypot, change the button to `type="submit"`, make the page `async` to read `searchParams` and show a success/error banner. Recipient text unchanged.

### 2. Stripe payment webhook → email
- New `src/app/api/stripe/webhook/route.ts` — `export async function POST(req)`:
  - Read raw body (`await req.text()`) + `stripe-signature` header.
  - Read `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` from `process.env` (decoupled, like the checkout helper). If either missing → log + `500`.
  - `new Stripe(secretKey).webhooks.constructEvent(body, sig, webhookSecret)`; on throw → `400`.
  - On `checkout.session.completed`: `sendEmail({ to: SITE.email, subject: "💷 New payment — £X from <email>", text: amount + customer email/name + session id, replyTo: customer email })`. Amount = `session.amount_total/100` `session.currency`.
  - Always return `200 {received:true}` for handled/ignored event types (so Stripe doesn't retry).
- **Operational (done via Stripe API + Vercel CLI after build):** create a webhook endpoint pointing to `https://www.bridgewayaibootcamp.com/api/stripe/webhook` subscribed to `checkout.session.completed`; capture its signing secret; set `STRIPE_WEBHOOK_SECRET` in Vercel Production; redeploy.
- **Note:** scope is email notification only (manual onboarding stays per the user's earlier choice — no auto-enrollment in this wave).

### 3. Fix admin Q&A nested `<form>` (real HTML bug)
- `src/app/(app)/admin/qa/page.tsx` (~124–158): the "Mark resolved" `<form action={markResolvedAction}>` is nested inside the "reply" `<form action={replyToQuestionAction}>`. Restructure so the two forms are **siblings** (move the mark-resolved form out of the reply form). No behavior change beyond making the button reliable.

### 4. Fix stale Playwright e2e test
- `tests/e2e/marketing-home.spec.ts`: the assertion `expect(page.getByRole("heading")).toContainText(/build real websites/i)` is stale (homepage hero now reads "we teach you how to build…") and uses an unscoped `getByRole("heading")` (matches 13 elements → strict-mode failure). Update it to scope to the hero's H1 (e.g. `page.getByRole("heading", { level: 1 })` or a test-id) and assert current copy. The page is correct; only the test changes.

### 5. De-link empty `/success-stories`
- The footer links "Success stories" → `/success-stories`, which is a "coming soon" placeholder. Remove/hide that footer link (find the marketing footer component) until real content exists. Leave the page itself in place (not routed-to from nav).

### 6. Document `STRIPE_PRICE_ID`
- Add `STRIPE_PRICE_ID: z.string().min(1).optional()` to the schema in `src/lib/env.server.ts` purely for documentation/visibility (the checkout helper still reads it via `process.env`; optional so it never blocks boot). Update `.env.local.example` to list it.

## Out of scope (later waves)
Auth/middleware/`auth/callback`; real-mode admin/data writes + analytics; AI assistant; `/api/book` booking; video-player progress/seek; populating success-stories content.

## Testing
- `submitContactForm`: mock-mode → `?sent=1`; missing email/message → `?error=`; honeypot filled → `?sent=1` with **no** `sendEmail` call. (Mock `@/lib/email`, `next/navigation`, `@/lib/mock` per the pricing-action test pattern.)
- Stripe webhook: mock `stripe` (`constructEvent` returns a fake `checkout.session.completed`) + `@/lib/email`; assert `sendEmail` called with the right amount/email; bad signature (`constructEvent` throws) → `400`; unrelated event type → `200`, no email. Use the regular-`function` constructor mock + `vi.hoisted` (Vitest 4).
- Q&A + footer + e2e + env changes: covered by `tsc`, `npm run lint`, and the corrected Playwright test passing.

## Constraints / risks
- **Modified Next.js 16 (`AGENTS.md`):** read `node_modules/next/dist/docs` before coding — especially **Route Handlers** (the webhook `POST`, raw body via `req.text()`), Server Actions, and async `searchParams`.
- The webhook must read the **raw** request body for signature verification (do not parse JSON first).
- Stripe webhook config + the `STRIPE_WEBHOOK_SECRET` need the live `sk_live` again (then rotate).
