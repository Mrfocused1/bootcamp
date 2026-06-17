# Wave 3 — Real-Mode Admin Writes + Analytics — Implementation Plan

> **For agentic workers:** execute task-by-task with review. Steps use checkbox syntax.

**Goal:** Wire the stubbed student-admin actions + analytics reads to real Supabase
(service-role client, `guardAdmin`-gated), mock mode unchanged.

**Architecture:** Each action: `guardAdmin()` → `if (IS_MOCK) {revalidatePath; return}` →
`createAdminClient()` → write → `revalidatePath`. Analytics via two read-only SQL views read
through the service-role client (revoked from anon/authenticated).

**Tech Stack:** Next.js 16 (modified), `@supabase/supabase-js` service-role, Resend, Vitest.

**Branch:** `feat/wave3-admin-writes`.

---

### Task 0: Pre-flight
- [ ] `ls node_modules/next/dist/docs/`; skim Server Actions + `revalidatePath`. Confirm
  `createAdminClient` (`src/lib/supabase/admin.ts`) and `sendEmail({to,subject,text,replyTo?})`
  (`src/lib/email.ts`) signatures. Confirm `guardAdmin()` + `str`/`toIso` (copy from
  `admin/crm/actions.ts:22-35`).

---

### Task 1: Analytics views migration (controller applies via Supabase MCP)
Apply this migration (`apply_migration`, name `wave3_admin_analytics_views`):
```sql
create or replace view public.student_summaries as
with progress_rollup as (
  select e.user_id, e.cohort_id,
    coalesce(round(sum(lp.watched_percent)::numeric
      / nullif((select count(*) from public.lessons), 0)), 0)::int as overall_percent
  from public.enrollments e
  left join public.lesson_progress lp on lp.user_id = e.user_id
  where e.status = 'active'
  group by e.user_id, e.cohort_id
)
select to_jsonb(p) as profile, to_jsonb(c) as cohort, pr.overall_percent
from progress_rollup pr
join public.profiles p on p.id = pr.user_id and p.role = 'student'
join public.cohorts c on c.id = pr.cohort_id;

create or replace view public.day_funnel as
select d.day_index as day,
  count(distinct lp.user_id) filter (where coalesce(lp.watched_percent,0) > 0) as started,
  count(distinct lp.user_id) filter (where lp.completed) as completed
from public.days d
left join public.lessons l on l.day_id = d.id
left join public.lesson_progress lp on lp.lesson_id = l.id
group by d.day_index order by d.day_index;

revoke all on public.student_summaries from anon, authenticated;
revoke all on public.day_funnel from anon, authenticated;
```
- [ ] Apply, then `get_advisors(type:security)` → resolve any view finding. Verify both
  views `select` cleanly (return 0 rows on the empty DB, no error).

---

### Task 2: Write actions (`src/app/(app)/admin/actions.ts`)
Add `str`/`toIso` helpers (copy of CRM). Replace the 7 stub bodies with the real-mode code
(full code in the design spec's In-Scope section). Pattern for each: guard → IS_MOCK return →
`const { createAdminClient } = await import("@/lib/supabase/admin"); const supabase = createAdminClient();`
→ write → `revalidatePath`.

- saveLesson → `lessons.update({title,video_provider,video_id}).eq("id", id)` (id from hidden field; no id → revalidate+return).
- setAccess(userId,status) → `enrollments.update({status}).eq("user_id", userId)`.
- saveCohort → `cohorts.insert({name, start_date})`.
- saveLiveSession → look up latest cohort (`cohorts.select("id").order("start_date",{ascending:false}).limit(1).maybeSingle()`); none → revalidate+return; else `live_sessions.insert({cohort_id, day_index:Number||1, scheduled_at:toIso, zoom_url})`.
- postAnnouncement → `announcements.insert({title, body})`.
- nudgeStudent(userId) → `profiles.select("name,email").eq("id",userId).maybeSingle()`; no email → `{ok:false}`; else `sendEmail(...)` → `{ok:res.ok}`.
- sendBroadcast(formData) → read `recipient_type`,`cohort`,`subject`,`body`; `enrollments.select("profiles(email)").eq("status","active")` (+`.eq("cohort_id",cohort)` when recipient_type==="cohort"); fan out `sendEmail` per email; return `{ok:true, recipients:emails.length}`.

Leave `replyToQuestion`/`markResolved` unchanged (deferred). Leave recordings actions unchanged.

- [ ] Implement. `npx tsc --noEmit` clean.

---

### Task 3: Analytics read wiring (`src/lib/queries.ts`)
- [ ] `getStudents()` real branch → `createAdminClient()` → `from("student_summaries").select("profile, cohort, overall_percent")` → map `overall_percent → overallPercent`.
- [ ] `getDayFunnel()` real branch → `createAdminClient()` → `from("day_funnel").select("day, started, completed")` → return as `DayFunnelEntry[]` (drop the mock fallback).

---

### Task 4: Tests (`src/app/(app)/admin/__tests__/actions.test.ts`)
Chainable `createAdminClient` mock (records `from`/`insert`/`update`/`eq`/`select` calls;
thenable + `maybeSingle` resolve configured per-table data). Mock `@/lib/email` (`sendEmail`),
`@/lib/queries` (`getCurrentProfile`→admin), `next/cache` (`revalidatePath`), and `@/lib/mock`
(mutable `IS_MOCK` via `vi.hoisted`). Assert: mock mode → no client call; real mode → correct
table + payload; `setAccess` `.eq("user_id",…)`; `saveLiveSession` attaches latest cohort id;
`sendBroadcast` returns recipient count; `nudgeStudent` emails the fetched address; mock-mode
`sendBroadcast` returns 20. Analytics: extend `queries` tests for the view reads + mapping.

- [ ] `npx vitest run` all green. `npx tsc --noEmit`. `npm run build`.

---

### Task 5: Verify + ship (controller)
- [ ] Two-stage review (spec compliance, then code quality); fix findings.
- [ ] Commit; merge `feat/wave3-admin-writes` → main (ff); deploy; smoke check `/admin` still
  gated, `/` + webhook still public; confirm the views read in prod (service-role).
