# NeuBautUlm – CLAUDE.md

## Projekt-Überblick

NeuBautUlm ist eine Web-Anwendung für das kommunale Baustellen- und Mängelmanagement der Stadt Neu-Ulm.  
Im ersten Schritt wird nur ein **Frontend mit Mock-Daten** gebaut, um die wichtigsten Funktionen und UI-Flows zu sehen, ohne echte Backendanbindung.

Die App soll drei Nutzertypen unterstützen:
1. Sachbearbeiter:in der Stadt (primäre Zielgruppe)
2. Bauleiter:in
3. Passant:in (Bürger:in)

Kartenbasis ist eine **offene Karte (OpenStreetMap)**, der Kartenausschnitt ist standardmäßig auf Neu-Ulm zentriert (ca. 48.39° N, 10.01° E).[web:59]  
Der Name der Anwendung ist **„NeuBautUlm“**.

---

## Design-Prinzipien

### Minimalistisches Material Design

Ziel ist ein reduziertes, ruhiges UI, angelehnt an **Material Design 3** und moderne „Material Minimal“-Interpretationen.[web:63][web:64][web:72]

- Helle, ruhige Hintergründe (vorwiegend Weiß / sehr helle Grautöne).
- Viel Weißraum, klare Typografie, große, gut lesbare Überschriften.
- Dezente runde Ecken (z. B. 4–8 px) für Karten, Inputs und Buttons.
- Sehr begrenzte Farbpalette:
    - 1 Primärfarbe (z. B. Blau oder Grün der Stadt Neu-Ulm).
    - 1–2 Akzentfarben für Status (z. B. Rot für hohe Priorität).
    - Grauabstufungen für Texte und Rahmen.
- Material-typische Hierarchie:
    - **Primary Button**: gefüllt, kräftige Primärfarbe.
    - **Secondary Button**: Outlined oder Ton-in-Ton.
    - **Tertiary Button**: Textbutton ohne Hintergrund.[web:61][web:66]
- Elevation sehr sparsam einsetzen (leichte Schatten nur für Floating-Elemente wie Bottom Sheets und FABs).

---

## Ziele (Scope v1 – Mock-Frontend)

- Vollständig klickbarer UI-Prototyp in Vue mit Routing, State und Mock-Daten.
- **Zentrale Sachbearbeiter-Ansicht**:
    - Baustellenliste.
    - Mängelliste.
    - Kartenansicht mit Baustellen- und Mängelmarkern.
- Bauleiter-Ansicht mit Upload-Flow (Mock) für Dokumente und Bilder pro Baustelle.
- Passanten-Ansicht zum Melden von Mängeln auf der Karte.
- Rolle per globalem Menü auswählbar; Tabs in der Tabbar passen sich an die Rolle an.

---

## Nicht-Ziele (Out of Scope v1)

- Keine echte Authentifizierung/Autorisation (Rollenwechsel nur über Role-Switch).
- Keine echte Persistenz:
    - Alle Daten sind im Frontend gemockt (z. B. JSON/Store).
- Kein echtes Dateiupload-Handling:
    - Uploads nur als UI-Dummy (z. B. fester Beispiel-Eintrag).
- Keine komplexe Routing-Berechnung:
    - Nur Platzhalter-UI für künftige Routenlogik.
- Kein perfektes responsives Feintuning:
    - Fokus zunächst auf Desktop (später Mobile optimieren).

---

## Tech-Stack & Architektur

- Framework: **Vue 3** (z. B. Vite-Template).
- Sprache: JavaScript oder TypeScript (TS empfohlen).
- Router: **Vue Router** für Seiten/Rollen.
- State-Management: **Pinia** oder einfacher globaler Store.
- UI-Styling:
    - Minimalistisches Material Design, z. B. mit:
        - TailwindCSS + eigene Komponenten im Material-Stil **oder**
        - Leichte Material-orientierte UI-Library (z. B. Vuetify, Material-basierte Kits).
