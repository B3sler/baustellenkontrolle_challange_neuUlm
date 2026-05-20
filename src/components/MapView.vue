<template>
  <div style="width: 100%; height: 100%; min-height: 350px; border-radius: 8px; overflow: hidden;">
    <l-map
      ref="mapRef"
      :zoom="zoom"
      :center="center"
      :use-global-leaflet="false"
    >
      <!-- CartoDB Positron — light grey, minimal, no API key needed -->
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        :max-zoom="19"
      />

      <!-- Baustellen markers -->
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

      <!-- Mängel markers -->
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

function baustelleFillColor(status: BaustellenStatus) {
  return { offen: '#F59E0B', in_pruefung: '#8B5CF6', abgeschlossen: '#22C55E' }[status]
}
function baustelleRingColor(status: BaustellenStatus) {
  return { offen: '#D97706', in_pruefung: '#7C3AED', abgeschlossen: '#16A34A' }[status]
}
function maengelColor(status: MaengelStatus) {
  return { offen: '#EF4444', in_bearbeitung: '#3B82F6', erledigt: '#22C55E' }[status]
}
function maengelStatusLabel(status: MaengelStatus) {
  return { offen: 'Offen', in_bearbeitung: 'In Bearbeitung', erledigt: 'Erledigt' }[status]
}
function baustelleStatusLabel(status: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[status]
}
</script>

<style>
/* ── Leaflet UI: match site style ── */
.leaflet-control-zoom a {
  font-family: 'DM Sans', sans-serif !important;
  background: #ffffff !important;
  color: #64748B !important;
  border-color: #E2E8F0 !important;
  font-weight: 600 !important;
}
.leaflet-control-zoom a:hover {
  background: #F1F5F9 !important;
  color: #0F172A !important;
}
.leaflet-control-attribution {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 9px !important;
  background: rgba(255, 255, 255, 0.85) !important;
  color: #94A3B8 !important;
  border-radius: 6px 0 0 0 !important;
  padding: 2px 6px !important;
}
.leaflet-control-attribution a {
  color: #64748B !important;
}

/* ── Popup shell ── */
.leaflet-popup-content-wrapper {
  background: #ffffff !important;
  border: 1px solid #E2E8F0 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
  padding: 0 !important;
}
.leaflet-popup-content {
  margin: 0 !important;
  width: auto !important;
}
.leaflet-popup-tip {
  background: #ffffff !important;
  box-shadow: none !important;
}
.leaflet-popup-close-button {
  font-family: 'DM Sans', sans-serif !important;
  color: #94A3B8 !important;
  top: 8px !important;
  right: 10px !important;
  font-size: 16px !important;
}
.leaflet-popup-close-button:hover {
  color: #0F172A !important;
}

/* ── Popup content — project fonts ── */
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
  background: #EFF6FF;
  color: #2563EB;
}
.map-popup-tag--mangel {
  background: #FEF2F2;
  color: #DC2626;
}
.map-popup-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 3px;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.map-popup-addr {
  font-family: 'DM Sans', sans-serif;
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
  letter-spacing: 0.03em;
}
.map-popup-link {
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563EB;
  text-decoration: none;
  border-top: 1px solid #F1F5F9;
  padding-top: 8px;
  margin-top: 2px;
  transition: color 0.12s;
}
.map-popup-link:hover {
  color: #1D4ED8;
}
</style>
