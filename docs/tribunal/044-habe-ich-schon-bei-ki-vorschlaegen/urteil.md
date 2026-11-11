---
topic: 044-habe-ich-schon-bei-ki-vorschlaegen
status: entschieden
option: A
datum: 2026-11-12
umgesetzt: 3cade8a
---
**Janns Anweisung, umgesetzt (Option A).** Im Wunschdetail der eigenen Ansicht (auch bei Kind-Konten) steht an jedem Vorschlag von Wishtale der Knopf „Habe ich schon“. Er legt das Produkt als „Selbst gekauft“ in die Wunschliste (damit Freunde es sehen und nicht doppelt schenken), speichert den Hinweis „habe ich schon“ im Konto (`taste_signals`), blendet den Vorschlag sofort aus und die KI schlägt Produkte mit demselben Stichwort (zum Beispiel „Toniebox“) künftig nicht mehr vor. Gäste sehen den Knopf nicht. Mit simuliertem Kind-Konto geprüft: Vorschlag verschwindet, Hinweis und Wunsch werden gespeichert. Hinweis: Ein Vorschlag, der denselben Begriff trägt wie die Box (etwa „Tonies“ allgemein), wird dabei nicht automatisch mit entfernt, nur die Wörter des gemeldeten Produkts.
