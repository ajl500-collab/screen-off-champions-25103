-- Step 2: Create invitations table
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references auth.users(id) on delete cascade,
  invitee_id uuid references auth.users(id) on delete cascade,
  squad_id uuid references public.squads(id) on delete cascade,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS on invitations
alter table public.invitations enable row level security;

-- Invitations RLS: invitee or inviter can read
create policy "invitation_read" on public.invitations 
for select using (invitee_id = auth.uid() or inviter_id = auth.uid());

-- Invitations RLS: inviter can insert
create policy "invitation_insert" on public.invitations 
for insert with check (inviter_id = auth.uid());

-- Invitations RLS: invitee or inviter can update
create policy "invitation_update" on public.invitations 
for update using (invitee_id = auth.uid() or inviter_id = auth.uid());