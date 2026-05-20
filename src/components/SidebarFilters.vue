<template>
  <div class="sf-panel">
    <div class="sf-header">
      <span class="bp-section-title">Kartenebenen</span>
    </div>

    <div class="sf-toggles">
      <label class="sf-toggle" :class="{ 'sf-toggle--active': show.baustellen }">
        <input type="checkbox" v-model="show.baustellen" class="sf-checkbox" />
        <span class="sf-dot sf-dot--baustelle" />
        <span class="sf-toggle-label">Baustellen</span>
        <span class="sf-toggle-count bp-mono">{{ baustellen.length }}</span>
      </label>
      <label class="sf-toggle" :class="{ 'sf-toggle--active': show.maengel }">
        <input type="checkbox" v-model="show.maengel" class="sf-checkbox" />
        <span class="sf-dot sf-dot--mangel" />
        <span class="sf-toggle-label">Mängel</span>
        <span class="sf-toggle-count bp-mono">{{ maengel.length }}</span>
      </label>
    </div>

    <div class="sf-divider" />

    <div class="sf-list-header bp-mono">Sichtbare Elemente</div>
    <div class="sf-list">
      <template v-if="show.baustellen">
        <div class="sf-subheader bp-mono">Baustellen</div>
        <div
          v-for="b in baustellen"
          :key="b.id"
          class="sf-item"
          @click="emit('focusBaustelle', b)"
        >
          <span class="bp-dot" :class="`bp-dot--${b.status}`" style="flex-shrink:0" />
          <div class="sf-item-body">
            <span class="sf-item-name">{{ b.name }}</span>
            <span class="sf-item-sub bp-mono">{{ b.adresse }}</span>
          </div>
        </div>
      </template>
      <template v-if="show.maengel">
        <div class="sf-subheader bp-mono">Mängel</div>
        <div
          v-for="m in maengel"
          :key="m.id"
          class="sf-item"
          @click="emit('focusMangel', m)"
        >
          <span class="bp-dot" :class="`bp-dot--${m.status}`" style="flex-shrink:0" />
          <div class="sf-item-body">
            <span class="sf-item-name">{{ m.kategorie }}</span>
            <span class="sf-item-sub bp-mono">{{ m.beschreibung }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Baustelle, Mangel } from '../types/types'

defineProps<{
  baustellen: Baustelle[]
  maengel: Mangel[]
}>()

const emit = defineEmits<{
  focusBaustelle: [b: Baustelle]
  focusMangel: [m: Mangel]
}>()

const show = reactive({ baustellen: true, maengel: true })

defineExpose({ show })
</script>

<style scoped>
.sf-panel {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #E2E8F0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sf-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #F1F5F9;
}

.sf-toggles {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sf-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  background: #F8FAFC;
}
.sf-toggle--active {
  background: #EFF6FF;
  border-color: #93C5FD;
}

.sf-checkbox {
  display: none;
}

.sf-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.sf-dot--baustelle {
  background: #2563EB;
  box-shadow: 0 0 5px rgba(37,99,235,0.5);
}
.sf-dot--mangel {
  background: #EF4444;
  box-shadow: 0 0 5px rgba(239,68,68,0.5);
}

.sf-toggle-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #0F172A;
  flex: 1;
}

.sf-toggle-count {
  font-size: 9.5px;
  color: #94A3B8;
}

.sf-divider {
  height: 1px;
  background: #F1F5F9;
  margin: 0 16px;
}

.sf-list-header {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94A3B8;
  padding: 12px 16px 6px;
}

.sf-subheader {
  font-size: 8.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #CBD5E1;
  padding: 6px 16px 4px;
}

.sf-list {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 12px;
}

.sf-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.1s;
}
.sf-item:hover {
  background: #F8FAFC;
}

.sf-item-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  padding-top: 1px;
}

.sf-item-name {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sf-item-sub {
  font-size: 9.5px;
  color: #94A3B8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
