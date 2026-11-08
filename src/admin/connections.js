import { sb } from '../lib/supabase.js';
import { esc } from './util.js';

const step = (t, body) => `<li><b>${t}</b>${body ? `<div class="muted">${body}</div>` : ''}</li>`;

export async function mount(el) {
  el.innerHTML = '<div class="head"><div><h1>Verbindungen</h1><p class="muted">Hier siehst du, was schon verbunden ist, und wie du Instagram und Google Ads anschließt.</p></div></div><p class="muted">Wird geprüft …</p>';
  let st = null, err = '';
  try { const { data: { session } } = await sb.auth.getSession(); const r = await fetch('/api/integrations', { headers: { authorization: 'Bearer ' + session.access_token } }); if (!r.ok) throw new Error((await r.json()).error || r.status); st = await r.json(); }
  catch (e) { err = String(e.message || e); }
  const pill = (ok, yes = 'Verbunden', no = 'Nicht verbunden') => `<span class="pill ${ok ? 'ok' : ''}">${ok ? yes : no}</span>`;
  el.innerHTML = `<div class="head"><div><h1>Verbindungen</h1><p class="muted">Hier siehst du, was schon verbunden ist, und wie du Instagram und Google Ads anschließt. Alle Schlüssel trägst du in Vercel ein, nie in dieses CMS und nie in eine Chat-Nachricht.</p></div></div>
  ${err ? `<div class="banner warn2" role="alert"><b>Der Status konnte nicht geladen werden.</b> ${esc(err)} Auf einer Vorschau ohne Server-Funktionen (npm run dev) geht das nicht, auf der echten Seite schon.</div>` : ''}
  <div class="card"><h2>Schreibassistent ${st ? pill(st.ai && st.ai.configured) : ''}</h2>
   <p class="muted">Der Assistent schreibt aus einer Idee die Folien und die Bildunterschrift im Wishtale-Ton und überarbeitet sie auf Zuruf (kürzer, wärmer, ohne Produkt). Er nutzt die Claude-API von Anthropic. Jede Anfrage kostet wenige Cent.</p>
   <ol class="steps">
    ${step('1. Konto und Schlüssel', 'Auf <b>console.anthropic.com</b> ein Konto anlegen, unter „Billing“ ein kleines Guthaben aufladen und unter „API Keys“ einen Schlüssel erzeugen. Setze dort auch ein <b>monatliches Limit</b> (zum Beispiel 10 Euro).')}
    ${step('2. In Vercel eintragen', 'Projekt <b>wishtale</b> › Settings › Environment Variables: <code>ANTHROPIC_API_KEY</code> mit dem Schlüssel. Danach „Redeploy“.')}
   </ol>
   <p class="hint">Optional: <code>ANTHROPIC_MODEL</code> legt das Modell fest. Ohne Eintrag nutzt das CMS <code>claude-sonnet-5-5</code>. Die Texte, die du eingibst, gehen an Anthropic. Gib dort keine personenbezogenen Daten Dritter ein.</p></div>
  <div class="card"><h2>Zahlungen (Stripe) ${st ? pill(st.payments && st.payments.configured) : ''}</h2>
   <p class="muted">Damit lassen sich Pläne und Einzelaktionen buchen. Ohne diese Schlüssel bleibt Bezahlen ausgeschaltet, und alle Nutzer behalten, was sie haben. Rechte entstehen erst, wenn Stripe die Zahlung bestätigt.</p>
   <ol class="steps">
    ${step('1. Stripe-Konto', 'Konto auf <b>stripe.com</b> anlegen und die Firmen- und Bankdaten hinterlegen. Zum Testen gibt es den Testmodus mit Testkarten.')}
    ${step('2. Schlüssel', 'Unter Entwickler › API-Schlüssel den <b>geheimen Schlüssel</b> kopieren. In Vercel als <code>STRIPE_SECRET_KEY</code> eintragen ' + (st ? pill(st.payments && st.payments.secret, 'Gesetzt', 'Fehlt') : '') + '.')}
    ${step('3. Webhook', 'Unter Entwickler › Webhooks einen Endpunkt <code>https://wishtale.de/api/stripe-webhook</code> anlegen. Ereignisse: <code>checkout.session.completed</code>, <code>invoice.paid</code>, <code>customer.subscription.deleted</code>. Das Signing-Secret als <code>STRIPE_WEBHOOK_SECRET</code> in Vercel eintragen ' + (st ? pill(st.payments && st.payments.webhook, 'Gesetzt', 'Fehlt') : '') + '.')}
    ${step('4. Kundenportal', 'Unter Einstellungen › Billing › Kundenportal aktivieren, damit Nutzer ihr Abo selbst verwalten und kündigen können.')}
   </ol>
   <p class="hint">Vor dem ersten Verkauf brauchst du AGB, eine Widerrufsbelehrung samt Hinweis zum vorzeitigen Erlöschen bei digitalen Inhalten, einen Kündigungsbutton und einen Datenschutz-Abschnitt zu Stripe. Außerdem muss das Projekt auf einem Vercel-Plan laufen, der kommerzielle Nutzung erlaubt.</p></div>
  <div class="card"><h2>Instagram ${st ? pill(st.instagram.configured, st.instagram.username ? 'Verbunden mit @' + esc(st.instagram.username) : 'Verbunden') : ''}</h2>
   ${st?.instagram.error ? `<p class="banner warn2" role="alert">${esc(st.instagram.error)}</p>` : ''}
   <p class="muted">Damit postest du Beiträge direkt aus dem Studio. Der einfachste Weg ist der „Instagram-Login“: Du brauchst nur dein berufliches Instagram-Konto und ein Meta-Entwicklerkonto, aber <b>keine Facebook-Seite</b>.</p>
   <ol class="steps">
    ${step('1. Entwicklerkonto', 'Gehe auf <b>developers.facebook.com</b>, melde dich mit deinem Facebook- oder Meta-Konto an und wähle „Erste Schritte“. Bestätige deine Handynummer und die Angaben.')}
    ${step('2. App erstellen', 'Oben rechts „Meine Apps“ › „App erstellen“. Als Name zum Beispiel „Wishtale CMS“. Wenn Meta nach dem Anwendungsfall fragt, wähle „Andere“ oder „Inhalte auf Instagram verwalten“, als App-Typ „Business“. Dann „App erstellen“.')}
    ${step('3. Instagram hinzufügen', 'In der App links auf „Produkte“ oder „Anwendungsfälle“, dann „Instagram“ hinzufügen und die Einrichtung <b>„API-Einrichtung mit Instagram-Login“</b> öffnen.')}
    ${step('4. Konto verbinden', 'Dort unter „Instagram-Konto hinzufügen“ meldest du dich mit @wishtale.de an und erlaubst den Zugriff. Falls Instagram eine Einladung als Tester schickt, nimm sie in der Instagram-App unter Einstellungen › Apps und Websites an.')}
    ${step('5. Token erzeugen', 'Neben dem Konto steht „Token generieren“. Bestätige die Berechtigung „Inhalte veröffentlichen“ und kopiere das Token. Daneben steht die lange <b>Instagram-Konto-ID</b>, ebenfalls kopieren.')}
    ${step('6. In Vercel eintragen', 'Projekt <b>wishtale</b> › Settings › Environment Variables. Lege drei Einträge an: <code>META_ACCESS_TOKEN</code> (das Token), <code>META_IG_USER_ID</code> (die Konto-ID) und <code>META_API_HOST</code> mit dem Wert <code>https://graph.instagram.com</code>. Danach unter Deployments „Redeploy“ klicken.')}
   </ol>
   <p class="hint">Solange die Meta-App im Entwicklungsmodus bleibt, darfst du damit dein eigenes Konto bedienen, ohne dass Meta die App prüfen muss. Die Menünamen bei Meta ändern sich öfter, die Reihenfolge bleibt aber gleich.</p>
   <p class="hint">Hinweis: Das langlebige Token läuft nach etwa 60 Tagen ab, dann musst du ein neues eintragen. Der Status oben zeigt dir, wenn es nicht mehr funktioniert.</p></div>
  <div class="card"><h2>Geplante Beiträge ${st ? pill(st.cron.secret && st.cron.serviceKey && st.instagram.configured, 'Bereit', 'Nicht bereit') : ''}</h2>
   <p class="muted">Damit Beiträge zur geplanten Zeit automatisch erscheinen, ruft Vercel täglich um 7 Uhr (UTC) eine Funktion auf. Dafür brauchst du in Vercel zusätzlich:</p>
   <ol class="steps">${step('<code>CRON_SECRET</code>', 'Eine lange zufällige Zeichenfolge, die du dir ausdenkst. Vercel schickt sie beim Aufruf mit. ' + (st ? pill(st.cron.secret, 'Gesetzt', 'Fehlt') : ''))}
   ${step('<code>SUPABASE_SERVICE_ROLE_KEY</code>', 'In Supabase unter Project Settings › API Keys der geheime Schlüssel (secret). Er darf niemals im Browser oder im Chat landen. ' + (st ? pill(st.cron.serviceKey, 'Gesetzt', 'Fehlt') : ''))}</ol>
   <p class="hint">Der kostenlose Vercel-Plan erlaubt nur eine Prüfung pro Tag. Beiträge erscheinen deshalb bis zu 24 Stunden nach der geplanten Zeit. Mit „Jetzt auf Instagram posten“ geht es sofort.</p></div>
  <div class="card"><h2>Google Ads ${st ? pill(st.googleAds.configured) : ''}</h2>
   <p class="muted">Damit siehst du Kampagnen mit Kosten und Klicks, pausierst sie, änderst das Tagesbudget und legst aus einem Plan eine neue Kampagne an (immer pausiert, damit nichts ungeprüft Geld kostet).</p>
   <ol class="steps">
    ${step('1. Google-Ads-Konto', 'Konto auf ads.google.com anlegen und die Kunden-ID notieren (10 Ziffern, oben rechts).')}
    ${step('2. Entwickler-Token', 'Im Google-Ads-Konto unter Tools › API-Center das Entwickler-Token beantragen. Mit einem Test-Token geht es sofort, für echte Kampagnen prüft Google den Antrag (meist einige Tage).')}
    ${step('3. OAuth-Client', 'In der Google Cloud Console ein Projekt anlegen, die „Google Ads API“ aktivieren und einen OAuth-Client (Typ „Webanwendung“) anlegen. Client-ID und Secret notieren.')}
    ${step('4. Refresh-Token', 'Im OAuth Playground (developers.google.com/oauthplayground) mit eigenem Client, Bereich <code>https://www.googleapis.com/auth/adwords</code>, ein Refresh-Token erzeugen.')}
    ${step('5. In Vercel eintragen', '<code>GOOGLE_ADS_DEVELOPER_TOKEN</code>, <code>GOOGLE_ADS_CLIENT_ID</code>, <code>GOOGLE_ADS_CLIENT_SECRET</code>, <code>GOOGLE_ADS_REFRESH_TOKEN</code>, <code>GOOGLE_ADS_CUSTOMER_ID</code> (ohne Bindestriche). Bei einem Verwaltungskonto zusätzlich <code>GOOGLE_ADS_LOGIN_CUSTOMER_ID</code>. Danach neu deployen.')}
   </ol>
   <p class="hint">Hinweis: Wer Conversion-Messung oder Remarketing nutzt, braucht ein Einwilligungsbanner und eine angepasste Datenschutzerklärung. Das Steuern über das CMS setzt keine Google-Skripte auf deiner Seite ein.</p></div>`;
}
