<template>
  <div v-if="baustelle" class="bv-view">
    <!-- Page Header -->
    <div class="bv-page-header">
      <button class="bv-back-btn" @click="router.back()">
        <v-icon size="16">mdi-arrow-left</v-icon>
        Zurück
      </button>
      <div class="bv-header-body">
        <div class="bv-header-main">
          <div>
            <h1 class="bp-heading bv-title">{{ baustelle.name }}</h1>
            <div class="bv-meta">
              <span class="bp-mono">{{ baustelle.id }}</span>
              <span class="bv-dot-sep">·</span>
              <v-icon size="12" color="#94A3B8">mdi-map-marker-outline</v-icon>
              {{ baustelle.adresse }}
            </div>
          </div>
          <div class="bv-header-actions">
            <span class="bp-status">
              <span class="bp-dot" :class="`bp-dot--${baustelle.status}`" />
              {{ statusLabel(baustelle.status) }}
            </span>
            <v-select
              v-if="isSachbearbeiter"
              v-model="selectedStatus"
              :items="statusOptions"
              density="compact"
              variant="outlined"
              hide-details
              class="bv-status-select"
              @update:model-value="updateStatus"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-tabs -->
    <div class="bv-tabs-wrap">
      <v-tabs v-model="activeTab" color="primary" height="42" class="bv-tabs">
        <v-tab value="uebersicht" class="bv-tab">
          <v-icon size="14" class="mr-1">mdi-view-dashboard-outline</v-icon>
          Übersicht
        </v-tab>
        <v-tab value="maengel" class="bv-tab">
          <v-icon size="14" class="mr-1">mdi-alert-circle-outline</v-icon>
          Mängel
          <span class="bv-tab-badge">{{ maengelForBaustelle.length }}</span>
        </v-tab>
        <v-tab value="dokumente" class="bv-tab">
          <v-icon size="14" class="mr-1">mdi-folder-outline</v-icon>
          Dokumente & Bilder
        </v-tab>
      </v-tabs>
      <div class="bv-tabs-line" />
    </div>

    <div class="bv-content">
      <v-window v-model="activeTab">
        <!-- Tab: Übersicht -->
        <v-window-item value="uebersicht">
          <div class="bv-overview-grid">
            <div class="bv-data-card">
              <div class="bp-section-header">
                <span class="bp-section-title">Stammdaten</span>
              </div>
              <div class="bv-data-list">
                <div class="bv-data-row">
                  <span class="bv-data-label bp-mono">Priorität</span>
                  <span class="bp-prio" :class="`bp-prio--${baustelle.prioritaet}`">{{ baustelle.prioritaet }}</span>
                </div>
                <div class="bv-data-row">
                  <span class="bv-data-label bp-mono">Zeitraum</span>
                  <span class="bv-data-value bp-mono">{{ baustelle.startDatum }} – {{ baustelle.endDatum }}</span>
                </div>
                <div class="bv-data-row">
                  <span class="bv-data-label bp-mono">Bauleiter ID</span>
                  <span class="bv-data-value bp-mono">{{ baustelle.bauleiterId }}</span>
                </div>
                <div class="bv-data-row">
                  <span class="bv-data-label bp-mono">Offene Mängel</span>
                  <span class="bv-maengel-val">{{ baustelle.offenerMaengelCount }}</span>
                </div>
              </div>
            </div>
            <div class="bv-map-card">
              <MapView
                :baustellen="[baustelle]"
                :maengel="[]"
                :center="[baustelle.lat, baustelle.lng]"
                :zoom="15"
              />
            </div>
          </div>

          <!-- Timeline -->
          <div class="bv-timeline-card">
            <div class="bp-section-title mb-3">Verlauf</div>
            <div class="bv-timeline">
              <div class="bv-tl-item">
                <div class="bv-tl-dot bv-tl-dot--green" />
                <div class="bv-tl-line" />
                <div class="bv-tl-body">
                  <span class="bv-tl-title">Baustelle eröffnet</span>
                  <span class="bv-tl-date bp-mono">{{ baustelle.startDatum }}</span>
                </div>
              </div>
              <div class="bv-tl-item">
                <div class="bv-tl-dot bv-tl-dot--amber" />
                <div class="bv-tl-line" />
                <div class="bv-tl-body">
                  <span class="bv-tl-title">Erster Mangel gemeldet</span>
                  <span class="bv-tl-date bp-mono">{{ firstMangelDate }}</span>
                </div>
              </div>
              <div class="bv-tl-item">
                <div class="bv-tl-dot bv-tl-dot--blue" />
                <div class="bv-tl-body">
                  <span class="bv-tl-title">Aktueller Status: {{ statusLabel(baustelle.status) }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- Tab: Mängel -->
        <v-window-item value="maengel">
          <div class="bv-section-wrap">
            <v-data-table
              :headers="maengelHeaders"
              :items="maengelForBaustelle"
              item-value="id"
              hover
            >
              <template #item.kategorie="{ item }">
                <span class="bp-mono" style="font-size:10.5px;color:#64748B">{{ item.kategorie }}</span>
              </template>
              <template #item.status="{ item }">
                <div v-if="isSachbearbeiter" class="bv-status-cell">
                  <span class="bp-status">
                    <span class="bp-dot" :class="`bp-dot--${item.status}`" />
                  </span>
                  <v-select
                    :model-value="item.status"
                    :items="maengelStatusOptions"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="max-width:150px"
                    @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
                  />
                </div>
                <span v-else class="bp-status">
                  <span class="bp-dot" :class="`bp-dot--${item.status}`" />
                  {{ item.status }}
                </span>
              </template>
              <template #item.erstelltAm="{ item }">
                <span class="bp-mono" style="font-size:11px;color:#64748B">{{ item.erstelltAm }}</span>
              </template>
            </v-data-table>
          </div>
        </v-window-item>

        <!-- Tab: Dokumente & Bilder -->
        <v-window-item value="dokumente">
          <div class="bv-dok-grid">
            <!-- Dokumente -->
            <div class="bv-dok-col">
              <div class="bp-section-header">
                <span class="bp-section-title">Dokumente</span>
                <v-btn
                  v-if="isBauleiter"
                  size="small"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-upload"
                  @click="uploadDokDialog = true"
                >
                  Hochladen
                </v-btn>
              </div>
              <div class="bv-dok-list">
                <div
                  v-for="dok in dokumenteForBaustelle"
                  :key="dok.id"
                  class="bv-dok-item"
                >
                  <div class="bv-dok-icon">
                    <v-icon size="18" :color="typColor(dok.typ)">{{ typIcon(dok.typ) }}</v-icon>
                  </div>
                  <div class="bv-dok-info">
                    <span class="bv-dok-title">{{ dok.titel }}</span>
                    <span class="bv-dok-meta bp-mono">{{ dok.typ.toUpperCase() }} · {{ dok.hochgeladenAm }} · {{ dok.hochgeladenVon }}</span>
                  </div>
                </div>
                <div v-if="dokumenteForBaustelle.length === 0" class="bv-empty-state">
                  <v-icon size="32" color="#CBD5E1">mdi-file-outline</v-icon>
                  <span class="bp-mono bv-empty-text">Keine Dokumente</span>
                </div>
              </div>
            </div>

            <!-- Bilder -->
            <div class="bv-dok-col">
              <div class="bp-section-header">
                <span class="bp-section-title">Bilder</span>
                <v-btn
                  v-if="isBauleiter"
                  size="small"
                  variant="outlined"
                  color="primary"
                  prepend-icon="mdi-camera"
                  @click="addDummyBild"
                >
                  Foto hinzufügen
                </v-btn>
              </div>
              <div class="bv-img-grid">
                <div v-for="bild in bilderForBaustelle" :key="bild.id" class="bv-img-wrap">
                  <v-img :src="bild.url" :alt="bild.beschreibung" aspect-ratio="1.33" cover rounded="lg" />
                  <span class="bv-img-caption bp-mono">{{ bild.beschreibung }}</span>
                </div>
                <div v-if="bilderForBaustelle.length === 0" class="bv-empty-state">
                  <v-icon size="32" color="#CBD5E1">mdi-image-outline</v-icon>
                  <span class="bp-mono bv-empty-text">Keine Bilder</span>
                </div>
              </div>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </div>

    <!-- Upload Dok Dialog -->
    <v-dialog v-model="uploadDokDialog" max-width="400">
      <v-card class="bp-card pa-6">
        <div class="bp-section-title mb-4">Dokument hochladen</div>
        <v-text-field v-model="newDokTitel" label="Titel" variant="outlined" density="compact" class="mb-3" />
        <v-select v-model="newDokTyp" :items="['pdf', 'protokoll', 'sonstiges']" label="Typ" variant="outlined" density="compact" />
        <div class="d-flex gap-2 justify-end mt-4">
          <v-btn variant="text" @click="uploadDokDialog = false">Abbrechen</v-btn>
          <v-btn color="primary" @click="submitDokument">Hochladen</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>

  <div v-else class="pa-6">
    <v-alert type="error" variant="tonal">Baustelle nicht gefunden.</v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import { useRoleStore } from '../../stores/roleStore'
import type { BaustellenStatus, Dokument, Bild } from '../../types/types'
import MapView from '../../components/MapView.vue'

const route = useRoute()
const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()
const roleStore = useRoleStore()

const id = route.params.id as string
const baustelle = computed(() => baustellenStore.baustellen.find(b => b.id === id))
const isSachbearbeiter = computed(() => roleStore.currentRole === 'sachbearbeiter')
const isBauleiter = computed(() => roleStore.currentRole === 'bauleiter')

const activeTab = ref((route.query.tab as string) || 'uebersicht')
const uploadDokDialog = ref(false)
const newDokTitel = ref('')
const newDokTyp = ref<'pdf' | 'protokoll' | 'sonstiges'>('pdf')
const selectedStatus = ref<BaustellenStatus>(baustelle.value?.status ?? 'offen')

const maengelForBaustelle = computed(() => maengelStore.getMaengelForBaustelle(id))
const dokumenteForBaustelle = computed(() => baustellenStore.getDokumenteForBaustelle(id))
const bilderForBaustelle = computed(() => baustellenStore.getBilderForBaustelle(id))
const firstMangelDate = computed(() => maengelForBaustelle.value[0]?.erstelltAm ?? 'N/A')

const statusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Prüfung', value: 'in_pruefung' },
  { title: 'Abgeschlossen', value: 'abgeschlossen' },
]
const maengelStatusOptions = [
  { title: 'Offen', value: 'offen' },
  { title: 'In Bearbeitung', value: 'in_bearbeitung' },
  { title: 'Erledigt', value: 'erledigt' },
]
const maengelHeaders = [
  { title: 'Kategorie', key: 'kategorie' },
  { title: 'Beschreibung', key: 'beschreibung' },
  { title: 'Status', key: 'status' },
  { title: 'Gemeldet am', key: 'erstelltAm' },
]

