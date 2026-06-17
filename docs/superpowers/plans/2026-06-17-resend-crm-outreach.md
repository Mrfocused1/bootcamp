# Resend CRM Outreach Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin send a templated, editable outreach email to a CRM lead from the lead's page, sending via Resend and auto-logging it to the lead's activity timeline.

**Architecture:** A server-only Resend wrapper (`lib/email.ts`) + code templates with merge fields (`lib/outreach-templates.ts`) + a new `sendLeadEmail` server action that sends then writes a `lead_activities` row (reusing the existing `logActivity` pattern) + a client `SendEmailForm` rendered on the lead detail page. No new DB tables; reuses `leads` and `lead_activities`. Everything honours `IS_MOCK` and `guardCrm`.

**Tech Stack:** Next.js (modified — see Task 0), TypeScript, `resend` v6.12.4, Supabase, Vitest, Tailwind.

**Branch:** `feat/resend-crm-outreach` (already created and pushed).

---

### Task 0: Pre-flight — read the modified-Next.js guides & verify the Resend SDK

**Files:** none (reading only)

- [ ] **Step 1: Read the relevant Next.js guides**

`AGENTS.md` warns this is a modified Next.js with breaking changes. Before writing code, list and skim the guides:

Run: `ls node_modules/next/dist/docs/ && sed -n '1,200p' node_modules/next/dist/docs/*server-actions* 2>/dev/null`
Read whatever covers **Server Actions**, **`revalidatePath`**, **`redirect`**, and async **`params`/`searchParams`**. Confirm the patterns already used in `src/app/(app)/admin/crm/actions.ts` (`"use server"`, `redirect()` from `next/navigation`, `revalidatePath`) are still current. If a deprecation notice changes any of these, adapt the code in later tasks accordingly.

- [ ] **Step 2: Verify the Resend v6 send signature**

Run: `find node_modules/resend/dist -name '*.d.ts' | xargs grep -niE "reply|class Emails|send\(" 2>/dev/null | head -40`
Confirm the field name for reply-to (expected `replyTo` in v6) and that `emails.send(...)` returns `{ data, error }`. If the reply-to field differs (older `reply_to`), use the verified name in Task 2.

- [ ] **Step 3: Confirm the test command**

Run: `grep -A3 '"scripts"' package.json | grep -iE "test|vitest"`
Note the test command (the steps below use `npx vitest run <path>`, which works regardless of the script alias).

---

### Task 1: Outreach templates + merge helper

**Files:**
- Create: `src/lib/outreach-templates.ts`
- Test: `src/lib/__tests__/outreach-templates.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/outreach-templates.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { OUTREACH_TEMPLATES, renderTemplate } from "@/lib/outreach-templates";
import type { Lead } from "@/lib/types";

const baseLead: Lead = {
  id: "lead-1", company: "Acme Trust", website: "https://acme.org",
  contact_name: "Sam Lee", email: "sam@acme.org", phone: null,
  status: "new", source: "cold_outreach", priority: "medium", est_value: 0,
  assigned_to: null, created_by: null, notes: null,
  next_follow_up_at: null, last_contacted_at: null,
  created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z",
};

describe("renderTemplate", () => {
  it("merges company, contact name and website, and appends the footer", () => {
    const t = OUTREACH_TEMPLATES[0];
    const { subject, body } = renderTemplate(t, baseLead);
    expect(subject).toContain("Acme Trust");
    expect(body).toContain("Hi Sam Lee,");
    expect(body).not.toContain("{{");
    expect(body).toContain("Bridgeway Ai Bootcamp");
    expect(body).toContain("www.bridgewayaibootcamp.com/work");
  });

  it("falls back to a team greeting when there is no contact name", () => {
    const { body } = renderTemplate(OUTREACH_TEMPLATES[0], { ...baseLead, contact_name: null });
    expect(body).toContain("Dear Acme Trust team,");
    expect(body).not.toContain("{{");
  });

  it("ships both seeded templates", () => {
    expect(OUTREACH_TEMPLATES.map((t) => t.id)).toEqual(["website-pitch", "ai-workshop"]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/__tests__/outreach-templates.test.ts`