- Map:
    - OpenStreetMap-Kacheln.
    - Integration über **Leaflet** mit Vue-Wrapper (z. B. `@vue-leaflet/vue-leaflet`).[web:55][web:58]

---

## User-Rollen & Berechtigungen (Mock)

### 1. Rolle: Sachbearbeiter:in Stadt (Primäre Zielgruppe)

**Ziel:**  
Zentrale Schaltstelle für das Baustellen- und Mängelmanagement. Die Sachbearbeitung soll:
- alle Baustellen in einer Übersichtsliste sehen,
- gemeldete Mängel je Baustelle einsehen und bearbeiten,
- eine Kartenansicht zur räumlichen Einordnung nutzen,
- von Bauleitern hochgeladene Dokumente/Bilder pro Baustelle einsehen können.

**Berechtigungen (UI, Mock):**
- Vollzugriff auf:
    - **Baustellenliste** mit Filter/Suche.
    - **Mängelliste** (alle Mängel mit Zuordnung zu Baustellen).
    - **Kartenansicht** mit Baustellen- und Mängelmarkern.
- Baustellendetail:
    - Stammdaten sehen.
    - Zugehörige Mängel sehen.
    - Von Bauleitern hochgeladene Dokumente/Bilder sehen (read-only).
- Statusänderungen (Mock):
    - Mängelstatus ändern (z. B. „offen“ → „in Bearbeitung“ → „erledigt“).
    - Baustellenstatus ändern (Dropdown; nur Frontend-State).

### 2. Rolle: Bauleiter:in

**Ziel:**  
Schnellen Überblick über „eigene“ Baustellen plus Dokumente/Bilder verwalten.

**Berechtigungen (UI, Mock):**
- Liste eigener Baustellen sehen (gefiltert nach `bauleiterId`).
- Pro Baustelle:
    - Kurzinfos (Name, Adresse, Status, Zeitraum).
    - Tab „Dokumente“: Liste mit Dokumenten.
    - Tab „Bilder“: Galerie/Thumbnails.
- Aktionen (Mock):
    - „Dokument hochladen“ → Dialog, fügt Dummy-Dokument in Liste ein.
    - „Foto hinzufügen“ → Dummy-Bild in Galerie hinzufügen.
- Sachbearbeiter sieht dieselben Dokumente/Bilder in seiner Detailansicht (read-only).

### 3. Rolle: Passant:in

**Ziel:**  
Einfach Mängel im öffentlichen Raum melden und den Status grob einsehen.

**Berechtigungen (UI, Mock):**
- Karte mit bestehenden Mängelpunkten sehen (Marker mit Status).
- Neue Meldung erstellen:
    - Klick auf Karte oder Button „Mangel melden“.
    - Formular mit Feldern: Kategorie, Beschreibung, optional Foto-Platzhalter.
    - Position aus Kartenklick übernehmen.
- Nach Absenden:
    - Neuer Marker und Listen-Eintrag wird im Frontend-State angelegt.

---

## Datenmodell (Mock)

### Typen

```ts
// types.ts
export type BaustellenStatus = "offen" | "in_pruefung" | "abgeschlossen";

export interface Baustelle {
  id: string;
  name: string;
  adresse: string;
  status: BaustellenStatus;
  prioritaet: "hoch" | "mittel" | "niedrig";
  lat: number;
  lng: number;
  bauleiterId: string;
  startDatum: string;
  endDatum: string;
  offenerMaengelCount: number;
}

export type MaengelStatus = "offen" | "in_bearbeitung" | "erledigt";

export interface Mangel {
  id: string;
  baustellenId: string;
  kategorie: string;
  beschreibung: string;
  status: MaengelStatus;
  lat: number;
  lng: number;
  erstelltAm: string;
}

export interface Dokument {
  id: string;
  baustellenId: string;
  titel: string;
  typ: "pdf" | "bild" | "protokoll" | "sonstiges";
  hochgeladenVon: "bauleiter" | "sachbearbeiter";
  hochgeladenAm: string;
}

export interface Bild {
  id: string;
  baustellenId: string;
  url: string; // Mock-URL oder Platzhalter
  beschreibung?: string;
  hochgeladenVon: "bauleiter" | "sachbearbeiter";
  hochgeladenAm: string;
}
```

