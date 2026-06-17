# Wave 3 — Real-Mode Admin Data Writes + Analytics — Design Spec

- **Date:** 2026-06-17
- **Status:** Approved (fix-all mandate; user chose "wire it all now")
- **Author:** Paul (Bridgeway Ai Bootcamp) with Claude

## Context
The student-LMS admin actions in `src/app/(app)/admin/actions.ts` are **stubbed**: in mock
mode they `revalidatePath`; in real mode they are no-ops (commented-out write stubs). The
analytics reads (`getStudents`, `getDayFunnel` in `src/lib/queries.ts`) fall back to mock
data even in real mode. Meanwhile the Supabase schema is **fully provisioned** (12 tables,
all empty), and the CRM (`admin/crm/actions.ts`) already proves the real-mode write pattern
in this codebase. This wave wires the student-admin actions + analytics to real Supabase,
following the established pattern.

`IS_MOCK = !NEXT_PUBLIC_SUPABASE_URL` (`src/lib/mock.ts`); mock mode must stay a no-op so
local review (`NEXT_PUBLIC_MOCK_ADMIN=1`) is unaffected.

## Goal
When an admin uses the content / students / cohorts / announcements / broadcast / analytics
screens **in production (real mode)**, the changes persist to Supabase and the analytics
screens show real numbers — without changing mock-mode behaviour or any public surface.

## Client choice — service-role, gated in code
All writes use the **service-role admin client** `createAdminClient()` (`src/lib/supabase/admin.ts`,
already used by the recordings feature; `SUPABASE_SERVICE_ROLE_KEY` confirmed present in
Vercel Production). Each action is gated by the existing `guardAdmin()` (throws `Forbidden`
for non-admins), so authorization is enforced in code and we don't depend on per-table RLS
write policies existing. This matches `confirmRecording`/`deleteRecordingAction`.

## In scope

### A. Write actions (`src/app/(app)/admin/actions.ts`)
Add local `str(formData,key)` and `toIso(formData,key)` helpers (copy of the CRM file's
helpers). Then wire, each: `await guardAdmin()` → `if (IS_MOCK) { revalidatePath; return }`
→ `createAdminClient()` → write → `revalidatePath`.

1. **saveLesson** — UPDATE `lessons` by hidden `id`: `{ title, video_provider, video_id }`.
2. **setAccess(userId, status)** — UPDATE `enrollments` `{ status }` `.eq("user_id", userId)`.
3. **saveCohort** — INSERT `cohorts` `{ name, start_date }` (date input → 'YYYY-MM-DD').
4. **saveLiveSession** — `live_sessions.cohort_id` is NOT NULL and the form has no cohort
   field → look up the latest cohort (`order by start_date desc limit 1`); if none, no-op
   revalidate (nothing to attach to). INSERT `{ cohort_id, day_index:Number(...), scheduled_at:toIso, zoom_url }`.
5. **postAnnouncement** — INSERT `announcements` `{ title, body }` (`cohort_id` left null).
6. **nudgeStudent(userId)** — fetch `profiles.{name,email}` by id; `sendEmail({to,subject,text})`
   (warm Bridgeway nudge). Return `{ ok }`.
7. **sendBroadcast(formData)** — read `recipient_type` (all|cohort), `cohort` (id), `subject`,
   `body`. Recipients = active enrollments' student emails (join `enrollments → profiles`),
   filtered by cohort when `recipient_type==="cohort"`. Fan out `sendEmail` per recipient.
   Return `{ ok:true, recipients: emails.length }`.

### B. Analytics views + read wiring
- **Migration** (`apply_migration`, applied by the controller via the Supabase MCP) creates
  two **read-only views**:
  - `student_summaries(profile jsonb, cohort jsonb, overall_percent int)` — one row per
    active student+cohort; `overall_percent = round(sum(watched_percent)/total_lessons)`.
  - `day_funnel(day int, started int, completed int)` — per day_index, distinct students with
    any watched lesson vs completed.
  - `revoke all ... from anon, authenticated` on both (so they are **not** exposed via
    PostgREST to logged-in non-admins; only the service-role client reads them).
- Wire `getStudents()` and `getDayFunnel()` (`src/lib/queries.ts`) to read those views via
  `createAdminClient()` (real mode); mock branch unchanged. Run `get_advisors` after the
  migration and resolve any security finding.

## Out of scope (explicitly deferred)
- **Q&A reply/resolve** (`replyToQuestion`, `markResolved`): `ai_messages` has no `parent_id`
  /`resolved` columns and its `role` CHECK only allows `user`/`assistant`. Needs a schema
  migration **and** there are no real questions until the AI assistant exists. Left as the
  current graceful `{ ok:true }` no-op; bundled into **Wave 4**.
- **Pre-existing real-mode read bugs** (flagged, fixed in Wave 4): `getProgressMap()` queries
  a non-existent `progress` table (should be `lesson_progress`); `getLessons()` selects
  `topics`/`day_index` columns that aren't on `lessons` (day_index is on `days`; `topics`
  doesn't exist). These break student-facing reads in real mode — Wave 4.
- **Content seeding** (days/lessons skeleton, a starter cohort): operational data, offered as
  a follow-up — not a code fix. The content admin only *edits* lessons; there's no create-day
  flow, so lessons must be seeded before `saveLesson` has anything to act on.
- Recordings actions (already implemented). The `admin/broadcast/page.tsx` `handleSend`
  wrapper (stays; just calls the now-real `sendBroadcast`).

## Error handling & mock mode
- Mock mode: every action keeps its existing `revalidatePath`/return — no Supabase, no email.
- Writes are best-effort like the CRM (no throw on Postgres error beyond what the CRM does);
  `nudgeStudent`/`sendBroadcast` rely on `sendEmail` which never throws (returns `{ok:false}`).
- `saveLiveSession` with no cohort yet → revalidate + return (no crash).

## Testing
Vitest, mocking `@/lib/supabase/admin` (`createAdminClient` → fake with chainable
`from().update()/.insert()/.select()...`), `@/lib/email` (`sendEmail`), `@/lib/queries`
(`getCurrentProfile` → admin), and `@/lib/mock` (`IS_MOCK`). Per action assert: mock mode does
NOT call the client; real mode calls the right table + payload; `setAccess` filters by
`user_id`; `sendBroadcast` returns the recipient count; `nudgeStudent` calls `sendEmail` to the
fetched address. Analytics: real mode reads the view and maps `overall_percent → overallPercent`.
Use `vi.hoisted` for shared mock fns (Vitest 4). `tsc` + `npm run build` green.

## Constraints / risks
- **Modified Next.js 16 (`AGENTS.md`):** read `node_modules/next/dist/docs` (Server Actions,
  `revalidatePath`, async params) before coding.
- **Service-role client is server-only** — never import it into a client component. Actions
  are `"use server"`; queries.ts is server-only. Keep it that way.
- **View exposure:** the two views bypass RLS by design → MUST stay revoked from
  anon/authenticated and be read only by the service-role client. Verify with `get_advisors`.
- Empty DB: every wired action is correct but has no visible effect until content + students
  exist. That's expected and was accepted by the user.
