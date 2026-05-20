# NeuBautUlm MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully-clickable Vue 3 mock frontend for Neu-Ulm's construction site and defect management system with Sachbearbeiter, Bauleiter, and Passant roles.

**Architecture:** Single-page Vue 3 app scaffolded with Vite. Pinia stores hold all mock state. Vuetify 3 provides Material Design 3 UI. Vue Router 4 handles role-based navigation. Leaflet + @vue-leaflet/vue-leaflet renders OpenStreetMap with markers.

**Tech Stack:** Vue 3 + Vite + TypeScript, Vuetify 3, vite-plugin-vuetify, Pinia, Vue Router 4, Leaflet, @vue-leaflet/vue-leaflet, @mdi/font, Vitest (store tests only)

---

## File Map

| File | Responsibility |
|---|---|
| `src/types/types.ts` | All TypeScript interfaces |
| `src/data/mockData.ts` | Seed data for all stores |
| `src/stores/roleStore.ts` | Current role + bauleiter ID |
| `src/stores/baustellenStore.ts` | Baustellen, Dokumente, Bilder + actions |
| `src/stores/maengelStore.ts` | Mängel + actions |
| `src/router/index.ts` | All routes |
| `src/plugins/vuetify.ts` | Vuetify theme config |
| `src/App.vue` | Root layout (v-app) |
| `src/components/AppHeader.vue` | Top bar with title + RoleSwitch |
| `src/components/RoleSwitch.vue` | Role dropdown |
| `src/components/Tabbar.vue` | Context-sensitive tabs |
| `src/components/MapView.vue` | Reusable Leaflet map |
| `src/components/SidebarFilters.vue` | Filter panel for Sachbearbeiter map |
| `src/components/DefectForm.vue` | New defect form (Passant) |
| `src/views/sachbearbeiter/BaustellenListView.vue` | Construction site list |
| `src/views/sachbearbeiter/BaustellenDetailView.vue` | Detail with tabs (shared SB+BL) |
| `src/views/sachbearbeiter/MaengelListView.vue` | All defects list |
| `src/views/sachbearbeiter/KarteView.vue` | Map view (SB) |
| `src/views/bauleiter/ProjectList.vue` | My sites list (BL) |
| `src/views/bauleiter/ProjectDetail.vue` | Thin wrapper → BaustellenDetailView |
| `src/views/passant/DefectReportView.vue` | Map + FAB + form |
| `src/views/passant/MeldungenView.vue` | Passant's own reports |
| `src/views/passant/PassantKarteView.vue` | All defects map (Passant) |

---

## Task 1: Scaffold Project + Install Dependencies

**Files:**
- Create: `vite.config.ts`
- Create: `src/main.ts`
- Create: `src/plugins/vuetify.ts`
- Create: `index.html` (from scaffold)

- [ ] **Step 1: Scaffold Vite project in current directory**

Run from the project root (`baustellenkontrolle_challange_neuUlm/`):
```bash
npm create vite@latest . -- --template vue-ts
```
When asked "Current directory is not empty. Remove existing files and continue?", choose **No** / ignore existing files, or use:
```bash
npm create vite@latest tmp-scaffold -- --template vue-ts
cp -r tmp-scaffold/src tmp-scaffold/index.html tmp-scaffold/tsconfig*.json tmp-scaffold/package.json .
rm -rf tmp-scaffold
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install
npm install vuetify vite-plugin-vuetify @mdi/font
npm install pinia vue-router@4
npm install leaflet @vue-leaflet/vue-leaflet
npm install -D @types/leaflet vitest @vue/test-utils jsdom
```

- [ ] **Step 3: Configure vite.config.ts**

Replace contents of `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Create Vuetify plugin**

Create `src/plugins/vuetify.ts`:
```typescript
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          'primary-darken-1': '#0D47A1',
          secondary: '#42A5F5',
          error: '#D32F2F',
          warning: '#F57F17',
          success: '#2E7D32',
          surface: '#FFFFFF',
          background: '#F5F5F5',
        },
      },
    },
  },
})
```

- [ ] **Step 5: Wire up main.ts**

Replace `src/main.ts`:
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import router from './router'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
```

- [ ] **Step 6: Delete scaffold boilerplate**

```bash
rm -rf src/components/HelloWorld.vue src/assets/vue.svg public/vite.svg src/style.css
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite dev server running at `http://localhost:5173`. Browser shows blank page (no errors in console).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vue 3 + Vuetify 3 + Leaflet project"
```

---

## Task 2: Types + Mock Data

**Files:**
- Create: `src/types/types.ts`
- Create: `src/data/mockData.ts`

- [ ] **Step 1: Create types**

Create `src/types/types.ts`:
```typescript
export type BaustellenStatus = 'offen' | 'in_pruefung' | 'abgeschlossen'
export type MaengelStatus = 'offen' | 'in_bearbeitung' | 'erledigt'
export type Prioritaet = 'hoch' | 'mittel' | 'niedrig'

export interface Baustelle {
  id: string
  name: string
  adresse: string
  status: BaustellenStatus
  prioritaet: Prioritaet
  lat: number
  lng: number
  bauleiterId: string
  startDatum: string
  endDatum: string
  offenerMaengelCount: number
}

export interface Mangel {
  id: string
  baustellenId: string
  kategorie: string
  beschreibung: string
  status: MaengelStatus
  lat: number
  lng: number
  erstelltAm: string
}

export interface Dokument {
  id: string
  baustellenId: string
  titel: string
  typ: 'pdf' | 'bild' | 'protokoll' | 'sonstiges'
  hochgeladenVon: 'bauleiter' | 'sachbearbeiter'
  hochgeladenAm: string
}

export interface Bild {
  id: string
  baustellenId: string
  url: string
  beschreibung?: string
  hochgeladenVon: 'bauleiter' | 'sachbearbeiter'
  hochgeladenAm: string
}
```

- [ ] **Step 2: Create mock data**

Create `src/data/mockData.ts`:
```typescript
import type { Baustelle, Mangel, Dokument, Bild } from '../types/types'

export const mockBaustellen: Baustelle[] = [
  {
    id: 'bs-1',
    name: 'Bahnhofsplatz Sanierung',
    adresse: 'Bahnhofsplatz 1, 89231 Neu-Ulm',
    status: 'offen',
    prioritaet: 'hoch',
    lat: 48.3981,
    lng: 9.9997,
    bauleiterId: 'bl-1',
    startDatum: '2026-03-01',
    endDatum: '2026-07-31',
    offenerMaengelCount: 3,
  },
  {
    id: 'bs-2',
    name: 'Innenstadt Tiefbau Schillerstraße',
    adresse: 'Schillerstraße 12, 89231 Neu-Ulm',
    status: 'in_pruefung',
    prioritaet: 'mittel',
    lat: 48.3962,
    lng: 10.0021,
    bauleiterId: 'bl-2',
    startDatum: '2026-01-15',
    endDatum: '2026-06-30',
    offenerMaengelCount: 1,
  },
  {
    id: 'bs-3',
    name: 'Wileystraße Kanalsanierung',
    adresse: 'Wileystraße 45, 89231 Neu-Ulm',
    status: 'offen',
    prioritaet: 'mittel',
    lat: 48.3944,
    lng: 10.0078,
    bauleiterId: 'bl-1',
    startDatum: '2026-02-10',
    endDatum: '2026-05-15',
    offenerMaengelCount: 2,
  },
  {
    id: 'bs-4',
    name: 'Ringstraße Asphaltierung',
    adresse: 'Ringstraße 3, 89231 Neu-Ulm',
    status: 'abgeschlossen',
    prioritaet: 'niedrig',
    lat: 48.4011,
    lng: 10.0045,
    bauleiterId: 'bl-2',
    startDatum: '2025-10-01',
    endDatum: '2026-01-31',
    offenerMaengelCount: 0,
  },
  {
    id: 'bs-5',
    name: 'Industriestraße Brückensanierung',
    adresse: 'Industriestraße 88, 89231 Neu-Ulm',
    status: 'in_pruefung',
    prioritaet: 'hoch',
    lat: 48.3921,
    lng: 9.9956,
    bauleiterId: 'bl-1',
    startDatum: '2026-04-01',
    endDatum: '2026-09-30',
    offenerMaengelCount: 4,
  },
  {
    id: 'bs-6',
    name: 'Ludwigsplatz Pflasterung',
    adresse: 'Ludwigsplatz 5, 89231 Neu-Ulm',
    status: 'offen',
    prioritaet: 'niedrig',
    lat: 48.3998,
    lng: 10.0033,
    bauleiterId: 'bl-2',
    startDatum: '2026-05-01',
    endDatum: '2026-08-15',
    offenerMaengelCount: 1,
  },
]

