# NeuBautUlm

**Kommunales Baustellen- und Mängelmanagement für die Stadt Neu-Ulm**

Eine interaktive Frontend-Demo für das digitale Management von Baustellen, Mängeln und Dokumenten im öffentlichen Raum. Gebaut als vollständig klickbarer UI-Prototyp mit Mock-Daten — ohne echtes Backend.

🔗 **Live-Demo:** [b3sler.github.io/baustellenkontrolle_challange_neuUlm](https://b3sler.github.io/baustellenkontrolle_challange_neuUlm/)

> Die Demo ist passwortgeschützt. Zugang auf Anfrage.

---

## Überblick

NeuBautUlm bildet drei Nutzerrollen ab, die jeweils eigene Ansichten und Berechtigungen haben:

| Rolle | Beschreibung |
|---|---|
| **Sachbearbeiter:in** | Zentrale Verwaltung aller Baustellen und Mängel, Routenplanung, Statusbearbeitung, Kartenübersicht |
| **Bauleiter:in** | Eigene Baustellen einsehen, Kommentare zu Mängeln abgeben, Dokumente und Fotos hochladen |
| **Passant:in** | Mängel im öffentlichen Raum auf der Karte melden |

Der Rollenwechsel erfolgt direkt über ein **Segmented Control** in der Navigationsleiste — alle drei Rollen sind jederzeit sichtbar und per Klick sofort wechselbar, ohne Dropdown.

---

## Features

### Sachbearbeiter:in
- **Karte** (Startansicht) — OpenStreetMap mit farbcodierten Markern für alle Baustellen und Mängel, Klick öffnet Detailpopup mit Direktlink
- **Baustellenliste** — Filter nach Status und Priorität, Freitextsuche, Klick öffnet Detailseite
- **Mängelliste** — alle Mängel aller Baustellen, Status- und Kategoriefilter, Klick öffnet Mangel-Detailseite
- **Baustellendetail** mit vier Bereichen:
  - Stammdaten (Firma, Ansprechpartner, Telefon, E-Mail, Genehmigungsnummer, Auftragswert, Beschreibung)
  - Kartenausschnitt + Verlaufs-Timeline (no-scroll Layout)
  - Mängelliste der Baustelle mit Klick auf Mangel-Detailseite
  - Dokumenten- und Bildergalerie (read-only)
- **Mangel-Detailseite** — Stammdaten, Kommentarverlauf (Bauleiter/Sachbearbeiter farblich getrennt), Kommentar hinzufügen, Status per Dropdown ändern, „Als abgeschlossen markieren"-Button
- **Baustellenkontrollen** — intelligente Routenplanung:
  - Beliebige Baustellen per Checkbox auswählen
  - Nearest-Neighbor-Algorithmus berechnet optimale Route ab Rathaus Neu-Ulm
  - Anzeige: Gesamtstrecke (km), Fahrzeit, Kontrollzeit pro Stop (15 Min Basis + 8 Min pro offenem Mangel), Gesamtdauer
  - Nummerierte Route als gestrichelte Polylinie auf der Karte

### Bauleiter:in
- Liste der eigenen Baustellen mit Statusübersicht
- Baustellendetail mit Dokumenten- und Foto-Upload (Mock)
- **Mängel kommentieren** — Kommentar-Eingabe auf jeder Mangel-Detailseite, Kommentare erscheinen sofort im Verlauf für Sachbearbeiter sichtbar

### Passant:in
- Vollbild-Karte mit allen gemeldeten Mängeln (farbcodiert nach Status)
- Mangel melden: Klick auf Karte → Position übernehmen → Formular ausfüllen → absenden
- Meldungsliste mit eigenen Einträgen und Statusanzeige
- Separate Kartenansicht aller Mängel

---

## Mängel-Workflow

Mängel durchlaufen einen klar definierten 5-stufigen Status-Workflow:

| Status | Farbe | Bedeutung |
|---|---|---|
| **Gemeldet** | Amber | Mangel wurde eingereicht (Passant oder Bauleiter) |
| **In Bearbeitung** | Blau | Sachbearbeiter hat Bearbeitung aufgenommen |
| **Überprüft** | Lila | Mangel wurde vor Ort geprüft und bestätigt |
| **Abgemahnt** | Rot | Formelle Abmahnung an Auftragnehmer ausgesprochen |
| **Abgeschlossen** | Grün | Mangel vollständig behoben und dokumentiert |

Bauleiter können zu jedem Mangel Kommentare hinterlassen. Sachbearbeiter sehen alle Kommentare und können den Status jederzeit anpassen.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) + TypeScript |
| UI-Library | [Vuetify 4](https://vuetifyjs.com/) (Material Design 3) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Routing | [Vue Router 4](https://router.vuejs.org/) (Hash-Modus) |
| Karte | [Leaflet](https://leafletjs.com/) via [@vue-leaflet/vue-leaflet](https://github.com/vue-leaflet/vue-leaflet) |
| Kartenkacheln | [CartoDB Positron](https://carto.com/basemaps/) (OpenStreetMap-Basis, kein API-Key nötig) |
| Icons | [Material Design Icons](https://pictogrammers.com/library/mdi/) |
| Tests | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) |
| CI/CD | GitHub Actions → GitHub Pages |

### Design System (A2 Blueprint)
- **Schriften:** Barlow Semi Condensed (Überschriften/KPIs) · Barlow (Fließtext/Buttons) · IBM Plex Mono (Daten/Labels/Badges)
- **Farben:** Slate-Palette mit Blau (#2563EB) als Primärfarbe, Amber/Rot/Lila/Grün für Mängelstatus
- **Navigation:** Segmented Control für Rollenwechsel (Sachbearbeiter blau · Bauleiter orange · Passant grün), Pill-Tabs für Seitennavigation, zentriert per CSS Grid
- **Bilder:** Thematisch passende Unsplash-Fotos je Baustellentyp (Pflaster, Tiefbau, Kanal, Asphalt, Brücke, Promenade etc.)
- Globale Design-Tokens in `src/styles/blueprint.css`

---

## Projektstruktur

```
src/
├── components/
│   ├── PillNav.vue          # Hauptnavigation (Pill-Tabs + Rollenwechsel)
│   ├── MapView.vue          # Leaflet-Kartenkomponente (wiederverwendbar)
│   ├── DefectForm.vue       # Formular für Passanten-Meldung
│   └── SidebarFilters.vue   # Filterleiste für die Sachbearbeiter-Karte
├── views/
│   ├── sachbearbeiter/
│   │   ├── KarteView.vue            # Tab: Karte (Startansicht)
│   │   ├── BaustellenListView.vue   # Tab: Baustellen
│   │   ├── BaustellenDetailView.vue # Detailseite (Stammdaten, Mängel, Dokumente)
│   │   ├── MaengelListView.vue      # Tab: Mängel
│   │   ├── MangelDetailView.vue     # Mangel-Detail mit Kommentarverlauf
│   │   └── KontrollenView.vue       # Tab: Baustellenkontrollen + Routenplanung
│   ├── bauleiter/
│   │   ├── ProjectList.vue          # Tab: Meine Baustellen
│   │   ├── ProjectDetail.vue        # Baustellendetail (Upload-Buttons)
│   │   └── AnleitungView.vue        # Platzhalter
│   └── passant/
│       ├── DefectReportView.vue     # Tab: Mängel melden
│       ├── MeldungenView.vue        # Tab: Meldungen
│       ├── PassantKarteView.vue     # Tab: Karte
│       └── AnleitungView.vue        # Platzhalter
├── stores/
│   ├── baustellenStore.ts   # Baustellen, Dokumente, Bilder
│   ├── maengelStore.ts      # Mängel, Statusänderungen, Kommentare
│   └── roleStore.ts         # Aktive Rolle (sachbearbeiter / bauleiter / passant)
├── data/
│   └── mockData.ts          # Alle Mock-Daten (12 Baustellen, 22 Mängel, Kommentare)
├── types/
│   └── types.ts             # TypeScript-Interfaces (Baustelle, Mangel, Kommentar, Dokument, Bild)
├── router/
│   └── index.ts             # Vue Router mit allen Routen
└── styles/
    └── blueprint.css        # Globale Design-Tokens und Utility-Klassen
```

---

## Datenmodell

```ts
interface Baustelle {
  id: string
  name: string
  adresse: string
  status: 'offen' | 'in_pruefung' | 'abgeschlossen'
  prioritaet: 'hoch' | 'mittel' | 'niedrig'
  lat: number
  lng: number
  bauleiterId: string
  startDatum: string
  endDatum: string
  offenerMaengelCount: number
  firma: string
  ansprechpartner: string
  telefon: string
  email: string
  genehmigungsNr: string
  auftragswert: string
  beschreibung: string
}

interface Mangel {
  id: string
  baustellenId: string
  kategorie: string
  beschreibung: string
  status: 'gemeldet' | 'in_bearbeitung' | 'ueberprueft' | 'abgemahnt' | 'abgeschlossen'
  lat: number
  lng: number
  erstelltAm: string
  kommentare?: Kommentar[]
}

interface Kommentar {
  id: string
  text: string
  verfasserRolle: 'bauleiter' | 'sachbearbeiter'
  erstelltAm: string
}
```

Alle Daten leben ausschließlich im Pinia-Store (initialisiert aus `mockData.ts`). Änderungen (Statuswechsel, neue Mängel, neue Kommentare, neue Dokumente) sind nur im Frontend-State — kein Backend, kein LocalStorage.

---

## Lokale Entwicklung

**Voraussetzungen:** Node.js 20+

```bash
# Repository klonen
git clone https://github.com/B3sler/baustellenkontrolle_challange_neuUlm.git
cd baustellenkontrolle_challange_neuUlm

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann unter `http://localhost:5173`.

```bash
# Produktions-Build erstellen
npm run build

# Build lokal vorschauen
npm run preview

# Tests ausführen
npm test
```

---

## Deployment (GitHub Pages)

Das Deployment läuft vollautomatisch via GitHub Actions bei jedem Push auf `main`.

**Workflow:** `.github/workflows/deploy.yml`

```
Push auf main
  → npm ci
  → npm run build
  → dist/ wird auf GitHub Pages veröffentlicht
```

Voraussetzung: Im Repository unter `Settings → Pages → Source: GitHub Actions` aktiviert.

---

## Mock-Daten

Die App enthält 12 realistische Baustellen in Neu-Ulm mit insgesamt 22 Mängeln:

| ID | Name | Firma | Status |
|---|---|---|---|
| bs-1 | Bahnhofsplatz Sanierung | Strabag AG | Offen |
| bs-2 | Innenstadt Tiefbau Schillerstraße | Leonhard Weiss | In Prüfung |
| bs-3 | Wileystraße Kanalsanierung | Max Bögl | Offen |
| bs-4 | Ringstraße Asphaltierung | Eurovia | Abgeschlossen |
| bs-5 | Industriestraße Brückensanierung | Züblin AG | In Prüfung |
| bs-6 | Ludwigsplatz Pflasterung | Johann Bunte | Offen |
| bs-7 | Europastraße Fahrbahnmarkierung | Swarco | Offen |
| bs-8 | Gärtnerstraße Gehwegsanierung | Max Bögl | In Prüfung |
| bs-9 | Stadtpark Wegenetz Erneuerung | Johann Bunte | Abgeschlossen |
| bs-10 | Memminger Straße Leitungsverlegung | Leonhard Weiss | Offen |
| bs-11 | Silcherstraße Kreuzungsumbau | Strabag AG | In Prüfung |
| bs-12 | Donauufer Promenade Sanierung | Eurovia | Offen |

Jede Baustelle enthält automatisch einen **Antrag** und eine **Verkehrsrechtliche Anordnung (VRA)** als Pflichtdokumente. Ausgewählte Mängel haben bereits einen Kommentarverlauf als Beispieldaten.

---

## Zugang & Passwortschutz

Die Live-Demo auf GitHub Pages ist durch einen Passwort-Screen geschützt.

- Passwort wird **nicht im Quellcode** gespeichert
- Zur Build-Zeit via **GitHub Repository Secret** (`VITE_GATE_PASSWORD`) injiziert
- Lokal über `.env.local` konfiguriert (gitigniert)
- **Session-basiert** — der Zugang verfällt automatisch beim Schließen des Browser-Tabs

Für lokale Entwicklung `.env.local` anlegen:

```bash
VITE_GATE_PASSWORD=DemoKanu2026
```

Für GitHub Pages das Secret unter `Settings → Secrets and variables → Actions → New repository secret` hinterlegen.

---

## Bekannte Einschränkungen (Scope v1)

- Kein echtes Backend / keine Persistenz — alle Daten gehen beim Reload verloren
- Kein echter Datei-Upload — Dokumente und Bilder sind nur Dummy-Einträge
- Passwortschutz ist rein clientseitig — das Passwort liegt nach dem Build im JS-Bundle
- Routenplanung verwendet Haversine-Distanz (Luftlinie), keine echten Straßendistanzen
- Kartenmarker verwenden feste Mock-Koordinaten in der Nähe von Neu-Ulm
- Nur Desktop optimiert — Mobile-Feintuning ist für eine spätere Version geplant

---

## Lizenz

Dieses Projekt ist ein interner Demo-Prototyp und nicht für den produktiven Einsatz vorgesehen.
