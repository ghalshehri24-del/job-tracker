-- Paste this entire file into Supabase → SQL Editor → New query, then Run.
-- Safe to re-run: every statement is guarded.

create extension if not exists "pgcrypto";

-- ---------- table ----------
create table if not exists public.jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  company     text not null,
  title       text not null,
  location    text default '',
  type        text not null default 'full_time'
              check (type in ('internship','full_time','part_time','remote','contract')),
  date        date,
  status      text not null default 'no_response'
              check (status in ('no_response','interview','offer','rejected')),
  source      text default '',
  contact     text default '',
  notes       text default '',
  follow_up   date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists jobs_user_id_idx
  on public.jobs (user_id, created_at desc);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

-- ---------- row-level security ----------
alter table public.jobs enable row level security;

drop policy if exists "jobs_select_own" on public.jobs;
create policy "jobs_select_own"
  on public.jobs for select
  using (auth.uid() = user_id);

drop policy if exists "jobs_insert_own" on public.jobs;
create policy "jobs_insert_own"
  on public.jobs for insert
  with check (auth.uid() = user_id);

drop policy if exists "jobs_update_own" on public.jobs;
create policy "jobs_update_own"
  on public.jobs for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "jobs_delete_own" on public.jobs;
create policy "jobs_delete_own"
  on public.jobs for delete
  using (auth.uid() = user_id);
