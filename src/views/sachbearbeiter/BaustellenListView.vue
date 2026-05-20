<template>
  <v-container fluid class="pa-4">
    <!-- Filter row -->
    <v-row class="mb-3" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Suche (Name, Adresse)"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          v-model="filterPrioritaet"
          :items="prioritaetOptions"
          label="Priorität"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="filteredBaustellen"
      :search="search"
      item-value="id"
      hover
      @click:row="(_: any, { item }: any) => openDetail(item.id)"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.prioritaet="{ item }">
        <v-chip :color="prioritaetColor(item.prioritaet)" size="small" label variant="outlined">
          {{ item.prioritaet }}
        </v-chip>
      </template>
      <template #item.offenerMaengelCount="{ item }">
        <v-badge
          v-if="item.offenerMaengelCount > 0"
          :content="item.offenerMaengelCount"
          color="error"
          inline
        />
        <span v-else class="text-success">0</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import type { BaustellenStatus, Prioritaet } from '../../types/types'

const router = useRouter()
const store = useBaustellenStore()

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
  { title: 'Zeitraum', key: 'startDatum', sortable: true, value: (item: any) => `${item.startDatum} – ${item.endDatum}` },
  { title: 'Offene Mängel', key: 'offenerMaengelCount', sortable: true },
]

const filteredBaustellen = computed(() => {
  return store.baustellen.filter(b => {
    if (filterStatus.value && b.status !== filterStatus.value) return false
    if (filterPrioritaet.value && b.prioritaet !== filterPrioritaet.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      return b.name.toLowerCase().includes(q) || b.adresse.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
    }
    return true
  })
})

function openDetail(id: string) {
  router.push(`/sb/baustellen/${id}`)
}

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
function prioritaetColor(p: Prioritaet) {
  return { hoch: 'error', mittel: 'warning', niedrig: 'success' }[p]
}
</script>
