<template>
  <v-container fluid class="pa-4" v-if="baustelle">
    <!-- Header -->
    <v-row align="center" class="mb-2">
      <v-col>
        <div class="d-flex align-center ga-3 flex-wrap">
          <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()" />
          <div>
            <h2 class="text-h5 font-weight-bold">{{ baustelle.name }}</h2>
            <span class="text-body-2 text-medium-emphasis">{{ baustelle.adresse }} · ID: {{ baustelle.id }}</span>
          </div>
          <v-chip :color="statusColor(baustelle.status)" label class="ml-2">
            {{ statusLabel(baustelle.status) }}
          </v-chip>
          <!-- SB: change status -->
          <v-select
            v-if="isSachbearbeiter"
            v-model="selectedStatus"
            :items="statusOptions"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 180px"
            @update:model-value="updateStatus"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="primary">
      <v-tab value="uebersicht">Übersicht</v-tab>
      <v-tab value="maengel">Mängel</v-tab>
      <v-tab value="dokumente">Dokumente & Bilder</v-tab>
    </v-tabs>
    <v-divider />

    <v-window v-model="activeTab" class="mt-4">
      <!-- Tab: Übersicht -->
      <v-window-item value="uebersicht">
        <v-row>
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="pa-4">
              <v-list density="compact">
                <v-list-item title="Priorität" :subtitle="baustelle.prioritaet" prepend-icon="mdi-flag" />
                <v-list-item title="Zeitraum" :subtitle="`${baustelle.startDatum} – ${baustelle.endDatum}`" prepend-icon="mdi-calendar" />
                <v-list-item title="Bauleiter ID" :subtitle="baustelle.bauleiterId" prepend-icon="mdi-hard-hat" />
                <v-list-item title="Offene Mängel" :subtitle="String(baustelle.offenerMaengelCount)" prepend-icon="mdi-alert-circle" />
              </v-list>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <!-- TODO Task 9: Replace with <MapView :baustellen="[baustelle]" :maengel="[]" :center="[baustelle.lat, baustelle.lng]" :zoom="15" /> -->
            <v-card variant="outlined" class="pa-4 d-flex align-center justify-center" style="height: 250px">
              <div class="text-center text-medium-emphasis">
                <v-icon size="48" class="mb-2">mdi-map-marker</v-icon>
                <div>Karte: {{ baustelle.lat.toFixed(4) }}, {{ baustelle.lng.toFixed(4) }}</div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- Timeline -->
        <v-timeline density="compact" class="mt-4" side="end">
          <v-timeline-item dot-color="success" size="small">
            <div class="text-body-2">Baustelle eröffnet – {{ baustelle.startDatum }}</div>
          </v-timeline-item>
          <v-timeline-item dot-color="warning" size="small">
            <div class="text-body-2">Erster Mangel gemeldet – {{ firstMangelDate }}</div>
          </v-timeline-item>
          <v-timeline-item dot-color="info" size="small">
            <div class="text-body-2">Status: {{ statusLabel(baustelle.status) }}</div>
          </v-timeline-item>
        </v-timeline>
      </v-window-item>

      <!-- Tab: Mängel -->
      <v-window-item value="maengel">
        <v-data-table
          :headers="maengelHeaders"
          :items="maengelForBaustelle"
          item-value="id"
        >
          <template #item.status="{ item }">
            <v-select
              v-if="isSachbearbeiter"
              :model-value="item.status"
              :items="maengelStatusOptions"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 160px"
              @update:model-value="(v: any) => maengelStore.updateStatus(item.id, v)"
            />
            <v-chip v-else :color="maengelStatusColor(item.status)" size="small" label>
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-window-item>

      <!-- Tab: Dokumente & Bilder -->
      <v-window-item value="dokumente">
        <v-row>
          <!-- Dokumente -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <h3 class="text-subtitle-1 font-weight-bold">Dokumente</h3>
              <v-spacer />
              <v-btn
                v-if="isBauleiter"
                size="small"
                prepend-icon="mdi-upload"
                @click="uploadDokDialog = true"
              >
                Hochladen
              </v-btn>
            </div>
            <v-list lines="two" variant="outlined" rounded>
              <v-list-item
                v-for="dok in dokumenteForBaustelle"
                :key="dok.id"
                :title="dok.titel"
                :subtitle="`${dok.typ.toUpperCase()} · ${dok.hochgeladenAm} · von ${dok.hochgeladenVon}`"
                :prepend-icon="typIcon(dok.typ)"
              />
              <v-list-item v-if="dokumenteForBaustelle.length === 0" title="Keine Dokumente vorhanden" />
            </v-list>
          </v-col>

          <!-- Bilder -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <h3 class="text-subtitle-1 font-weight-bold">Bilder</h3>
              <v-spacer />
              <v-btn
                v-if="isBauleiter"
                size="small"
                prepend-icon="mdi-camera"
                @click="addDummyBild"
              >
                Foto hinzufügen
              </v-btn>
            </div>
            <v-row dense>
              <v-col v-for="bild in bilderForBaustelle" :key="bild.id" cols="6">
                <v-img :src="bild.url" :alt="bild.beschreibung" aspect-ratio="1.33" cover rounded="lg" />
                <div class="text-caption mt-1">{{ bild.beschreibung }}</div>
              </v-col>
              <v-col v-if="bilderForBaustelle.length === 0" cols="12">
                <span class="text-body-2 text-medium-emphasis">Keine Bilder vorhanden</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Upload Dok Dialog -->
    <v-dialog v-model="uploadDokDialog" max-width="420">
      <v-card>
        <v-card-title>Dokument hochladen</v-card-title>
        <v-card-text>
          <v-text-field v-model="newDokTitel" label="Titel" variant="outlined" density="compact" class="mb-3" />
          <v-select v-model="newDokTyp" :items="['pdf', 'protokoll', 'sonstiges']" label="Typ" variant="outlined" density="compact" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="uploadDokDialog = false">Abbrechen</v-btn>
          <v-btn color="primary" @click="submitDokument">Hochladen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else>
    <v-alert type="error">Baustelle nicht gefunden.</v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import { useRoleStore } from '../../stores/roleStore'
import type { BaustellenStatus, Dokument, Bild } from '../../types/types'

const route = useRoute()
const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()
const roleStore = useRoleStore()

const id = route.params.id as string
const baustelle = computed(() => baustellenStore.baustellen.find(b => b.id === id))
const isSachbearbeiter = computed(() => roleStore.currentRole === 'sachbearbeiter')
const isBauleiter = computed(() => roleStore.currentRole === 'bauleiter')

const activeTab = ref('uebersicht')
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
function statusColor(s: BaustellenStatus) {
  return { offen: 'warning', in_pruefung: 'info', abgeschlossen: 'success' }[s]
}
function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
function maengelStatusColor(s: string) {
  return { offen: 'error', in_bearbeitung: 'warning', erledigt: 'success' }[s] ?? 'grey'
}
function typIcon(typ: string) {
  return { pdf: 'mdi-file-pdf-box', bild: 'mdi-image', protokoll: 'mdi-clipboard-text', sonstiges: 'mdi-file' }[typ] ?? 'mdi-file'
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
