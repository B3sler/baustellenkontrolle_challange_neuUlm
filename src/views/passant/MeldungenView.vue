<template>
  <div class="mv-view">
    <div class="mv-header">
      <h1 class="bp-heading mv-title">Meine Meldungen</h1>
      <p class="mv-subtitle bp-mono">Ihre gemeldeten Mängel im Überblick</p>
    </div>

    <!-- KPI Row -->
    <div class="mv-kpi-section">
      <div class="bp-kpi-row">
        <div class="bp-kpi-block">
          <div class="bp-kpi-value">{{ meldungen.length }}</div>
          <div class="bp-kpi-label">Gesamt</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#F59E0B">{{ kpiGemeldet }}</div>
          <div class="bp-kpi-label">Gemeldet</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#3B82F6">{{ kpiBearbeitung }}</div>
          <div class="bp-kpi-label">In Bearbeitung</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#22C55E">{{ kpiAbgeschlossen }}</div>
          <div class="bp-kpi-label">Abgeschlossen</div>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="mv-list">
      <div v-if="meldungen.length === 0" class="mv-empty">
        <v-icon size="40" color="#CBD5E1">mdi-inbox-outline</v-icon>
        <p class="bp-mono mv-empty-text">Noch keine Meldungen vorhanden</p>
      </div>

      <div
        v-for="m in meldungen"
        :key="m.id"
        class="mv-item"
      >
        <div class="mv-item-left">
          <div class="mv-item-kategorie bp-mono">{{ m.kategorie }}</div>
          <div class="mv-item-desc">{{ m.beschreibung }}</div>
          <div class="mv-item-meta">
            <span class="bp-mono mv-item-date">
              <v-icon size="11">mdi-calendar</v-icon>
              {{ m.erstelltAm }}
            </span>
            <button class="mv-map-link" @click="router.push('/pa/karte')">
              <v-icon size="11">mdi-map-marker</v-icon>
              {{ m.lat.toFixed(4) }}, {{ m.lng.toFixed(4) }}
            </button>
          </div>
        </div>
        <div class="mv-item-right">
          <span class="bp-status">
            <span class="bp-dot" :class="`bp-dot--${m.status}`" />
            {{ statusLabel(m.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMaengelStore } from '../../stores/maengelStore'
import type { MaengelStatus } from '../../types/types'

const router = useRouter()
const maengelStore = useMaengelStore()

const meldungen = computed(() =>
  maengelStore.maengel.filter(m => m.id.startsWith('mg-p-') || m.id === 'mg-1' || m.id === 'mg-4')
)

const kpiGemeldet = computed(() => meldungen.value.filter(m => m.status === 'gemeldet').length)
const kpiBearbeitung = computed(() => meldungen.value.filter(m => m.status === 'in_bearbeitung').length)
const kpiAbgeschlossen = computed(() => meldungen.value.filter(m => m.status === 'abgeschlossen').length)

function statusLabel(s: MaengelStatus) {
  return { gemeldet: 'Gemeldet', in_bearbeitung: 'In Bearbeitung', ueberprueft: 'Überprüft', abgemahnt: 'Abgemahnt', abgeschlossen: 'Abgeschlossen' }[s]
}
</script>

<style scoped>
.mv-view {
  background: #F8FAFC;
  min-height: 100%;
}

.mv-header {
  padding: 24px 24px 0;
}

.mv-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.mv-subtitle {
  font-size: 10px;
  color: #94A3B8;
  margin-top: 3px;
  letter-spacing: 0.06em;
}

.mv-kpi-section {
  padding: 16px 24px 0;
}

.mv-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px 24px;
}

.mv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px;
}

.mv-empty-text {
  font-size: 11px;
  color: #CBD5E1;
  letter-spacing: 0.06em;
}

.mv-item {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  transition: border-color 0.15s;
}
.mv-item:hover {
  border-color: #CBD5E1;
}

.mv-item-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.mv-item-kategorie {
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2563EB;
}

.mv-item-desc {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #0F172A;
}

.mv-item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}

.mv-item-date {
  font-size: 10px;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 3px;
}

.mv-map-link {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  color: #63B3ED;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0;
  transition: color 0.15s;
}
.mv-map-link:hover {
  color: #2563EB;
}

.mv-item-right {
  flex-shrink: 0;
  padding-top: 2px;
}
</style>
