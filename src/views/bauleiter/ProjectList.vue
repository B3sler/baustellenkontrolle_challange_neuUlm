<template>
  <div class="pl-view">
    <!-- Header section -->
    <div class="pl-header">
      <div>
        <h1 class="bp-heading pl-title">Meine Baustellen</h1>
        <p class="pl-subtitle bp-mono">Bauleiter · {{ roleStore.currentBauleiterId }}</p>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="pl-kpi-section">
      <div class="bp-kpi-row">
        <div class="bp-kpi-block">
          <div class="bp-kpi-value">{{ meineBaustellen.length }}</div>
          <div class="bp-kpi-label">Zugewiesen</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#F59E0B">{{ kpiOffen }}</div>
          <div class="bp-kpi-label">Offen</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#8B5CF6">{{ kpiInPruefung }}</div>
          <div class="bp-kpi-label">In Prüfung</div>
        </div>
        <div class="bp-kpi-block">
          <div class="bp-kpi-value" style="color:#EF4444">{{ kpiMaengel }}</div>
          <div class="bp-kpi-label">Offene Mängel</div>
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="pl-cards">
      <div
        v-for="b in meineBaustellen"
        :key="b.id"
        class="pl-card"
        @click="router.push(`/bl/projects/${b.id}`)"
      >
        <div class="pl-card-top">
          <div class="pl-card-info">
            <span class="pl-card-name">{{ b.name }}</span>
            <span class="bp-mono pl-card-id">{{ b.id }}</span>
          </div>
          <span class="bp-status">
            <span class="bp-dot" :class="`bp-dot--${b.status}`" />
            {{ statusLabel(b.status) }}
          </span>
        </div>
        <div class="pl-card-addr">
          <v-icon size="12" color="#94A3B8">mdi-map-marker-outline</v-icon>
          {{ b.adresse }}
        </div>
        <div class="pl-card-footer">
          <span class="bp-mono pl-card-date">
            <v-icon size="11">mdi-calendar-range</v-icon>
            {{ b.startDatum }} – {{ b.endDatum }}
          </span>
          <span class="pl-card-prio" :class="`bp-prio--${b.prioritaet}`">
            <span class="bp-prio">{{ b.prioritaet }}</span>
          </span>
          <span v-if="b.offenerMaengelCount > 0" class="pl-maengel-badge">
            {{ b.offenerMaengelCount }} Mängel
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBaustellenStore } from '../../stores/baustellenStore'
import { useMaengelStore } from '../../stores/maengelStore'
import { useRoleStore } from '../../stores/roleStore'
import type { BaustellenStatus } from '../../types/types'

const router = useRouter()
const baustellenStore = useBaustellenStore()
const maengelStore = useMaengelStore()
const roleStore = useRoleStore()

const meineBaustellen = computed(() =>
  baustellenStore.baustellen.filter(b => b.bauleiterId === roleStore.currentBauleiterId)
)

const kpiOffen = computed(() => meineBaustellen.value.filter(b => b.status === 'offen').length)
const kpiInPruefung = computed(() => meineBaustellen.value.filter(b => b.status === 'in_pruefung').length)
const kpiMaengel = computed(() =>
  meineBaustellen.value.reduce((sum, b) => sum + maengelStore.getMaengelForBaustelle(b.id).filter(m => m.status === 'gemeldet').length, 0)
)

function statusLabel(s: BaustellenStatus) {
  return { offen: 'Offen', in_pruefung: 'In Prüfung', abgeschlossen: 'Abgeschlossen' }[s]
}
</script>

<style scoped>
.pl-view {
  background: #F8FAFC;
  min-height: 100%;
}

.pl-header {
  padding: 24px 24px 0;
}

.pl-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.pl-subtitle {
  font-size: 10px;
  color: #94A3B8;
  margin-top: 3px;
  letter-spacing: 0.06em;
}

.pl-kpi-section {
  padding: 16px 24px 0;
}

.pl-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px 24px;
}

.pl-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 16px 18px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pl-card:hover {
  border-color: #93C5FD;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.08);
}

.pl-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.pl-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pl-card-name {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
}

.pl-card-id {
  font-size: 9.5px;
  color: #94A3B8;
}

.pl-card-addr {
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pl-card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pl-card-date {
  font-size: 10.5px;
  color: #94A3B8;
  display: flex;
  align-items: center;
  gap: 3px;
}

.pl-maengel-badge {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9.5px;
  background: #FEF2F2;
  color: #EF4444;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}
</style>