Expected: FAIL — cannot find module `@/lib/outreach-templates`.

- [ ] **Step 3: Implement the templates module**

Create `src/lib/outreach-templates.ts`:

```ts
import type { Lead } from "@/lib/types";

export interface OutreachTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

const FOOTER = `Warm regards,
Paul
Bridgeway Ai Bootcamp

You can see more of the work we've done here: www.bridgewayaibootcamp.com/work`;

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "website-pitch",
    label: "Website pitch",
    subject: "Helping {{company}} reach more people online",
    body: `{{greeting}}

I've been looking at the work {{company}} does, and it really stood out.

I help mission-driven organisations strengthen their online presence — not just how a site looks, but how well it works to bring people in. I think there's real scope to help more people discover and support what you do.

I'd love to learn more about where you're headed and explore how we might be able to help. Would you be the right person to speak to, or could you point me to whoever is?`,
  },
  {
    id: "ai-workshop",
    label: "AI-workshop pitch",
    subject: "A practical AI workshop for {{company}}",
    body: `{{greeting}}

I've been reading about the work {{company}} does, and it's clearly important — and growing.

I run Bridgeway Ai Bootcamp, where we deliver practical, jargon-free AI workshops. I'd love to offer one to your team or the people you support — a hands-on session that builds confidence and real, future-facing skills.

I'd love to learn more about where you're headed and explore whether a workshop could be useful. Would you be the right person to speak to, or could you point me to whoever is?`,
  },
];

