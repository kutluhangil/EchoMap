-- Echo Map — optional cloud backup schema (Supabase / Postgres).
-- Apply this in the Supabase SQL editor when enabling cloud sync. The app is
-- local-first; this is only needed if a user opts into backup.

-- 1. Metadata table -----------------------------------------------------------
create table if not exists public.echoes (
  id            text primary key,
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  note          text,
  lat           double precision not null,
  lng           double precision not null,
  location_name text,
  audio_path    text not null,        -- path within the echo-audio bucket
  duration_ms   integer not null,
  created_at    bigint not null,      -- epoch ms (matches the client)
  updated_at    bigint not null
);

create index if not exists echoes_user_updated_idx
  on public.echoes (user_id, updated_at);

-- 2. Row Level Security -------------------------------------------------------
alter table public.echoes enable row level security;

create policy "Users read their own echoes"
  on public.echoes for select using (auth.uid() = user_id);

create policy "Users write their own echoes"
  on public.echoes for insert with check (auth.uid() = user_id);

create policy "Users update their own echoes"
  on public.echoes for update using (auth.uid() = user_id);

create policy "Users delete their own echoes"
  on public.echoes for delete using (auth.uid() = user_id);

-- 3. Private audio storage bucket ---------------------------------------------
insert into storage.buckets (id, name, public)
values ('echo-audio', 'echo-audio', false)
on conflict (id) do nothing;

-- Files live under "<user_id>/<echo_id>.m4a"; restrict access to the owner.
create policy "Users access their own audio"
  on storage.objects for all
  using (bucket_id = 'echo-audio' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'echo-audio' and auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Account deletion ---------------------------------------------------------
-- Google Play requires an in-app account/data deletion path. RLS lets the
-- client delete its own rows and audio; deleting the auth user itself needs the
-- service role, so deploy an Edge Function named "delete-account" that calls
-- supabase.auth.admin.deleteUser(user.id) and have the client invoke it
-- (see lib/sync/sync-engine.ts → deleteAccount).
