-- Session recordings: one row per recorded live session, stored privately in
-- Cloudflare R2 (we keep only the object key; playback uses short-lived signed
-- URLs minted server-side after an enrolment check). Gated to the cohort's
-- enrolled students; managed by admins. Mirrors the live_sessions policy.

create table if not exists session_recordings (
  id                uuid primary key default gen_random_uuid(),
  cohort_id         uuid not null references cohorts(id) on delete cascade,
  day_index         int  not null check (day_index between 1 and 5),
  title             text not null,
  object_key        text not null,            -- R2 object key
  duration_seconds  int  not null default 0,
  recorded_at       timestamptz not null default now(),
  created_at        timestamptz not null default now()
);

create index if not exists session_recordings_cohort_day_idx
  on session_recordings (cohort_id, day_index);

alter table session_recordings enable row level security;

-- Enrolled students of the cohort can read; admins can read everything.
create policy sr_read on session_recordings for select
  using (
    is_admin() or exists (
      select 1 from enrollments e
      where e.cohort_id = session_recordings.cohort_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  );

-- Only admins can create / update / delete.
create policy sr_admin on session_recordings for all
  using (is_admin()) with check (is_admin());
