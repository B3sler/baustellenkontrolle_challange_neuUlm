<template>
  <div class="ml-view">
    <!-- KPI Row -->
    <div class="ml-kpi-section">
      <div class="bp-kpi-row">
        <div class="bp-kpi-block">
          <div class="bp-kpi-value">{{ maengelStore.maengel.length }}</div>
          <div class="bp-kpi-label">Gesamt</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#F59E0B">{{ kpiOffen }}</div>
          <div class="bp-kpi-label">Offen</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#3B82F6">{{ kpiInBearbeitung }}</div>
          <div class="bp-kpi-label">In Bearbeitung</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#22C55E">{{ kpiErledigt }}</div>
          <div class="bp-kpi-label">Erledigt</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="ml-filters bp-filter">
      <v-select
        v-model="filterStatus"
        :items="statusOptions"
        placeholder="Status"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="ml-filter-select"
      />
      <v-select
        v-model="filterKategorie"
        :items="kategorien"
        placeholder="Kategorie"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="ml-filter-select"
      />
      <span class="ml-count bp-mono">{{ filteredMaengel.length }} Mängel</span>
    </div>

    <!-- Table -->
    <div class="ml-table-wrap">
      <v-data-table
        :headers="headers"
        :items="filteredMaengel"
        item-value="id"
        hover
      >
        <template #item.kategorie="{ item }">
          <span class="bp-mono" style="font-size:10.5px;letter-spacing:0.04em;color:#64748B">{{ item.kategorie }}</span>
        </template>
        <template #item.beschreibung="{ item }">
          <span class="ml-desc">{{ item.beschreibung }}</span>
        </template>
        <template #item.baustellenId="{ item }">
          <button class="ml-link-btn" @click="goToDetail(item.baustellenId)">
            {{ baustelleName(item.baustellenId) }}
          </button>
        </template>
        <template #item.status="{ item }">
          <div class="ml-status-cell">
            <span class="bp-status">
              <span class="bp-dot" :class="`bp-dot--${item.status}`" />
              {{ statusLabel(item.status) }}
            </span>
            <v-select
              :model-value="item.status"
              :items="statusOptions"
              density="compact"
              variant="outlined"
              hide-details
              class="ml-status-select"
              @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
            />
          </div>
        </template>
        <template #item.erstelltAm="{ item }">
          <span class="bp-mono" style="font-size:11px;color:#64748B">{{ item.erstelltAm }}</span>
        </template>
      </v-data-table>
    </div>
  </div>
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

const kpiOffen = computed(() => maengelStore.maengel.filter(m => m.status === 'offen').length)
const kpiInBearbeitung = computed(() => maengelStore.maengel.filter(m => m.status === 'in_bearbeitung').length)
const kpiErledigt = computed(() => maengelStore.maengel.filter(m => m.status === 'erledigt').length)

function baustelleName(id: string) {
  return baustellenStore.baustellen.find(b => b.id === id)?.name ?? id
}

function goToDetail(baustellenId: string) {
  router.push(`/sb/baustellen/${baustellenId}`)
}

function statusLabel(s: MaengelStatus) {
  return { offen: 'Offen', in_bearbeitung: 'In Bearbeitung', erledigt: 'Erledigt' }[s]
}
</script>

<style scoped>
.ml-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F8FAFC;
}

.ml-kpi-section {
  padding: 20px 24px 0;
}

.ml-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
}

.ml-filter-select {
  width: 180px;
}

.ml-count {
  margin-left: auto;
  color: #94A3B8;
  font-size: 10px;
  letter-spacing: 0.05em;
}

.ml-table-wrap {
  padding: 0 24px 24px;
  flex: 1;
}

.ml-desc {
  font-size: 13px;
  color: #0F172A;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.ml-link-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #2563EB;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: color 0.15s;
}
.ml-link-btn:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

.ml-status-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ml-status-select {
  max-width: 150px;
  font-size: 12px;
}
</style>