### Beziehungen

- Jede **Baustelle** kann mehrere **Mängel**, **Dokumente** und **Bilder** haben.
- Alle Dokumente und Bilder sind über `baustellenId` fest mit einer Baustelle verknüpft.
- Wenn ein Bauleiter in seiner Ansicht etwas „hochlädt“ (Mock), taucht es automatisch bei der gleichen Baustelle in der Sachbearbeiter-Ansicht unter „Dokumente & Bilder“ auf (gemeinsamer Store).

---

## Navigation & Tabbar

Es gibt zwei Ebenen:

1. **User-Auswahl (Rollenwechsel)** – globales Menü im Header.
2. **Tabbar** – kontextsensitive Tabs je Rolle.

### User-Auswahl

- Position: oben rechts im `AppHeader.vue`.
- Darstellung: Button oder Dropdown mit aktuellem User-Typ (z. B. „Sachbearbeiter:in“).
- Menüeinträge:
    - „Sachbearbeiter:in“
    - „Bauleiter:in“
    - „Passant:in“
- Beim Rollenwechsel:
    - ändern sich die sichtbaren Tabs in der Tabbar,
    - wird ggf. auf einen passenden Standard-Tab der Rolle navigiert.

### Tabbar

- Desktop: direkt unter dem Header als horizontale Tabs.
- Mobile: am unteren Rand als klassische Tabbar.
- Tabs je Rolle:

#### Tabs für Sachbearbeiter:in (Standard-Role beim App-Start)

1. **„Baustellen“**
    - Ansicht: große Liste/Tabelle aller Baustellen.
    - Funktionen:
        - Filter (Status, Priorität, Stadtteil).
        - Suche (Name, Adresse, ID).
        - Klick → Baustellendetail.

2. **„Mängel“**
    - Ansicht: Liste aller Mängel (alle Baustellen).
    - Spalten: Kategorie, Kurzbeschreibung, zugehörige Baustelle, Status, Datum.
    - Klick → Mängeldetail oder direkt Baustellendetail (Mängel-Tab aktiv).

3. **„Karte“**
    - Ansicht: Karte mit allen Baustellen- und Mängelmarkern.
    - Filter/Legende:
        - Anzeigen: nur Baustellen, nur Mängel oder beides.
    - Klick → Popup mit Kurzinfos + „Details ansehen“.

#### Tabs für Bauleiter:in

1. **„Meine Baustellen“**
    - Liste der Baustellen, für die `bauleiterId` = aktuelle Role-ID ist (Mock).
2. **„Karte“** (optional)
    - Karte nur mit „eigenen“ Baustellen.
3. **„Uploads“** (optional, falls nicht im Detail)
    - Alternativ: Upload-Funktion direkt im Baustellendetail.

#### Tabs für Passant:in

1. **„Mängel melden“**
    - Hauptscreen: Karte + FAB „Mangel melden“ + Formularpanel.
2. **„Meldungen“**
    - Liste der (gemockten) eigenen Meldungen.
3. **„Karte“**
    - Karte mit allen Mängeln in Neu-Ulm.

---

## Screens / Views

### Routes (Beispiel)

