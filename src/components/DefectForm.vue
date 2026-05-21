<template>
  <div class="df-panel">
    <div class="df-header">
      <span class="bp-heading df-title">Mangel melden</span>
      <button class="df-close" @click="emit('cancel')">
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </div>

    <div class="df-body">
      <div class="df-position-hint" :class="{ 'df-position-hint--set': form.lat !== 0 }">
        <v-icon size="14">{{ form.lat !== 0 ? 'mdi-map-marker-check' : 'mdi-cursor-pointer' }}</v-icon>
        <span v-if="form.lat !== 0" class="bp-mono df-pos-text">
          {{ form.lat.toFixed(4) }}, {{ form.lng.toFixed(4) }}
        </span>
        <span v-else class="df-pos-hint-text">Klicke auf die Karte für Position</span>
      </div>

      <div class="df-field">
        <label class="df-label bp-mono">Kategorie *</label>
        <v-select
          v-model="form.kategorie"
          :items="kategorien"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>

      <div class="df-field">
        <label class="df-label bp-mono">Beschreibung *</label>
        <v-textarea
          v-model="form.beschreibung"
          variant="outlined"
          density="compact"
          rows="3"
          hide-details
          placeholder="Was ist passiert?"
        />
      </div>
    </div>

    <div class="df-actions">
      <button class="df-cancel-btn" @click="emit('cancel')">Abbrechen</button>
      <button
        class="df-submit-btn"
        :disabled="!form.kategorie || !form.beschreibung || form.lat === 0"
        @click="submit"
      >
        <v-icon size="15">mdi-send</v-icon>
        Absenden
      </button>
    </div>
  </div>
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
  if (!form.kategorie || !form.beschreibung || form.lat === 0) return
  emit('submit', { kategorie: form.kategorie, beschreibung: form.beschreibung, lat: form.lat, lng: form.lng })
  form.kategorie = ''
  form.beschreibung = ''
}
</script>

<style scoped>
.df-panel {
  width: 340px;
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.14);
  overflow: hidden;
}

.df-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 12px;
  border-bottom: 1px solid #F1F5F9;
}

.df-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.df-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #94A3B8;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.12s, color 0.12s;
}
.df-close:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.df-body {
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.df-position-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #FEF9EC;
  border: 1px solid #FDE68A;
  border-radius: 8px;
  color: #92400E;
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  transition: all 0.2s;
}
.df-position-hint--set {
  background: #F0FDF4;
  border-color: #86EFAC;
  color: #166534;
}

.df-pos-text {
  font-size: 10.5px;
  color: #166534;
}

.df-pos-hint-text {
  font-size: 12px;
}

.df-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.df-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94A3B8;
}

.df-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px 16px;
  border-top: 1px solid #F1F5F9;
}

.df-cancel-btn {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.12s;
}
.df-cancel-btn:hover { background: #F1F5F9; }

.df-submit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2563EB;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.12s, opacity 0.12s;
}
.df-submit-btn:hover:not(:disabled) { background: #1D4ED8; }
.df-submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
