/*
 * Reservierungs-Link per Mail für Gäste ohne Konto (Dev 106, B3).
 * Die Mail enthält einen Link mit dem Gast-Schlüssel, damit dieselben Reservierungen auf einem anderen Gerät wieder da sind.
 * Die Adresse wird nur für diese eine Mail genutzt und nirgends gespeichert. Versand über den eigenen Mailserver (united domains),
 * Zugangsdaten nur in Vercel: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, optional MAIL_FROM. Ohne sie ist die Funktion aus.
 */
import nodemailer from 'nodemailer';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const gen = n => (/[sßxz]$/i.test(String(n)) ? n + '’' : n + 's');
export const validMail = e => /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i.test(String(e || '')) && String(e).length <= 254;
export const mailReady = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export function guestMail({ name, link }) {
  const who = String(name || '').trim().slice(0, 40) || 'der Wunschliste';
  const list = name ? `${gen(who)} Wunschliste` : 'der Wunschliste';
  const subject = `Deine Reservierung bei ${list}`;
  const text = `Hallo,

hier ist dein persönlicher Link zu deiner Reservierung bei ${list}. Öffne ihn auf jedem Gerät, dann siehst du, was du reserviert hast, und kannst es als gekauft markieren oder wieder freigeben. ${name ? who : 'Die beschenkte Person'} erfährt davon nichts.

${link}

Bitte gib den Link nicht weiter, er gehört nur zu deinen Reservierungen.
Deine E-Mail-Adresse haben wir nur für diese Nachricht genutzt und nicht gespeichert.

Herzliche Grüße
Wishtale · Die Wunschliste, die dich kennt
https://wishtale.de`;
  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#FAF7F1;font-family:Arial,Helvetica,sans-serif;color:#1F1B16">
<div style="max-width:520px;margin:0 auto;padding:28px 20px">
<p style="font:400 26px Georgia,serif;margin:0 0 20px">wishtale<span style="color:#B8801F">.</span></p>
<h1 style="font:400 24px Georgia,serif;margin:0 0 12px">Deine Reservierung bei ${esc(list)}</h1>
<p style="font-size:16px;line-height:1.5;margin:0 0 18px">Öffne diesen Link auf jedem Gerät, dann siehst du, was du reserviert hast, und kannst es als gekauft markieren oder wieder freigeben. ${esc(name ? who : 'Die beschenkte Person')} erfährt davon nichts.</p>
<p style="margin:0 0 22px"><a href="${esc(link)}" style="display:inline-block;background:#2E3B2F;color:#F6F0E4;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:99px">Zu meiner Reservierung</a></p>
<p style="font-size:13px;line-height:1.5;color:#5E564C;margin:0">Bitte gib den Link nicht weiter, er gehört nur zu deinen Reservierungen. Deine E-Mail-Adresse haben wir nur für diese Nachricht genutzt und nicht gespeichert.</p>
</div></body></html>`;
  return { subject, text, html };
}

export async function sendGuestMail(to, msg, transport) {
  const t = transport || nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: +(process.env.SMTP_PORT || 465), secure: +(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await t.sendMail({ from: process.env.MAIL_FROM || 'Wishtale <hallo@wishtale.de>', to, subject: msg.subject, text: msg.text, html: msg.html });
}