- `/` – Redirect zur Standard-Rolle (Sachbearbeiter) und Tab „Baustellen“.
- `/sb/baustellen` – Sachbearbeiter: Baustellenliste.
- `/sb/maengel` – Sachbearbeiter: Mängelliste.
- `/sb/karte` – Sachbearbeiter: Kartenansicht.
- `/bl/projects` – Bauleiter: Meine Baustellen.
- `/bl/projects/:id` – Bauleiter: Baustellendetail.
- `/pa/report` – Passant: Mängel melden.
- `/pa/meldungen` – Passant: Meldungenliste.

### Screens für Sachbearbeiter:in

#### Tab „Baustellen“

- Vollbild-Liste/Tabelle aller Baustellen.
- Elemente:
    - Filterleiste oben (Chips / Dropdowns).
    - Suchfeld.
    - Tabelle mit Spalten:
        - Name, Adresse, Status, Priorität, Zeitraum, Anzahl offener Mängel.
    - Klick auf Reihe:
        - Navigiert zu **Baustellendetail** (Sachbearbeiter-Sicht).

#### Tab „Mängel“

- Liste aller Mängel über alle Baustellen.
- Elemente:
    - Filter (Status, Kategorie, Zeitraum).
    - Spalten:
        - Kategorie, Kurzbeschreibung, Baustellenname, Status, Datum.
    - Klick:
        - Öffnet ein Mängel-Detailpanel **oder**
        - Navigiert direkt zum Baustellendetail mit aktivem „Mängel“-Tab.

#### Tab „Karte“

- Karte zentriert auf Neu-Ulm (OpenStreetMap).
- Marker:
    - Baustellenmarker (Icon/Farbe nach Status/Priorität).
    - Mängelmarker (andere Form/Farbe).
- Seitenpanel (links oder rechts):
    - Umschalter „Baustellen“ / „Mängel“ / „Beides“.
    - Liste der aktuell sichtbaren Elemente.
- Klick auf Marker:
    - Popup mit Name/Kategorie, Status, Kurzbeschreibung.
    - Button „Details“ → Baustellendetail / Mängelkontext.

### Screens für Bauleiter:in

#### Tab „Meine Baustellen“

- Liste nur der Baustellen, für die der aktuelle Bauleiter verantwortlich ist.
- Spalten:
    - Name, Adresse, Status, Zeitraum, offene Mängel.
- Klick → `/bl/projects/:id` (Baustellendetail).

#### Screen „Baustellendetail (Bauleiter)“

- Header:
    - Baustellenname, ID, Status-Badge.
    - Adresse.
- Tabs:
    1. **„Übersicht“**
        - Stammdaten, kleiner Kartenabschnitt, Kurzstatistiken.
    2. **„Dokumente“**
        - Liste (Titel, Typ, hochgeladenAm, hochgeladenVon).
        - Button „Dokument hochladen“ → Dialog → Dummy-Eintrag anlegen.
    3. **„Bilder“**
        - Galerie mit Thumbnails.
        - Button „Foto hinzufügen“ → Dummy-Bild hinzufügen.

### Screens für Passant:in

#### Tab „Mängel melden“

- Vollbild-Karte + FAB „Mangel melden“.
- Flow:
    - Klick auf FAB:
        - Formularpanel (Bottom Sheet oder Seitenpanel):
            - Kategorie (Dropdown).
            - Beschreibung (Textarea).
            - Position: aus letztem Kartenklick übernehmen (oder per Button „Position wählen“).
            - Button „Absenden“ → Mock-Mangel im Store hinzufügen.

#### Tab „Meldungen“

- Liste der (gemockten) Meldungen der Passant-Rolle.
- Anzeige:
    - Kategorie, Kurzbeschreibung, Status, Datum, Position (als Link zur Karte).

#### Tab „Karte“

- Karte mit allen Mängeln.
- Klick auf Marker:
    - Popup mit Kategorie, Kurztext, Status.

---

## Baustellendetail – gemeinsame Basis (Sachbearbeiter & Bauleiter)

- Header:
    - Baustellenname, ID, Status-Badge.
    - Adresse.
    - Für Sachbearbeiter: Dropdown „Status ändern“ (Mock).
