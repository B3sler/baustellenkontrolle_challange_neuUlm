<template>
  <div v-if="mangel" class="md-view">

    <!-- Header -->
    <div class="md-page-header">
      <button class="md-back-btn" @click="router.back()">
        <v-icon size="18">mdi-arrow-left</v-icon>
        Zurück
      </button>
      <div class="md-header-main">
        <div class="md-header-left">
          <h1 class="bp-heading md-title">{{ mangel.kategorie }}</h1>
          <div class="md-meta">
            <span class="bp-mono">{{ mangel.id }}</span>
            <span class="md-dot-sep">·</span>
            <span class="bp-mono">{{ baustelle?.name ?? mangel.baustellenId }}</span>
            <span class="md-dot-sep">·</span>
            <span class="bp-mono">{{ mangel.erstelltAm }}</span>
          </div>
        </div>
        <v-select
          v-if="isSachbearbeiter"
          :model-value="mangel.status"
          :items="statusOptions"
          density="compact"
          variant="outlined"
          hide-details
          style="width: 160px; max-width: 160px; flex-shrink: 0;"
          @update:model-value="(v: any) => maengelStore.updateStatus(mangel!.id, v)"
        />
        <span v-else class="bp-status">
          <span class="bp-dot" :class="`bp-dot--${mangel.status}`" />
          {{ statusLabel(mangel.status) }}
        </span>
      </div>
    </div>

    <!-- Tabs line -->
    <div class="md-divider" />

    <!-- Main layout -->
    <div class="md-layout">

      <!-- Left: Stammdaten + Kommentar-Eingabe -->
      <div class="md-left-col">

        <div class="md-section-label bp-mono">Details</div>

        <div class="md-data-row">
          <span class="md-data-label bp-mono">Status</span>
          <span class="bp-status">
            <span class="bp-dot" :class="`bp-dot--${mangel.status}`" />
            {{ statusLabel(mangel.status) }}
          </span>
        </div>
        <div class="md-data-row">
          <span class="md-data-label bp-mono">Kategorie</span>
          <span class="md-data-value bp-mono">{{ mangel.kategorie }}</span>
        </div>
        <div class="md-data-row">
          <span class="md-data-label bp-mono">Gemeldet am</span>
          <span class="md-data-value bp-mono">{{ mangel.erstelltAm }}</span>
        </div>
        <div class="md-data-row">
          <span class="md-data-label bp-mono">Baustelle</span>
          <span class="md-data-value md-data-value--link" @click="goToBaustelle">
            {{ baustelle?.name ?? mangel.baustellenId }}
          </span>
        </div>
        <div class="md-data-row">
          <span class="md-data-label bp-mono">Koordinaten</span>
          <span class="md-data-value bp-mono">{{ mangel.lat.toFixed(4) }}, {{ mangel.lng.toFixed(4) }}</span>
        </div>

        <div class="md-beschreibung-label bp-mono">Beschreibung</div>
        <div class="md-beschreibung">{{ mangel.beschreibung }}</div>

        <!-- Kommentar hinzufügen -->
        <div class="md-section-label bp-mono" style="margin-top: 20px;">
          {{ isBauleiter ? 'Kommentar hinzufügen' : 'Anmerkung hinzufügen' }}
        </div>
        <textarea
          v-model="neuerKommentar"
          class="md-textarea"
          placeholder="Kommentar eingeben…"
          rows="4"
        />
        <button class="md-submit-btn" :disabled="!neuerKommentar.trim()" @click="submitKommentar">
          <v-icon size="15">mdi-send</v-icon>
          Absenden
        </button>

        <!-- Sachbearbeiter: Als erledigt markieren -->
        <button
          v-if="isSachbearbeiter && mangel.status !== 'abgeschlossen'"
          class="md-done-btn"
          @click="maengelStore.updateStatus(mangel.id, 'abgeschlossen')"
        >
          <v-icon size="15">mdi-check-circle</v-icon>
          Als erledigt markieren
        </button>
      </div>

      <!-- Right: Map + Kommentare -->
      <div class="md-right-col">
        <div class="md-map-card">
          <MapView
            :maengel="[mangel]"
            :baustellen="[]"
            :center="[mangel.lat, mangel.lng]"
            :zoom="16"
          />
        </div>

        <div class="md-comments-card">
          <div class="md-section-label bp-mono">Kommentarverlauf</div>
          <div class="md-comments-list">
            <div
              v-for="k in mangel.kommentare ?? []"
              :key="k.id"
              class="md-comment"
              :class="`md-comment--${k.verfasserRolle}`"
            >
              <div class="md-comment-header">
                <span class="md-comment-role bp-mono">
                  {{ k.verfasserRolle === 'bauleiter' ? 'Bauleiter' : 'Sachbearbeiter' }}
                </span>
                <span class="md-comment-date bp-mono">{{ k.erstelltAm }}</span>
              </div>
              <div class="md-comment-text">{{ k.text }}</div>
            </div>
            <div v-if="!mangel.kommentare?.length" class="md-empty-comments">
              <v-icon size="28" color="#CBD5E1">mdi-comment-outline</v-icon>
              <span class="bp-mono" style="font-size:10px;color:#CBD5E1;letter-spacing:0.06em">Noch keine Kommentare</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div v-else class="pa-6">
    <v-alert type="error" variant="tonal">Mangel nicht gefunden.</v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaengelStore } from '../../stores/maengelStore'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useRoleStore } from '../../stores/roleStore'