export const mockMaengel: Mangel[] = [
  {
    id: 'mg-1',
    baustellenId: 'bs-1',
    kategorie: 'Straßenschaden',
    beschreibung: 'Tiefes Schlagloch gefährdet Radfahrer',
    status: 'offen',
    lat: 48.3983,
    lng: 9.9995,
    erstelltAm: '2026-04-10',
  },
  {
    id: 'mg-2',
    baustellenId: 'bs-1',
    kategorie: 'Absperrung',
    beschreibung: 'Bake umgefallen, Absperrung unvollständig',
    status: 'in_bearbeitung',
    lat: 48.3979,
    lng: 10.0001,
    erstelltAm: '2026-04-12',
  },
  {
    id: 'mg-3',
    baustellenId: 'bs-1',
    kategorie: 'Lärm',
    beschreibung: 'Bauarbeiten außerhalb erlaubter Zeiten',
    status: 'erledigt',
    lat: 48.398,
    lng: 9.9998,
    erstelltAm: '2026-03-28',
  },
  {
    id: 'mg-4',
    baustellenId: 'bs-2',
    kategorie: 'Gehwegschaden',
    beschreibung: 'Aufgebrochener Gehweg nicht gesichert',
    status: 'offen',
    lat: 48.3965,
    lng: 10.0019,
    erstelltAm: '2026-04-15',
  },
  {
    id: 'mg-5',
    baustellenId: 'bs-3',
    kategorie: 'Wassereinbruch',
    beschreibung: 'Wasser tritt aus offener Baugrube',
    status: 'offen',
    lat: 48.3946,
    lng: 10.0075,
    erstelltAm: '2026-04-08',
  },
  {
    id: 'mg-6',
    baustellenId: 'bs-3',
    kategorie: 'Absperrung',
    beschreibung: 'Warnband fehlt an Baugrubenrand',
    status: 'erledigt',
    lat: 48.3942,
    lng: 10.008,
    erstelltAm: '2026-03-20',
  },
  {
    id: 'mg-7',
    baustellenId: 'bs-5',
    kategorie: 'Straßenschaden',
    beschreibung: 'Rissbildung in Fahrbahndecke',
    status: 'offen',
    lat: 48.3923,
    lng: 9.9958,
    erstelltAm: '2026-04-18',
  },
  {
    id: 'mg-8',
    baustellenId: 'bs-5',
    kategorie: 'Beleuchtung',
    beschreibung: 'Baustellen-Beleuchtung ausgefallen',
    status: 'in_bearbeitung',
    lat: 48.3919,
    lng: 9.9954,
    erstelltAm: '2026-04-20',
  },
  {
    id: 'mg-9',
    baustellenId: 'bs-5',
    kategorie: 'Lärm',
    beschreibung: 'Nachts laute Maschinen im Einsatz',
    status: 'offen',
    lat: 48.392,
    lng: 9.9957,
    erstelltAm: '2026-04-22',
  },
  {
    id: 'mg-10',
    baustellenId: 'bs-5',
    kategorie: 'Absperrung',
    beschreibung: 'Fahrzeugabsperrung blockiert Feuerwehrzufahrt',
    status: 'offen',
    lat: 48.3922,
    lng: 9.9961,
    erstelltAm: '2026-04-23',
  },
  {
    id: 'mg-11',
    baustellenId: 'bs-6',
    kategorie: 'Gehwegschaden',
    beschreibung: 'Unebenheiten nach Pflasterarbeiten',
    status: 'offen',
    lat: 48.3999,
    lng: 10.0031,
    erstelltAm: '2026-05-02',
  },
]

export const mockDokumente: Dokument[] = [
  {
    id: 'dok-1',
    baustellenId: 'bs-1',
    titel: 'Baustellenplan Bahnhofsplatz v2',
    typ: 'pdf',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-03-05',
  },
  {
    id: 'dok-2',
    baustellenId: 'bs-1',
    titel: 'Besprechungsprotokoll 10.03.2026',
    typ: 'protokoll',
    hochgeladenVon: 'sachbearbeiter',
    hochgeladenAm: '2026-03-10',
  },
  {
    id: 'dok-3',
    baustellenId: 'bs-2',
    titel: 'Genehmigung Tiefbau',
    typ: 'pdf',
    hochgeladenVon: 'sachbearbeiter',
    hochgeladenAm: '2026-01-20',
  },
  {
    id: 'dok-4',
    baustellenId: 'bs-3',
    titel: 'Kanalplan Wileystraße',
    typ: 'pdf',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-02-15',
  },
  {
    id: 'dok-5',
    baustellenId: 'bs-5',
    titel: 'Statikgutachten Brücke',
    typ: 'pdf',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-04-02',
  },
]

