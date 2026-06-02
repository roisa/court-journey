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

-- ---------------------------------------------------------------------------
-- Media storage: photos & voice notes. Private bucket, one folder per user
-- (objects are stored at "<user_id>/<file_id>"). RLS restricts each user to
-- their own folder.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

create policy "media_select_own"
  on storage.objects for select
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media_update_own"
  on storage.objects for update
  using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
