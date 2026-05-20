<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h6 font-weight-bold mb-4">Meine Baustellen</h2>
    <v-data-table
      :headers="headers"
      :items="meineBaustellen"
      item-value="id"
      hover
      @click:row="(_: any, { item }: any) => router.push(`/bl/projects/${item.id}`)"
    >
      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" label>
          {{ statusLabel(item.status) }}
        </v-chip>
      </template>
      <template #item.offenerMaengelCount="{ item }">
        <v-badge v-if="item.offenerMaengelCount > 0" :content="item.offenerMaengelCount" color="error" inline />
        <span v-else class="text-success">0</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useRoleStore } from '../../stores/roleStore'
import type { BaustellenStatus } from '../../types/types'

const router = useRouter()
const baustellenStore = useBaustellenStore()
const roleStore = useRoleStore()

const meineBaustellen = computed(() =>
  baustellenStore.baustellen.filter(b => b.bauleiterId === roleStore.currentBauleiterId)
)

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Adresse', key: 'adresse' },
  { title: 'Status', key: 'status' },
  { title: 'Zeitraum', key: 'startDatum', value: (item: any) => `${item.startDatum} – ${item.endDatum}` },
  { title: 'Offene Mängel', key: 'offenerMaengelCount' },
]

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
</script>
