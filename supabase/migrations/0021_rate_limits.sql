-- Wishtale: dauerhafte Begrenzung von KI-Aufrufen (Missbrauchsschutz). Gezählt wird je Eimer und festem Zeitfenster.
-- Nur der Server (Dienstschlüssel) ruft hit_limit auf. Eimer-Namen enthalten nur Hashes, keine Klartext-Adressen.
create table if not exists public.rate_limits (
  bucket text not null,
  window_start timestamptz not null,
  hits int not null default 0,
  primary key (bucket, window_start)
);
alter table public.rate_limits enable row level security;

create or replace function public.hit_limit(p_bucket text, p_window_seconds int, p_max int)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare w timestamptz; n int;
begin
  w := to_timestamp(floor(extract(epoch from now()) / greatest(p_window_seconds, 1)) * greatest(p_window_seconds, 1));
  insert into public.rate_limits (bucket, window_start, hits) values (left(p_bucket, 120), w, 1)
  on conflict (bucket, window_start) do update set hits = public.rate_limits.hits + 1
  returning hits into n;
  return jsonb_build_object('ok', n <= p_max, 'hits', n, 'max', p_max);
end $$;
revoke all on function public.hit_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.hit_limit(text, int, int) to service_role;
