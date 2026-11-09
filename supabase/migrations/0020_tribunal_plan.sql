-- Wishtale: Janns Planungs-Aktion je Punkt auf der Entwickler-Seite (Seite „Prioritäten“).
-- Die Prioritäten von Claude und ChatGPT liegen als Dateien in docs/tribunal/prioritaeten/.
create table if not exists public.tribunal_plan (
  topic text primary key check (topic ~ '^[a-z0-9-]{3,80}$'),
  action text not null check (action in ('jetzt','naechstes','spaeter','backlog','verworfen')),
  note text not null default '' check (char_length(note) <= 500),
  set_at timestamptz not null default now()
);
alter table public.tribunal_plan enable row level security;
create policy tribunal_plan_admin on public.tribunal_plan for all to authenticated using (public.is_admin()) with check (public.is_admin());
