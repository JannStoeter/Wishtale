-- Wishtale: Kind-Konto von zwei Eltern verwalten (Entscheidung 046, Auftrag von Jann: es reichen die Eltern).
-- Ein Kind-Profil hat einen Hauptnutzer (profiles.owner_id) und höchstens EIN weiteres Elternteil (profile_members, Primärschlüssel profile_id).
-- Das zweite Elternteil darf Profil, Wünsche, Geschenke und Hinweise bearbeiten und die Reservierungsübersicht sehen.
-- Nur der Hauptnutzer darf einladen, das zweite Elternteil entfernen und das Kind-Profil löschen. Das zweite Elternteil kann sich selbst entfernen.
-- Eingeladen wird per Link (nur Zufallscode, gespeichert nur als Hash, 14 Tage, einmal einlösbar), Wishtale verschickt nichts.

create table if not exists public.profile_members (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
create index if not exists profile_members_user_idx on public.profile_members (user_id);
alter table public.profile_members enable row level security;
revoke all on public.profile_members from anon, authenticated;
grant select, delete on public.profile_members to authenticated;

-- Wer darf dieses Profil verwalten? Hauptnutzer oder das eine eingeladene Elternteil.
create or replace function public.can_manage(pid uuid)
returns boolean language sql stable security definer set search_path = '' as $f$
  select exists (select 1 from public.profiles p where p.id = pid and p.owner_id = (select auth.uid()))
      or exists (select 1 from public.profile_members m where m.profile_id = pid and m.user_id = (select auth.uid()));
$f$;
revoke execute on function public.can_manage(uuid) from public, anon;
grant execute on function public.can_manage(uuid) to authenticated;

-- Prüfung des Hauptnutzers über eine Funktion, damit sich die Regeln von profiles und profile_members nicht gegenseitig aufrufen (Rekursion).
create or replace function public.is_profile_owner(pid uuid)
returns boolean language sql stable security definer set search_path = '' as $f$
  select exists (select 1 from public.profiles p where p.id = pid and p.owner_id = (select auth.uid()));
$f$;
revoke execute on function public.is_profile_owner(uuid) from public, anon;
grant execute on function public.is_profile_owner(uuid) to authenticated;

create policy profile_members_select on public.profile_members for select to authenticated
  using (user_id = (select auth.uid()) or public.is_profile_owner(profile_id));
create policy profile_members_delete on public.profile_members for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_profile_owner(profile_id));

-- Profile: das zweite Elternteil darf lesen und ändern (nicht anlegen, nicht löschen, nicht übertragen).
create policy profiles_member_select on public.profiles for select to authenticated
  using (exists (select 1 from public.profile_members m where m.profile_id = id and m.user_id = (select auth.uid())));
create policy profiles_member_update on public.profiles for update to authenticated
  using (exists (select 1 from public.profile_members m where m.profile_id = id and m.user_id = (select auth.uid())))
  with check (exists (select 1 from public.profile_members m where m.profile_id = id and m.user_id = (select auth.uid())));

create or replace function public.guard_profile_update()
returns trigger language plpgsql security definer set search_path = '' as $f$
begin
  -- Wer nicht Hauptnutzer ist, darf Besitz, Kürzel und Art des Profils nicht ändern.
  if (select auth.uid()) is not null and (select auth.uid()) is distinct from old.owner_id then
    if new.owner_id is distinct from old.owner_id or new.handle is distinct from old.handle or new.managed is distinct from old.managed then
      raise exception 'Nur der Hauptnutzer darf das ändern.' using errcode = '42501';
    end if;
  end if;
  return new;
end $f$;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_profile_update();

-- Wünsche, Geschenke, Rückmeldungen: Hauptnutzer und zweites Elternteil.
drop policy if exists wishes_owner on public.wishes;
create policy wishes_owner on public.wishes for all to authenticated using (public.can_manage(profile_id)) with check (public.can_manage(profile_id));
drop policy if exists gifts_owner on public.gifts;
create policy gifts_owner on public.gifts for all to authenticated using (public.can_manage(profile_id)) with check (public.can_manage(profile_id));
drop policy if exists taste_signals_own on public.taste_signals;
create policy taste_signals_own on public.taste_signals for all to authenticated using (public.can_manage(profile_id)) with check (public.can_manage(profile_id));

-- Reservierungsübersicht für Kind-Konten
create or replace function public.owner_reservations(p_profile_id uuid)
returns table(wish_id uuid, state text) language sql stable security definer set search_path = '' as $f$
  select r.wish_id, r.state
  from public.reservations r
  join public.wishes w on w.id = r.wish_id
  join public.profiles p on p.id = w.profile_id
  where p.id = p_profile_id and p.managed and public.can_manage(p.id);
$f$;

-- Einladung zum Mitverwalten
create table if not exists public.member_invites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  used_at timestamptz,
  used_by uuid references auth.users(id) on delete set null
);
alter table public.member_invites enable row level security;
revoke all on public.member_invites from anon, authenticated;
grant select, delete on public.member_invites to authenticated;
create policy member_invites_own_select on public.member_invites for select to authenticated using (owner_id = (select auth.uid()));
create policy member_invites_own_delete on public.member_invites for delete to authenticated using (owner_id = (select auth.uid()));

