---
topic: 124-wunschdialog-schlank-und-suche
status: entschieden
option: D
datum: 2026-11-25
umgesetzt: 76765ff7fbf2698b52c4a38c4098cd6bcff2beeb
---
**Jann im Projekt:** „also erstmal würde ich das interface Ideen / Wunsch suchen / Wunsch eingeben übernehmen.. das macht irgendwie sinn für die eigene Liste.. unsere Ideen mit "Hab ich" "Erfülle ich mir selbst" "passt nicht" behalten wir bei“. Quelle: „Websuche jetzt, Amazon später“.

Umsetzung: Reiter in `src/views/wishadd.js`, Suche über `op=searchQuery` (Brave-Websuche, je Shop ein Treffer, Bilder über den eigenen Server, nichts gespeichert). Amazon und Otto als Quelle folgen, sobald deren Schnittstellen frei sind.