function updateStatus(v: BaustellenStatus) {
  baustellenStore.updateStatus(id, v)
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
function typIcon(typ: string) {
  return { pdf: 'mdi-file-pdf-box', bild: 'mdi-image', protokoll: 'mdi-clipboard-text', sonstiges: 'mdi-file' }[typ] ?? 'mdi-file'
}
function typColor(typ: string) {
  return { pdf: '#EF4444', bild: '#8B5CF6', protokoll: '#F59E0B', sonstiges: '#94A3B8' }[typ] ?? '#94A3B8'
}

function submitDokument() {
  if (!newDokTitel.value) return
  const dok: Dokument = {
    id: `dok-${Date.now()}`,
    baustellenId: id,
    titel: newDokTitel.value,
    typ: newDokTyp.value,
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: new Date().toISOString().split('T')[0],
  }
  baustellenStore.addDokument(dok)
  newDokTitel.value = ''
  uploadDokDialog.value = false
}

function addDummyBild() {
  const bild: Bild = {
    id: `bild-${Date.now()}`,
    baustellenId: id,
    url: `https://picsum.photos/seed/${Date.now()}/400/300`,
    beschreibung: 'Neues Foto',
    hochgeladenVon: 'bauleiter',
    hochgeladenAm: new Date().toISOString().split('T')[0],
  }
  baustellenStore.addBild(bild)
}
</script>

<style scoped>
.bv-view {
  background: #F8FAFC;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.bv-page-header {
  padding: 16px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bv-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.05em;
  color: #94A3B8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
}
.bv-back-btn:hover { color: #2563EB; }

.bv-header-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.bv-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.bv-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

.bv-dot-sep {
  color: #CBD5E1;
}

.bv-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.bv-status-select {
  width: 170px;
}

.bv-tabs-wrap {
  margin-top: 12px;
  border-bottom: 1px solid #E2E8F0;
}

.bv-tabs {
  padding: 0 24px;
}

.bv-tab {
  font-family: 'DM Sans', sans-serif !important;
  font-size: 13px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  display: flex;
  align-items: center;
  gap: 4px;
}

.bv-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #F1F5F9;
  color: #64748B;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  margin-left: 4px;
}

.bv-tabs-line {
  height: 1px;
  background: #E2E8F0;
}

.bv-content {
  padding: 20px 24px 24px;
  flex: 1;
}

.bv-overview-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.bv-data-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 18px;
}

