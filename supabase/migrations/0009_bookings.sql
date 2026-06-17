-- A student's chosen 5-day schedule (start date + daily time). One per student.
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  start_date date not null,
  daily_time text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bookings enable row level security;
create policy bookings_owner_all on public.bookings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy bookings_admin_read on public.bookings
  for select using (public.is_admin());