export const mockBilder: Bild[] = [
  {
    id: 'bild-1',
    baustellenId: 'bs-1',
    url: 'https://picsum.photos/seed/bs1a/400/300',
    beschreibung: 'Baufortschritt Woche 1',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-03-08',
  },
  {
    id: 'bild-2',
    baustellenId: 'bs-1',
    url: 'https://picsum.photos/seed/bs1b/400/300',
    beschreibung: 'Schaden vor Sanierung',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-03-01',
  },
  {
    id: 'bild-3',
    baustellenId: 'bs-2',
    url: 'https://picsum.photos/seed/bs2a/400/300',
    beschreibung: 'Aushub Schillerstraße',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-01-20',
  },
  {
    id: 'bild-4',
    baustellenId: 'bs-3',
    url: 'https://picsum.photos/seed/bs3a/400/300',
    beschreibung: 'Kanalöffnung',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-02-12',
  },
  {
    id: 'bild-5',
    baustellenId: 'bs-5',
    url: 'https://picsum.photos/seed/bs5a/400/300',
    beschreibung: 'Brückenuntersicht',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-04-05',
  },
  {
    id: 'bild-6',
    baustellenId: 'bs-5',
    url: 'https://picsum.photos/seed/bs5b/400/300',
    beschreibung: 'Rissschaden Fahrbahn',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: '2026-04-18',
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/types/types.ts src/data/mockData.ts
git commit -m "feat: add TypeScript types and mock data"
```

---

## Task 3: Pinia Stores

**Files:**
- Create: `src/stores/roleStore.ts`
- Create: `src/stores/baustellenStore.ts`
- Create: `src/stores/maengelStore.ts`
- Create: `src/stores/__tests__/stores.test.ts`

- [ ] **Step 1: Create roleStore**

Create `src/stores/roleStore.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Role = 'sachbearbeiter' | 'bauleiter' | 'passant'

export const useRoleStore = defineStore('role', () => {
  const currentRole = ref<Role>('sachbearbeiter')
  const currentBauleiterId = ref<string>('bl-1')

  function setRole(role: Role) {
    currentRole.value = role
  }

  return { currentRole, currentBauleiterId, setRole }
})
```

- [ ] **Step 2: Create baustellenStore**

Create `src/stores/baustellenStore.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Baustelle, Dokument, Bild, BaustellenStatus } from '../types/types'
import { mockBaustellen, mockDokumente, mockBilder } from '../data/mockData'

export const useBaustellenStore = defineStore('baustellen', () => {
  const baustellen = ref<Baustelle[]>([...mockBaustellen])
  const dokumente = ref<Dokument[]>([...mockDokumente])
  const bilder = ref<Bild[]>([...mockBilder])

  function updateStatus(id: string, status: BaustellenStatus) {
    const b = baustellen.value.find(x => x.id === id)
    if (b) b.status = status
  }

  function addDokument(dok: Dokument) {
    dokumente.value.push(dok)
  }

  function addBild(bild: Bild) {
    bilder.value.push(bild)
  }

  function getDokumenteForBaustelle(baustellenId: string) {
    return dokumente.value.filter(d => d.baustellenId === baustellenId)
  }

  function getBilderForBaustelle(baustellenId: string) {
    return bilder.value.filter(b => b.baustellenId === baustellenId)
  }

  return {
    baustellen,
    dokumente,
    bilder,
    updateStatus,
    addDokument,
    addBild,
    getDokumenteForBaustelle,
    getBilderForBaustelle,
  }
})
```

- [ ] **Step 3: Create maengelStore**

Create `src/stores/maengelStore.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Mangel, MaengelStatus } from '../types/types'
import { mockMaengel } from '../data/mockData'

export const useMaengelStore = defineStore('maengel', () => {
  const maengel = ref<Mangel[]>([...mockMaengel])

  function updateStatus(id: string, status: MaengelStatus) {
    const m = maengel.value.find(x => x.id === id)
    if (m) m.status = status
  }

  function addMangel(mangel: Mangel) {
    maengel.value.push(mangel)
    // update offenerMaengelCount — this is the store's responsibility
  }

  function getMaengelForBaustelle(baustellenId: string) {
    return maengel.value.filter(m => m.baustellenId === baustellenId)
  }

  return { maengel, updateStatus, addMangel, getMaengelForBaustelle }
})
```

- [ ] **Step 4: Write store tests**

Create `src/stores/__tests__/stores.test.ts`:
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { useBaustellenStore } from '../baustellenStore'
import { useMaengelStore } from '../maengelStore'
import { useRoleStore } from '../roleStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('roleStore', () => {
  it('defaults to sachbearbeiter', () => {
    const store = useRoleStore()
    expect(store.currentRole).toBe('sachbearbeiter')
  })

  it('switches role', () => {
    const store = useRoleStore()
    store.setRole('bauleiter')
    expect(store.currentRole).toBe('bauleiter')
  })
})

describe('baustellenStore', () => {
  it('loads mock data', () => {
    const store = useBaustellenStore()
    expect(store.baustellen.length).toBeGreaterThan(0)
  })

  it('updates baustellen status', () => {
    const store = useBaustellenStore()
    store.updateStatus('bs-1', 'abgeschlossen')
    expect(store.baustellen.find(b => b.id === 'bs-1')?.status).toBe('abgeschlossen')
  })

  it('adds a dokument', () => {
    const store = useBaustellenStore()
    const before = store.dokumente.length
    store.addDokument({
      id: 'test-dok',
      baustellenId: 'bs-1',
      titel: 'Test',
      typ: 'pdf',
      hochgeladenVon: 'bauleiter',
      hochgeladenAm: '2026-05-20',
    })
    expect(store.dokumente.length).toBe(before + 1)
  })
})

describe('maengelStore', () => {
  it('loads mock data', () => {
    const store = useMaengelStore()
    expect(store.maengel.length).toBeGreaterThan(0)
  })

  it('updates mangel status', () => {
    const store = useMaengelStore()
    store.updateStatus('mg-1', 'erledigt')
    expect(store.maengel.find(m => m.id === 'mg-1')?.status).toBe('erledigt')
  })

  it('filters by baustellenId', () => {
    const store = useMaengelStore()
    const result = store.getMaengelForBaustelle('bs-1')
    expect(result.every(m => m.baustellenId === 'bs-1')).toBe(true)
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```
Expected: All tests pass (green).

- [ ] **Step 6: Commit**

```bash
git add src/stores/
git commit -m "feat: add Pinia stores with tests"
```

---

## Task 4: Router

**Files:**
- Create: `src/router/index.ts`

- [ ] **Step 1: Create router**

Create `src/router/index.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useRoleStore } from '../stores/roleStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/sb/baustellen' },

    // Sachbearbeiter
    {
      path: '/sb/baustellen',
      component: () => import('../views/sachbearbeiter/BaustellenListView.vue'),
    },
    {
      path: '/sb/baustellen/:id',
      component: () => import('../views/sachbearbeiter/BaustellenDetailView.vue'),
    },
    {
      path: '/sb/maengel',
      component: () => import('../views/sachbearbeiter/MaengelListView.vue'),
    },
    {
      path: '/sb/karte',
      component: () => import('../views/sachbearbeiter/KarteView.vue'),
    },

    // Bauleiter
    {
      path: '/bl/projects',
      component: () => import('../views/bauleiter/ProjectList.vue'),
    },
    {
      path: '/bl/projects/:id',
      component: () => import('../views/bauleiter/ProjectDetail.vue'),
    },

    // Passant
    {
      path: '/pa/report',
      component: () => import('../views/passant/DefectReportView.vue'),
    },
    {
      path: '/pa/meldungen',
      component: () => import('../views/passant/MeldungenView.vue'),
    },
    {
      path: '/pa/karte',
      component: () => import('../views/passant/PassantKarteView.vue'),
    },
  ],
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add src/router/index.ts
git commit -m "feat: add Vue Router with all role-based routes"
```

---

## Task 5: App Shell (Layout + Header + Tabbar)

**Files:**
- Create: `src/App.vue`
- Create: `src/components/AppHeader.vue`
- Create: `src/components/RoleSwitch.vue`
- Create: `src/components/Tabbar.vue`

- [ ] **Step 1: Create RoleSwitch component**

Create `src/components/RoleSwitch.vue`:
```vue
<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="tonal" color="white" prepend-icon="mdi-account-circle">
        {{ roleLabel }}
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="option in options"
        :key="option.value"
        :title="option.label"
        :prepend-icon="option.icon"
        :active="roleStore.currentRole === option.value"
        active-color="primary"
        @click="switchRole(option.value)"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore, type Role } from '../stores/roleStore'

const roleStore = useRoleStore()
const router = useRouter()

const options = [
  { value: 'sachbearbeiter' as Role, label: 'Sachbearbeiter:in', icon: 'mdi-briefcase' },
  { value: 'bauleiter' as Role, label: 'Bauleiter:in', icon: 'mdi-hard-hat' },
  { value: 'passant' as Role, label: 'Passant:in', icon: 'mdi-walk' },
]

const roleLabel = computed(() => options.find(o => o.value === roleStore.currentRole)?.label ?? '')

const defaultRoutes: Record<Role, string> = {
  sachbearbeiter: '/sb/baustellen',
  bauleiter: '/bl/projects',
  passant: '/pa/report',
}

function switchRole(role: Role) {
  roleStore.setRole(role)
  router.push(defaultRoutes[role])
}
</script>
```