.bv-data-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bv-data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
}
.bv-data-row:last-child { border-bottom: none; }

.bv-data-label {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94A3B8;
}

.bv-data-value {
  font-size: 11.5px;
  color: #0F172A;
}

.bv-maengel-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #EF4444;
}

.bv-map-card {
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  overflow: hidden;
  min-height: 220px;
}

.bv-timeline-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 18px;
}

.bv-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.bv-tl-item {
  display: grid;
  grid-template-columns: 16px 2px 1fr;
  gap: 0 12px;
  align-items: start;
}

.bv-tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}
.bv-tl-dot--green { background: #22C55E; box-shadow: 0 0 5px rgba(34,197,94,0.5); }
.bv-tl-dot--amber { background: #F59E0B; box-shadow: 0 0 5px rgba(245,158,11,0.5); }
.bv-tl-dot--blue  { background: #3B82F6; box-shadow: 0 0 5px rgba(59,130,246,0.5); }

.bv-tl-line {
  width: 2px;
  background: #E2E8F0;
  min-height: 28px;
  justify-self: center;
}

.bv-tl-body {
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bv-tl-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #0F172A;
}

.bv-tl-date {
  font-size: 10px;
  color: #94A3B8;
}

.bv-section-wrap {
  /* table already styled via global bp-data-table */
}

.bv-status-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bv-dok-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.bv-dok-col {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 18px;
}

.bv-dok-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bv-dok-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 1px solid #F1F5F9;
  border-radius: 8px;
  background: #FAFAFA;
}

.bv-dok-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #F1F5F9;
  flex-shrink: 0;
}

.bv-dok-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.bv-dok-title {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-dok-meta {
  font-size: 9.5px;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.bv-img-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.bv-img-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bv-img-caption {
  font-size: 9px;
  color: #94A3B8;
  text-align: center;
}

.bv-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.bv-empty-text {
  font-size: 10px;
  color: #CBD5E1;
  letter-spacing: 0.06em;
}
</style>
