-- Wishtale: Entscheidungen von Jann auf der Entwickler-Seite (/dev/). Die Positionen von Claude und ChatGPT liegen als Dateien in docs/tribunal/.
create table if not exists public.tribunal_verdicts (
  topic text primary key check (topic ~ '^[a-z0-9-]{3,80}$'),
  status text not null default 'entschieden' check (status in ('entschieden','vertagt','abgelehnt')),
  option text,
  note text not null default '' check (char_length(note) <= 2000),
  decided_at timestamptz not null default now()
);
alter table public.tribunal_verdicts enable row level security;
create policy tribunal_admin on public.tribunal_verdicts for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.tribunal_verdicts (topic, status, option, note)
values ('003-sichtbarkeit-nur-schenkende', 'entschieden', 'B', 'Streichen: nur „Für alle mit Link“ und „Privat“. Die KI darf Privates zur Orientierung nutzen, zeigt es Gästen aber nie.')
on conflict (topic) do nothing;
