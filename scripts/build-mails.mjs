/*
 * Baut die E-Mail-Vorlagen für Supabase (Authentication › Emails) im Wishtale-Stil: node scripts/build-mails.mjs
 * Ergebnis: supabase/email-templates/*.html und eine Anleitung dazu. Die Vorlagen nutzen Tabellen und Inline-Stile, weil Mail-Programme
 * kein modernes CSS und keine Web-Schriften laden. Das Logo kommt als PNG von der eigenen Domain (public/mail/logo.png).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import legal from '../legal.config.mjs';

const SITE = 'https://wishtale.de';
const SERIF = "Georgia,'Times New Roman',serif", SANS = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

const layout = ({ preheader, title, body, button, link, note }) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F3EDE2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F3EDE2;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EDE2;"><tr><td align="center" style="padding:28px 14px;">
 <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#FBF8F1;border:1px solid #DDD3C2;border-radius:18px;">
  <tr><td style="padding:30px 34px 6px;"><a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/mail/logo.png" width="150" alt="wishtale" style="display:block;border:0;height:auto;"></a></td></tr>
  <tr><td style="padding:14px 34px 4px;font-family:${SERIF};font-size:30px;line-height:1.15;color:#1F1B16;">${title}</td></tr>
  <tr><td style="padding:10px 34px 4px;font-family:${SANS};font-size:16px;line-height:1.6;color:#3B352D;">${body}</td></tr>
  ${button ? `<tr><td style="padding:18px 34px 8px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#2E3B2F;border-radius:99px;"><a href="${link}" style="display:inline-block;padding:14px 30px;font-family:${SANS};font-size:16px;font-weight:600;color:#F6F0E4;text-decoration:none;">${button}</a></td></tr></table></td></tr>
  <tr><td style="padding:10px 34px 4px;font-family:${SANS};font-size:13px;line-height:1.5;color:#5E564C;">Funktioniert der Knopf nicht? Kopiere diesen Link in deinen Browser:<br><a href="${link}" style="color:#2E3B2F;word-break:break-all;">${link}</a></td></tr>` : ''}
  <tr><td style="padding:16px 34px 26px;font-family:${SANS};font-size:13px;line-height:1.5;color:#5E564C;">${note}</td></tr>
 </table>
 <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;"><tr><td align="center" style="padding:18px 10px 0;font-family:${SANS};font-size:12px;line-height:1.6;color:#5E564C;">
  <span style="font-family:${SERIF};font-size:15px;color:#1F1B16;">Die Wunschliste, die dich kennt.</span><br>
  Wishtale · ${legal.name} · ${legal.street} · ${legal.city}<br>
  <a href="${SITE}/impressum" style="color:#5E564C;">Impressum</a> · <a href="${SITE}/datenschutz" style="color:#5E564C;">Datenschutz</a>
 </td></tr></table>
</td></tr></table></body></html>`;

const URL = '{{ .ConfirmationURL }}';
const ignore = 'Falls du das nicht warst, kannst du diese Mail einfach ignorieren, es passiert nichts.';
export const TEMPLATES = {
  'confirm-signup': { name: 'Confirm signup', subject: 'Bestätige dein Wishtale', html: layout({
    preheader: 'Ein Tipp auf den Knopf, und dein Wishtale ist startklar.', title: 'Schön, dass du dabei bist',
    body: 'Mit einem Tipp bestätigst du deine E-Mail-Adresse, und dein Wishtale ist startklar. Danach kannst du deine Wünsche sammeln und den Link mit deinen Freunden teilen.',
    button: 'E-Mail bestätigen', link: URL, note: `Du hast diese Mail bekommen, weil sich jemand mit ${'{{ .Email }}'} bei Wishtale angemeldet hat. ${ignore}` }) },
  'magic-link': { name: 'Magic Link', subject: 'Dein Link zu Wishtale', html: layout({
    preheader: 'Mit diesem Link bist du sofort in deinem Wishtale.', title: 'Dein Anmelde-Link',
    body: 'Tippe auf den Knopf, dann bist du ohne Passwort in deinem Wishtale. Der Link funktioniert nur einmal und nur für kurze Zeit.',
    button: 'Jetzt anmelden', link: URL, note: `Du hast diese Mail bekommen, weil jemand einen Anmelde-Link für ${'{{ .Email }}'} angefordert hat. ${ignore}` }) },
  'recovery': { name: 'Reset password', subject: 'Neues Passwort für dein Wishtale', html: layout({
    preheader: 'Lege mit einem Tipp ein neues Passwort fest.', title: 'Neues Passwort festlegen',
    body: 'Du hast ein neues Passwort angefordert. Tippe auf den Knopf und wähle eines, das du dir gut merken kannst. Der Link gilt eine Stunde.',
    button: 'Passwort festlegen', link: URL, note: `Wenn du kein neues Passwort angefordert hast, ist nichts passiert. Dein bisheriges Passwort bleibt gültig.` }) },
  // Auch für Wunschlisten, die ohne Konto begonnen wurden (141): Dann gibt es noch keine alte Adresse ({{ .Email }} ist leer).
  'email-change': { name: 'Change email address', subject: 'Bestätige deine E-Mail-Adresse für Wishtale', html: layout({
    preheader: 'Bestätige die Adresse für dein Wishtale.', title: 'E-Mail-Adresse bestätigen',
    body: '{{ if .Email }}Du möchtest deine E-Mail-Adresse für Wishtale von {{ .Email }} auf {{ .NewEmail }} ändern. Bestätige das mit einem Tipp.{{ else }}Du möchtest deine Wunschliste mit der Adresse {{ .NewEmail }} sichern. Bestätige das mit einem Tipp, dann ist dein Konto fertig und deine Wünsche bleiben.{{ end }}',
    button: 'Adresse bestätigen', link: URL, note: `Wenn du das nicht angefordert hast, ignoriere diese Mail. Dein Konto bleibt unverändert.` }) },
  'invite': { name: 'Invite user', subject: 'Du wurdest zu Wishtale eingeladen', html: layout({
    preheader: 'Nimm die Einladung an und lege dein Wishtale an.', title: 'Willkommen bei Wishtale',
    body: 'Du wurdest zu Wishtale eingeladen. Nimm die Einladung an und lege dein Konto an.',
    button: 'Einladung annehmen', link: URL, note: ignore }) },
  'reauthentication': { name: 'Reauthentication', subject: 'Dein Bestätigungscode für Wishtale', html: layout({
    preheader: 'Dein Code für die Bestätigung.', title: 'Dein Bestätigungscode',
    body: 'Gib diesen Code in Wishtale ein: <b style="font-family:Consolas,Menlo,monospace;font-size:22px;letter-spacing:.2em;">{{ .Token }}</b>',
    note: `Der Code gilt nur kurz. ${ignore}` }) },
};

mkdirSync('supabase/email-templates', { recursive: true });
for (const [k, t] of Object.entries(TEMPLATES)) writeFileSync(`supabase/email-templates/${k}.html`, t.html);
writeFileSync('supabase/email-templates/README.md', `# E-Mail-Vorlagen für Wishtale

Erzeugt mit \`node scripts/build-mails.mjs\`. Nicht von Hand ändern, sondern in \`scripts/build-mails.mjs\` anpassen und neu bauen.

## Einfügen
Supabase › Authentication › Emails (oder „Email Templates“). Pro Vorlage Betreff und Inhalt (HTML) ersetzen:

| Vorlage in Supabase | Betreff | Datei |
|---|---|---|
${Object.entries(TEMPLATES).map(([k, t]) => `| ${t.name} | ${t.subject} | \`${k}.html\` |`).join('\n')}

## Absender
Supabase › Authentication › SMTP Settings: Absender \`hallo@wishtale.de\`, Name \`Wishtale\`, dazu Host, Port, Benutzer und Passwort deines Mailanbieters.

## Logo
\`public/mail/logo.png\` wird von \`${SITE}/mail/logo.png\` geladen. Neu erzeugen mit \`node scripts/mail-logo.mjs\`.
`);
console.log(Object.keys(TEMPLATES).length, 'Vorlagen geschrieben');
