# Stripe Checkout (Enrolment Payment) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A public "Enrol — £1,000" button on the pricing page that starts a Stripe hosted Checkout for the existing "Single 5-Day Training" price and returns the buyer to a branded thank-you page (collect-only; manual onboarding; no webhook).

**Architecture:** A mock-safe Stripe wrapper (`lib/stripe.ts`) creates a Checkout Session; a public server action redirects the buyer to Stripe's hosted page; success/cancel return to our own pages. No new DB tables, no webhook. `STRIPE_WEBHOOK_SECRET` becomes optional since nothing uses it.

**Tech Stack:** Next.js 16 (modified — see Task 0), TypeScript, `stripe` v22, Vitest, Tailwind.

**Branch:** `feat/stripe-checkout` (already created; spec committed at `9b0455f`).

---

### Task 0: Pre-flight — Next.js guides, Stripe v22 API, fetch the price id

**Files:** `.env.local` (add one line) — otherwise reading only.

- [ ] **Step 1: Confirm Next.js conventions**

Run: `ls node_modules/next/dist/docs/` and skim the Server Actions / `redirect` / async `searchParams` guides. Confirm the patterns already in `src/app/(app)/admin/crm/actions.ts` (`"use server"`, `redirect()` from `next/navigation` outside try/catch, `redirect` typed `never`) and async `searchParams` in page components are current. Flag any deprecation that affects a new server action that calls `redirect()`.

- [ ] **Step 2: Verify the Stripe v22 API**

Run: `find node_modules/stripe -name '*.d.ts' | xargs grep -niE "class Stripe|checkout|sessions|export default|export = " 2>/dev/null | head -40`
Confirm: `Stripe` is the **default import** (`import Stripe from "stripe"`), `new Stripe(secretKey)` works without an explicit apiVersion, and `stripe.checkout.sessions.create({ mode, line_items, success_url, cancel_url })` resolves to a session object with a `url` field. Note any required field differences.

- [ ] **Step 3: Fetch the £1,000 price id and write it to `.env.local`**

