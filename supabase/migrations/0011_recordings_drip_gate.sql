-- Drip-gate session recordings to the same cadence as lessons/live sessions:
-- an enrolled student may only read recordings for days that have already
-- unlocked for their cohort (day_index <= max_unlocked_day()). Without this,
-- a recording uploaded ahead of schedule would be readable before its day
-- unlocks. Admins keep their full bypass.

drop policy if exists sr_read on session_recordings;

create policy sr_read on session_recordings for select
  using (
    is_admin() or exists (
      select 1 from enrollments e
      where e.cohort_id = session_recordings.cohort_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
    and session_recordings.day_index <= public.max_unlocked_day()
  );
