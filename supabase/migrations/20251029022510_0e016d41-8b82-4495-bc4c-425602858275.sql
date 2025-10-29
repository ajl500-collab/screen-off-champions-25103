-- Secure function to fetch a squad by invite code (bypasses RLS safely)
create or replace function public.get_squad_by_invite_code(p_code text)
returns setof public.squads
language sql
security definer
set search_path = public
as $$
  select *
  from public.squads
  where invite_code = p_code
  limit 1
$$;