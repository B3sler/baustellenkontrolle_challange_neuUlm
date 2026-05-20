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
          <div class="map-popup">
            <div class="map-popup-tag map-popup-tag--baustelle">Baustelle</div>
            <div class="map-popup-title">{{ b.name }}</div>
            <div class="map-popup-addr">{{ b.adresse }}</div>
            <div class="map-popup-row">
              <span class="map-popup-dot" :style="{ background: baustelleStatusColor(b.status) }" />
              <span class="map-popup-status">{{ baustelleStatusLabel(b.status) }}</span>
            </div>
            <a class="map-popup-link" href="#" @click.prevent="emit('baustelleDetail', b.id)">Details ansehen →</a>
          </div>
        </l-popup>
      </l-marker>

      <!-- Mängel markers -->
      <l-circle-marker
        v-for="m in maengel"
        :key="m.id"
        :lat-lng="[m.lat, m.lng]"
        :radius="8"
        :color="maengelColor(m.status)"
        :fill-color="maengelColor(m.status)"
        :fill-opacity="0.85"
        :weight="2"
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
import { LMap, LTileLayer, LMarker, LPopup, LCircleMarker } from '@vue-leaflet/vue-leaflet'
import type { Baustelle, Mangel, MaengelStatus, BaustellenStatus } from '../types/types'

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
  mangelDetail: [m: Mangel]
  mapClick: [latlng: { lat: number; lng: number }]
}>()

function maengelColor(status: MaengelStatus) {
  return { offen: '#F59E0B', in_bearbeitung: '#3B82F6', erledigt: '#22C55E' }[status]
}
function maengelStatusLabel(status: MaengelStatus) {
  return { offen: 'Offen', in_bearbeitung: 'In Bearbeitung', erledigt: 'Erledigt' }[status]
}
function baustelleStatusColor(status: BaustellenStatus) {
  return { offen: '#F59E0B', in_pruefung: '#8B5CF6', abgeschlossen: '#22C55E' }[status]
}
function baustelleStatusLabel(status: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[status]
}
</script>

<style>
/* Popup styles — unscoped so Leaflet can render them */
.map-popup {
  font-family: 'DM Sans', sans-serif;
  min-width: 180px;
  padding: 2px 0;
}
.map-popup-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 2px 7px;
  border-radius: 4px;
  margin-bottom: 6px;
}
.map-popup-tag--baustelle {
  background: #EFF6FF;
  color: #2563EB;
}
.map-popup-tag--mangel {
  background: #FFFBEB;
  color: #92400E;
}
.map-popup-title {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 3px;
  line-height: 1.2;
}
.map-popup-addr {
  font-size: 11.5px;
  color: #64748B;
  margin-bottom: 7px;
  line-height: 1.3;
}
.map-popup-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
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
  color: #2563EB;
  text-decoration: none;
  border-top: 1px solid #F1F5F9;
  padding-top: 7px;
  margin-top: 2px;
  transition: color 0.12s;
}
.map-popup-link:hover {
  color: #1D4ED8;
}
</style>
