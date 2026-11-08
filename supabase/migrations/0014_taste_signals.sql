-- Wishtale: Rückmeldungen der Profilinhaber zu KI-Ideen („gefällt“, „passt nicht“, „habe ich schon“).
-- Nur die eigene Person liest und schreibt sie. Der Server (Dienstschlüssel) nutzt sie für bessere Ideen.

create table if not exists public.taste_signals (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('yes','no','have')),
  term text not null check (char_length(term) between 1 and 120),
  created_at timestamptz not null default now()
);
create index if not exists taste_signals_profile_idx on public.taste_signals(profile_id, created_at desc);
alter table public.taste_signals enable row level security;

create policy taste_signals_own on public.taste_signals for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = profile_id and p.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.profiles p where p.id = profile_id and p.owner_id = (select auth.uid())));
