-- Wishtale: Antworten auf die Geschmackskarten (Entscheidung 082).
-- Je Profil und Karte höchstens eine Zeile (die neueste Antwort zählt). Bewertung (gefällt oder gefällt nicht) und Besitz sind unabhängig.
-- Nur die verwaltende Person liest und schreibt sie (can_manage, 0026). Der Server liest sie mit dem Dienstschlüssel für bessere Ideen.

create table if not exists public.taste_cards (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  card_id text not null check (char_length(card_id) between 1 and 40),
  rating text check (rating in ('like', 'dislike')),
  owned boolean not null default false,
  version int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (profile_id, card_id)
);
alter table public.taste_cards enable row level security;
revoke all on public.taste_cards from anon, authenticated;
grant select, insert, update, delete on public.taste_cards to authenticated;

create policy taste_cards_own on public.taste_cards for all to authenticated
  using (public.can_manage(profile_id)) with check (public.can_manage(profile_id));
