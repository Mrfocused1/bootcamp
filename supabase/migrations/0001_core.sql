-- Urban AI learning app — core schema
create type user_role as enum ('student','admin');
create type enrollment_status as enum ('active','revoked');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text not null,
  role user_role not null default 'student',
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  created_at timestamptz default now()
);

create table enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  cohort_id uuid not null references cohorts(id),
  status enrollment_status not null default 'active',
  enrolled_at timestamptz default now(),
  unique (user_id, cohort_id)
);

create table days (
  id uuid primary key default gen_random_uuid(),
  day_index int not null unique check (day_index between 1 and 5),
  title text not null,
  description text
);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references days(id) on delete cascade,
  title text not null,
  video_provider text,
  video_id text,
  duration_seconds int default 0,
  resources jsonb default '[]'::jsonb,
  "order" int not null default 0
);

create table lesson_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  last_position_seconds int default 0,
  watched_percent int default 0,
  completed boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

create table live_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references cohorts(id) on delete cascade,
  day_index int not null,
  scheduled_at timestamptz not null,
  zoom_url text,
  reminded_at timestamptz
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  title text not null,
  body text,
  created_at timestamptz default now()
);
