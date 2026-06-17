# Wave 1 — Notification Emails + Audit Quick-Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Wire the contact form to email, add a Stripe payment-notification webhook, and clear the small, well-defined audit fixes (Q&A nested form, stale e2e test, empty success-stories footer link, document `STRIPE_PRICE_ID`).

**Architecture:** Reuse `sendEmail` (`@/lib/email`, mock-safe, never throws) for both email features. Contact uses a Server Action; payments use a Route Handler (`/api/stripe/webhook`) verifying Stripe signatures. The rest are targeted edits.

**Tech Stack:** Next.js 16 (modified — Task 0), TypeScript, `stripe` v22, `resend` v6, Vitest, Playwright, Tailwind.

**Branch:** `feat/wave1-notifications-fixes` (spec committed at `4995d9c`).

---

### Task 0: Pre-flight (Next.js 16 Route Handlers)

- [ ] **Step 1:** `ls node_modules/next/dist/docs/` and skim the **Route Handlers** guide. Confirm for a Node-runtime `POST` handler: signature `export async function POST(req: Request): Promise<Response>`, raw body via `await req.text()`, headers via `req.headers.get(...)`, and that `export const runtime = "nodejs"` is valid/honoured (Stripe's `constructEvent` needs Node crypto). Also confirm Server Actions + async `searchParams` conventions still match the existing CRM/pricing code (they do as of prior recon). Report anything that differs.
- [ ] **Step 2:** Confirm `stripe` v22 exposes `new Stripe(key).webhooks.constructEvent(body, sig, secret): Stripe.Event` (synchronous) by grepping `node_modules/stripe` types. Report the exact method name.

---

### Task 1: Contact form server action

**Files:** Create `src/app/(marketing)/contact/actions.ts`; Test `src/app/(marketing)/contact/__tests__/actions.test.ts`

- [ ] **Step 1: Failing test** — `src/app/(marketing)/contact/__tests__/actions.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendEmail: sendMock }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((u: string) => { throw new Error(`REDIRECT:${u}`); }),
}));

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe("submitContactForm", () => {
  beforeEach(() => { vi.resetModules(); sendMock.mockReset(); sendMock.mockResolvedValue({ ok: true }); });

  it("sends and redirects ?sent=1 on valid input", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ name: "Sam", email: "sam@x.com", message: "hi" })))
      .rejects.toThrow("REDIRECT:/contact?sent=1");
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ replyTo: "sam@x.com" }));
  });

  it("redirects ?error= and does not send when email/message missing", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ name: "Sam" }))).rejects.toThrow(/REDIRECT:\/contact\?error=/);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("honeypot filled → silently succeeds without sending", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ company: "bot", email: "a@b.com", message: "x" })))
      .rejects.toThrow("REDIRECT:/contact?sent=1");
    expect(sendMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2:** `npx vitest run "src/app/(marketing)/contact/__tests__/actions.test.ts"` → FAIL (module missing).

- [ ] **Step 3: Implement** `src/app/(marketing)/contact/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/marketing/content";

function field(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function submitContactForm(formData: FormData): Promise<void> {
  // Honeypot: bots fill the hidden "company" field; real users never see it.
  if (field(formData, "company")) redirect("/contact?sent=1");

  const name = field(formData, "name");
  const email = field(formData, "email");
  const message = field(formData, "message");

  if (!email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    redirect(`/contact?error=${encodeURIComponent("Please add a valid email and a message.")}`);
  }

  const res = await sendEmail({
    to: SITE.email,
    subject: `New enquiry from ${name || email}`,
    text: `Name: ${name || "(not given)"}\nEmail: ${email}\n\nMessage:\n${message}`,
    replyTo: email,
  });

  if (!res.ok) {
    console.error("[submitContactForm] send failed:", res.error);
    redirect(`/contact?error=${encodeURIComponent("Sorry — your message didn't send. Please email us directly.")}`);
  }
  redirect("/contact?sent=1");
}
```

- [ ] **Step 4:** `npx vitest run "src/app/(marketing)/contact/__tests__/actions.test.ts"` → PASS (3). Then `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**
```bash
git add "src/app/(marketing)/contact/actions.ts" "src/app/(marketing)/contact/__tests__/actions.test.ts"
git commit -m "feat(contact): add submitContactForm server action (honeypot + Resend)"
```

---

### Task 2: Wire the contact page to the action

**Files:** Modify `src/app/(marketing)/contact/page.tsx`

- [ ] **Step 1:** Add imports after the existing content import:
```tsx
import { submitContactForm } from "./actions";
```

- [ ] **Step 2:** Make the page async + read searchParams. Replace:
```tsx
export default function ContactPage() {
  return (
```
with:
```tsx
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const sent = sp.sent === "1";
  const error = typeof sp.error === "string" ? sp.error : null;
  return (
```

- [ ] **Step 3:** Convert the message card to a real form. Replace the `<div className="mt-8 space-y-5">…</div>` block (the one containing the name/email/message inputs and the Send button) so that block is wrapped in a `<form>` and the button submits. Concretely:
  - Change the wrapper `<div className="mt-8 space-y-5">` to `<form action={submitContactForm} className="mt-8 space-y-5">` and its closing `</div>` to `</form>`.
  - Immediately inside the form (top), add a hidden honeypot + a status banner:
```tsx
                {/* honeypot — hidden from real users */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                {sent && (
                  <p className="rounded-xl border-2 border-ua-ink bg-ua-green px-4 py-3 text-sm font-semibold text-ua-ink">
                    Thanks — your message is on its way. We&apos;ll reply within a day.
                  </p>
                )}
                {error && (
                  <p className="rounded-xl border-2 border-ua-ink bg-ua-orange px-4 py-3 text-sm font-semibold text-white">
                    {error}
                  </p>
                )}
```
  - Add `required` to the email `<input>` and the message `<textarea>`.
  - Change the Send button from `type="button"` to `type="submit"` (keep its classes/label).

- [ ] **Step 4:** `npx tsc --noEmit` clean; `npx vitest run` full suite still green.

- [ ] **Step 5: Commit**
```bash
git add "src/app/(marketing)/contact/page.tsx"
git commit -m "feat(contact): wire form to submitContactForm + honeypot + status banner"
```

---

### Task 3: Stripe payment webhook

**Files:** Create `src/app/api/stripe/webhook/route.ts`; Test `src/app/api/stripe/__tests__/webhook.test.ts`

- [ ] **Step 1: Failing test** — `src/app/api/stripe/__tests__/webhook.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const { constructEventMock, sendMock } = vi.hoisted(() => ({
  constructEventMock: vi.fn(),
  sendMock: vi.fn(),
}));
// Regular function (not arrow) for Vitest 4 Reflect.construct on `new Stripe()`.
vi.mock("stripe", () => ({
  default: vi.fn(function () { return { webhooks: { constructEvent: constructEventMock } }; }),
}));
vi.mock("@/lib/email", () => ({ sendEmail: sendMock }));

function req(body = "{}") {
  return new Request("https://x/api/stripe/webhook", {
    method: "POST", body, headers: { "stripe-signature": "sig" },
  });
}

describe("stripe webhook POST", () => {
  beforeEach(() => {
    vi.resetModules();
    constructEventMock.mockReset();
    sendMock.mockReset(); sendMock.mockResolvedValue({ ok: true });
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
  });

  it("emails on checkout.session.completed and returns 200", async () => {
    constructEventMock.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { amount_total: 100000, currency: "gbp", customer_details: { email: "jane@x.com", name: "Jane" }, id: "cs_1" } },
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ replyTo: "jane@x.com" }));
    expect(sendMock.mock.calls[0][0].subject).toContain("1000");
  });

  it("returns 400 on bad signature, no email", async () => {
    constructEventMock.mockImplementation(() => { throw new Error("bad sig"); });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("ignores other event types: 200, no email", async () => {
    constructEventMock.mockReturnValue({ type: "payment_intent.created", data: { object: {} } });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2:** `npx vitest run "src/app/api/stripe/__tests__/webhook.test.ts"` → FAIL (module missing).

- [ ] **Step 3: Implement** `src/app/api/stripe/webhook/route.ts`:

```ts
import Stripe from "stripe";
import { sendEmail } from "@/lib/email";
import { SITE } from "@/lib/marketing/content";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    console.error("[stripe webhook] missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook not configured", { status: 500 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(secretKey);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", (err as Error).message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
    const currency = (session.currency ?? "gbp").toUpperCase();
    const email = session.customer_details?.email ?? "unknown";
    const name = session.customer_details?.name ?? "";
    await sendEmail({
      to: SITE.email,
      subject: `💷 New payment — ${currency} ${amount} from ${email}`,
      text: `You received a payment.\n\nAmount: ${currency} ${amount}\nCustomer: ${name || "(no name)"} <${email}>\nSession: ${session.id}`,
      replyTo: email !== "unknown" ? email : undefined,
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
```

- [ ] **Step 4:** `npx vitest run "src/app/api/stripe/__tests__/webhook.test.ts"` → PASS (3). `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit**
```bash
git add "src/app/api/stripe/webhook/route.ts" "src/app/api/stripe/__tests__/webhook.test.ts"
git commit -m "feat(stripe): payment webhook → email notification on checkout.session.completed"
```

---

### Task 4: Fix admin Q&A nested `<form>`

**Files:** Modify `src/app/(app)/admin/qa/page.tsx`

- [ ] **Step 1:** Replace the reply-form block (the `<form action={replyToQuestionAction.bind(null, question.id)}>` … `</form>` spanning ~lines 124–158) with this **un-nested** version — the reply form (textarea) and the button row become siblings; the "Send reply" button references the form via the `form` attribute, and "Mark resolved" is its own sibling form:

```tsx
                <form
                  id={`reply-${question.id}`}
                  action={replyToQuestionAction.bind(null, question.id)}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    name="reply"
                    rows={3}
                    placeholder="Write a reply to escalate or clarify..."
                    required
                    className="rounded-xl border border-[var(--ua-ink)]/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)] resize-none w-full"
                    style={{ color: "var(--ua-ink)" }}
                  />
                </form>
                <div className="flex items-center gap-2 justify-between">
                  <form action={markResolvedAction.bind(null, question.id)}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: "var(--ua-green)",
                        color: "var(--ua-ink)",
                        border: "1px solid rgba(20,20,20,0.1)",
                      }}
                    >
                      Mark resolved
                    </button>
                  </form>
                  <button
                    type="submit"
                    form={`reply-${question.id}`}
                    className="inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                  >
                    Send reply
                  </button>
                </div>
```

- [ ] **Step 2:** `npx tsc --noEmit` clean; `npx vitest run` full suite green. (Confirm no remaining `<form>`-inside-`<form>` in the file.)

- [ ] **Step 3: Commit**
```bash
git add "src/app/(app)/admin/qa/page.tsx"
git commit -m "fix(admin-qa): un-nest mark-resolved form (invalid nested <form>)"
```

---

### Task 5: Fix the stale Playwright e2e assertion

**Files:** Modify `tests/e2e/marketing-home.spec.ts`

- [ ] **Step 1:** Replace line 9:
```tsx
  await expect(page.getByRole("heading")).toContainText(/build real websites/i);
```
with (scope to the hero H1 + current copy):
```tsx
  await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(/build premium websites/i);
```

- [ ] **Step 2:** Run the e2e test: `npx playwright test tests/e2e/marketing-home.spec.ts`. Expected: PASS (Playwright's `webServer` config starts the dev server). If Playwright browsers aren't installed in this environment, report that and skip running — the change is a one-line copy/selector fix; do not install browsers.

- [ ] **Step 3: Commit**
```bash
git add tests/e2e/marketing-home.spec.ts
git commit -m "test(e2e): fix stale homepage heading assertion (scope to H1, current copy)"
```

---

### Task 6: De-link the empty `/success-stories` from the footer

**Files:** Modify `src/lib/marketing/content.ts`; possibly `src/components/marketing/__tests__/MarketingFooter.test.tsx`

- [ ] **Step 1:** In `src/lib/marketing/content.ts`, remove the footer-links entry on line ~24:
```tsx
  { label: "Success stories", href: "/success-stories" },
```
(Delete that one array element. Leave the `/success-stories` page file itself in place — it's just no longer linked from the footer.)

- [ ] **Step 2:** Open `src/components/marketing/__tests__/MarketingFooter.test.tsx`. If it asserts the presence of "Success stories" / `/success-stories`, update/remove that assertion so it matches the new footer link set. If it doesn't reference it, no change.

- [ ] **Step 3:** `npx vitest run "src/components/marketing/__tests__/MarketingFooter.test.tsx"` → PASS. `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**
```bash
git add src/lib/marketing/content.ts src/components/marketing/__tests__/MarketingFooter.test.tsx
git commit -m "chore(marketing): de-link empty success-stories from footer"
```

---

### Task 7: Document `STRIPE_PRICE_ID`

**Files:** Modify `src/lib/env.server.ts`; `.env.local.example`

- [ ] **Step 1:** In `src/lib/env.server.ts`, add to the schema directly after the `STRIPE_WEBHOOK_SECRET` line:
```ts
  STRIPE_PRICE_ID: z.string().min(1).optional(),
```
(Optional, so it never blocks boot; the checkout helper still reads it via `process.env`. This just documents it in the schema/type.)

- [ ] **Step 2:** In `.env.local.example`, add a line under the Stripe section:
```
STRIPE_PRICE_ID=
```

- [ ] **Step 3:** `npx vitest run src/lib/__tests__/env.server.test.ts` → PASS (adding an optional var doesn't affect the required-keys tests). `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit**
```bash
git add src/lib/env.server.ts .env.local.example
git commit -m "chore(env): document optional STRIPE_PRICE_ID"
```

---

### Task 8: Full verification

- [ ] **Step 1:** `npx vitest run` → all green (incl. the 2 new test files).
- [ ] **Step 2:** `npx tsc --noEmit` → no errors.
- [ ] **Step 3:** `npm run lint` → no NEW errors/warnings in the files this wave touched (the pre-existing `BookingClient.tsx` errors are unrelated).
- [ ] **Step 4:** `npm run build` → succeeds.
- [ ] **Step 5:** Mock-mode walkthrough: `NEXT_PUBLIC_MOCK_ADMIN=1 npm run dev`, open `/contact`, submit the form → lands on `/contact?sent=1` with the green banner (mock mode sends nothing). Submit empty → `?error=` banner. (The webhook can't be exercised locally without Stripe; it's covered by unit tests + the post-merge live config below.)

---

## Post-merge operational steps (controller does these after merge + deploy)
1. Create the Stripe webhook endpoint via the Stripe API (sk_live) → `https://www.bridgewayaibootcamp.com/api/stripe/webhook`, event `checkout.session.completed`; capture the signing secret.
2. `vercel env add STRIPE_WEBHOOK_SECRET production` with that secret.
3. Redeploy production.
4. (Optional) Send a Stripe test webhook event to confirm the email arrives.
