---
titel: Stripe im Testmodus verbinden und Kauf testen
art: aufgabe
status: offen
optionen: A=Jetzt Stripe-Konto und Testschlüssel einrichten | B=Erst nach den Rechtstexten | C=Erst wenn Preise entschieden sind
erstellt: 2026-11-09
von: claude
---
## Kontext
Der Zahlungsweg ist gebaut und nur gegen simulierte Antworten getestet (Signaturprüfung, Abo-Verlängerung, Doppelbuchung). Echt getestet ist nichts. Für den Test braucht es ein Stripe-Konto, einen Testschlüssel (`STRIPE_SECRET_KEY`) und den Webhook-Schlüssel (`STRIPE_WEBHOOK_SECRET`) in Vercel, jeweils nur dort, nie im Chat. Im Testmodus fließt kein echtes Geld.

## Frage
Wann machen wir den Testlauf?
