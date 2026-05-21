<template>
  <div class="kv-view">

    <!-- Left panel: selection -->
    <div class="kv-panel">
      <div class="kv-panel-head">
        <div>
          <h2 class="kv-panel-title bp-heading">Baustellenkontrollen</h2>
          <p class="kv-panel-sub bp-mono">Baustellen auswählen, Route berechnen</p>
        </div>
        <div class="kv-sel-actions">
          <button class="kv-text-btn" @click="selectAll">Alle</button>
          <span class="kv-sep">·</span>
          <button class="kv-text-btn" @click="selectNone">Keine</button>
        </div>
      </div>

      <!-- Baustellen list -->
      <div class="kv-list">
        <label
          v-for="b in baustellen"
          :key="b.id"
          class="kv-item"
          :class="{ 'kv-item--selected': selected.has(b.id) }"
        >
          <input
            type="checkbox"
            class="kv-checkbox"
            :checked="selected.has(b.id)"
            @change="toggle(b.id)"
          />
          <div class="kv-item-body">
            <div class="kv-item-top">
              <span class="kv-item-name">{{ b.name }}</span>
              <span class="bp-prio" :class="`bp-prio--${b.prioritaet}`">{{ b.prioritaet }}</span>
            </div>
            <div class="kv-item-addr bp-mono">{{ b.adresse }}</div>
            <div class="kv-item-meta">
              <span class="bp-status">
                <span class="bp-dot" :class="`bp-dot--${b.status}`" />
                {{ baustelleStatusLabel(b.status) }}
              </span>
              <span class="kv-maengel-badge" :class="offeneMaengel(b.id) > 0 ? 'kv-maengel-badge--active' : ''">
                <v-icon size="10">mdi-alert-circle-outline</v-icon>
                {{ offeneMaengel(b.id) }} Mängel
              </span>
            </div>
          </div>
        </label>
      </div>

      <!-- Calculate button -->
      <div class="kv-panel-footer">
        <button
          class="kv-calc-btn"
          :disabled="selected.size === 0"
          @click="calculateRoute"
        >
          <v-icon size="16">mdi-map-marker-path</v-icon>
          Route berechnen ({{ selected.size }} Baustellen)
        </button>
      </div>

      <!-- Route summary -->
      <transition name="kv-fade">
        <div v-if="route.length > 0" class="kv-summary">
          <div class="kv-summary-head bp-mono">Routenzusammenfassung</div>

          <div class="kv-stats-row">
            <div class="kv-stat">
              <div class="kv-stat-value">{{ totalDistanceKm }} km</div>
              <div class="kv-stat-label bp-mono">Strecke</div>
            </div>
            <div class="kv-stat">
              <div class="kv-stat-value">{{ driveTimeMin }} min</div>
              <div class="kv-stat-label bp-mono">Fahrzeit</div>
            </div>
            <div class="kv-stat">
              <div class="kv-stat-value">{{ inspectTimeMin }} min</div>
              <div class="kv-stat-label bp-mono">Kontrollzeit</div>
            </div>
            <div class="kv-stat kv-stat--total">
              <div class="kv-stat-value">{{ totalTimeFormatted }}</div>
              <div class="kv-stat-label bp-mono">Gesamt</div>
            </div>
          </div>

          <div class="kv-route-list">
            <div class="kv-route-start">
              <div class="kv-route-num kv-route-num--start">S</div>
              <div class="kv-route-info">
                <span class="kv-route-name">Startpunkt</span>
                <span class="kv-route-detail bp-mono">Rathaus Neu-Ulm</span>
              </div>
            </div>
            <div v-for="(stop, i) in route" :key="stop.id" class="kv-route-stop">
              <div class="kv-route-connector" />
              <div class="kv-route-num">{{ i + 1 }}</div>
              <div class="kv-route-info">
                <span class="kv-route-name">{{ stop.name }}</span>
                <span class="kv-route-detail bp-mono">
                  ~{{ stopDuration(stop.id) }} min Kontrolle
                  <span v-if="offeneMaengel(stop.id) > 0" class="kv-route-mangel">
                    · {{ offeneMaengel(stop.id) }} offene Mängel
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Right: Map -->
    <div class="kv-map">
      <l-map
        :zoom="13"
        :center="mapCenter"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          :max-zoom="19"
        />

        <!-- Route polyline -->
        <l-polyline
          v-if="routeLatLngs.length > 1"
          :lat-lngs="routeLatLngs"
          color="#2563EB"
          :weight="3"
          :opacity="0.75"
          :dash-array="'8, 6'"
        />

        <!-- Start marker -->
        <l-circle-marker
          v-if="route.length > 0"
          :lat-lng="START"
          :radius="10"
          color="#0F172A"
          fill-color="#0F172A"
          :fill-opacity="1"
          :weight="0"
        >
          <l-popup><div class="map-popup" style="padding:10px 14px"><div class="map-popup-title">Startpunkt</div><div class="map-popup-addr">Rathaus Neu-Ulm</div></div></l-popup>
        </l-circle-marker>

        <!-- All Baustellen (unselected: muted) -->
        <l-circle-marker
          v-for="b in baustellen"
          :key="'bg-' + b.id"
          :lat-lng="[b.lat, b.lng]"
          :radius="8"
          :color="selected.has(b.id) ? '#2563EB' : '#CBD5E1'"
          :fill-color="selected.has(b.id) ? '#2563EB' : '#E2E8F0'"
          :fill-opacity="0.9"
          :weight="2"
        >
          <l-popup>
            <div class="map-popup" style="padding:12px 14px">
              <div class="map-popup-tag map-popup-tag--baustelle">Baustelle</div>
              <div class="map-popup-title">{{ b.name }}</div>
              <div class="map-popup-addr">{{ b.adresse }}</div>
              <div class="map-popup-row">
                <span class="map-popup-dot" :style="{ background: '#F59E0B' }" />
                <span class="map-popup-status">{{ offeneMaengel(b.id) }} offene Mängel</span>
              </div>
            </div>
          </l-popup>
        </l-circle-marker>

        <!-- Route stop numbers (shown on top) -->
        <l-circle-marker
          v-for="(stop, i) in route"
          :key="'rn-' + stop.id"
          :lat-lng="[stop.lat, stop.lng]"
          :radius="13"
          color="#1D4ED8"
          fill-color="#2563EB"
          :fill-opacity="1"
          :weight="2.5"
        >
          <l-tooltip :permanent="true" :direction="'top'" :offset="[0, -14]">
            <span style="font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;">{{ i + 1 }}</span>
          </l-tooltip>
        </l-circle-marker>

      </l-map>

      <!-- Empty state overlay -->
      <div v-if="route.length === 0 && selected.size === 0" class="kv-map-hint">
        <v-icon size="16" color="white">mdi-cursor-pointer</v-icon>
        Baustellen auswählen und Route berechnen
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { LMap, LTileLayer, LCircleMarker, LPolyline, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import type { Baustelle, BaustellenStatus } from '../../types/types'

const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()

const baustellen = computed(() => baustellenStore.baustellen)
const selected = ref<Set<string>>(new Set())
const route = ref<Baustelle[]>([])

const START: [number, number] = [48.3974, 10.001] // Rathaus Neu-Ulm
const CITY_SPEED_KMH = 30
const BASE_INSPECT_MIN = 15
const MANGEL_INSPECT_MIN = 8

// ── Selection ──────────────────────────────────────────────
function toggle(id: string) {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
  route.value = []
}
function selectAll() { selected.value = new Set(baustellen.value.map(b => b.id)); route.value = [] }
function selectNone() { selected.value = new Set(); route.value = [] }

// ── Helpers ────────────────────────────────────────────────
function offeneMaengel(baustellenId: string) {
  return maengelStore.getMaengelForBaustelle(baustellenId)
    .filter(m => m.status !== 'abgeschlossen').length
}

function stopDuration(baustellenId: string) {
  return BASE_INSPECT_MIN + offeneMaengel(baustellenId) * MANGEL_INSPECT_MIN
}

function baustelleStatusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}

