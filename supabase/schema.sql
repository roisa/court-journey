-- Court Journey — cloud sync schema (free Supabase tier).
-- One JSON row per user, protected by Row-Level Security so each person can
-- only read/write their own journey. Run this once in the Supabase SQL editor.

create table if not exists public.journeys (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.journeys enable row level security;

-- A user can only see and modify their own row.
create policy "journeys_select_own"
  on public.journeys for select
  using (auth.uid() = user_id);

create policy "journeys_insert_own"
  on public.journeys for insert
  with check (auth.uid() = user_id);

create policy "journeys_update_own"
  on public.journeys for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
