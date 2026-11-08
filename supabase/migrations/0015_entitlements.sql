-- Wishtale: Rechte (Freemium vordenken), Verbrauch und Kosten der KI-Aufrufe.
-- Geschrieben wird nur serverseitig (Dienstschlüssel). Jede Person liest nur ihre eigenen Zeilen.
-- Gründerphase: Bis zum Datum in settings.plans.founder_until gilt für alle der Plan „plus“, niemand wird eingeschränkt.

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('plan','feature','credit')),
  key text not null check (char_length(key) between 1 and 60),
  quantity int,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  source text not null check (source in ('stripe','admin','promo','founder','trial')),
  external_ref text,
  created_at timestamptz not null default now()
);
create index if not exists entitlements_user_idx on public.entitlements(user_id, kind, key);
alter table public.entitlements enable row level security;
create policy entitlements_read_own on public.entitlements for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  period text not null,
  calls int not null default 0,
  tokens_in bigint not null default 0,
  tokens_out bigint not null default 0,
  primary key (user_id, key, period)
);
alter table public.usage enable row level security;
create policy usage_read_own on public.usage for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.bump_usage(p_user uuid, p_key text, p_in int, p_out int)
returns void language sql security definer set search_path = '' as $$
  insert into public.usage (user_id, key, period, calls, tokens_in, tokens_out)
  values (p_user, p_key, to_char(now(), 'YYYY-MM'), 1, greatest(p_in, 0), greatest(p_out, 0))
  on conflict (user_id, key, period) do update
    set calls = public.usage.calls + 1, tokens_in = public.usage.tokens_in + greatest(p_in, 0), tokens_out = public.usage.tokens_out + greatest(p_out, 0);
$$;
revoke all on function public.bump_usage(uuid, text, int, int) from public, anon, authenticated;
grant execute on function public.bump_usage(uuid, text, int, int) to service_role;

-- Was ein Konto darf: Plan aus Rechten oder Gründerphase, dazu Verbrauch dieses Monats.
create or replace function public.my_entitlements()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'plan', coalesce((select e.key from public.entitlements e where e.user_id = auth.uid() and e.kind = 'plan' and e.valid_from <= now() and (e.valid_until is null or e.valid_until > now()) order by e.created_at desc limit 1),
      case when coalesce((select (s.value->>'founder_until')::timestamptz from public.settings s where s.key = 'plans'), 'epoch') > now() then 'plus' else 'free' end),
    'features', coalesce((select jsonb_agg(distinct e.key) from public.entitlements e where e.user_id = auth.uid() and e.kind = 'feature' and e.valid_from <= now() and (e.valid_until is null or e.valid_until > now())), '[]'::jsonb),
    'credits', coalesce((select sum(e.quantity) from public.entitlements e where e.user_id = auth.uid() and e.kind = 'credit' and (e.valid_until is null or e.valid_until > now())), 0),
    'usage', coalesce((select jsonb_object_agg(u.key, jsonb_build_object('calls', u.calls, 'tokens_in', u.tokens_in, 'tokens_out', u.tokens_out)) from public.usage u where u.user_id = auth.uid() and u.period = to_char(now(), 'YYYY-MM')), '{}'::jsonb)
  );
$$;
grant execute on function public.my_entitlements() to authenticated;

insert into public.settings (key, value) values ('plans', '{"founder_until":"2027-12-31T23:59:59Z"}'::jsonb)
on conflict (key) do nothing;