import type { MaengelStatus } from '../../types/types'
import MapView from '../../components/MapView.vue'

const route = useRoute()
const router = useRouter()
const maengelStore = useMaengelStore()
const baustellenStore = useBaustellenStore()
const roleStore = useRoleStore()

const id = route.params.id as string
const mangel = computed(() => maengelStore.maengel.find(m => m.id === id))
const baustelle = computed(() => baustellenStore.baustellen.find(b => b.id === mangel.value?.baustellenId))

const isSachbearbeiter = computed(() => roleStore.currentRole === 'sachbearbeiter')
const isBauleiter = computed(() => roleStore.currentRole === 'bauleiter')

const neuerKommentar = ref('')

const statusOptions = [
  { title: 'Gemeldet', value: 'gemeldet' },
  { title: 'In Bearbeitung', value: 'in_bearbeitung' },
  { title: 'Überprüft', value: 'ueberprueft' },
  { title: 'Abgemahnt', value: 'abgemahnt' },
  { title: 'Abgeschlossen', value: 'abgeschlossen' },
]

function statusLabel(s: MaengelStatus) {
  return { gemeldet: 'Gemeldet', in_bearbeitung: 'In Bearbeitung', ueberprueft: 'Überprüft', abgemahnt: 'Abgemahnt', abgeschlossen: 'Abgeschlossen' }[s]
}

function goToBaustelle() {
  if (!mangel.value) return
  const base = isBauleiter.value ? '/bl/projects' : '/sb/baustellen'
  router.push(`${base}/${mangel.value.baustellenId}`)
}

function submitKommentar() {
  if (!neuerKommentar.value.trim() || !mangel.value) return
  maengelStore.addKommentar(mangel.value.id, {
    id: `k-${Date.now()}`,
    text: neuerKommentar.value.trim(),
    verfasserRolle: isBauleiter.value ? 'bauleiter' : 'sachbearbeiter',
    erstelltAm: new Date().toISOString().split('T')[0],
  })
  neuerKommentar.value = ''
}
</script>

<style scoped>
.md-view {
  background: #F8FAFC;
  height: calc(100vh - 56px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.md-page-header {
  padding: 12px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.md-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px 14px;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  align-self: flex-start;
}
.md-back-btn:hover {
  background: #F1F5F9;
  border-color: #CBD5E1;
  color: #0F172A;
}
.md-back-btn:active { background: #E2E8F0; }

.md-header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.md-header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.md-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.md-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.md-dot-sep { color: #CBD5E1; }

.md-divider {
  height: 1px;
  background: #E2E8F0;
  margin-top: 12px;
}

/* ── Main layout ── */
.md-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
  padding: 16px 24px 24px;
  box-sizing: border-box;
}

/* ── Left column ── */
.md-left-col {
  overflow-y: auto;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
}

.md-section-label {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #CBD5E1;
  margin-bottom: 10px;
}

.md-data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
}
.md-data-row:last-of-type { border-bottom: none; }

.md-data-label {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94A3B8;
  flex-shrink: 0;
}

.md-data-value {
  font-size: 12.5px;
  color: #0F172A;
  text-align: right;
}

.md-data-value--link {
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  color: #2563EB;
  cursor: pointer;
  text-align: right;
  transition: color 0.12s;
}
.md-data-value--link:hover { color: #1D4ED8; text-decoration: underline; }

.md-beschreibung-label {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #CBD5E1;
  margin-top: 16px;
  margin-bottom: 6px;
}

.md-beschreibung {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.md-textarea {
  width: 100%;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  color: #0F172A;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 12px;
  resize: none;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
  margin-top: 6px;
  line-height: 1.5;
}
.md-textarea:focus { border-color: #2563EB; background: #fff; }
.md-textarea::placeholder { color: #CBD5E1; }

.md-submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #2563EB;
  border: none;
  border-radius: 8px;
  padding: 9px 16px;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-start;
}
.md-submit-btn:hover { background: #1D4ED8; }
.md-submit-btn:disabled { background: #CBD5E1; cursor: not-allowed; }

.md-done-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #15803D;
  background: #DCFCE7;
  border: 1px solid #86EFAC;
  border-radius: 8px;
  padding: 9px 16px;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-start;
}
.md-done-btn:hover { background: #BBF7D0; }

/* ── Right column ── */
.md-right-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.md-map-card {
  flex: 2;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  overflow: hidden;
  min-height: 0;
}

.md-comments-card {
  flex: 1;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 16px 18px;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.md-comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.md-comment {
  border-radius: 8px;
  padding: 10px 12px;
}

.md-comment--bauleiter {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
}

.md-comment--sachbearbeiter {
  background: #F5F3FF;
  border: 1px solid #DDD6FE;
}

.md-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.md-comment-role {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
}
.md-comment--bauleiter .md-comment-role { color: #1D4ED8; }
.md-comment--sachbearbeiter .md-comment-role { color: #6D28D9; }

.md-comment-date {
  font-size: 9px;
  color: #94A3B8;
  letter-spacing: 0.04em;
}

.md-comment-text {
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  color: #0F172A;
  line-height: 1.55;
}

.md-empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}
</style>
