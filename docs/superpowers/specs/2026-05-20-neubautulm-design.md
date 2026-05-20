# NeuBautUlm – Design Spec

Date: 2026-05-20

## Overview

Mock-Frontend MVP für das kommunale Baustellen- und Mängelmanagement der Stadt Neu-Ulm.  
Drei Nutzerrollen: Sachbearbeiter:in, Bauleiter:in, Passant:in.  
Vollständig gemocker Frontend-State, keine Backendanbindung.

## Tech-Stack

| Bereich | Entscheidung |
|---|---|
| Framework | Vue 3 + Vite |
| Sprache | TypeScript |
| Router | Vue Router 4 |
| State | Pinia |
| UI | Vuetify 3 (Material Design 3) |
| Karte | Leaflet + `@vue-leaflet/vue-leaflet` |
| Daten | Mock-JSON im Pinia-Store |

## Projektstruktur

```
src/
├── components/
│   ├── AppHeader.vue        # Titel + RoleSwitch
│   ├── RoleSwitch.vue       # Dropdown Rollenwechsel
│   ├── Tabbar.vue           # Kontextsensitive Tabs je Rolle
│   ├── MapView.vue          # Leaflet/OSM-Karte
│   ├── SidebarFilters.vue   # Filter + Liste (Sachbearbeiter-Karte)
│   └── DefectForm.vue       # Meldungsformular (Passant)
├── views/
│   ├── sachbearbeiter/
│   │   ├── BaustellenListView.vue
│   │   ├── MaengelListView.vue
│   │   └── KarteView.vue
│   ├── bauleiter/
│   │   ├── ProjectList.vue
│   │   └── ProjectDetail.vue
│   └── passant/
│       ├── DefectReportView.vue
│       └── MeldungenView.vue
├── stores/
│   ├── roleStore.ts         # Aktuelle Rolle + User-ID
│   ├── baustellenStore.ts   # Baustellen + Dokumente + Bilder
│   └── maengelStore.ts      # Mängel
├── types/
│   └── types.ts             # Alle TypeScript-Interfaces
├── data/
│   └── mockData.ts          # Beispieldaten (5+ Baustellen, 10+ Mängel)
├── router/
│   └── index.ts             # Alle Routes
└── App.vue                  # Root mit v-app Layout
```

## Routing

```
/                    → redirect zu /sb/baustellen
/sb/baustellen       → Sachbearbeiter: Baustellenliste
/sb/baustellen/:id   → Sachbearbeiter: Baustellendetail
/sb/maengel          → Sachbearbeiter: Mängelliste
/sb/karte            → Sachbearbeiter: Kartenansicht
/bl/projects         → Bauleiter: Meine Baustellen
/bl/projects/:id     → Bauleiter: Baustellendetail
/pa/report           → Passant: Mängel melden
/pa/meldungen        → Passant: Meldungenliste
/pa/karte            → Passant: Karte
```

## State Management (Pinia)

### roleStore
- `currentRole`: `'sachbearbeiter' | 'bauleiter' | 'passant'`
- `currentBauleiterId`: string (für Bauleiter-Filter, z.B. `'bl-1'`)

### baustellenStore
- `baustellen`: `Baustelle[]` (aus mockData)
- `dokumente`: `Dokument[]`
- `bilder`: `Bild[]`
- Actions: `updateBaustellenStatus()`, `addDokument()`, `addBild()`

### maengelStore
- `maengel`: `Mangel[]` (aus mockData)
- Actions: `updateMangelStatus()`, `addMangel()`

## Datenmodell

Vollständig definiert in `CLAUDE.md` → `types.ts` übernimmt diese Interfaces 1:1.

## Mock-Daten

- 5+ Baustellen in Neu-Ulm (verschiedene Status, Prioritäten, 2 Bauleiter)
- 10+ Mängel verteilt auf Baustellen
- 5+ Dokumente, 5+ Bilder

## Karte

- Leaflet mit OpenStreetMap-Kacheln
- Zentrum: 48.3974° N, 10.0010° E (Neu-Ulm), Zoom 13
- Baustellenmarker: farbig nach Status/Priorität
- Mängelmarker: eigene Farbe/Icon
- Klick auf Marker → Popup mit Kurzinfo + „Details"-Button

## Rollenwechsel

- RoleSwitch in AppHeader
- Beim Wechsel: Tabbar aktualisiert sich, Router navigiert zum Standard-Tab der Rolle
- Sachbearbeiter ist Default beim App-Start

## UI-Prinzipien (Vuetify 3)

- Heller Hintergrund (`surface`, `background`)
- Primärfarbe: Blau (Neu-Ulm-Palette)
- `v-data-table` für Listen
- `v-tabs` für Detailansicht-Tabs
- `v-dialog` für Upload-Flows (Bauleiter)
- `v-bottom-sheet` oder `v-navigation-drawer` für Melde-Formular (Passant)
- FAB (`v-btn` mit `icon`) für „Mangel melden"
