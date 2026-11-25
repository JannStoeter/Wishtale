-- Wishtale (Dev 120): Jedes Konto hat genau ein eigenes Hauptprofil.
-- Zwei gleichzeitige Aufrufe von loadMine() legten bei zwei Konten eine leere zweite Kopie an,
-- die in „Konten“ als zweites Hauptkonto erschien (ein Konto wurde deshalb versehentlich gelöscht).
-- Leere Doppel werden entfernt (nur ohne Wünsche, Geschenke, Mitverwaltung und Rückmeldungen),
-- danach verhindert ein Index weitere Doppel.

delete from public.profiles d
where not d.managed and not d.is_demo
  and exists (select 1 from public.profiles o where o.owner_id = d.owner_id and not o.managed and not o.is_demo
              and (o.created_at, o.id) < (d.created_at, d.id))
  and not exists (select 1 from public.wishes w where w.profile_id = d.id)
  and not exists (select 1 from public.gifts g where g.profile_id = d.id)
  and not exists (select 1 from public.profile_members m where m.profile_id = d.id)
  and not exists (select 1 from public.taste_cards c where c.profile_id = d.id)
  and not exists (select 1 from public.taste_signals s where s.profile_id = d.id);

create unique index if not exists profiles_one_main_per_owner
  on public.profiles (owner_id) where not managed and not is_demo;
