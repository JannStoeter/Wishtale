-- Nach 0029 in einer Testdatenbank als Admin ausführen. Alle Daten werden zurückgerollt.
begin;
select set_config('test.owner', gen_random_uuid()::text, true);
select set_config('test.other', gen_random_uuid()::text, true);
select set_config('test.profile', gen_random_uuid()::text, true);
insert into auth.users(id, aud, role, email) values
  (current_setting('test.owner')::uuid, 'authenticated', 'authenticated', current_setting('test.owner') || '@example.invalid'),
  (current_setting('test.other')::uuid, 'authenticated', 'authenticated', current_setting('test.other') || '@example.invalid');
insert into public.profiles(id, owner_id, handle, name) values
  (current_setting('test.profile')::uuid, current_setting('test.owner')::uuid, 'test-' || substr(current_setting('test.profile'), 1, 6), 'Test');
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.owner'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.claim_taste_prompt(current_setting('test.profile')::uuid)) <> 1 then raise exception 'Erste Einblendung fehlt'; end if;
  if (select count(*) from public.claim_taste_prompt(current_setting('test.profile')::uuid)) <> 0 then raise exception 'Wochenabstand fehlt'; end if;
  perform public.dismiss_taste_prompt(current_setting('test.profile')::uuid);
  perform public.dismiss_taste_prompt(current_setting('test.profile')::uuid);
  perform public.dismiss_taste_prompt(current_setting('test.profile')::uuid);
  perform public.dismiss_taste_prompt(current_setting('test.profile')::uuid);
  if (select dismissals from public.taste_prompt_preferences where profile_id=current_setting('test.profile')::uuid) <> 3 then raise exception 'Ablehnungen nicht begrenzt'; end if;
  update public.taste_prompt_preferences set last_shown_at=now()-interval '8 days';
  if (select count(*) from public.claim_taste_prompt(current_setting('test.profile')::uuid)) <> 0 then raise exception 'Dauerhaftes Ausblenden fehlt'; end if;
end $$;
reset role;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.other'), 'role', 'authenticated')::text, true);
set local role authenticated;
do $$ begin
  if (select count(*) from public.taste_prompt_preferences) <> 0 then raise exception 'Fremde Zeilen sichtbar'; end if;
  if public.dismiss_taste_prompt(current_setting('test.profile')::uuid) then raise exception 'Fremde Ablehnung erlaubt'; end if;
  begin
    perform public.claim_taste_prompt(current_setting('test.profile')::uuid);
    raise exception 'Fremde Einblendung erlaubt';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
delete from public.profiles where id=current_setting('test.profile')::uuid;
do $$ begin
  if exists (select 1 from public.taste_prompt_preferences where profile_id=current_setting('test.profile')::uuid) then raise exception 'Kaskade fehlt'; end if;
end $$;
rollback;
