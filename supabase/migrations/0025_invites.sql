-- Wishtale: Einladungslink mit vorbereitetem Entwurf (Entscheidung 039).
-- Jemand legt Vorname und höchstens zwei Tipps an und schickt den Link selbst weiter. Erst die eingeladene Person legt ein Konto an.
-- Im Link steht nur ein Zufallscode (36 Hexzeichen), gespeichert wird nur sein Hash. Gültig 30 Tage, einmal einlösbar, höchstens 10 offene Einladungen pro Konto.
create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  name text not null check (char_length(name) between 1 and 40),
  tips text[] not null default '{}' check (cardinality(tips) <= 2),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days',
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null
);
alter table public.invites enable row level security;
revoke all on public.invites from anon, authenticated;
grant select, delete on public.invites to authenticated;
create policy invites_own_select on public.invites for select to authenticated using (owner_id = (select auth.uid()));
create policy invites_own_delete on public.invites for delete to authenticated using (owner_id = (select auth.uid()));

create or replace function public.create_invite(p_name text, p_tips text[])
returns jsonb language plpgsql security definer set search_path = '' as $f$
declare uid uuid := (select auth.uid()); n text := left(btrim(coalesce(p_name, '')), 40); tips text[] := '{}'; t text; token text;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'login'); end if;
  if n = '' then return jsonb_build_object('ok', false, 'reason', 'name'); end if;
  foreach t in array coalesce(p_tips, '{}') loop
    t := left(btrim(coalesce(t, '')), 80);
    if t <> '' and cardinality(tips) < 2 then tips := tips || t; end if;
  end loop;
  if (select count(*) from public.invites where owner_id = uid and used_at is null and expires_at > now()) >= 10 then
    return jsonb_build_object('ok', false, 'reason', 'limit');
  end if;
  token := encode(extensions.gen_random_bytes(18), 'hex');
  insert into public.invites (owner_id, token_hash, name, tips) values (uid, encode(extensions.digest(token, 'sha256'), 'hex'), n, tips);
  return jsonb_build_object('ok', true, 'token', token);
end $f$;

create or replace function public.peek_invite(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $f$
declare i public.invites; who text;
begin
  if p_token is null or char_length(p_token) < 16 or char_length(p_token) > 100 then return jsonb_build_object('ok', false); end if;
  select * into i from public.invites where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and used_at is null and expires_at > now();
  if not found then return jsonb_build_object('ok', false); end if;
  select split_part(p.name, ' ', 1) into who from public.profiles p where p.owner_id = i.owner_id and not p.managed order by p.created_at limit 1;
  return jsonb_build_object('ok', true, 'name', i.name, 'tips', to_jsonb(i.tips), 'from', coalesce(nullif(who, ''), 'Jemand'));
end $f$;

create or replace function public.redeem_invite(p_token text)
returns jsonb language plpgsql security definer set search_path = '' as $f$
declare uid uuid := (select auth.uid()); i public.invites; who text;
begin
  if uid is null or p_token is null or char_length(p_token) < 16 or char_length(p_token) > 100 then return jsonb_build_object('ok', false); end if;
  select * into i from public.invites where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and used_at is null and expires_at > now() for update;
  if not found or i.owner_id = uid then return jsonb_build_object('ok', false); end if;
  update public.invites set used_at = now(), used_by = uid where id = i.id;
  select split_part(p.name, ' ', 1) into who from public.profiles p where p.owner_id = i.owner_id and not p.managed order by p.created_at limit 1;
  return jsonb_build_object('ok', true, 'name', i.name, 'tips', to_jsonb(i.tips), 'from', coalesce(nullif(who, ''), 'Jemand'));
end $f$;

revoke execute on function public.create_invite(text, text[]) from public, anon;
revoke execute on function public.peek_invite(text) from public;
revoke execute on function public.redeem_invite(text) from public, anon;
grant execute on function public.create_invite(text, text[]) to authenticated;
grant execute on function public.peek_invite(text) to anon, authenticated;
grant execute on function public.redeem_invite(text) to authenticated;