export function renderTemplate(
  template: OutreachTemplate,
  lead: Lead,
): { subject: string; body: string } {
  const greeting = lead.contact_name
    ? `Hi ${lead.contact_name},`
    : `Dear ${lead.company} team,`;

  const fill = (s: string): string =>
    s
      .replace(/\{\{greeting\}\}/g, greeting)
      .replace(/\{\{contact_name\}\}/g, lead.contact_name ?? "")
      .replace(/\{\{company\}\}/g, lead.company)
      .replace(/\{\{website\}\}/g, lead.website ?? "");

  return {
    subject: fill(template.subject),
    body: `${fill(template.body)}\n\n${FOOTER}`,
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/__tests__/outreach-templates.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/outreach-templates.ts src/lib/__tests__/outreach-templates.test.ts
git commit -m "feat(crm): add outreach email templates + merge helper"
```

---

### Task 2: Resend send helper

**Files:**
- Create: `src/lib/email.ts`
- Test: `src/lib/__tests__/email.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/email.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted so `sendMock` exists when the hoisted vi.mock factory runs.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({ Resend: vi.fn(() => ({ emails: { send: sendMock } })) }));
vi.mock("@/lib/env.server", () => ({
  getServerEnv: () => ({ RESEND_API_KEY: "re_test", RESEND_FROM: "Test <t@test.dev>" }),
}));

describe("sendEmail", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
  });

  it("no-ops in mock mode and never calls Resend", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    const { sendEmail } = await import("@/lib/email");
    await expect(sendEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toEqual({
      ok: true,
      mocked: true,
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends via Resend in real mode and returns ok with the id", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const { sendEmail } = await import("@/lib/email");
    const res = await sendEmail({ to: "a@b.com", subject: "S", text: "T" });
    expect(res).toEqual({ ok: true, id: "email_123" });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Test <t@test.dev>", to: "a@b.com", subject: "S", text: "T" }),
    );
  });

  it("returns { ok:false, error } when Resend reports an error", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    sendMock.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const { sendEmail } = await import("@/lib/email");
    await expect(sendEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toEqual({
      ok: false,
      error: "domain not verified",
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/__tests__/email.test.ts`
Expected: FAIL — cannot find module `@/lib/email`.

- [ ] **Step 3: Implement the email helper**

Create `src/lib/email.ts` (use the reply-to field name verified in Task 0 — shown here as `replyTo`):

```ts
import { Resend } from "resend";
import { IS_MOCK } from "@/lib/mock";
import { getServerEnv } from "@/lib/env.server";

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  mocked?: boolean;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (IS_MOCK) return { ok: true, mocked: true };

  try {
    const env = getServerEnv();
    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: input.to,
      subject: input.subject,
      text: input.text,
      replyTo: input.replyTo ?? env.RESEND_FROM,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/__tests__/email.test.ts`
Expected: PASS (3 tests). If TypeScript complains about `replyTo`, switch to the field name verified in Task 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/email.ts src/lib/__tests__/email.test.ts
git commit -m "feat(email): add Resend send helper (mock-safe, never throws)"
```

---

### Task 3: `sendLeadEmail` server action

**Files:**
- Modify: `src/app/(app)/admin/crm/actions.ts` (append a new action; reuses existing `guardCrm`, `str`, `toIso`)
- Test: `src/app/(app)/admin/crm/__tests__/actions.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/app/(app)/admin/crm/__tests__/actions.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Profile } from "@/lib/types";

vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
vi.mock("@/lib/queries", () => ({ getCurrentProfile: vi.fn() }));

import { getCurrentProfile } from "@/lib/queries";
const mockGetCurrentProfile = getCurrentProfile as ReturnType<typeof vi.fn>;

const adminProfile: Profile = { id: "admin-1", name: "Admin", email: "admin@x.co", role: "admin" };
const studentProfile: Profile = { id: "s-1", name: "Alex", email: "a@x.co", role: "student" };

describe("sendLeadEmail", () => {
  beforeEach(() => vi.resetModules());

  it("throws Forbidden when called by a student", async () => {
    mockGetCurrentProfile.mockResolvedValue(studentProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    await expect(sendLeadEmail(new FormData())).rejects.toThrow("Forbidden");
  });

  it("redirects to ?sent=1 for an admin in mock mode", async () => {
    mockGetCurrentProfile.mockResolvedValue(adminProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    const fd = new FormData();
    fd.set("lead_id", "lead-1");
    fd.set("subject", "Hello");
    fd.set("body", "A message");
    await expect(sendLeadEmail(fd)).rejects.toThrow("REDIRECT:/admin/crm/leads/lead-1?sent=1");
  });

  it("redirects with an error when subject/body are missing", async () => {
    mockGetCurrentProfile.mockResolvedValue(adminProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    const fd = new FormData();
    fd.set("lead_id", "lead-1");
    await expect(sendLeadEmail(fd)).rejects.toThrow(/REDIRECT:\/admin\/crm\/leads\/lead-1\?error=/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run "src/app/(app)/admin/crm/__tests__/actions.test.ts"`
Expected: FAIL — `sendLeadEmail` is not exported.

- [ ] **Step 3: Implement the action**

Append to `src/app/(app)/admin/crm/actions.ts` (the file already imports `revalidatePath`, `redirect`, `getCurrentProfile`, `isAdmin`, `IS_MOCK`, and defines `guardCrm`, `str`, `toIso`):

```ts
// ---------------------------------------------------------------------------
// Send an outreach email to a lead (via Resend) and log it as an activity.
// ---------------------------------------------------------------------------
export async function sendLeadEmail(formData: FormData): Promise<void> {
  const profile = await guardCrm();
  const leadId = str(formData, "lead_id");
  if (!leadId) throw new Error("Missing lead id");

  const subject = str(formData, "subject");
  const body = str(formData, "body");
  if (!subject || !body) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent("Subject and message are required")}`);
  }
  const followUpAt = toIso(formData, "follow_up_at");

  if (IS_MOCK) {
    revalidatePath(`/admin/crm/leads/${leadId}`);
    redirect(`/admin/crm/leads/${leadId}?sent=1`);
  }

  const { getLeadById } = await import("@/lib/crm");
  const lead = await getLeadById(leadId);
  if (!lead || !lead.email) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent("This lead has no email address")}`);
  }

  const { sendEmail } = await import("@/lib/email");
  const res = await sendEmail({ to: lead.email, subject, text: body });
  if (!res.ok) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(res.error ?? "Send failed")}`);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const now = new Date().toISOString();
  await supabase.from("lead_activities").insert({
    lead_id: leadId,
    user_id: profile.id,
    type: "email",
    direction: "outbound",
    outcome: "no_response",
    notes: subject,
    occurred_at: now,
    follow_up_at: followUpAt,
  });
  await supabase
    .from("leads")
    .update({ last_contacted_at: now, next_follow_up_at: followUpAt })
    .eq("id", leadId);

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/leads/${leadId}`);
  redirect(`/admin/crm/leads/${leadId}?sent=1`);
}
```

Note: `redirect()` returns `never`, so after the `if (!subject || !body)` guard, TypeScript narrows `subject`/`body` to `string`; after the `if (!lead || !lead.email)` guard, `lead.email` is `string`. No non-null assertions needed.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run "src/app/(app)/admin/crm/__tests__/actions.test.ts"`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add "src/app/(app)/admin/crm/actions.ts" "src/app/(app)/admin/crm/__tests__/actions.test.ts"
git commit -m "feat(crm): add sendLeadEmail action (send via Resend + log activity)"
```

---

### Task 4: `SendEmailForm` client component

**Files:**
- Create: `src/components/crm/SendEmailForm.tsx`

(No unit test — mirrors the untested `LogActivityForm` client component; verified via the mock-mode walkthrough in Task 6.)

- [ ] **Step 1: Create the component**

Create `src/components/crm/SendEmailForm.tsx` (FIELD/LABEL constants copied from `LogActivityForm.tsx` for visual consistency):

```tsx
"use client";

import { useState } from "react";
import { sendLeadEmail } from "@/app/(app)/admin/crm/actions";

const FIELD =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm text-ua-ink focus:border-ua-blue focus:outline-none";
const LABEL = "text-[11px] font-bold uppercase tracking-widest text-ua-ink/50";

export interface RenderedTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

export function SendEmailForm({
  leadId,
  hasEmail,
  templates,
}: {
  leadId: string;
  hasEmail: boolean;
  templates: RenderedTemplate[];
}) {
  const first = templates[0];
  const [subject, setSubject] = useState(first?.subject ?? "");
  const [body, setBody] = useState(first?.body ?? "");

  function pick(id: string) {
    const t = templates.find((x) => x.id === id);
    if (t) {
      setSubject(t.subject);
      setBody(t.body);
    }
  }

  return (
    <form action={sendLeadEmail} className="space-y-4">
      <input type="hidden" name="lead_id" value={leadId} />

      <div className="flex flex-col gap-1">
        <label htmlFor="template" className={LABEL}>Template</label>
        <select id="template" defaultValue={first?.id} onChange={(e) => pick(e.target.value)} className={FIELD}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="subject" className={LABEL}>Subject</label>
        <input id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className={FIELD} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="body" className={LABEL}>Message</label>
        <textarea id="body" name="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} required className={`${FIELD} resize-y`} />
      </div>

      <div className="flex flex-col gap-1 sm:max-w-xs">
        <label htmlFor="follow_up_at" className={LABEL}>Schedule follow-up (optional)</label>
        <input id="follow_up_at" name="follow_up_at" type="datetime-local" className={FIELD} />
      </div>

      <div className="flex items-center justify-end gap-3">
        {!hasEmail && <span className="text-xs text-ua-ink/50">Add an email to this lead to send.</span>}
        <button
          type="submit"
          disabled={!hasEmail}
          className="rounded-full border-2 border-ua-ink bg-ua-blue px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Send email
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors from this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/crm/SendEmailForm.tsx
git commit -m "feat(crm): add SendEmailForm compose component"
```

---

### Task 5: Wire the form into the lead detail page

**Files:**
- Modify: `src/app/(app)/admin/crm/leads/[id]/page.tsx`

- [ ] **Step 1: Add imports**

After the existing `LogActivityForm` import (around line 14), add:

```tsx
import { SendEmailForm } from "@/components/crm/SendEmailForm";
import { OUTREACH_TEMPLATES, renderTemplate } from "@/lib/outreach-templates";
```

- [ ] **Step 2: Compute rendered templates + read the new query params**

After `const saved = sp.saved === "1";` (around line 42), add:

```tsx
  const sent = sp.sent === "1";
  const error = typeof sp.error === "string" ? sp.error : null;
  const emailTemplates = OUTREACH_TEMPLATES.map((t) => ({
    id: t.id,
    label: t.label,
    ...renderTemplate(t, lead),
  }));
```

- [ ] **Step 3: Extend the success banner + add an error banner**

Replace the existing banner block:

```tsx
      {(logged || saved) && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-green p-4 text-sm font-semibold text-ua-ink">
          {logged ? "Outreach logged — the team can see it now." : "Lead updated."}
        </div>
      )}
```

with:

```tsx
      {(logged || saved || sent) && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-green p-4 text-sm font-semibold text-ua-ink">
          {logged
            ? "Outreach logged — the team can see it now."
            : sent
              ? "Email sent — logged to this lead's timeline."
              : "Lead updated."}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-orange p-4 text-sm font-semibold text-white">
          {error}
        </div>
      )}
```

- [ ] **Step 4: Add the "send email" section**

In the main column (`lg:col-span-2`), immediately before the `{/* Log outreach */}` section, add:

```tsx
          {/* Send email */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-4 text-xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                send email
              </h2>
              <SendEmailForm leadId={lead.id} hasEmail={Boolean(lead.email)} templates={emailTemplates} />
            </section>
          </Reveal>
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add "src/app/(app)/admin/crm/leads/[id]/page.tsx"
git commit -m "feat(crm): add send-email section + sent/error banners to lead page"
```

---

### Task 6: Full verification

**Files:** none (verification); may modify the spec status line.

- [ ] **Step 1: Run the whole test suite**

Run: `npx vitest run`
Expected: PASS, including the 3 new test files.

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual mock-mode walkthrough**

Run: `NEXT_PUBLIC_MOCK_ADMIN=1 npm run dev` then open `/admin/crm/leads/lead-1`. Confirm: the **send email** section renders; choosing a template fills subject + body (merged with the lead's company/contact); editing works; **Send email** redirects back with the green "Email sent" banner; an email activity appears in the timeline (mock mode does not send a real email). Open `lead-3` (or any lead without an email) and confirm the button is disabled with the hint.

- [ ] **Step 4: Update the spec status + commit**

Edit `docs/superpowers/specs/2026-06-17-resend-crm-outreach-design.md` status line to `Implemented`.

```bash
git add docs/superpowers/specs/2026-06-17-resend-crm-outreach-design.md
git commit -m "docs(crm): mark Resend outreach spec implemented"
```

- [ ] **Step 5: Push**

```bash
git push
```

---

## Post-implementation checklist (operational, outside this plan)
- In Resend, **verify a sending domain** and set `RESEND_FROM` to an address on it (or use `onboarding@resend.dev` to test to your own account email). Add `STRIPE_WEBHOOK_SECRET` if you intend to run the app in non-mock mode.
- **Roll the Resend + Stripe keys** that were shared in chat and add the fresh ones to `.env.local` and Vercel.
- A real end-to-end send (not mock) requires the other required env vars in `env.server.ts` to be present.
