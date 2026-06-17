-- Wave 3 — admin analytics views (read-only).
-- Read only by the service-role client (admin analytics + students screens);
-- revoked from anon/authenticated so they are never exposed to non-admins via
-- PostgREST. Both bypass RLS by design, hence the revoke.

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
  count(distinct lp.user_id) filter (where coalesce(lp.watched_percent, 0) > 0) as started,
  count(distinct lp.user_id) filter (where lp.completed) as completed
from public.days d
left join public.lessons l on l.day_id = d.id
left join public.lesson_progress lp on lp.lesson_id = l.id
group by d.day_index
order by d.day_index;

revoke all on public.student_summaries from anon, authenticated;
revoke all on public.day_funnel from anon, authenticated;
