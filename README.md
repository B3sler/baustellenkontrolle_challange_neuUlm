# NeuBautUlm

**Kommunales Baustellen- und Mängelmanagement für die Stadt Neu-Ulm**

Eine interaktive Frontend-Demo für das digitale Management von Baustellen, Mängeln und Dokumenten im öffentlichen Raum. Gebaut als vollständig klickbarer UI-Prototyp mit Mock-Daten — ohne echtes Backend.

🔗 **Live-Demo:** [b3sler.github.io/baustellenkontrolle_challange_neuUlm](https://b3sler.github.io/baustellenkontrolle_challange_neuUlm/)

---

## Überblick

NeuBautUlm bildet drei Nutzerrollen ab, die jeweils eigene Ansichten und Berechtigungen haben:

| Rolle | Beschreibung |
|---|---|
| **Sachbearbeiter:in** | Zentrale Verwaltung aller Baustellen und Mängel, Statusbearbeitung, Kartenübersicht |
| **Bauleiter:in** | Eigene Baustellen einsehen, Dokumente und Fotos hochladen (Mock) |
| **Passant:in** | Mängel im öffentlichen Raum auf der Karte melden |

Der Rollenwechsel erfolgt direkt über die Navigationsleiste — keine Authentifizierung erforderlich.

---

## Features

### Sachbearbeiter:in
- **Baustellenliste** mit Filter nach Status und Priorität sowie Freitextsuche
- **Mängelliste** über alle Baustellen mit Status- und Kategoriefilter
- **Kartenansicht** (OpenStreetMap) mit farbcodierten Markern für Baustellen und Mängel
- **Baustellendetail** mit:
  - Stammdaten (Firma, Ansprechpartner, Genehmigungsnummer, Auftragswert)
  - Kartenausschnitt + Verlaufs-Timeline
  - Mängelliste mit Statusbearbeitung (Dropdown)
  - Dokumenten- und Bildergalerie (read-only)
- Baustellenstatus ändern (Offen → In Prüfung → Abgeschlossen)

### Bauleiter:in
- Liste der eigenen Baustellen
- Dokumente hochladen (Dummy-Eintrag wird im Store angelegt)
- Fotos hinzufügen (zufälliges Platzhalterbild via picsum.photos)

### Passant:in
- Vollbild-Karte mit allen gemeldeten Mängeln (farbcodiert nach Status)
- Mangel melden: Klick auf Karte → Position übernehmen → Formular ausfüllen → absenden
- Meldungsliste mit eigenen Einträgen
- Separate Kartenansicht aller Mängel

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
- **Schriften:** Bricolage Grotesque (Überschriften) · DM Sans (Fließtext) · JetBrains Mono (Daten/Labels)
- **Farben:** Slate-Palette mit Blau (#2563EB) als Primärfarbe
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
│   │   ├── BaustellenListView.vue   # Tab: Baustellen
│   │   ├── BaustellenDetailView.vue # Detailseite mit Sub-Tabs
│   │   ├── MaengelListView.vue      # Tab: Mängel
│   │   └── KarteView.vue            # Tab: Karte
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
│   ├── maengelStore.ts      # Mängel + Statusänderungen
│   └── roleStore.ts         # Aktive Rolle (sachbearbeiter / bauleiter / passant)
├── data/
│   └── mockData.ts          # Alle Mock-Daten (6 Baustellen, Mängel, Dokumente, Bilder)
├── types/
│   └── types.ts             # TypeScript-Interfaces (Baustelle, Mangel, Dokument, Bild)
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
  status: 'offen' | 'in_bearbeitung' | 'erledigt'
  lat: number
  lng: number
  erstelltAm: string
}
```

Alle Daten leben ausschließlich im Pinia-Store (initialisiert aus `mockData.ts`). Änderungen (Statuswechsel, neue Mängel, neue Dokumente) sind nur im Frontend-State — kein Backend, kein LocalStorage.

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

Die App enthält 6 realistische Baustellen in Neu-Ulm:

| ID | Name | Firma | Status |
|---|---|---|---|
| bs-1 | Straßensanierung Augsburger Str. | Strabag AG | In Prüfung |
| bs-2 | Kanalarbeiten Innenstadt | Leonhard Weiss | Offen |
| bs-3 | Gehwegerneuerung Wileystr. | Max Bögl | Abgeschlossen |
| bs-4 | Brückenreparatur B10 | Eurovia | Offen |
| bs-5 | Neubau Kreisverkehr Ludwigsfeld | Züblin AG | In Prüfung |
| bs-6 | Parkplatzsanierung Rathaus | Johann Bunte | Offen |

Jede Baustelle enthält automatisch einen **Antrag** und eine **Verkehrsrechtliche Anordnung (VRA)** als Pflichtdokumente.

---

## Bekannte Einschränkungen (Scope v1)

- Kein echtes Backend / keine Persistenz — alle Daten gehen beim Reload verloren
- Kein echter Datei-Upload — Dokumente und Bilder sind nur Dummy-Einträge
- Kein Login / keine echte Rollentrennung — Rollenwechsel ist nur ein UI-Toggle
- Kartenmarker verwenden feste Mock-Koordinaten in der Nähe von Neu-Ulm
- Nur Desktop optimiert — Mobile-Feintuning ist für eine spätere Version geplant

---

## Lizenz

Dieses Projekt ist ein interner Demo-Prototyp und nicht für den produktiven Einsatz vorgesehen.
