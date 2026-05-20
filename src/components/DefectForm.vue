<template>
  <v-card class="pa-4" max-width="420" elevation="4">
    <v-card-title class="px-0">Mangel melden</v-card-title>
    <v-card-text class="px-0">
      <v-select
        v-model="form.kategorie"
        :items="kategorien"
        label="Kategorie *"
        variant="outlined"
        density="compact"
        class="mb-3"
      />
      <v-textarea
        v-model="form.beschreibung"
        label="Beschreibung *"
        variant="outlined"
        density="compact"
        rows="3"
        class="mb-3"
      />
      <v-alert
        v-if="form.lat && form.lng"
        type="success"
        density="compact"
        class="mb-3"
      >
        Position: {{ form.lat.toFixed(4) }}, {{ form.lng.toFixed(4) }}
      </v-alert>
      <v-alert v-else type="info" density="compact" class="mb-3">
        Klicke auf die Karte, um eine Position zu wählen.
      </v-alert>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn variant="text" @click="emit('cancel')">Abbrechen</v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!form.kategorie || !form.beschreibung || !form.lat"
        @click="submit"
      >
        Absenden
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  lat?: number
  lng?: number
}>()

const emit = defineEmits<{
  submit: [data: { kategorie: string; beschreibung: string; lat: number; lng: number }]
  cancel: []
}>()

const kategorien = ['Straßenschaden', 'Gehwegschaden', 'Absperrung', 'Beleuchtung', 'Lärm', 'Wassereinbruch', 'Sonstiges']

const form = reactive({
  kategorie: '',
  beschreibung: '',
  lat: props.lat ?? 0,
  lng: props.lng ?? 0,
})

watch(() => props.lat, v => { if (v) form.lat = v })
watch(() => props.lng, v => { if (v) form.lng = v })

function submit() {
  if (!form.kategorie || !form.beschreibung || !form.lat) return
  emit('submit', { kategorie: form.kategorie, beschreibung: form.beschreibung, lat: form.lat, lng: form.lng })
  form.kategorie = ''
  form.beschreibung = ''
}
</script>
