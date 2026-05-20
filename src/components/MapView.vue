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
// @ts-ignore
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
