-- Wishtale: Ablauf der Entwickler-Seite. Aus einem Urteil kann ein Bauauftrag werden (freigegeben), den Claude beim Abgleich umsetzt (umgesetzt).
-- Neue Fragen von Jann landen als Anfrage und werden beim Abgleich zu einem Ordner in docs/tribunal/.
alter table public.tribunal_verdicts
  add column if not exists build text not null default 'nein' check (build in ('nein','freigegeben','umgesetzt')),
  add column if not exists build_ref text not null default '' check (char_length(build_ref) <= 200),
  add column if not exists built_at timestamptz;

create table if not exists public.tribunal_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  context text not null default '' check (char_length(context) <= 3000),
  options text not null default '' check (char_length(options) <= 1500),
  status text not null default 'neu' check (status in ('neu','angelegt','verworfen')),
  topic text check (topic is null or topic ~ '^[a-z0-9-]{3,80}$'),
  created_at timestamptz not null default now()
);
alter table public.tribunal_requests enable row level security;
create policy tribunal_requests_admin on public.tribunal_requests for all to authenticated using (public.is_admin()) with check (public.is_admin());
