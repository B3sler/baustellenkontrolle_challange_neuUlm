<template>
  <div class="dr-container">
    <!-- Map fills background -->
    <div class="dr-map">
      <l-map
        :zoom="13"
        :center="[48.3974, 10.001]"
        :use-global-leaflet="false"
        @click="onMapClick"
      >
        <l-tile-layer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          :max-zoom="19"
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
        <l-circle-marker
          v-if="selectedLat !== 0"
          :lat-lng="[selectedLat, selectedLng]"
          :radius="11"
          color="#2563EB"
          fill-color="#2563EB"
          :fill-opacity="0.5"
          :weight="2"
        />
      </l-map>
    </div>

    <!-- Click hint (shown when form is open but no position set) -->
    <div v-if="showForm && selectedLat === 0" class="dr-hint">
      <v-icon size="14" color="white">mdi-cursor-pointer</v-icon>
      Klicke auf die Karte um eine Position zu wählen
    </div>

    <!-- FAB -->
    <button v-if="!showForm" class="dr-fab" @click="showForm = true">
      <v-icon size="20" color="white">mdi-plus</v-icon>
      <span>Mangel melden</span>
    </button>

    <!-- Form panel -->
    <div v-if="showForm" class="dr-form-wrap">
      <DefectForm
        :lat="selectedLat"
        :lng="selectedLng"
        @submit="onSubmit"
        @cancel="onCancel"
      />
    </div>
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
  onCancel()
}

function onCancel() {
  showForm.value = false
  selectedLat.value = 0
  selectedLng.value = 0
}

function markerColor(status: MaengelStatus) {
  return { offen: '#EF4444', in_bearbeitung: '#3B82F6', erledigt: '#22C55E' }[status]
}
</script>

<style scoped>
.dr-container {
  position: relative;
  height: calc(100vh - 56px);
}

.dr-map {
  position: absolute;
  inset: 0;
}

.dr-hint {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(8, 18, 43, 0.82);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 40px;
  border: 1px solid rgba(99, 179, 237, 0.2);
  white-space: nowrap;
}

.dr-fab {
  position: absolute;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563EB;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 40px;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
}
.dr-fab:hover {
  background: #1D4ED8;
  box-shadow: 0 6px 28px rgba(37, 99, 235, 0.5);
  transform: translateY(-1px);
}
.dr-fab:active { transform: translateY(0); }

.dr-form-wrap {
  position: absolute;
  bottom: 28px;
  right: 28px;
  z-index: 1000;
}
</style>
