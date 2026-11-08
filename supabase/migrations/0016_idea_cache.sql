-- Wishtale: Zwischenspeicher für KI-Ideen. Der Fingerabdruck aus Profil, Rückmeldungen, Anlass, Anweisung und Modell ist der Schlüssel,
-- gleiche Eingabe liefert die gespeicherte Antwort ohne neuen KI-Aufruf. Nur der Server (Dienstschlüssel) liest und schreibt.
create table if not exists public.idea_cache (
  hash text primary key,
  feature text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists idea_cache_created_idx on public.idea_cache(created_at);
alter table public.idea_cache enable row level security;