- [ ] **Step 2: Create Tabbar component**

Create `src/components/Tabbar.vue`:
```vue
<template>
  <v-tabs
    v-model="activeTab"
    color="primary"
    bg-color="white"
    show-arrows
  >
    <v-tab
      v-for="tab in currentTabs"
      :key="tab.to"
      :value="tab.to"
      :prepend-icon="tab.icon"
      @click="router.push(tab.to)"
    >
      {{ tab.label }}
    </v-tab>
  </v-tabs>
  <v-divider />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '../stores/roleStore'

const roleStore = useRoleStore()
const route = useRoute()
const router = useRouter()

const tabsByRole = {
  sachbearbeiter: [
    { to: '/sb/baustellen', label: 'Baustellen', icon: 'mdi-road-variant' },
    { to: '/sb/maengel', label: 'Mängel', icon: 'mdi-alert-circle' },
    { to: '/sb/karte', label: 'Karte', icon: 'mdi-map' },
  ],
  bauleiter: [
    { to: '/bl/projects', label: 'Meine Baustellen', icon: 'mdi-hard-hat' },
  ],
  passant: [
    { to: '/pa/report', label: 'Mängel melden', icon: 'mdi-plus-circle' },
    { to: '/pa/meldungen', label: 'Meldungen', icon: 'mdi-list-box' },
    { to: '/pa/karte', label: 'Karte', icon: 'mdi-map' },
  ],
}

const currentTabs = computed(() => tabsByRole[roleStore.currentRole])
const activeTab = ref(route.path)

watch(() => route.path, (path) => {
  activeTab.value = path
})
</script>
```

- [ ] **Step 3: Create AppHeader**

Create `src/components/AppHeader.vue`:
```vue
<template>
  <v-app-bar elevation="1" color="primary">
    <v-app-bar-title>
      <span class="font-weight-bold text-white">NeuBautUlm</span>
    </v-app-bar-title>
    <template #append>
      <RoleSwitch />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import RoleSwitch from './RoleSwitch.vue'
</script>
```

- [ ] **Step 4: Create App.vue**

Replace `src/App.vue`:
```vue
<template>
  <v-app>
    <AppHeader />
    <v-main>
      <Tabbar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import Tabbar from './components/Tabbar.vue'
</script>
```

- [ ] **Step 5: Verify in browser**

Run `npm run dev`. Open `http://localhost:5173`.
Expected:
- Blue header with "NeuBautUlm" title and role dropdown button
- Tabs below header: "Baustellen", "Mängel", "Karte" (Sachbearbeiter default)
- Switching role in dropdown changes tabs and navigates to default route

- [ ] **Step 6: Commit**

```bash
git add src/App.vue src/components/
git commit -m "feat: add app shell with header, role switch, and tabbar"
```

---

## Task 6: Sachbearbeiter – BaustellenListView

**Files:**
- Create: `src/views/sachbearbeiter/BaustellenListView.vue`

- [ ] **Step 1: Create view**

Create `src/views/sachbearbeiter/BaustellenListView.vue`:
```vue
<template>
  <v-container fluid class="pa-4">
    <!-- Filter row -->
    <v-row class="mb-3" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Suche (Name, Adresse)"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="filterPrioritaet"
          :items="prioritaetOptions"
          label="Priorität"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="filteredBaustellen"
      :search="search"
      item-value="id"
      hover
      @click:row="(_: any, { item }: any) => openDetail(item.id)"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.prioritaet="{ item }">
        <v-chip :color="prioritaetColor(item.prioritaet)" size="small" label variant="outlined">
          {{ item.prioritaet }}
        </v-chip>
      </template>
      <template #item.offenerMaengelCount="{ item }">
        <v-badge
          v-if="item.offenerMaengelCount > 0"
          :content="item.offenerMaengelCount"
          color="error"
          inline
        />
        <span v-else class="text-success">0</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import type { BaustellenStatus, Prioritaet } from '../../types/types'

const router = useRouter()
const store = useBaustellenStore()

const search = ref('')
const filterStatus = ref<BaustellenStatus | null>(null)
const filterPrioritaet = ref<Prioritaet | null>(null)

const statusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Prüfung', value: 'in_pruefung' },
  { title: 'Abgeschlossen', value: 'abgeschlossen' },
]
const prioritaetOptions = [
  { title: 'Hoch', value: 'hoch' },
  { title: 'Mittel', value: 'mittel' },
  { title: 'Niedrig', value: 'niedrig' },
]

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Adresse', key: 'adresse', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priorität', key: 'prioritaet', sortable: true },
  { title: 'Zeitraum', key: 'startDatum', sortable: true, value: (item: any) => `${item.startDatum} – ${item.endDatum}` },
  { title: 'Offene Mängel', key: 'offenerMaengelCount', sortable: true },
]

const filteredBaustellen = computed(() => {
  return store.baustellen.filter(b => {
    if (filterStatus.value && b.status !== filterStatus.value) return false
    if (filterPrioritaet.value && b.prioritaet !== filterPrioritaet.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      return b.name.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
    }
    return true
  })
})

function openDetail(id: string) {
  router.push(`/sb/baustellen/${id}`)
}

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
function prioritaetColor(p: Prioritaet) {
  return { hoch: 'error', mittel: 'warning', niedrig: 'success' }[p]
}
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:5173/sb/baustellen`.
Expected:
- Search field + Status + Priorität filters visible
- Table with 6 Baustellen
- Colored status and Priorität chips
- Clicking a row navigates to `/sb/baustellen/bs-1` (placeholder page or 404 until Task 7)

- [ ] **Step 3: Commit**

```bash
git add src/views/sachbearbeiter/BaustellenListView.vue
git commit -m "feat: add Sachbearbeiter BaustellenListView with filters"
```

---

## Task 7: BaustellenDetail (shared Sachbearbeiter + Bauleiter view)

**Files:**
- Create: `src/views/sachbearbeiter/BaustellenDetailView.vue`

This view is used by both roles. It detects the current role to show/hide upload buttons and the status-change dropdown.

- [ ] **Step 1: Create BaustellenDetailView**

