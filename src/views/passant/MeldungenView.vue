<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Meine Meldungen</h2>
    <v-data-table
      :headers="headers"
      :items="meldungen"
      item-value="id"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>{{ item.status }}</v-chip>
      </template>
      <template #item.position="{ item }">
        <v-btn variant="text" size="small" color="primary" @click="router.push('/pa/karte')">
          {{ item.lat.toFixed(3) }}, {{ item.lng.toFixed(3) }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMaengelStore } from '../../stores/maengelStore'
import type { MaengelStatus } from '../../types/types'

const router = useRouter()
const maengelStore = useMaengelStore()

// Show Passant-reported items (id starts with mg-p-) + 2 mock entries for demo
const meldungen = computed(() =>
  maengelStore.maengel.filter(m => m.id.startsWith('mg-p-') || m.id === 'mg-1' || m.id === 'mg-4')
)

const headers = [
  { title: 'Kategorie', key: 'kategorie' },
  { title: 'Beschreibung', key: 'beschreibung' },
  { title: 'Status', key: 'status' },
  { title: 'Gemeldet am', key: 'erstelltAm' },
  { title: 'Position', key: 'position', sortable: false },
]

function statusColor(s: MaengelStatus) {
  return { offen: 'error', in_bearbeitung: 'warning', erledigt: 'success' }[s]
}
</script>
