-- Urban AI learning app — access helpers + Row-Level Security

-- is the current user an admin?
create or replace function is_admin() returns boolean
  language sql security definer stable as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- highest unlocked day_index for the current user (drip rule).
-- Day N unlocks on cohort.start_date + (N-1) days; clamped to 0..5.
create or replace function max_unlocked_day() returns int
  language sql security definer stable as $$
  select coalesce(max(
    least(5, greatest(0, (current_date - c.start_date)::int + 1))
  ), 0)
  from enrollments e
  join cohorts c on c.id = e.cohort_id
  where e.user_id = auth.uid() and e.status = 'active';
$$;

alter table profiles        enable row level security;
alter table cohorts         enable row level security;
alter table enrollments     enable row level security;
alter table days            enable row level security;
alter table lessons         enable row level security;
alter table lesson_progress enable row level security;
alter table ai_messages     enable row level security;
alter table live_sessions   enable row level security;
alter table announcements   enable row level security;

-- profiles: self read/update; admin all
create policy p_self     on profiles for select using (id = auth.uid() or is_admin());
create policy p_self_upd on profiles for update using (id = auth.uid() or is_admin());
create policy p_admin    on profiles for all    using (is_admin()) with check (is_admin());

-- days / lessons: only days the student has unlocked; admin all
create policy d_read on days for select
  using (is_admin() or day_index <= max_unlocked_day());
create policy l_read on lessons for select
  using (is_admin() or exists(
    select 1 from days d where d.id = lessons.day_id and d.day_index <= max_unlocked_day()));
create policy d_admin on days    for all using (is_admin()) with check (is_admin());
create policy l_admin on lessons for all using (is_admin()) with check (is_admin());

-- lesson_progress: own rows; admin read
create policy lp_rw on lesson_progress for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());

-- ai_messages: own rows; admin read
create policy ai_rw on ai_messages for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid());

-- enrollments / cohorts: own/related read; admin write
create policy e_read  on enrollments for select using (user_id = auth.uid() or is_admin());
create policy e_admin on enrollments for all    using (is_admin()) with check (is_admin());
create policy c_read  on cohorts for select
  using (is_admin() or exists(
    select 1 from enrollments e where e.cohort_id = cohorts.id and e.user_id = auth.uid()));
create policy c_admin on cohorts for all using (is_admin()) with check (is_admin());

-- live_sessions: enrolled students read; admin write
create policy ls_read  on live_sessions for select
  using (is_admin() or exists(
    select 1 from enrollments e where e.cohort_id = live_sessions.cohort_id and e.user_id = auth.uid()));
create policy ls_admin on live_sessions for all using (is_admin()) with check (is_admin());

-- announcements: global or enrolled-cohort read; admin write
create policy an_read on announcements for select
  using (is_admin() or cohort_id is null or exists(
    select 1 from enrollments e where e.cohort_id = announcements.cohort_id and e.user_id = auth.uid()));
create policy an_admin on announcements for all using (is_admin()) with check (is_admin());