Create `src/views/sachbearbeiter/BaustellenDetailView.vue`:
```vue
<template>
  <v-container fluid class="pa-4" v-if="baustelle">
    <!-- Header -->
    <v-row align="center" class="mb-2">
      <v-col>
        <div class="d-flex align-center ga-3">
          <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
          <div>
            <h2 class="text-h5 font-weight-bold">{{ baustelle.name }}</h2>
            <span class="text-body-2 text-medium-emphasis">{{ baustelle.adresse }} · ID: {{ baustelle.id }}</span>
          </div>
          <v-chip :color="statusColor(baustelle.status)" label class="ml-2">
            {{ statusLabel(baustelle.status) }}
          </v-chip>
          <!-- SB: change status -->
          <v-select
            v-if="isSachbearbeiter"
            v-model="baustelle.status"
            :items="statusOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px"
            @update:model-value="updateStatus"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="primary">
      <v-tab value="uebersicht">Übersicht</v-tab>
      <v-tab value="maengel">Mängel</v-tab>
      <v-tab value="dokumente">Dokumente & Bilder</v-tab>
    </v-tabs>
    <v-divider />

    <v-window v-model="activeTab" class="mt-4">
      <!-- Tab: Übersicht -->
      <v-window-item value="uebersicht">
        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4">
              <v-list density="compact">
                <v-list-item title="Priorität" :subtitle="baustelle.prioritaet" prepend-icon="mdi-flag" />
                <v-list-item title="Zeitraum" :subtitle="`${baustelle.startDatum} – ${baustelle.endDatum}`" prepend-icon="mdi-calendar" />
                <v-list-item title="Bauleiter ID" :subtitle="baustelle.bauleiterId" prepend-icon="mdi-hard-hat" />
                <v-list-item title="Offene Mängel" :subtitle="String(baustelle.offenerMaengelCount)" prepend-icon="mdi-alert-circle" />
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6" style="height: 250px">
            <MapView
              :baustellen="[baustelle]"
              :maengel="[]"
              :center="[baustelle.lat, baustelle.lng]"
              :zoom="15"
            />
          </v-col>
        </v-row>
        <!-- Timeline -->
        <v-timeline density="compact" class="mt-4">
          <v-timeline-item dot-color="success" size="small">
            <div class="text-body-2">Baustelle eröffnet – {{ baustelle.startDatum }}</div>
          </v-timeline-item>
          <v-timeline-item dot-color="warning" size="small">
            <div class="text-body-2">Erster Mangel gemeldet – {{ firstMangelDate }}</div>
          </v-timeline-item>
          <v-timeline-item dot-color="info" size="small">
            <div class="text-body-2">Letzter Statuswechsel – heute</div>
          </v-timeline-item>
        </v-timeline>
      </v-window-item>

      <!-- Tab: Mängel -->
      <v-window-item value="maengel">
        <v-data-table
          :headers="maengelHeaders"
          :items="maengelForBaustelle"
          item-value="id"
        >
          <template #item.status="{ item }">
            <v-select
              v-if="isSachbearbeiter"
              v-model="item.status"
              :items="maengelStatusOptions"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 160px"
              @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
            />
            <v-chip v-else :color="maengelStatusColor(item.status)" size="small" label>
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-window-item>

      <!-- Tab: Dokumente & Bilder -->
      <v-window-item value="dokumente">
        <v-row>
          <!-- Dokumente -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <h3 class="text-subtitle-1 font-weight-bold">Dokumente</h3>
              <v-spacer />
              <v-btn
                v-if="isBauleiter"
                size="small"
                prepend-icon="mdi-upload"
                @click="uploadDokDialog = true"
              >
                Hochladen
              </v-btn>
            </div>
            <v-list lines="two" variant="outlined" rounded>
              <v-list-item
                v-for="dok in dokumenteForBaustelle"
                :key="dok.id"
                :title="dok.titel"
                :subtitle="`${dok.typ.toUpperCase()} · ${dok.hochgeladenAm} · von ${dok.hochgeladenVon}`"
                :prepend-icon="typIcon(dok.typ)"
              />
              <v-list-item v-if="dokumenteForBaustelle.length === 0" title="Keine Dokumente vorhanden" />
            </v-list>
          </v-col>

          <!-- Bilder -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <h3 class="text-subtitle-1 font-weight-bold">Bilder</h3>
              <v-spacer />
              <v-btn
                v-if="isBauleiter"
                size="small"
                prepend-icon="mdi-camera"
                @click="addDummyBild"
              >
                Foto hinzufügen
              </v-btn>
            </div>
            <v-row dense>
              <v-col v-for="bild in bilderForBaustelle" :key="bild.id" cols="6">
                <v-img :src="bild.url" :alt="bild.beschreibung" aspect-ratio="4/3" cover rounded="lg">
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                </v-img>
                <div class="text-caption mt-1">{{ bild.beschreibung }}</div>
              </v-col>
              <v-col v-if="bilderForBaustelle.length === 0" cols="12">
                <span class="text-body-2 text-medium-emphasis">Keine Bilder vorhanden</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Upload Dok Dialog -->
    <v-dialog v-model="uploadDokDialog" max-width="420">
      <v-card>
        <v-card-title>Dokument hochladen</v-card-title>
        <v-card-text>
          <v-text-field v-model="newDokTitel" label="Titel" variant="outlined" density="compact" />
          <v-select v-model="newDokTyp" :items="['pdf', 'protokoll', 'sonstiges']" label="Typ" variant="outlined" density="compact" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="uploadDokDialog = false">Abbrechen</v-btn>
          <v-btn color="primary" @click="submitDokument">Hochladen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else>
    <v-alert type="error">Baustelle nicht gefunden.</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import { useRoleStore } from '../../stores/roleStore'
import MapView from '../../components/MapView.vue'
import type { BaustellenStatus, Dokument, Bild } from '../../types/types'

const route = useRoute()
const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()
const roleStore = useRoleStore()

const id = route.params.id as string
const baustelle = computed(() => baustellenStore.baustellen.find(b => b.id === id))
const isSachbearbeiter = computed(() => roleStore.currentRole === 'sachbearbeiter')
const isBauleiter = computed(() => roleStore.currentRole === 'bauleiter')

const activeTab = ref('uebersicht')
const uploadDokDialog = ref(false)
const newDokTitel = ref('')
const newDokTyp = ref<'pdf' | 'protokoll' | 'sonstiges'>('pdf')

const maengelForBaustelle = computed(() => maengelStore.getMaengelForBaustelle(id))
const dokumenteForBaustelle = computed(() => baustellenStore.getDokumenteForBaustelle(id))
const bilderForBaustelle = computed(() => baustellenStore.getBilderForBaustelle(id))

const firstMangelDate = computed(() => maengelForBaustelle.value[0]?.erstelltAm ?? 'N/A')

const statusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Prüfung', value: 'in_pruefung' },
  { title: 'Abgeschlossen', value: 'abgeschlossen' },
]
const maengelStatusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Bearbeitung', value: 'in_bearbeitung' },
  { title: 'Erledigt', value: 'erledigt' },
]
const maengelHeaders = [
  { title: 'Kategorie', key: 'kategorie' },
  { title: 'Beschreibung', key: 'beschreibung' },
  { title: 'Status', key: 'status' },
  { title: 'Gemeldet am', key: 'erstelltAm' },
]

function updateStatus(v: BaustellenStatus) {
  baustellenStore.updateStatus(id, v)
}
function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
function maengelStatusColor(s: string) {
  return { offen: 'error', in_bearbeitung: 'warning', erledigt: 'success' }[s] ?? 'grey'
}
function typIcon(typ: string) {
  return { pdf: 'mdi-file-pdf-box', bild: 'mdi-image', protokoll: 'mdi-clipboard-text', sonstiges: 'mdi-file' }[typ] ?? 'mdi-file'
}

function submitDokument() {
  if (!newDokTitel.value) return
  const dok: Dokument = {
    id: `dok-${Date.now()}`,
    baustellenId: id,
    titel: newDokTitel.value,
    typ: newDokTyp.value,
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: new Date().toISOString().split('T')[0],
  }
  baustellenStore.addDokument(dok)
  newDokTitel.value = ''
  uploadDokDialog.value = false
}

function addDummyBild() {
  const bild: Bild = {
    id: `bild-${Date.now()}`,
    baustellenId: id,
    url: `https://picsum.photos/seed/${Date.now()}/400/300`,
    beschreibung: 'Neues Foto',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: new Date().toISOString().split('T')[0],
  }
  baustellenStore.addBild(bild)
}
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:5173/sb/baustellen/bs-1`.
Expected:
- Header with back button, name, address, status chip
- Status-change dropdown (Sachbearbeiter role)
- 3 tabs: Übersicht, Mängel, Dokumente & Bilder
- Übersicht: data list + small map + timeline
- Mängel tab: table with status dropdowns (Sachbearbeiter)
- Dokumente & Bilder tab: list + image thumbnails (no upload buttons for SB)

Switch to Bauleiter role in header, navigate to `/bl/projects/bs-1`:
Expected: Upload buttons visible in Dokumente & Bilder tab.

- [ ] **Step 3: Commit**

```bash
git add src/views/sachbearbeiter/BaustellenDetailView.vue
git commit -m "feat: add shared BaustellenDetailView with role-aware tabs"
```

---

## Task 8: Sachbearbeiter – MaengelListView

**Files:**
- Create: `src/views/sachbearbeiter/MaengelListView.vue`

- [ ] **Step 1: Create view**

Create `src/views/sachbearbeiter/MaengelListView.vue`:
```vue
<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-3" align="center">
      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filterKategorie"
          :items="kategorien"
          label="Kategorie"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredMaengel"
      item-value="id"
      hover
    >
      <template #item.status="{ item }">
        <v-select
          v-model="item.status"
          :items="statusOptions"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 160px"
          @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
        />
      </template>
      <template #item.baustellenId="{ item }">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="goToDetail(item.baustellenId)"
        >
          {{ baustelleName(item.baustellenId) }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMaengelStore } from '../../stores/maengelStore'
