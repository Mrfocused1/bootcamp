# Resend CRM Outreach — Design Spec

- **Date:** 2026-06-17
- **Status:** Approved (pending spec review)
- **Author:** Paul (Bridgeway Ai Bootcamp) with Claude

## Context

Bridgeway runs cold/warm outreach to community charities and CICs (website-build
pitches and AI-workshop pitches). Those leads are tracked in the CRM at
`/admin/crm`. Today the only way to email a lead is to copy a draft out of a chat
and paste it into a personal inbox; the send is then logged by hand (if at all).

The app already has the `resend` package installed and `env.server.ts` requires
`RESEND_API_KEY` + `RESEND_FROM`, but **no email is actually sent anywhere** —
`admin/actions.ts` only has commented-out stubs referencing a `@/lib/email`
module that does not exist.

## Goal

Let an admin send an outreach email to a CRM lead **from the lead's page**,
starting from a reusable template, editing it, and sending via Resend — and have
that send automatically recorded in the lead's activity timeline.

### In scope
- A reusable Resend send helper (`lib/email.ts`).
- Outreach templates in code (`lib/outreach-templates.ts`) with merge fields +
  auto-appended Bridgeway footer. Seeded with two: **Website pitch** and
  **AI-workshop pitch**.
- A **compose-and-edit** send flow on the lead detail page (single lead).
- On successful send: insert a `lead_activities` row (`type: "email"`,
  `direction: "outbound"`) and update the lead's `last_contacted_at` /
  `next_follow_up_at`, reusing the existing `logActivity` pattern.
- Mock-mode and error handling consistent with the rest of the CRM.
- Unit tests.

### Out of scope (YAGNI)
- Bulk / multi-lead send.
- Database-managed templates + template CRUD UI.
- Open/click tracking, scheduling, sequences.
- Wiring the other stubbed features (student broadcast, at-risk nudges) — though
  `lib/email` is built to be reusable by them later.
- HTML emails (we send plain text).

## Approach

**Approach A (chosen):** templates as code constants + a compose form on the
lead page + a new server action that sends via Resend and logs an activity.
Smallest new surface, mirrors existing CRM patterns, no new DB tables.

Rejected: (B) DB-managed templates — more flexible but adds a table, migration
and CRUD UI we don't need yet (the body is editable per-send anyway); (C) Resend
Broadcasts/audiences — works against the per-lead personal style.

## Architecture & components

### 1. `src/lib/email.ts` (new)
Thin Resend wrapper, server-only.

```
interface SendEmailInput { to: string; subject: string; text: string; replyTo?: string }
interface SendEmailResult { ok: boolean; id?: string; error?: string; mocked?: boolean }
async function sendEmail(input: SendEmailInput): Promise<SendEmailResult>
```
- `IS_MOCK` → return `{ ok: true, mocked: true }` (no network call).
- Real → `new Resend(env.RESEND_API_KEY)`, `resend.emails.send({ from: env.RESEND_FROM, to, subject, text, replyTo })`.
- Never throws — maps SDK/network errors to `{ ok: false, error }`.
- **Impl note:** confirm the exact `resend` v6 field name for reply-to
  (`replyTo` vs `reply_to`) against the installed package's types before coding.

### 2. `src/lib/outreach-templates.ts` (new)
```
interface OutreachTemplate { id: string; label: string; subject: string; body: string }
const OUTREACH_TEMPLATES: OutreachTemplate[]   // seeded: "website-pitch", "ai-workshop"
function renderTemplate(t: OutreachTemplate, lead: Lead): { subject: string; body: string }
```
- Placeholders: `{{contact_name}}`, `{{company}}`, `{{website}}`.
- Greeting fallback: if `contact_name` is null, render "Dear {{company}} team,"
  instead of "Hi {{contact_name}},".
- `renderTemplate` always appends the standard footer:
  ```
  Warm regards,
  Paul
  Bridgeway Ai Bootcamp

  You can see more of the work we've done here: www.bridgewayaibootcamp.com/work
  ```
- Plain text only.