Run (reads the saved secret key; does not print it):
```bash
cd "/Users/paulbridges/Desktop/online coaching/urban-ai-app"
SK=$(grep -m1 '^STRIPE_SECRET_KEY=' .env.local | cut -d= -f2-)
curl -s https://api.stripe.com/v1/prices -u "$SK:" -d limit=20 -G | grep -o '"id": "price_[^"]*"\|"unit_amount": [0-9]*\|"currency": "[a-z]*"' | head -40
```
Identify the price with `unit_amount: 100000` and `currency: "gbp"` (that's £1,000). Append it to `.env.local`:
```bash
echo 'STRIPE_PRICE_ID=price_XXXXXXXX' >> .env.local   # replace with the real id
```
If the API call can't reach Stripe from this environment (HTTP 000 / network blocked), STOP and report — the controller will supply the price id (the build + tests do NOT depend on it; only a real live checkout does). Do not block later tasks on this.

- [ ] **Step 4: Confirm the test command**

Run: `grep -A3 '"scripts"' package.json | grep -iE "test|vitest"` — tests run via `npm test` (=`vitest run`); `npx vitest run <path>` also works. `@/`→`/src` alias is configured in `vitest.config.ts`.

---

### Task 1: Stripe checkout wrapper

**Files:**
- Create: `src/lib/stripe.ts`
- Test: `src/lib/__tests__/stripe.test.ts`

- [ ] **Step 1: Write the failing test** — `src/lib/__tests__/stripe.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted so the mock fn exists when the hoisted vi.mock factory runs.
const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

// Regular function (not arrow) so Vitest 4's Reflect.construct can `new` it.
// `stripe` is a default export, so mock the `default` key.
vi.mock("stripe", () => ({
  default: vi.fn(function () {
    return { checkout: { sessions: { create: createMock } } };
  }),
}));
vi.mock("@/lib/env.server", () => ({
  getServerEnv: () => ({ STRIPE_SECRET_KEY: "sk_test_x" }),
}));

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.resetModules();
    createMock.mockReset();
    delete process.env.STRIPE_PRICE_ID;
  });

  it("no-ops in mock mode and returns the success url", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://x/success", mocked: true });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a Checkout Session and returns its url in real mode", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    process.env.STRIPE_PRICE_ID = "price_123";
    createMock.mockResolvedValue({ url: "https://checkout.stripe.com/c/sess_1" });
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://checkout.stripe.com/c/sess_1" });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_123", quantity: 1 }],
        success_url: "https://x/success",
        cancel_url: "https://x/cancel",
      }),
    );
  });

  it("returns an error (and skips Stripe) when STRIPE_PRICE_ID is missing", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res.ok).toBe(false);
    expect(createMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/__tests__/stripe.test.ts`
Expected: FAIL — cannot find module `@/lib/stripe`.

- [ ] **Step 3: Implement `src/lib/stripe.ts`**

```ts
import Stripe from "stripe";
import { IS_MOCK } from "@/lib/mock";
import { getServerEnv } from "@/lib/env.server";

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
  mocked?: boolean;
}

export async function createCheckoutSession(input: {
  successUrl: string;
  cancelUrl: string;
}): Promise<CheckoutResult> {
  if (IS_MOCK) return { ok: true, url: input.successUrl, mocked: true };

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return { ok: false, error: "STRIPE_PRICE_ID is not set" };

  try {
    const stripe = new Stripe(getServerEnv().STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    });
    if (!session.url) return { ok: false, error: "Stripe did not return a checkout URL" };
    return { ok: true, url: session.url };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
```
If `tsc` complains about the `Stripe` import style or `sessions.create` args, adjust to the exact v22 shape verified in Task 0 (do not guess silently — keep the same behaviour).

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/__tests__/stripe.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/stripe.ts src/lib/__tests__/stripe.test.ts
git commit -m "feat(stripe): add mock-safe checkout-session helper"
```

---

### Task 2: Make `STRIPE_WEBHOOK_SECRET` optional

**Files:**
- Modify: `src/lib/env.server.ts:12`
- Modify/Test: `src/lib/__tests__/env.server.test.ts`

- [ ] **Step 1: Write the failing test** — add this test inside the `describe("getServerEnv ...")` block in `src/lib/__tests__/env.server.test.ts` (e.g. after the "returns typed object" test):

```ts
  it("does not require STRIPE_WEBHOOK_SECRET (it is optional)", async () => {
    for (const [k, v] of Object.entries(FULL_ENV)) process.env[k] = v;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const { getServerEnv } = await import("@/lib/env.server");
    expect(() => getServerEnv()).not.toThrow();
  });
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run src/lib/__tests__/env.server.test.ts`
Expected: FAIL — currently `STRIPE_WEBHOOK_SECRET` is required, so `getServerEnv()` throws.

- [ ] **Step 3: Make it optional** — in `src/lib/env.server.ts`, change line 12 from:

```ts
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
```
to:
```ts
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run src/lib/__tests__/env.server.test.ts`
Expected: PASS (all tests, including the new one). The existing "throws when required vars are missing" test still passes because the other required vars are still absent.

- [ ] **Step 5: Commit**

```bash
git add src/lib/env.server.ts src/lib/__tests__/env.server.test.ts
git commit -m "chore(env): make STRIPE_WEBHOOK_SECRET optional (no webhook in use)"
```

---

### Task 3: Checkout server action

**Files:**
- Create: `src/app/(marketing)/pricing/actions.ts`
- Test: `src/app/(marketing)/pricing/__tests__/actions.test.ts`

- [ ] **Step 1: Write the failing test** — `src/app/(marketing)/pricing/__tests__/actions.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

describe("startEnrolmentCheckout", () => {
  beforeEach(() => vi.resetModules());

  it("redirects to the success page in mock mode", async () => {
    const { startEnrolmentCheckout } = await import("@/app/(marketing)/pricing/actions");
    await expect(startEnrolmentCheckout()).rejects.toThrow(/REDIRECT:.*\/pricing\/success/);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run "src/app/(marketing)/pricing/__tests__/actions.test.ts"`
Expected: FAIL — `startEnrolmentCheckout` not found.

- [ ] **Step 3: Implement `src/app/(marketing)/pricing/actions.ts`**

```ts
"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/stripe";

export async function startEnrolmentCheckout(): Promise<void> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const res = await createCheckoutSession({
    successUrl: `${base}/pricing/success`,
    cancelUrl: `${base}/pricing?checkout=cancelled`,
  });
  if (!res.ok || !res.url) {
    redirect(`/pricing?error=${encodeURIComponent(res.error ?? "Could not start checkout. Please try again.")}`);
  }
  redirect(res.url);
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run "src/app/(marketing)/pricing/__tests__/actions.test.ts"`
Expected: PASS (1 test). In mock mode `createCheckoutSession` returns the success URL, so the action redirects to `…/pricing/success`.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(marketing)/pricing/actions.ts" "src/app/(marketing)/pricing/__tests__/actions.test.ts"
git commit -m "feat(stripe): add startEnrolmentCheckout server action"
```

---

### Task 4: Success (thank-you) page

**Files:**
- Create: `src/app/(marketing)/pricing/success/page.tsx`

(No unit test — a static marketing page; verified via tsc + the mock-mode walkthrough.)

- [ ] **Step 1: Create `src/app/(marketing)/pricing/success/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Thank you — Bridgeway AI Bootcamp",
  description: "Your enrolment payment was received.",
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <PageHero
        eyebrow="you're in"
        title="thank you"
        intro="Your payment was received — we'll email you shortly to set up your access."
        sticker="hundred"
      />
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-lg text-ua-ink/80">
            Thanks for enrolling in the Bridgeway AI Bootcamp. Stripe has emailed you a
            receipt, and we&apos;ll be in touch with your access details and the schedule.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-ua-blue px-7 py-3 text-lg font-bold text-ua-bg hover:opacity-90"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Back to home →
          </Link>
        </div>
      </section>
    </>
  );
}
```
(`PageHero` props `eyebrow/title/intro/sticker` and the `sticker="hundred"` value are the same ones used by `pricing/page.tsx`.)

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from this file.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(marketing)/pricing/success/page.tsx"
git commit -m "feat(stripe): add enrolment success page"
```

---

### Task 5: Wire the button into the pricing page

**Files:**
- Modify: `src/app/(marketing)/pricing/page.tsx`

- [ ] **Step 1: Update imports**

In `src/app/(marketing)/pricing/page.tsx`, **remove** this import (it becomes unused once the CTA changes):
```tsx
import { HERO } from "@/lib/marketing/content";
```
and **add**:
```tsx
import { startEnrolmentCheckout } from "./actions";
```
(Keep the existing `Link` import — it's still used by the group card and FAQ link.)

- [ ] **Step 2: Make the page async + read searchParams**

Replace:
```tsx
export default function PricingPage() {
  return (
```
with:
```tsx
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const error = typeof sp.error === "string" ? sp.error : null;
  const cancelled = sp.checkout === "cancelled";
  return (
```

- [ ] **Step 3: Add a banner under the hero**

Immediately AFTER the `<PageHero ... />` block (before `{/* Pricing cards */}`), add:
```tsx
      {(error || cancelled) && (
        <div className="bg-ua-bg px-6 pt-8 md:px-10">
          <div className="mx-auto max-w-4xl rounded-2xl border-2 border-ua-ink bg-ua-orange/20 p-4 text-center text-sm font-semibold text-ua-ink">
            {error ?? "Checkout cancelled — no charge was made."}
          </div>
        </div>
      )}
```

- [ ] **Step 4: Replace the full-course CTA with a checkout form**

Replace this block (the full-course card CTA):
```tsx
                <Link
                  href={HERO.ctaHref}
                  className="mt-9 block rounded-full bg-ua-orange px-7 py-3 text-center text-lg font-bold text-ua-bg hover:opacity-90"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {HERO.ctaLabel} →
                </Link>
```
with:
```tsx
                <form action={startEnrolmentCheckout} className="mt-9">
                  <button
                    type="submit"
                    className="block w-full rounded-full bg-ua-orange px-7 py-3 text-center text-lg font-bold text-ua-bg hover:opacity-90"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    Enrol — £1,000 →
                  </button>
                </form>
```
(Leave the "Secure checkout via Stripe." note directly below it unchanged.)

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` (expect clean) and `npx vitest run` (expect the whole suite still green, including the new Stripe tests).

- [ ] **Step 6: Commit**

```bash
git add "src/app/(marketing)/pricing/page.tsx"
git commit -m "feat(stripe): wire pricing CTA to Stripe checkout + add error/cancel banner"
```

---

### Task 6: Full verification

**Files:** none (verification); may edit the spec status line.

- [ ] **Step 1: Full test suite** — Run: `npx vitest run` → expect all green, including the new `stripe.test.ts`, pricing `actions.test.ts`, and updated `env.server.test.ts`.
- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` → no errors.
- [ ] **Step 3: Lint the changed files** — Run: `npm run lint` → confirm no NEW errors/warnings in the files this feature added/changed (the repo has pre-existing lint errors in `BookingClient.tsx` unrelated to this work — ignore those).
- [ ] **Step 4: Mock-mode walkthrough** — `NEXT_PUBLIC_MOCK_ADMIN=1 npm run dev`, open `/pricing`, click **Enrol — £1,000**; in mock mode it should land on `/pricing/success` (no real Stripe call). Then visit `/pricing?checkout=cancelled` and `/pricing?error=Test` to confirm the banners render.
- [ ] **Step 5: Mark spec implemented + commit** — set the status line in `docs/superpowers/specs/2026-06-17-stripe-checkout-design.md` to `Implemented`.
```bash
git add docs/superpowers/specs/2026-06-17-stripe-checkout-design.md
git commit -m "docs(stripe): mark checkout spec implemented"
```

---

## Post-implementation checklist (operational)
- Ensure `STRIPE_PRICE_ID` is set locally (Task 0) and add `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` to **Vercel** for the live site.
- Test the real flow with a Stripe **test card** (`4242 4242 4242 4242`, any future expiry/CVC).
- Switch to **live** Stripe keys + the live price id when ready to take real money; rotate the chat-exposed test keys.
- A real charge also requires your Stripe account to be activated for live payments.