- Tabs:
    1. **„Übersicht“**
        - Stammdaten (Zeitraum, Firma, Verantwortliche, Priorität).
        - Kleine Karte mit Marker der Baustelle.
        - einfache Timeline (z. B. „Mangel gemeldet“, „Mangel geprüft“, „Maßnahme gestartet“ – Mock).
    2. **„Mängel“**
        - Liste der Mängel **nur dieser Baustelle**.
        - Sachbearbeiter: Status änderbar (Dropdown).
        - Bauleiter: read-only oder eingeschränkte Bearbeitung (Mock nach Bedarf).
    3. **„Dokumente & Bilder“**
        - Dokumentenliste + Bildgalerie.
        - Bauleiter:
            - Buttons „Dokument hochladen“ / „Bild hinzufügen“ (Dummy-Einträge).
        - Sachbearbeiter:
            - Sieht alle Einträge, aber ohne Upload-Buttons (read-only).

---

## Karten-Verhalten (Mock)

- Karte in `MapView.vue` kapseln.
- Start-Zoom und Center:
    - Neu-Ulm als Standardzentrum (OSM).
- Marker-Daten:
    - Aus Mock-Stores für Baustellen und Mängel.
- Interaktionen:
    - Klick auf Marker → `selectedItem` im Store setzen, Detailpanel öffnen.
    - Filter in Sidebar/Panel ändern, welche Marker sichtbar sind.

---

## Mock-Daten

- Datei `mockData.ts` mit Beispiel-Baustellen, Mängeln, Dokumenten, Bildern.
- Beim App-Start lädt der Store diese Daten einmalig in den State.
- Änderungen (z. B. Statuswechsel, neue Mängel, neue Doku-Einträge) wirken nur im Frontend-State.

---

## Komponenten-Skizze

- `AppHeader.vue`
    - Titel „NeuBautUlm“.
    - RoleSwitch (Sachbearbeiter / Bauleiter / Passant).
- `RoleSwitch.vue`
    - Dropdown oder Menu für Rollenwechsel.
- `Tabbar.vue`
    - Tabs abhängig von aktueller Rolle.
- `MapView.vue`
    - Leaflet/OSM-Map, Marker-Rendering für Baustellen und Mängel.
- `SidebarFilters.vue`
    - Filter + Liste (für Sachbearbeiter-Karte).
- `BaustellenListView.vue`
    - Tab „Baustellen“ (Sachbearbeiter).
- `MaengelListView.vue`
    - Tab „Mängel“ (Sachbearbeiter).
- `ProjectList.vue`
    - „Meine Baustellen“ (Bauleiter).
- `ProjectDetail.vue`
    - Baustellendetail (Tabs Übersicht/Mängel/Dokumente & Bilder).
- `DefectReportView.vue`
    - Passanten-Screen „Mängel melden“.
- `DefectForm.vue`
    - Formularpanel für neue Meldung.

---

## Entwicklungs-Workflow (Vibe Coding)

1. Diese `CLAUDE.md` als **Single Source of Truth** nutzen.
2. Projekt scaffolden (z. B.):  
   `npm create vite@latest neubautulm -- --template vue`
3. Basis-Struktur:
    - Layout mit `AppHeader` + `Tabbar` + `router-view`.
    - `RoleSwitch` einbauen (Rolle global im Store halten).
4. Tabbar so implementieren, dass sie abhängig von der Rolle die passenden Tabs zeigt.
5. Map-Komponente integrieren (Leaflet/OSM) und mit Mock-Markern füllen.
6. Schrittweise die Liste-/Detail-Views für Sachbearbeiter umsetzen (Baustellen, Mängel).
7. Danach Bauleiter- und Passanten-Views ergänzen.
8. Bei neuen Anforderungen **zuerst** diese `CLAUDE.md` aktualisieren, dann Code anpassen.