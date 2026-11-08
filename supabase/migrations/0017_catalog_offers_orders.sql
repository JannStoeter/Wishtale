-- Wishtale: Katalog aus der Datenbank (KI-Entwürfe, im CMS geprüft), buchbare Angebote mit Zeitfenster, Bestellungen, Zahlungs-Kunden.
-- Besucher lesen nur freigegebene Katalog-Einträge und laufende Angebote. Bestellungen schreibt nur der Server (Dienstschlüssel).

create table if not exists public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  brand text not null default '',
  world text not null,
  kind text not null default 'ding' check (kind in ('ding','erlebnis')),
  search text not null default '',
  tags text[] not null default '{}',
  kw text[] not null default '{}',
  price_from int,
  price_to int,
  occ text[] not null default '{}',
  note text not null default '',
  status text not null default 'draft' check (status in ('draft','approved','hidden')),
  source text not null default 'ai' check (source in ('ai','manual','pick')),
  created_at timestamptz not null default now()
);
create index if not exists catalog_items_world_idx on public.catalog_items(world, status);
alter table public.catalog_items enable row level security;
create policy catalog_items_public on public.catalog_items for select to anon, authenticated using (status = 'approved');
create policy catalog_items_admin on public.catalog_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9_]{3,40}$'),
  kind text not null default 'pack' check (kind in ('plan','pack')),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 400),
  price_cents int not null check (price_cents >= 0),
  interval text check (interval in ('month','year')),
  grants jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.offers enable row level security;
create policy offers_public on public.offers for select to anon, authenticated
  using (active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now()));
create policy offers_admin on public.offers for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_code text not null,
  offer_title text not null,
  amount_cents int not null,
  grants jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','paid','failed','refunded')),
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
alter table public.orders enable row level security;
create policy orders_own on public.orders for select to authenticated using (user_id = (select auth.uid()));
create policy orders_admin on public.orders for select to authenticated using (public.is_admin());

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  customer_id text not null unique
);
alter table public.billing_customers enable row level security;
create policy billing_own on public.billing_customers for select to authenticated using (user_id = (select auth.uid()));

-- Admins dürfen Rechte vergeben und entziehen (Lesen ist für alle auf die eigenen Zeilen beschränkt).
create policy entitlements_admin on public.entitlements for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.admin_find_user(p_email text)
returns table (id uuid, email text, created_at timestamptz) language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'nicht erlaubt'; end if;
  return query select u.id, u.email::text, u.created_at from auth.users u where lower(u.email) = lower(trim(p_email)) limit 1;
end $$;
revoke all on function public.admin_find_user(text) from public, anon;
grant execute on function public.admin_find_user(text) to authenticated;

create or replace function public.admin_costs()
returns table (period text, key text, calls bigint, tokens_in bigint, tokens_out bigint, accounts bigint) language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'nicht erlaubt'; end if;
  return query select u.period, u.key, sum(u.calls)::bigint, sum(u.tokens_in)::bigint, sum(u.tokens_out)::bigint, count(distinct u.user_id)::bigint
    from public.usage u group by u.period, u.key order by u.period desc, u.key;
end $$;
revoke all on function public.admin_costs() from public, anon;
grant execute on function public.admin_costs() to authenticated;

-- my_entitlements liefert zusätzlich das Ende der Gründerphase.
create or replace function public.my_entitlements()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'plan', coalesce((select e.key from public.entitlements e where e.user_id = auth.uid() and e.kind = 'plan' and e.valid_from <= now() and (e.valid_until is null or e.valid_until > now()) order by e.created_at desc limit 1),
      case when coalesce((select (s.value->>'founder_until')::timestamptz from public.settings s where s.key = 'plans'), 'epoch') > now() then 'plus' else 'free' end),
    'paid_until', (select max(e.valid_until) from public.entitlements e where e.user_id = auth.uid() and e.kind = 'plan' and e.valid_from <= now() and (e.valid_until is null or e.valid_until > now())),
    'founder_until', (select s.value->>'founder_until' from public.settings s where s.key = 'plans'),
    'features', coalesce((select jsonb_agg(distinct e.key) from public.entitlements e where e.user_id = auth.uid() and e.kind = 'feature' and e.valid_from <= now() and (e.valid_until is null or e.valid_until > now())), '[]'::jsonb),
    'credits', coalesce((select sum(e.quantity) from public.entitlements e where e.user_id = auth.uid() and e.kind = 'credit' and (e.valid_until is null or e.valid_until > now())), 0),
    'usage', coalesce((select jsonb_object_agg(u.key, jsonb_build_object('calls', u.calls, 'tokens_in', u.tokens_in, 'tokens_out', u.tokens_out)) from public.usage u where u.user_id = auth.uid() and u.period = to_char(now(), 'YYYY-MM')), '{}'::jsonb)
  );
$$;
