-- Prüft die Zugriffsregeln aus 0026 mit drei Testkonten (A Hauptnutzer, B zweites Elternteil, C Fremder).
-- Im Supabase-SQL-Editor komplett ausführen. Die Testdaten leben nur in einem Unterblock, der am Ende absichtlich abgebrochen wird:
-- dadurch wird alles zurückgerollt und es bleibt nichts in der Datenbank. Das Ergebnis steht als normale Zeile „ergebnis“ im Ergebnisfenster.
-- Namen und Adressen sind zufällig, ein früherer Lauf kann nicht kollidieren. Die Funktion liegt nur in dieser Sitzung (pg_temp).
-- Erwartet: C_sieht_* = 0, C_einladen = "owner", C_managers_of = null, C_insert_wunsch = abgelehnt, B_accept ok = true,
-- B_accept_nochmal = "invalid", B_accept_zweite_einladung = "full", B_sieht_kindprofil = 1, B_sieht_A_hauptprofil = 0,
-- B_update_profil = 1, B_handle_aendern = abgelehnt, B_besitz_uebernehmen = abgelehnt, B_loescht_kindprofil = 0, B_einladen = "owner",
-- B_sieht_einladungen = 0, A_einladen_voll = "full", A_entfernt_B = 1, B_sieht_kind_nach_entfernung = 0.
create or replace function pg_temp.t0026() returns text language plpgsql as $f$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); c uuid := gen_random_uuid();
  kid uuid := gen_random_uuid(); pa uuid := gen_random_uuid(); pb uuid := gen_random_uuid(); pc uuid := gen_random_uuid();
  w1 uuid := gen_random_uuid();
  r jsonb := '{}'::jsonb; ha text := 'testa-'||substr(md5(random()::text),1,6); hk text := 'testk-'||substr(md5(random()::text),1,6); hb text := 'testb-'||substr(md5(random()::text),1,6); hc text := 'testc-'||substr(md5(random()::text),1,6); hn text := 'neuek-'||substr(md5(random()::text),1,6); tok text; tok2 text; n int; j jsonb;
