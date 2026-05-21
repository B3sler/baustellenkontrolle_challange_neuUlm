<template>
  <v-app-bar :elevation="0" class="bp-app-bar">
    <template #prepend>
      <div class="bp-logo-mark">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" fill="none" stroke="#63B3ED" stroke-width="1.5"/>
          <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#63B3ED" fill-opacity="0.15" stroke="#63B3ED" stroke-width="1"/>
          <circle cx="14" cy="14" r="2.5" fill="#63B3ED"/>
        </svg>
      </div>
    </template>
    <v-app-bar-title>
      <div class="bp-brand">
        <span class="bp-brand-name">NeuBautUlm</span>
        <span class="bp-brand-sub">Stadtverwaltung Digital</span>
      </div>
    </v-app-bar-title>
    <template #append>
      <RoleSwitch />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import RoleSwitch from './RoleSwitch.vue'
</script>

<style scoped>
.bp-app-bar {
  background: #08122B !important;
  border-bottom: 1px solid rgba(99, 179, 237, 0.15) !important;
}

.bp-logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 4px;
}

.bp-brand {
  display: flex;
  flex-direction: column;
  line-height: 1;
  gap: 2px;
}

.bp-brand-name {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.bp-brand-sub {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 400;
  color: rgba(99, 179, 237, 0.7);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
