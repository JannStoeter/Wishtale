-- Dev 106 B1: guard_profile_update() ist nur eine Trigger-Funktion und muss nicht über die Schnittstelle aufrufbar sein.
-- Der Trigger selbst läuft weiter (geprüft: Profil-Änderung als angemeldete Person klappt).
revoke execute on function public.guard_profile_update() from public, anon, authenticated;
