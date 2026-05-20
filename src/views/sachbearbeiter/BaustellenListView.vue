<template>
  <div class="bl-view">
    <!-- KPI Row -->
    <div class="bl-kpi-section">
      <div class="bp-kpi-row">
        <div class="bp-kpi-block">
          <div class="bp-kpi-value">{{ store.baustellen.length }}</div>
          <div class="bp-kpi-label">Gesamt</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#F59E0B">{{ kpiOffen }}</div>
          <div class="bp-kpi-label">Offen</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#8B5CF6">{{ kpiInPruefung }}</div>
          <div class="bp-kpi-label">In Prüfung</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#22C55E">{{ kpiAbgeschlossen }}</div>
          <div class="bp-kpi-label">Abgeschlossen</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#EF4444">{{ kpiMaengel }}</div>
          <div class="bp-kpi-label">Offene Mängel</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bl-filters bp-filter">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Name, Adresse oder ID suchen …"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="bl-search"
      />
      <v-select
        v-model="filterStatus"
        :items="statusOptions"
        placeholder="Status"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="bl-filter-select"
      />
      <v-select
        v-model="filterPrioritaet"
        :items="prioritaetOptions"
        placeholder="Priorität"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="bl-filter-select"
      />
      <span class="bl-count bp-mono">{{ filteredBaustellen.length }} Einträge</span>
    </div>

    <!-- Table -->
    <div class="bl-table-wrap">
      <v-data-table
        :headers="headers"
        :items="filteredBaustellen"
        :search="search"
        item-value="id"
        hover
        @click:row="(_: any, { item }: any) => openDetail(item.id)"
      >
        <template #item.name="{ item }">
          <div class="bl-name-cell">
            <span class="bl-item-name">{{ item.name }}</span>
            <span class="bp-mono bl-item-id">{{ item.id }}</span>
          </div>
        </template>
        <template #item.status="{ item }">
          <span class="bp-status">
            <span class="bp-dot" :class="`bp-dot--${item.status}`" />
            {{ statusLabel(item.status) }}
          </span>
        </template>
        <template #item.prioritaet="{ item }">
          <span class="bp-prio" :class="`bp-prio--${item.prioritaet}`">{{ item.prioritaet }}</span>
        </template>
        <template #item.zeitraum="{ item }">
          <span class="bp-mono" style="font-size:11px;color:#64748B">{{ item.startDatum }} – {{ item.endDatum }}</span>
        </template>
        <template #item.offenerMaengelCount="{ item }">
          <span v-if="item.offenerMaengelCount > 0" class="bl-maengel-count">{{ item.offenerMaengelCount }}</span>
          <span v-else class="bp-mono" style="color:#CBD5E1">—</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import type { BaustellenStatus, Prioritaet } from '../../types/types'

const router = useRouter()
const store = useBaustellenStore()
const maengelStore = useMaengelStore()

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
  { title: 'Zeitraum', key: 'zeitraum', sortable: false },
  { title: 'Offene Mängel', key: 'offenerMaengelCount', sortable: true },
]

const filteredBaustellen = computed(() =>
  store.baustellen.filter(b => {
    if (filterStatus.value && b.status !== filterStatus.value) return false
    if (filterPrioritaet.value && b.prioritaet !== filterPrioritaet.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      return b.name.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
    }
    return true
  })
)

const kpiOffen = computed(() => store.baustellen.filter(b => b.status === 'offen').length)
const kpiInPruefung = computed(() => store.baustellen.filter(b => b.status === 'in_pruefung').length)
const kpiAbgeschlossen = computed(() => store.baustellen.filter(b => b.status === 'abgeschlossen').length)
const kpiMaengel = computed(() => maengelStore.maengel.filter(m => m.status === 'offen').length)

function openDetail(id: string) {
  router.push(`/sb/baustellen/${id}`)
}

function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
</script>

<style scoped>
.bl-view {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
  background: #F8FAFC;
}

.bl-kpi-section {
  padding: 20px 24px 0;
}

.bl-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
}

.bl-search {
  flex: 1;
  max-width: 320px;
}

.bl-filter-select {
  width: 160px;
}

.bl-count {
  margin-left: auto;
  color: #94A3B8;
  font-size: 10px;
  letter-spacing: 0.05em;
}

.bl-table-wrap {
  padding: 0 24px 24px;
  flex: 1;
}

.bl-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bl-item-name {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
}

.bl-item-id {
  font-size: 9.5px;
  color: #94A3B8;
}

.bl-maengel-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #FEF2F2;
  color: #EF4444;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 600;
}
</style>