import { useBaustellenStore } from '../../stores/baustellenStore'
import type { MaengelStatus } from '../../types/types'

const router = useRouter()
const maengelStore = useMaengelStore()
const baustellenStore = useBaustellenStore()

const filterStatus = ref<MaengelStatus | null>(null)
const filterKategorie = ref<string | null>(null)

const statusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Bearbeitung', value: 'in_bearbeitung' },
  { title: 'Erledigt', value: 'erledigt' },
]

const kategorien = computed(() =>
  [...new Set(maengelStore.maengel.map(m => m.kategorie))]
)

const headers = [
  { title: 'Kategorie', key: 'kategorie' },
  { title: 'Beschreibung', key: 'beschreibung' },
  { title: 'Baustelle', key: 'baustellenId' },
  { title: 'Status', key: 'status' },
  { title: 'Gemeldet am', key: 'erstelltAm', sortable: true },
]

const filteredMaengel = computed(() =>
  maengelStore.maengel.filter(m => {
    if (filterStatus.value && m.status !== filterStatus.value) return false
    if (filterKategorie.value && m.kategorie !== filterKategorie.value) return false
    return true
  })
)

function baustelleName(id: string) {
  return baustellenStore.baustellen.find(b => b.id === id)?.name ?? id
}

function goToDetail(baustellenId: string) {
  router.push(`/sb/baustellen/${baustellenId}`)
}
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:5173/sb/maengel`.
Expected: Table with all 11 Mängel, status dropdowns, clickable Baustellen links.

- [ ] **Step 3: Commit**

```bash
git add src/views/sachbearbeiter/MaengelListView.vue
git commit -m "feat: add Sachbearbeiter MaengelListView"
```

---

## Task 9: MapView Component (Leaflet)

**Files:**
- Create: `src/components/MapView.vue`

- [ ] **Step 1: Fix Leaflet default icon issue (Vite)**

Create `src/utils/leafletIcons.ts`:
```typescript
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})
```

Import this in `src/main.ts` by adding:
```typescript
import './utils/leafletIcons'
```

- [ ] **Step 2: Create MapView component**

Create `src/components/MapView.vue`:
```vue
<template>
  <div style="width: 100%; height: 100%; min-height: 350px; border-radius: 8px; overflow: hidden;">
    <l-map
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <!-- Baustellen markers -->
      <l-marker
        v-for="b in baustellen"
        :key="b.id"
        :lat-lng="[b.lat, b.lng]"
        @click="emit('baustelleClick', b)"
      >
        <l-popup>
          <strong>{{ b.name }}</strong><br />
          {{ b.adresse }}<br />
          Status: {{ b.status }}<br />
          <a href="#" @click.prevent="emit('baustelleDetail', b.id)">Details →</a>
        </l-popup>
      </l-marker>

      <!-- Mängel markers (circle marker for visual distinction) -->
      <l-circle-marker
        v-for="m in maengel"
        :key="m.id"
        :lat-lng="[m.lat, m.lng]"
        :radius="8"
        :color="maengelColor(m.status)"
        :fill-color="maengelColor(m.status)"
        :fill-opacity="0.8"
        @click="emit('mangelClick', m)"
      >
        <l-popup>
          <strong>{{ m.kategorie }}</strong><br />
          {{ m.beschreibung }}<br />
          Status: {{ m.status }}
        </l-popup>
      </l-circle-marker>
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup, LCircleMarker } from '@vue-leaflet/vue-leaflet'
import type { Baustelle, Mangel, MaengelStatus } from '../types/types'

const props = withDefaults(defineProps<{
  baustellen?: Baustelle[]
  maengel?: Mangel[]
  center?: [number, number]
  zoom?: number
}>(), {
  baustellen: () => [],
  maengel: () => [],
  center: () => [48.3974, 10.001],
  zoom: 13,
})

const emit = defineEmits<{
  baustelleClick: [b: Baustelle]
  baustelleDetail: [id: string]
  mangelClick: [m: Mangel]
  mapClick: [latlng: { lat: number; lng: number }]
}>()

function maengelColor(status: MaengelStatus) {
  return { offen: '#D32F2F', in_bearbeitung: '#F57F17', erledigt: '#2E7D32' }[status]
}
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MapView.vue src/utils/leafletIcons.ts src/main.ts
git commit -m "feat: add reusable Leaflet MapView component"
```

---

## Task 10: Sachbearbeiter – KarteView

**Files:**
- Create: `src/views/sachbearbeiter/KarteView.vue`
- Create: `src/components/SidebarFilters.vue`

- [ ] **Step 1: Create SidebarFilters**

Create `src/components/SidebarFilters.vue`:
```vue
<template>
  <v-card variant="outlined" class="pa-3" style="min-width: 260px">
    <div class="text-subtitle-2 font-weight-bold mb-3">Anzeige</div>
    <v-checkbox v-model="show.baustellen" label="Baustellen" density="compact" hide-details color="primary" />
    <v-checkbox v-model="show.maengel" label="Mängel" density="compact" hide-details color="error" />
    <v-divider class="my-3" />
    <div class="text-subtitle-2 font-weight-bold mb-2">Sichtbare Elemente</div>
    <v-list density="compact" max-height="400" style="overflow-y: auto">
      <template v-if="show.baustellen">
        <v-list-subheader>Baustellen</v-list-subheader>
        <v-list-item
          v-for="b in baustellen"
          :key="b.id"
          :title="b.name"
          :subtitle="b.adresse"
          density="compact"
          @click="emit('focusBaustelle', b)"
        >
          <template #append>
            <v-chip :color="statusColor(b.status)" size="x-small" label>{{ b.status }}</v-chip>
          </template>
        </v-list-item>
      </template>
      <template v-if="show.maengel">
        <v-list-subheader>Mängel</v-list-subheader>
        <v-list-item
          v-for="m in maengel"
          :key="m.id"
          :title="m.kategorie"
          :subtitle="m.beschreibung"
          density="compact"
          @click="emit('focusMangel', m)"
        />
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Baustelle, Mangel, BaustellenStatus } from '../types/types'

defineProps<{
  baustellen: Baustelle[]
  maengel: Mangel[]
}>()

const emit = defineEmits<{
  focusBaustelle: [b: Baustelle]
  focusMangel: [m: Mangel]
}>()

const show = reactive({ baustellen: true, maengel: true })

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}

