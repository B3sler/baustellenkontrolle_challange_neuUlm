<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-3" align="center">
      <v-col cols="12" md="3">
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
      <v-col cols="12" md="3">
        <v-select
          v-model="filterKategorie"
          :items="kategorien"
          label="Kategorie"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredMaengel"
      item-value="id"
      hover
    >
      <template #item.status="{ item }">
        <v-select
          :model-value="item.status"
          :items="statusOptions"
          density="compact"
          variant="outlined"
          hide-details
          style="max-width: 160px"
          @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
        />
      </template>
      <template #item.baustellenId="{ item }">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          @click="goToDetail(item.baustellenId)"
        >
          {{ baustelleName(item.baustellenId) }}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
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

function baustelleName(id: string) {
  return baustellenStore.baustellen.find(b => b.id === id)?.name ?? id
}

function goToDetail(baustellenId: string) {
  router.push(`/sb/baustellen/${baustellenId}`)
}
</script>
