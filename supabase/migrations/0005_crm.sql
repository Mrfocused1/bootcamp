-- Bridgeway AI Bootcamp — sales CRM / lead tracker
-- Adds: a CRM role on profiles (owner | staff), a leads table (potential clients),
-- and a lead_activities table (outreach + follow-ups). All CRM users (admins) can
-- read/write the shared pipeline so the team never double-contacts the same person.

-- ---------------------------------------------------------------------------
-- CRM role on profiles
-- ---------------------------------------------------------------------------
-- 'owner' = co-owner (full pipeline + website analytics)
-- 'staff' = employee (logs and tracks their own + the team's outreach)
-- NULL    = not a CRM user
create type crm_role as enum ('owner','staff');
alter table profiles add column crm_role crm_role;

-- ---------------------------------------------------------------------------
-- Leads (potential clients)
-- ---------------------------------------------------------------------------
create table leads (
  id              uuid primary key default gen_random_uuid(),
  company         text not null,
  website         text,
  contact_name    text,
  email           text,
  phone           text,
  -- pipeline stage
  status          text not null default 'new'
                    check (status in ('new','contacted','qualified','proposal','won','lost')),
  source          text not null default 'other'
                    check (source in ('referral','cold_outreach','inbound','social','event','other')),
  priority        text not null default 'medium'
                    check (priority in ('low','medium','high')),
  est_value       numeric(12,2) default 0,
  -- the team member who "owns" this lead (prevents double-contact)
  assigned_to     uuid references profiles(id) on delete set null,
  created_by      uuid references profiles(id) on delete set null,
  notes           text,
  -- denormalised next follow-up (kept in sync when an activity sets one)
  next_follow_up_at timestamptz,
  last_contacted_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index leads_status_idx       on leads (status);
create index leads_assigned_to_idx  on leads (assigned_to);
create index leads_follow_up_idx    on leads (next_follow_up_at);
-- guard against logging the same potential client twice (case-insensitive)
create unique index leads_website_uniq on leads (lower(website)) where website is not null and website <> '';
create unique index leads_email_uniq   on leads (lower(email))   where email   is not null and email   <> '';

-- ---------------------------------------------------------------------------
-- Lead activities (outreach log + follow-ups)
-- ---------------------------------------------------------------------------
create table lead_activities (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references leads(id) on delete cascade,
  user_id       uuid references profiles(id) on delete set null,
  type          text not null
                  check (type in ('call','email','meeting','linkedin','sms','note')),
  direction     text default 'outbound'
                  check (direction in ('outbound','inbound')),
  outcome       text
                  check (outcome in (
                    'connected','no_answer','voicemail','replied','bounced',
                    'meeting_booked','interested','not_interested','no_response')),
  notes         text,            -- "what happened"
  occurred_at   timestamptz not null default now(),
  follow_up_at  timestamptz,     -- when to follow up next (NULL = none)
  created_at    timestamptz not null default now()
);

create index lead_activities_lead_idx       on lead_activities (lead_id);
create index lead_activities_user_idx       on lead_activities (user_id);
create index lead_activities_follow_up_idx  on lead_activities (follow_up_at);
create index lead_activities_occurred_idx   on lead_activities (occurred_at desc);

-- ---------------------------------------------------------------------------
-- keep leads.updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function touch_leads_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on leads
  for each row execute function touch_leads_updated_at();

-- ---------------------------------------------------------------------------
-- Row-Level Security — every admin (owner or staff) shares the pipeline.
-- Only owners may delete leads. is_admin() is defined in 0002_rls.sql.
-- ---------------------------------------------------------------------------
create or replace function is_crm_owner() returns boolean
  language sql security definer stable as $$
  select exists(
    select 1 from profiles
    where id = auth.uid() and role = 'admin' and crm_role = 'owner'
  );
$$;

alter table leads           enable row level security;
alter table lead_activities enable row level security;

-- leads: any admin can read + create + update; only owners delete
create policy leads_read   on leads for select using (is_admin());
create policy leads_insert on leads for insert with check (is_admin());
create policy leads_update on leads for update using (is_admin()) with check (is_admin());
create policy leads_delete on leads for delete using (is_crm_owner());

-- activities: any admin can read the whole team's log + create; authors/owners update/delete
create policy la_read   on lead_activities for select using (is_admin());
create policy la_insert on lead_activities for insert with check (is_admin());
create policy la_update on lead_activities for update
  using (user_id = auth.uid() or is_crm_owner())
  with check (user_id = auth.uid() or is_crm_owner());
create policy la_delete on lead_activities for delete
  using (user_id = auth.uid() or is_crm_owner());