begin
  begin
  insert into auth.users (id, aud, role, email, instance_id) values (a,'authenticated','authenticated','ta-'||a||'@example.invalid','00000000-0000-0000-0000-000000000000'),(b,'authenticated','authenticated','tb-'||b||'@example.invalid','00000000-0000-0000-0000-000000000000'),(c,'authenticated','authenticated','tc-'||c||'@example.invalid','00000000-0000-0000-0000-000000000000');
  insert into public.profiles (id, owner_id, handle, name, managed) values (pa,a,ha,'Anna',false),(kid,a,hk,'Levin',true),(pb,b,hb,'Ben',false),(pc,c,hc,'Clara',false);
  insert into public.wishes (id, profile_id, title, kind, prio, vis, status) values (w1, kid, 'Tonie', 'produkt', 2, 'alle', 'offen');

  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true); set local role authenticated;
  j := public.create_member_invite(kid); tok := j->>'token'; r := r || jsonb_build_object('A_einladen', j->'ok');
  j := public.create_member_invite(kid); tok2 := j->>'token';
  select count(*) into n from public.member_invites; r := r || jsonb_build_object('A_sieht_einladungen', n);
  reset role;

  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true); set local role authenticated;
  select count(*) into n from public.profiles where id = kid; r := r || jsonb_build_object('C_sieht_kindprofil_vorher', n);
  select count(*) into n from public.wishes where profile_id = kid; r := r || jsonb_build_object('C_sieht_wuensche_vorher', n);
  r := r || jsonb_build_object('C_einladen', public.create_member_invite(kid)->'reason');
  select count(*) into n from public.member_invites; r := r || jsonb_build_object('C_sieht_einladungen', n);
  r := r || jsonb_build_object('C_managers_of', public.managers_of(kid));
  begin insert into public.wishes (profile_id, title, kind, prio, vis, status) values (kid,'Hack','produkt',2,'alle','offen'); r := r || jsonb_build_object('C_insert_wunsch','FEHLER erlaubt'); exception when others then r := r || jsonb_build_object('C_insert_wunsch','abgelehnt'); end;
  reset role;

  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true); set local role authenticated;
  r := r || jsonb_build_object('B_accept', public.accept_member_invite(tok));
  r := r || jsonb_build_object('B_accept_nochmal', public.accept_member_invite(tok)->'reason');
  r := r || jsonb_build_object('B_accept_zweite_einladung', public.accept_member_invite(tok2)->'reason');
  select count(*) into n from public.profiles where id = kid; r := r || jsonb_build_object('B_sieht_kindprofil', n);
  select count(*) into n from public.profiles where id = pa; r := r || jsonb_build_object('B_sieht_A_hauptprofil', n);
  select count(*) into n from public.wishes where profile_id = kid; r := r || jsonb_build_object('B_sieht_wuensche', n);
  update public.profiles set about = 'von B' where id = kid; get diagnostics n = row_count; r := r || jsonb_build_object('B_update_profil', n);
  begin update public.profiles set handle = hn where id = kid; r := r || jsonb_build_object('B_handle_aendern','FEHLER erlaubt'); exception when others then r := r || jsonb_build_object('B_handle_aendern','abgelehnt'); end;
  begin update public.profiles set owner_id = b where id = kid; r := r || jsonb_build_object('B_besitz_uebernehmen','FEHLER erlaubt'); exception when others then r := r || jsonb_build_object('B_besitz_uebernehmen','abgelehnt'); end;
  insert into public.wishes (profile_id, title, kind, prio, vis, status) values (kid,'von B','produkt',2,'alle','offen');
  update public.wishes set note='B' where id = w1; get diagnostics n = row_count; r := r || jsonb_build_object('B_update_wunsch', n);
  delete from public.profiles where id = kid; get diagnostics n = row_count; r := r || jsonb_build_object('B_loescht_kindprofil', n);
  r := r || jsonb_build_object('B_einladen', public.create_member_invite(kid)->'reason');
  r := r || jsonb_build_object('B_managers_of', public.managers_of(kid));
  select count(*) into n from public.member_invites; r := r || jsonb_build_object('B_sieht_einladungen', n);
  reset role;

  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true); set local role authenticated;
  select count(*) into n from public.profiles where id = kid; r := r || jsonb_build_object('C_sieht_kindprofil_nachher', n);
  select count(*) into n from public.wishes where profile_id = kid; r := r || jsonb_build_object('C_sieht_wuensche_nachher', n);
  update public.wishes set note='C' where id = w1; get diagnostics n = row_count; r := r || jsonb_build_object('C_update_wunsch', n);
  select count(*) into n from public.profile_members; r := r || jsonb_build_object('C_sieht_member_zeilen', n);
  reset role;

  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true); set local role authenticated;
  select count(*) into n from public.wishes where profile_id = kid; r := r || jsonb_build_object('A_sieht_wuensche', n);
  r := r || jsonb_build_object('A_managers_of', public.managers_of(kid));
  r := r || jsonb_build_object('A_einladen_voll', public.create_member_invite(kid)->'reason');
  select count(*) into n from public.profile_members; r := r || jsonb_build_object('A_sieht_member_zeilen', n);
  delete from public.profile_members where profile_id = kid; get diagnostics n = row_count; r := r || jsonb_build_object('A_entfernt_B', n);
  reset role;

  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true); set local role authenticated;
  select count(*) into n from public.profiles where id = kid; r := r || jsonb_build_object('B_sieht_kind_nach_entfernung', n);
  select count(*) into n from public.wishes where profile_id = kid; r := r || jsonb_build_object('B_sieht_wuensche_nach_entfernung', n);
  reset role;
  raise exception 'TESTERGEBNIS %', r::text;
  exception when others then return sqlerrm;
  end;
end $f$;
select pg_temp.t0026() as ergebnis;