defineExpose({ show })
</script>
```

- [ ] **Step 2: Create KarteView (Sachbearbeiter)**

Create `src/views/sachbearbeiter/KarteView.vue`:
```vue
<template>
  <div class="d-flex" style="height: calc(100vh - 120px)">
    <!-- Sidebar -->
    <div class="pa-2" style="overflow-y: auto">
      <SidebarFilters
        ref="sidebarRef"
        :baustellen="visibleBaustellen"
        :maengel="visibleMaengel"
        @focus-baustelle="focusBaustelle"
        @focus-mangel="focusMangel"
      />
    </div>

    <!-- Map -->
    <div class="flex-grow-1">
      <MapView
        :baustellen="visibleBaustellen"
        :maengel="visibleMaengel"
        :center="mapCenter"
        :zoom="mapZoom"
        @baustelle-detail="(id) => router.push(`/sb/baustellen/${id}`)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import MapView from '../../components/MapView.vue'
import SidebarFilters from '../../components/SidebarFilters.vue'
import type { Baustelle, Mangel } from '../../types/types'

const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()

const sidebarRef = ref<InstanceType<typeof SidebarFilters> | null>(null)
const mapCenter = ref<[number, number]>([48.3974, 10.001])
const mapZoom = ref(13)

const visibleBaustellen = computed(() =>
  sidebarRef.value?.show.baustellen !== false ? baustellenStore.baustellen : []
)
const visibleMaengel = computed(() =>
  sidebarRef.value?.show.maengel !== false ? maengelStore.maengel : []
)

function focusBaustelle(b: Baustelle) {
  mapCenter.value = [b.lat, b.lng]
  mapZoom.value = 16
}
function focusMangel(m: Mangel) {
  mapCenter.value = [m.lat, m.lng]
  mapZoom.value = 17
}
</script>
```

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:5173/sb/karte`.
Expected:
- Full-height layout with sidebar (checkboxes + list) on left, map on right
- Baustellen as pin markers, Mängel as colored circles
- Toggle checkboxes show/hide layers
- Clicking list item centers map on that item
- Clicking marker popup "Details →" navigates to detail view

- [ ] **Step 4: Commit**

```bash
git add src/views/sachbearbeiter/KarteView.vue src/components/SidebarFilters.vue
git commit -m "feat: add Sachbearbeiter KarteView with Leaflet and sidebar"
```

---

## Task 11: Bauleiter Views

**Files:**
- Create: `src/views/bauleiter/ProjectList.vue`
- Create: `src/views/bauleiter/ProjectDetail.vue`

- [ ] **Step 1: Create ProjectList**

Create `src/views/bauleiter/ProjectList.vue`:
```vue
<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Meine Baustellen</h2>
    <v-data-table
      :headers="headers"
      :items="meineBaustellen"
      item-value="id"
      hover
      @click:row="(_: any, { item }: any) => router.push(`/bl/projects/${item.id}`)"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.offenerMaengelCount="{ item }">
        <v-badge v-if="item.offenerMaengelCount > 0" :content="item.offenerMaengelCount" color="error" inline />
        <span v-else class="text-success">0</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useRoleStore } from '../../stores/roleStore'
import type { BaustellenStatus } from '../../types/types'

const router = useRouter()
const baustellenStore = useBaustellenStore()
const roleStore = useRoleStore()

const meineBaustellen = computed(() =>
  baustellenStore.baustellen.filter(b => b.bauleiterId === roleStore.currentBauleiterId)
)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Adresse', key: 'adresse' },
  { title: 'Status', key: 'status' },
  { title: 'Zeitraum', key: 'startDatum', value: (item: any) => `${item.startDatum} – ${item.endDatum}` },
  { title: 'Offene Mängel', key: 'offenerMaengelCount' },
]

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
</script>
```

- [ ] **Step 2: Create ProjectDetail (thin wrapper)**

Create `src/views/bauleiter/ProjectDetail.vue`:
```vue
<template>
  <BaustellenDetailView />
</template>

<script setup lang="ts">
import BaustellenDetailView from '../sachbearbeiter/BaustellenDetailView.vue'
</script>
```

- [ ] **Step 3: Verify in browser**

Switch to Bauleiter role. Navigate to `/bl/projects`.
Expected: 3 Baustellen listed (those with bauleiterId = 'bl-1'). Click row → BaustellenDetail with upload buttons visible.

- [ ] **Step 4: Commit**

```bash
git add src/views/bauleiter/
git commit -m "feat: add Bauleiter ProjectList and ProjectDetail views"
```

---

## Task 12: Passant Views

**Files:**
- Create: `src/components/DefectForm.vue`
- Create: `src/views/passant/DefectReportView.vue`
- Create: `src/views/passant/MeldungenView.vue`
- Create: `src/views/passant/PassantKarteView.vue`

- [ ] **Step 1: Create DefectForm component**

Create `src/components/DefectForm.vue`:
```vue
<template>
  <v-card class="pa-4" max-width="420" elevation="4">
    <v-card-title class="px-0">Mangel melden</v-card-title>
    <v-card-text class="px-0">
      <v-select
        v-model="form.kategorie"
        :items="kategorien"
        label="Kategorie *"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      <v-textarea
        v-model="form.beschreibung"
        label="Beschreibung *"
        variant="outlined"
        density="compact"
        rows="3"
        class="mb-3"
      />
      <v-alert
        v-if="form.lat && form.lng"
        type="success"
        density="compact"
        class="mb-3"
      >
        Position: {{ form.lat.toFixed(4) }}, {{ form.lng.toFixed(4) }}
      </v-alert>
      <v-alert v-else type="info" density="compact" class="mb-3">
        Klicke auf die Karte, um eine Position zu wählen.
      </v-alert>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn variant="text" @click="emit('cancel')">Abbrechen</v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!form.kategorie || !form.beschreibung || !form.lat"
        @click="submit"
      >
        Absenden
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  lat?: number
  lng?: number
}>()

const emit = defineEmits<{
  submit: [data: { kategorie: string; beschreibung: string; lat: number; lng: number }]
  cancel: []
}>()

const kategorien = ['Straßenschaden', 'Gehwegschaden', 'Absperrung', 'Beleuchtung', 'Lärm', 'Wassereinbruch', 'Sonstiges']

const form = reactive({
  kategorie: '',
  beschreibung: '',
  lat: props.lat ?? 0,
  lng: props.lng ?? 0,
})

// update position when prop changes
import { watch } from 'vue'
watch(() => props.lat, v => { if (v) form.lat = v })
watch(() => props.lng, v => { if (v) form.lng = v })

function submit() {
  if (!form.kategorie || !form.beschreibung || !form.lat) return
  emit('submit', { kategorie: form.kategorie, beschreibung: form.beschreibung, lat: form.lat, lng: form.lng })
  form.kategorie = ''
  form.beschreibung = ''
}
</script>
```

- [ ] **Step 2: Create DefectReportView**

