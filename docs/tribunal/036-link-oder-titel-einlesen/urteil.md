---
topic: 036-link-oder-titel-einlesen
status: entschieden
option: A
datum: 2026-11-09
umgesetzt: 25a31f9
---
**Janns Anweisung, umgesetzt (Option A).** Im Wunschformular heißt der Knopf „Link oder Titel einlesen“, das Feld nimmt beides. Enthält der Eintrag ein „https://“ oder keine Leerzeichen, gilt er als Link wie bisher. Sonst gilt er als Text, die KI (dieselbe wie beim Wunschzettel, ) macht daraus Produktname, Preis und Hinweis, trägt sie ein und leert das Linkfeld, mit Bestätigung „Erkannt: …“. Mehrere Produkte im Text führen zum Hinweis auf „Liste einlesen“. Mit simuliertem Konto und gegen die echte Schnittstelle getestet (Tonies Hörfigur, Name und Preis korrekt). Ein Titel-Aufruf zählt zum Tageslimit des Wunschzettels (15). Daten gehen wie dort an die Claude-API, die Datenschutzerklärung deckt das ab.
