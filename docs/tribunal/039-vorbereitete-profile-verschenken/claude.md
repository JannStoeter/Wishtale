---
autor: claude
datum: 2026-11-10
empfehlung: A
sicherheit: hoch
aufwand: mittel
kosten: keine laufenden Kosten, etwa ein Arbeitstag
---
## Begründung
Die Idee ist sinnvoll, aber ich würde sie anders umsetzen, als sie beschrieben ist. Das Problem ist der leere Anfang: Wer sein Wishtale zum ersten Mal sieht, hat noch nichts darin, und genau dort springen Menschen ab. Ein Anfang mit dem eigenen Namen und ein, zwei Tipps von jemandem, der einen kennt, ist deutlich einladender, und zu Weihnachten gibt es einen natürlichen Anlass.

**Ich empfehle A, einen Einladungslink ohne vorab angelegtes Konto.** Jann legt in der App „Jemanden einladen“ an, gibt den Vornamen und optional ein, zwei Tipps ein und bekommt einen Link, den Jann selbst per Messenger oder Mail verschickt. Die Person öffnet ihn, sieht „Jann hat ein Wishtale für dich vorbereitet“, den Namen und die Tipps als Vorschläge und registriert sich ganz normal. Das Konto entsteht erst dann. Technisch passt das auf Vorhandenes: Der Entwurf reist wie heute bei der Einrichtung mit (`adoptDraft`), die Tipps erscheinen als Wünsche mit „Tipp von Jann“ (`via`) und lassen sich bestätigen oder verwerfen.

Warum nicht B (Konto vorab): Ein Konto mit der E-Mail einer anderen Person ohne deren Einwilligung ist datenschutzrechtlich heikel (Art. 6 und 7 DSGVO), und die Mail würde von Wishtale an eine Person gehen, die uns nie kontaktiert hat. Eine solche Einladungsmail an Dritte gilt nach der Rechtsprechung schnell als unerlaubte Werbung (§ 7 UWG, „Freunde werben“). Dazu käme Missbrauch: Jemand könnte Konten für beliebige Adressen anlegen. Bei A schickt Jann den Link selbst, Wishtale versendet nichts und speichert keine fremde E-Mail-Adresse.

Warum nicht C (verwaltetes Profil mit Übergabe): Das passt für Kinder und Eltern, für Erwachsene ist die Übergabe eines Profils, das jemand anderes geführt hat, schwieriger zu erklären und enthält mehr Daten über eine Person, die nie zugestimmt hat.

**Leitplanken für A:** Eine Einladung enthält nur Vorname und höchstens zwei Tipps, keine weiteren Angaben. Der Link läuft nach 30 Tagen ab, lässt sich nur einmal einlösen und wird gespeichert nur als Hash. Eine Person kann höchstens etwa zehn Einladungen offen haben. Die Tipps stehen erst nach Bestätigung auf der Wunschliste und sind als Tipp von Jann erkennbar. Die Datenschutzerklärung braucht einen Absatz (Name einer dritten Person wird bis zur Einlösung oder zum Ablauf gespeichert, danach gelöscht). Technisch: neue Tabelle `invites`, zwei Funktionen (anlegen, einlösen), eine Ansicht `#einladung/<Code>`, im Profil ein Knopf „Jemanden einladen“ mit Teilen-Funktion des Handys.

## Risiken
Falsche Namen oder Tipps wirken übergriffig, wenn sie sich wie die Wünsche der Person anfühlen, deshalb die klare Kennzeichnung und das Bestätigen. Der Link kann an Falsche gelangen, der Schaden bleibt klein, weil er nur Vorname und Tipps enthält. Ob Einladungen wirklich mehr Anmeldungen bringen, wissen wir erst mit Daten (Auswertung: Einladung angelegt, geöffnet, eingelöst).

## Gegenargument
D ist ehrlich die schlankste Lösung: Wer sich anmelden will, tut es, und die Landingpage mit dem Einlesen von Listen senkt die Hürde schon deutlich. Ein Einladungsweg lohnt sich vor allem, wenn Wishtale über Bekannte wachsen soll. Wenn die Reichweite noch nicht das Ziel ist, kann das warten.
