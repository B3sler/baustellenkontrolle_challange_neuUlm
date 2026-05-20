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

    <!-- Hint when form open but no position selected -->
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
    baustellenId: 'bs-1',
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
