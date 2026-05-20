<template>
  <div class="pk-container">
    <!-- Legend overlay -->
    <div class="pk-legend">
      <div class="pk-legend-title bp-mono">Legende</div>
      <div class="pk-legend-item">
        <span class="pk-dot pk-dot--offen" />
        <span class="pk-legend-label">Offen</span>
      </div>
      <div class="pk-legend-item">
        <span class="pk-dot pk-dot--bearbeitung" />
        <span class="pk-legend-label">In Bearbeitung</span>
      </div>
      <div class="pk-legend-item">
        <span class="pk-dot pk-dot--erledigt" />
        <span class="pk-legend-label">Erledigt</span>
      </div>
      <div class="pk-legend-count bp-mono">{{ maengelStore.maengel.length }} Mängel</div>
    </div>
    <MapView :maengel="maengelStore.maengel" :baustellen="[]" />
  </div>
</template>

<script setup lang="ts">
import MapView from '../../components/MapView.vue'
import { useMaengelStore } from '../../stores/maengelStore'
const maengelStore = useMaengelStore()
</script>

<style scoped>
.pk-container {
  position: relative;
  height: calc(100vh - 56px);
}

.pk-legend {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.pk-legend-title {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94A3B8;
  margin-bottom: 2px;
}

.pk-legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.pk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pk-dot--offen      { background: #F59E0B; box-shadow: 0 0 4px rgba(245,158,11,0.6); }
.pk-dot--bearbeitung{ background: #3B82F6; box-shadow: 0 0 4px rgba(59,130,246,0.6); }
.pk-dot--erledigt   { background: #22C55E; box-shadow: 0 0 4px rgba(34,197,94,0.6); }

.pk-legend-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 11.5px;
  font-weight: 500;
  color: #0F172A;
}

.pk-legend-count {
  font-size: 9px;
  color: #94A3B8;
  border-top: 1px solid #F1F5F9;
  padding-top: 6px;
  margin-top: 2px;
  letter-spacing: 0.05em;
}
</style>