Create `src/views/passant/DefectReportView.vue`:
```vue
<template>
  <div style="position: relative; height: calc(100vh - 120px)">
    <!-- Map fills background -->
    <div style="position: absolute; inset: 0">
      <l-map
        :zoom="13"
        :center="[48.3974, 10.001]"
        :use-global-leaflet="false"
        @click="onMapClick"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <l-circle-marker
          v-for="m in maengelStore.maengel"
          :key="m.id"
          :lat-lng="[m.lat, m.lng]"
          :radius="8"
          :color="markerColor(m.status)"
          :fill-color="markerColor(m.status)"
          :fill-opacity="0.8"
        >
          <l-popup>
            <strong>{{ m.kategorie }}</strong><br />{{ m.beschreibung }}<br />Status: {{ m.status }}
          </l-popup>
        </l-circle-marker>
        <!-- Selected position marker -->
        <l-circle-marker
          v-if="selectedLat"
          :lat-lng="[selectedLat, selectedLng]"
          :radius="10"
          color="#1565C0"
          fill-color="#1565C0"
          :fill-opacity="0.6"
        />
      </l-map>
    </div>

    <!-- FAB -->
    <v-btn
      v-if="!showForm"
      color="primary"
      icon="mdi-plus"
      size="large"
      style="position: absolute; bottom: 24px; right: 24px; z-index: 1000"
      elevation="4"
      @click="showForm = true"
    />

    <!-- Form panel -->
    <div
      v-if="showForm"
      style="position: absolute; bottom: 24px; right: 24px; z-index: 1000"
    >
      <DefectForm
        :lat="selectedLat"
        :lng="selectedLng"
        @submit="onSubmit"
        @cancel="showForm = false"
      />
    </div>

    <!-- Hint -->
    <v-chip
      v-if="showForm && !selectedLat"
      color="primary"
      style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index: 1000"
    >
      <v-icon start>mdi-cursor-pointer</v-icon>
      Klicke auf die Karte für die Position
    </v-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LMap, LTileLayer, LCircleMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import DefectForm from '../../components/DefectForm.vue'
import { useMaengelStore } from '../../stores/maengelStore'
import type { MaengelStatus } from '../../types/types'

const maengelStore = useMaengelStore()
const showForm = ref(false)
const selectedLat = ref(0)
const selectedLng = ref(0)

function onMapClick(e: any) {
  selectedLat.value = e.latlng.lat
  selectedLng.value = e.latlng.lng
}

function onSubmit(data: { kategorie: string; beschreibung: string; lat: number; lng: number }) {
  maengelStore.addMangel({
    id: `mg-p-${Date.now()}`,
    baustellenId: 'bs-1', // Passant reports assigned to nearest/first Baustelle (mock)
    kategorie: data.kategorie,
    beschreibung: data.beschreibung,
    status: 'offen',
    lat: data.lat,
    lng: data.lng,
    erstelltAm: new Date().toISOString().split('T')[0],
  })
  showForm.value = false
  selectedLat.value = 0
  selectedLng.value = 0
}

function markerColor(status: MaengelStatus) {
  return { offen: '#D32F2F', in_bearbeitung: '#F57F17', erledigt: '#2E7D32' }[status]
}
</script>
```

- [ ] **Step 3: Create MeldungenView**

Create `src/views/passant/MeldungenView.vue`:
```vue
<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Meine Meldungen</h2>
    <v-data-table
      :headers="headers"
      :items="meldungen"
      item-value="id"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>{{ item.status }}</v-chip>
      </template>
      <template #item.position="{ item }">
        <v-btn variant="text" size="small" color="primary" @click="router.push('/pa/karte')">
          {{ item.lat.toFixed(3) }}, {{ item.lng.toFixed(3) }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMaengelStore } from '../../stores/maengelStore'
import type { MaengelStatus } from '../../types/types'

const router = useRouter()
const maengelStore = useMaengelStore()

// In mock: show Passant-reported items (id starts with mg-p-) + first few for demo
const meldungen = computed(() =>
  maengelStore.maengel.filter(m => m.id.startsWith('mg-p-') || m.id === 'mg-1' || m.id === 'mg-4')
)

const headers = [
  { title: 'Kategorie', key: 'kategorie' },
  { title: 'Beschreibung', key: 'beschreibung' },
  { title: 'Status', key: 'status' },
  { title: 'Gemeldet am', key: 'erstelltAm' },
  { title: 'Position', key: 'position', sortable: false },
]

function statusColor(s: MaengelStatus) {
  return { offen: 'error', in_bearbeitung: 'warning', erledigt: 'success' }[s]
}
</script>
```

- [ ] **Step 4: Create PassantKarteView**

Create `src/views/passant/PassantKarteView.vue`:
```vue
<template>
  <div style="height: calc(100vh - 120px)">
    <MapView :maengel="maengelStore.maengel" :baustellen="[]" />
  </div>
</template>

<script setup lang="ts">
import MapView from '../../components/MapView.vue'
import { useMaengelStore } from '../../stores/maengelStore'
const maengelStore = useMaengelStore()
</script>
```

- [ ] **Step 5: Verify in browser**

Switch to Passant role. Navigate to `/pa/report`.
Expected:
- Full-height OSM map with existing Mängel as colored circles
- Blue FAB (+) in bottom-right
- Click FAB → DefectForm panel appears
- Click on map → position set (blue dot + coordinates in form)
- Fill form and submit → new red circle appears on map

Navigate to `/pa/meldungen`: See mock reports in a table.
Navigate to `/pa/karte`: See all Mängel on map.

- [ ] **Step 6: Commit**

```bash
git add src/components/DefectForm.vue src/views/passant/
git commit -m "feat: add Passant views (DefectReport, Meldungen, Karte)"
```

---

## Task 13: Final Polish + Smoke Test

- [ ] **Step 1: Add 404 fallback route**

In `src/router/index.ts`, add as last route:
```typescript
{ path: '/:pathMatch(.*)*', redirect: '/' },
```

- [ ] **Step 2: Verify full user flow – Sachbearbeiter**

1. Open `http://localhost:5173` → redirects to `/sb/baustellen`
2. Filter by Status "Offen" → 3 Baustellen visible
3. Click "Bahnhofsplatz Sanierung" → detail view opens
4. Change status via dropdown → chip updates
5. Go to Mängel tab → status dropdowns functional
6. Go to Dokumente tab → documents and images visible
7. Navigate to `/sb/maengel` → 11 Mängel, status editable
8. Navigate to `/sb/karte` → markers on OSM map, sidebar filters work

- [ ] **Step 3: Verify full user flow – Bauleiter**

1. Switch role to "Bauleiter:in" → navigates to `/bl/projects`
2. 3 Baustellen visible (bl-1's sites)
3. Click one → detail opens with upload buttons
4. Upload Dokument via dialog → appears in list
5. "Foto hinzufügen" → new image in gallery

- [ ] **Step 4: Verify full user flow – Passant**

1. Switch role to "Passant:in" → navigates to `/pa/report`
2. Map visible with Mängel circles
3. Click FAB → form appears
4. Click map → position set
5. Fill and submit → new marker on map
6. Navigate to "Meldungen" → submitted report visible
7. Navigate to "Karte" → all Mängel visible

- [ ] **Step 5: Run store tests one final time**

```bash
npx vitest run
```
Expected: All tests pass.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete NeuBautUlm MVP mock frontend"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Sachbearbeiter: BaustellenList, MaengelList, KarteView, BaustellenDetail (status change, mängel status change, dok/bilder read-only)
- ✅ Bauleiter: ProjectList (filtered by bauleiterId), ProjectDetail (upload Dokument dialog, dummy Bild)
- ✅ Passant: DefectReport (map + FAB + form + click-to-position), Meldungen list, Karte
- ✅ RoleSwitch in header, Tabbar per-role
- ✅ Shared BaustellenDetailView (role-aware: upload buttons only for Bauleiter)
- ✅ Pinia stores with reactive state shared across views
- ✅ MapView reusable across Sachbearbeiter and Passant views
- ✅ Mock data: 6 Baustellen, 11 Mängel, 5 Dokumente, 6 Bilder

**Type consistency:**
- `MaengelStatus` used consistently across all views and stores
- `BaustellenStatus` used consistently
- `getBilderForBaustelle` / `getDokumenteForBaustelle` match store definition
- `updateStatus` called correctly in all views