### 3. `sendLeadEmail(formData)` in `src/app/(app)/admin/crm/actions.ts` (new action)
- `guardCrm()` (admin only), mirroring the other actions.
- Reads `lead_id`, `subject`, `body`, optional `follow_up_at`.
- Loads the lead; if it has no `email`, redirect back with `?error=No email on this lead`.
- `IS_MOCK` → no send, `revalidatePath` + redirect `?sent=1`.
- Real:
  1. `sendEmail({ to: lead.email, subject, text: body, replyTo: REPLY_TO })`.
  2. If `!ok` → redirect `…/leads/{id}?error=<message>` (no activity logged).
  3. Insert `lead_activities`: `{ lead_id, user_id: profile.id, type: "email", direction: "outbound", outcome: "no_response", notes: subject, occurred_at: now, follow_up_at }`.
  4. Update lead: `last_contacted_at = now`, `next_follow_up_at = follow_up_at`.
  5. `revalidatePath` (`/admin/crm`, `…/leads/{id}`) + redirect `?sent=1`.
- `REPLY_TO`: defaults to `RESEND_FROM`; optional `RESEND_REPLY_TO` env can point
  replies at a monitored inbox. (Optional var; not added to the required schema.)

### 4. `src/components/crm/SendEmailForm.tsx` (new, client component)
- Props: `leadId`, lead display fields, and the **server-rendered** template
  options (`renderTemplate` is run on the server for this lead, so the client
  never re-implements merge logic): `{ id, label, subject, body }[]`.
- UI mirrors `LogActivityForm`: template `<select>` → sets `subject`/`body`
  state; editable `subject` `<input>` + `body` `<textarea>`; optional follow-up
  `datetime-local`; Send button. Button disabled (with a hint) if no lead email.
- Posts to `sendLeadEmail`.

### 5. Lead page integration — `src/app/(app)/admin/crm/leads/[id]/page.tsx`
- Render `SendEmailForm` (near `LogActivityForm`), passing the lead and the
  templates pre-rendered via `renderTemplate`.
- Show success/error banners from `?sent=1` / `?error=` (existing query-param
  pattern used by `?saved=1`, `?logged=1`).

## Data flow

Open lead → "Email" → pick template (auto-fills merged subject/body) → edit →
Send → `sendLeadEmail` → `sendEmail` (Resend) → on OK: log `email` activity +
bump `last_contacted_at`/follow-up → revalidate → back to lead `?sent=1`. The
email shows in the timeline like any other activity (✉️).

## Data model
No new tables. Reuses `leads` and `lead_activities` exactly as `logActivity` does.

## Error handling & mock mode
- Resend failure (e.g. unverified `RESEND_FROM` domain) → user returns to the
  lead with a clear `?error=` banner; nothing is logged.
- Mock mode sends nothing and logs nothing; just confirms `?sent=1`.
- No lead email → blocked in UI and re-checked in the action.

## Testing
- `renderTemplate`: placeholder merge, null-contact greeting fallback, footer appended.
- `sendEmail`: mock mode returns `{ ok, mocked }`; real mode (Resend client
  mocked) calls `emails.send` with the right args and maps `error`.
- `sendLeadEmail`: mock-mode path redirects `?sent=1` and writes nothing
  (mirrors `admin/__tests__/actions.test.ts` style).

## Setup / operational checklist
- Verify a sending domain in Resend and set `RESEND_FROM` to an address on it
  (or use `onboarding@resend.dev` for testing — delivers only to your own
  account email).
- (Optional) set `RESEND_REPLY_TO` to the inbox replies should land in.
- After the feature is tested, **roll the Resend + Stripe keys** that were shared
  in chat and add the fresh ones to `.env.local` (and Vercel).

## Constraints / risks
- **Modified Next.js (`AGENTS.md`):** this project's Next.js has breaking
  changes. Before writing code, read the relevant guides in
  `node_modules/next/dist/docs/` and follow current conventions for Server
  Actions, `revalidatePath`, and `redirect`.
- Verify the installed `resend` v6 SDK method/field names against its types.
- Deliverability depends on a verified Resend domain; until then real sends fail
  gracefully via the error path.
