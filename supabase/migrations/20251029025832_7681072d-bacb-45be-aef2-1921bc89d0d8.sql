-- Step 1: Create messages table for squad chat
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references public.squads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Index for fast read of chat messages
create index if not exists idx_messages_squad_created_at on public.messages (squad_id, created_at desc);

-- Invite code index for quick lookup (if doesn't exist)
create index if not exists idx_squads_invite_code on public.squads (invite_code);

-- App categories cache table
create table if not exists public.app_categories_cache (
  app_name text primary key,
  category text check (category in ('productive','unproductive','neutral')),
  last_updated timestamptz default now()
);

-- Daily usage index for performance
create index if not exists idx_daily_usage_user_date on public.daily_usage (user_id, usage_date desc);

-- User screen time index
create index if not exists idx_user_screen_time_user_date on public.user_screen_time (user_id, date desc);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Messages RLS: only members can read
create policy "messages_select_if_member" on public.messages
for select using (
  exists (select 1 from public.memberships m where m.user_id = auth.uid() and m.squad_id = messages.squad_id)
);

-- Messages RLS: only members can insert
create policy "messages_insert_if_member" on public.messages
for insert with check (
  exists (select 1 from public.memberships m where m.user_id = auth.uid() and m.squad_id = messages.squad_id)
);

-- App categories cache RLS: public select
alter table public.app_categories_cache enable row level security;
create policy "app_categories_cache_select_public" on public.app_categories_cache for select using (true);

-- Allow system to insert/update app categories cache
create policy "app_categories_cache_system_write" on public.app_categories_cache for all using (true) with check (true);