// ── Haversine ──────────────────────────────────────────────
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── Nearest-Neighbor TSP ───────────────────────────────────
function nearestNeighbor(start: [number, number], stops: Baustelle[]): Baustelle[] {
  const unvisited = [...stops]
  const ordered: Baustelle[] = []
  let [curLat, curLng] = start

  while (unvisited.length > 0) {
    let nearestIdx = 0
    let minDist = haversine(curLat, curLng, unvisited[0].lat, unvisited[0].lng)
    for (let i = 1; i < unvisited.length; i++) {
      const d = haversine(curLat, curLng, unvisited[i].lat, unvisited[i].lng)
      if (d < minDist) { minDist = d; nearestIdx = i }
    }
    const next = unvisited.splice(nearestIdx, 1)[0]
    ordered.push(next)
    curLat = next.lat
    curLng = next.lng
  }
  return ordered
}

// ── Calculate ──────────────────────────────────────────────
function calculateRoute() {
  const stops = baustellen.value.filter(b => selected.value.has(b.id))
  route.value = nearestNeighbor(START, stops)
}

// ── Route geometry ─────────────────────────────────────────
const routeLatLngs = computed((): [number, number][] => {
  if (route.value.length === 0) return []
  return [START, ...route.value.map(b => [b.lat, b.lng] as [number, number])]
})

// ── Stats ──────────────────────────────────────────────────
const totalDistanceKm = computed(() => {
  if (routeLatLngs.value.length < 2) return '0'
  let d = 0
  for (let i = 0; i < routeLatLngs.value.length - 1; i++) {
    d += haversine(...routeLatLngs.value[i], ...routeLatLngs.value[i + 1])
  }
  return d.toFixed(1)
})

