<template>
  <div style="width: 100%; height: 100%; min-height: 350px; border-radius: 8px; overflow: hidden;">
    <l-map
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
    >
      <!-- CartoDB Dark Matter — no API key needed -->
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        :max-zoom="19"
      />

      <!-- Baustellen markers (circle with border ring) -->
      <l-circle-marker
        v-for="b in baustellen"
        :key="b.id"
        :lat-lng="[b.lat, b.lng]"
        :radius="10"
        :color="baustelleRingColor(b.status)"
        :fill-color="baustelleFillColor(b.status)"
        :fill-opacity="0.9"
        :weight="2.5"
        @click="emit('baustelleClick', b)"
      >
        <l-popup>
          <div class="map-popup">
            <div class="map-popup-tag map-popup-tag--baustelle">Baustelle</div>
            <div class="map-popup-title">{{ b.name }}</div>
            <div class="map-popup-addr">{{ b.adresse }}</div>
            <div class="map-popup-row">
              <span class="map-popup-dot" :style="{ background: baustelleRingColor(b.status) }" />
              <span class="map-popup-status">{{ baustelleStatusLabel(b.status) }}</span>
            </div>
            <a class="map-popup-link" href="#" @click.prevent="emit('baustelleDetail', b.id)">Details ansehen →</a>
          </div>
        </l-popup>
      </l-circle-marker>

      <!-- Mängel markers (smaller, diamond-ish via smaller radius + distinct colors) -->
      <l-circle-marker
        v-for="m in maengel"
        :key="m.id"
        :lat-lng="[m.lat, m.lng]"
        :radius="6"
        :color="maengelColor(m.status)"
        :fill-color="maengelColor(m.status)"
        :fill-opacity="1"
        :weight="0"
        @click="emit('mangelClick', m)"
      >
        <l-popup>
          <div class="map-popup">
            <div class="map-popup-tag map-popup-tag--mangel">Mangel</div>
            <div class="map-popup-title">{{ m.kategorie }}</div>
            <div class="map-popup-addr">{{ m.beschreibung }}</div>
            <div class="map-popup-row">
              <span class="map-popup-dot" :style="{ background: maengelColor(m.status) }" />
              <span class="map-popup-status">{{ maengelStatusLabel(m.status) }}</span>
            </div>
            <a class="map-popup-link" href="#" @click.prevent="emit('mangelDetail', m)">Details ansehen →</a>
          </div>
        </l-popup>
      </l-circle-marker>
    </l-map>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { LMap, LTileLayer, LPopup, LCircleMarker } from '@vue-leaflet/vue-leaflet'
import type { Baustelle, Mangel, MaengelStatus, BaustellenStatus } from '../types/types'

withDefaults(defineProps<{
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
  mangelDetail: [m: Mangel]
  mapClick: [latlng: { lat: number; lng: number }]
}>()

// Baustellen: larger ring marker — neon accent on dark map
function baustelleFillColor(status: BaustellenStatus) {
  return { offen: '#F59E0B', in_pruefung: '#A78BFA', abgeschlossen: '#34D399' }[status]
}
function baustelleRingColor(status: BaustellenStatus) {
  return { offen: '#FDE68A', in_pruefung: '#DDD6FE', abgeschlossen: '#6EE7B7' }[status]
}

// Mängel: smaller solid dot
function maengelColor(status: MaengelStatus) {
  return { offen: '#FB923C', in_bearbeitung: '#60A5FA', erledigt: '#4ADE80' }[status]
}

function maengelStatusLabel(status: MaengelStatus) {
  return { offen: 'Offen', in_bearbeitung: 'In Bearbeitung', erledigt: 'Erledigt' }[status]
}
function baustelleStatusLabel(status: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[status]
}
</script>

<style>
/* ── Leaflet UI overrides for dark theme ── */
.leaflet-control-zoom a {
  background: #1E293B !important;
  color: #94A3B8 !important;
  border-color: #334155 !important;
}
.leaflet-control-zoom a:hover {
  background: #334155 !important;
  color: #F1F5F9 !important;
}
.leaflet-control-attribution {
  background: rgba(15, 23, 42, 0.7) !important;
  color: #475569 !important;
  font-size: 9px !important;
}
.leaflet-control-attribution a {
  color: #64748B !important;
}

/* ── Dark popup ── */
.leaflet-popup-content-wrapper {
  background: #0F172A !important;
  border: 1px solid #1E293B !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
  padding: 0 !important;
}
.leaflet-popup-content {
  margin: 0 !important;
  width: auto !important;
}
.leaflet-popup-tip {
  background: #0F172A !important;
}
.leaflet-popup-close-button {
  color: #475569 !important;
  top: 8px !important;
  right: 10px !important;
}
.leaflet-popup-close-button:hover {
  color: #94A3B8 !important;
}

/* ── Popup content ── */
.map-popup {
  font-family: 'DM Sans', sans-serif;
  min-width: 190px;
  padding: 14px 16px;
}
.map-popup-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 2px 7px;
  border-radius: 4px;
  margin-bottom: 8px;
}
.map-popup-tag--baustelle {
  background: rgba(37, 99, 235, 0.2);
  color: #93C5FD;
}
.map-popup-tag--mangel {
  background: rgba(245, 158, 11, 0.2);
  color: #FCD34D;
}
.map-popup-title {
  font-size: 13px;
  font-weight: 700;
  color: #F1F5F9;
  margin-bottom: 3px;
  line-height: 1.2;
}
.map-popup-addr {
  font-size: 11.5px;
  color: #64748B;
  margin-bottom: 8px;
  line-height: 1.3;
}
.map-popup-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}
.map-popup-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.map-popup-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #64748B;
}
.map-popup-link {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #63B3ED;
  text-decoration: none;
  border-top: 1px solid #1E293B;
  padding-top: 8px;
  margin-top: 2px;
  transition: color 0.12s;
}
.map-popup-link:hover {
  color: #93C5FD;
}
</style>
