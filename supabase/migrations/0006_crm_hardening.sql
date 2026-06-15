-- Security hardening: pin search_path on SECURITY DEFINER / trigger functions
-- so they can't be hijacked via a mutable search_path (Supabase linter 0011).

create or replace function is_crm_owner() returns boolean
  language sql security definer stable
  set search_path = public as $$
  select exists(
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and crm_role = 'owner'
  );
$$;

create or replace function touch_leads_updated_at() returns trigger
  language plpgsql
  set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Harden the pre-existing helpers too (same warning).
create or replace function is_admin() returns boolean
  language sql security definer stable
  set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function max_unlocked_day() returns int
  language sql security definer stable
  set search_path = public as $$
  select coalesce(max(
    least(5, greatest(0, (current_date - c.start_date)::int + 1))
  ), 0)
  from enrollments e
  join cohorts c on c.id = e.cohort_id
  where e.user_id = auth.uid() and e.status = 'active';
$$;