const driveTimeMin = computed(() => {
  return Math.round(Number(totalDistanceKm.value) / CITY_SPEED_KMH * 60)
})

const inspectTimeMin = computed(() => {
  return route.value.reduce((sum, b) => sum + stopDuration(b.id), 0)
})

const totalTimeFormatted = computed(() => {
  const total = driveTimeMin.value + inspectTimeMin.value
  const h = Math.floor(total / 60)
  const m = total % 60
  return h > 0 ? `${h}h ${m}min` : `${m} min`
})

const mapCenter = computed((): [number, number] => {
  if (route.value.length === 0) return START
  const lats = route.value.map(b => b.lat)
  const lngs = route.value.map(b => b.lng)
  return [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ]
})
</script>

<style scoped>
.kv-view {
  display: flex;
  height: calc(100vh - 56px);
  overflow: hidden;
  background: #F8FAFC;
}

/* ── Left panel ── */
.kv-panel {
  width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #E2E8F0;
  background: #fff;
  overflow: hidden;
}

.kv-panel-head {
  padding: 16px 18px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #F1F5F9;
  flex-shrink: 0;
}

.kv-panel-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.kv-panel-sub {
  font-size: 9.5px;
  color: #94A3B8;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.kv-sel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 2px;
}

.kv-text-btn {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  font-weight: 500;
  color: #2563EB;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  letter-spacing: 0.04em;
  transition: color 0.12s;
}
.kv-text-btn:hover { color: #1D4ED8; }

.kv-sep { color: #E2E8F0; font-size: 11px; }

/* ── List ── */
.kv-list {
  overflow-y: auto;
  flex: 1;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kv-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 10px;
  border: 1px solid #F1F5F9;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  background: #FAFAFA;
}
.kv-item:hover { border-color: #BFDBFE; background: #F8FBFF; }
.kv-item--selected {
  border-color: #2563EB;
  background: #EFF6FF;
}

.kv-checkbox {
  margin-top: 3px;
  width: 14px;
  height: 14px;
  accent-color: #2563EB;
  flex-shrink: 0;
  cursor: pointer;
}

.kv-item-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.kv-item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
}

.kv-item-name {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  line-height: 1.3;
}

.kv-item-addr {
  font-size: 9.5px;
  color: #94A3B8;
  letter-spacing: 0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kv-item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 2px;
}

.kv-maengel-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #94A3B8;
}
.kv-maengel-badge--active { color: #EF4444; }

/* ── Footer ── */
.kv-panel-footer {
  padding: 12px 14px;
  border-top: 1px solid #F1F5F9;
  flex-shrink: 0;
}

.kv-calc-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2563EB;
  border: none;
  border-radius: 8px;
  padding: 11px 16px;
  cursor: pointer;
  transition: background 0.15s;
}
.kv-calc-btn:hover { background: #1D4ED8; }
.kv-calc-btn:disabled { background: #CBD5E1; cursor: not-allowed; }

/* ── Summary ── */
.kv-summary {
  border-top: 1px solid #E2E8F0;
  padding: 14px;
  overflow-y: auto;
  max-height: 340px;
  flex-shrink: 0;
  background: #F8FAFC;
}

.kv-summary-head {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #CBD5E1;
  margin-bottom: 10px;
}

.kv-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #E2E8F0;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 14px;
}

.kv-stat {
  background: #fff;
  padding: 8px 8px;
  text-align: center;
}
.kv-stat--total { background: #EFF6FF; }

.kv-stat-value {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
}
.kv-stat--total .kv-stat-value { color: #2563EB; }

.kv-stat-label {
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94A3B8;
  margin-top: 2px;
}

/* Route list */
.kv-route-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.kv-route-start,
.kv-route-stop {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
}

.kv-route-connector {
  position: absolute;
  left: 11px;
  top: -8px;
  width: 2px;
  height: 8px;
  background: #E2E8F0;
}

.kv-route-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2563EB;
  color: #fff;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.kv-route-num--start { background: #0F172A; }

.kv-route-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding-bottom: 10px;
}

.kv-route-name {
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #0F172A;
}

.kv-route-detail {
  font-size: 9.5px;
  color: #94A3B8;
  letter-spacing: 0.03em;
}

.kv-route-mangel { color: #EF4444; }

/* ── Map ── */
.kv-map {
  flex: 1;
  position: relative;
}

.kv-map-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(8, 18, 43, 0.82);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 40px;
  border: 1px solid rgba(99, 179, 237, 0.2);
  white-space: nowrap;
}

/* Fade transition */
.kv-fade-enter-active,
.kv-fade-leave-active { transition: opacity 0.25s, transform 0.25s; }
.kv-fade-enter-from,
.kv-fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