create or replace function public.create_member_invite(p_profile uuid)
returns jsonb language plpgsql security definer set search_path = '' as $f$
declare uid uuid := (select auth.uid()); token text;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'login'); end if;
  if not exists (select 1 from public.profiles where id = p_profile and owner_id = uid and managed) then return jsonb_build_object('ok', false, 'reason', 'owner'); end if;
  if exists (select 1 from public.profile_members where profile_id = p_profile) then return jsonb_build_object('ok', false, 'reason', 'full'); end if;
  if (select count(*) from public.member_invites where profile_id = p_profile and used_at is null and expires_at > now()) >= 3 then return jsonb_build_object('ok', false, 'reason', 'limit'); end if;
  token := encode(extensions.gen_random_bytes(18), 'hex');
  insert into public.member_invites (profile_id, owner_id, token_hash) values (p_profile, uid, encode(extensions.digest(token, 'sha256'), 'hex'));
  return jsonb_build_object('ok', true, 'token', token);
end $f$;

create or replace function public.peek_member_invite(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $f$
declare i public.member_invites; kid text; who text;
begin
  if p_token is null or char_length(p_token) < 16 or char_length(p_token) > 100 then return jsonb_build_object('ok', false); end if;
  select * into i from public.member_invites where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and used_at is null and expires_at > now();
  if not found then return jsonb_build_object('ok', false); end if;
  if exists (select 1 from public.profile_members where profile_id = i.profile_id) then return jsonb_build_object('ok', false); end if;
  select split_part(name, ' ', 1) into kid from public.profiles where id = i.profile_id;
  select split_part(p.name, ' ', 1) into who from public.profiles p where p.owner_id = i.owner_id and not p.managed order by p.created_at limit 1;
  return jsonb_build_object('ok', true, 'kid', coalesce(nullif(kid, ''), 'Kind'), 'from', coalesce(nullif(who, ''), 'Jemand'));
end $f$;

create or replace function public.accept_member_invite(p_token text)
returns jsonb language plpgsql security definer set search_path = '' as $f$
declare uid uuid := (select auth.uid()); i public.member_invites; kid text; who text;
begin
  if uid is null or p_token is null or char_length(p_token) < 16 or char_length(p_token) > 100 then return jsonb_build_object('ok', false, 'reason', 'login'); end if;
  select * into i from public.member_invites where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex') and used_at is null and expires_at > now() for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'invalid'); end if;
  if i.owner_id = uid then return jsonb_build_object('ok', false, 'reason', 'self'); end if;
  if exists (select 1 from public.profile_members where profile_id = i.profile_id) then return jsonb_build_object('ok', false, 'reason', 'full'); end if;
  insert into public.profile_members (profile_id, user_id) values (i.profile_id, uid);
  update public.member_invites set used_at = now(), used_by = uid where id = i.id;
  select split_part(name, ' ', 1) into kid from public.profiles where id = i.profile_id;
  select split_part(p.name, ' ', 1) into who from public.profiles p where p.owner_id = i.owner_id and not p.managed order by p.created_at limit 1;
  return jsonb_build_object('ok', true, 'kid', coalesce(nullif(kid, ''), 'Kind'), 'from', coalesce(nullif(who, ''), 'Jemand'));
end $f$;

-- Wer verwaltet ein Kind-Konto? Nur für die beiden Eltern.
create or replace function public.managers_of(p_profile uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $f$
declare uid uuid := (select auth.uid()); pr public.profiles; mem uuid; o text; m text;
begin
  select * into pr from public.profiles where id = p_profile;
  if not found or not public.can_manage(p_profile) then return null; end if;
  select user_id into mem from public.profile_members where profile_id = p_profile;
  select split_part(p.name, ' ', 1) into o from public.profiles p where p.owner_id = pr.owner_id and not p.managed order by p.created_at limit 1;
  if mem is not null then select split_part(p.name, ' ', 1) into m from public.profiles p where p.owner_id = mem and not p.managed order by p.created_at limit 1; end if;
  return jsonb_build_object('is_owner', pr.owner_id = uid, 'owner', coalesce(nullif(o, ''), 'Hauptnutzer'), 'member', case when mem is null then null else coalesce(nullif(m, ''), 'Zweites Elternteil') end,
    'open_invites', (select count(*) from public.member_invites where profile_id = p_profile and used_at is null and expires_at > now()));
end $f$;

revoke execute on function public.create_member_invite(uuid), public.accept_member_invite(text), public.managers_of(uuid) from public, anon;
revoke execute on function public.peek_member_invite(text) from public;
grant execute on function public.create_member_invite(uuid), public.accept_member_invite(text), public.managers_of(uuid) to authenticated;
grant execute on function public.peek_member_invite(text) to anon, authenticated;
