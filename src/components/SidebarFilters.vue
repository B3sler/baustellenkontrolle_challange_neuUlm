<template>
  <v-card variant="outlined" class="pa-3" style="min-width: 260px">
    <div class="text-subtitle-2 font-weight-bold mb-3">Anzeige</div>
    <v-checkbox v-model="show.baustellen" label="Baustellen" density="compact" hide-details color="primary" />
    <v-checkbox v-model="show.maengel" label="Mängel" density="compact" hide-details color="error" />
    <v-divider class="my-3" />
    <div class="text-subtitle-2 font-weight-bold mb-2">Sichtbare Elemente</div>
    <v-list density="compact" max-height="400" style="overflow-y: auto">
      <template v-if="show.baustellen">
        <v-list-subheader>Baustellen</v-list-subheader>
        <v-list-item
          v-for="b in baustellen"
          :key="b.id"
          :title="b.name"
          :subtitle="b.adresse"
          density="compact"
          @click="emit('focusBaustelle', b)"
        >
          <template #append>
            <v-chip :color="statusColor(b.status)" size="x-small" label>{{ b.status }}</v-chip>
          </template>
        </v-list-item>
      </template>
      <template v-if="show.maengel">
        <v-list-subheader>Mängel</v-list-subheader>
        <v-list-item
          v-for="m in maengel"
          :key="m.id"
          :title="m.kategorie"
          :subtitle="m.beschreibung"
          density="compact"
          @click="emit('focusMangel', m)"
        />
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Baustelle, Mangel, BaustellenStatus } from '../types/types'

defineProps<{
  baustellen: Baustelle[]
  maengel: Mangel[]
}>()

const emit = defineEmits<{
  focusBaustelle: [b: Baustelle]
  focusMangel: [m: Mangel]
}>()

const show = reactive({ baustellen: true, maengel: true })

function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}

defineExpose({ show })
</script>
