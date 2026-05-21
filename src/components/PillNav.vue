<template>
  <nav class="pn-bar">
    <!-- Logo -->
    <div class="pn-logo">
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
        <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" fill="none" stroke="#2563EB" stroke-width="1.5"/>
        <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="#2563EB" fill-opacity="0.12" stroke="#2563EB" stroke-width="1"/>
        <circle cx="14" cy="14" r="2.5" fill="#2563EB"/>
      </svg>
      <span class="pn-logo-name">NeuBautUlm</span>
    </div>

    <!-- Pill tabs -->
    <div class="pn-pills">
      <button
        v-for="tab in currentTabs"
        :key="tab.to"
        class="pn-pill"
        :class="{ 'pn-pill--active': isActive(tab.to) }"
        @click="router.push(tab.to)"
      >
        <v-icon size="14" class="pn-pill-icon">{{ tab.icon }}</v-icon>
        {{ tab.label }}
      </button>
    </div>

    <!-- Role switcher -->
    <div class="pn-seg">
      <button
        v-for="option in roleOptions"
        :key="option.value"
        class="pn-seg-btn"
        :class="{ 'pn-seg-btn--active': roleStore.currentRole === option.value }"
        @click="switchRole(option.value)"
      >
        <span class="pn-seg-dot" :style="{ background: option.color }"></span>
        <v-icon size="13" class="pn-seg-icon">{{ option.icon }}</v-icon>
        {{ option.label }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore, type Role } from '../stores/roleStore'

const roleStore = useRoleStore()
const route = useRoute()
const router = useRouter()

const tabsByRole = {
  sachbearbeiter: [
    { to: '/sb/baustellen', label: 'Baustellen', icon: 'mdi-road-variant' },
    { to: '/sb/maengel', label: 'Mängel', icon: 'mdi-alert-circle-outline' },
    { to: '/sb/karte', label: 'Karte', icon: 'mdi-map-outline' },
    { to: '/sb/kontrollen', label: 'Kontrollen', icon: 'mdi-map-check-outline' },
  ],
  bauleiter: [
    { to: '/bl/projects', label: 'Meine Baustellen', icon: 'mdi-hard-hat' },
    { to: '/bl/anleitung', label: 'Anleitung', icon: 'mdi-book-open-outline' },
  ],
  passant: [
    { to: '/pa/report', label: 'Mängel melden', icon: 'mdi-plus-circle-outline' },
    { to: '/pa/meldungen', label: 'Meldungen', icon: 'mdi-format-list-bulleted' },
    { to: '/pa/karte', label: 'Karte', icon: 'mdi-map-outline' },
    { to: '/pa/anleitung', label: 'Anleitung', icon: 'mdi-book-open-outline' },
  ],
}

const currentTabs = computed(() => tabsByRole[roleStore.currentRole])

// A tab is active if the current path starts with the tab's path (handles detail sub-routes too)
function isActive(tabPath: string) {
  if (tabPath === '/sb/baustellen') {
    return route.path.startsWith('/sb/baustellen')
  }
  return route.path === tabPath
}

const roleOptions = [
  { value: 'sachbearbeiter' as Role, label: 'Sachbearbeiter:in', icon: 'mdi-briefcase-outline', color: '#2563EB' },
  { value: 'bauleiter' as Role, label: 'Bauleiter:in', icon: 'mdi-hard-hat', color: '#D97706' },
  { value: 'passant' as Role, label: 'Passant:in', icon: 'mdi-walk', color: '#16A34A' },
]

const defaultRoutes: Record<Role, string> = {
  sachbearbeiter: '/sb/karte',
  bauleiter: '/bl/projects',
  passant: '/pa/report',
}

function switchRole(role: Role) {
  roleStore.setRole(role)
  router.push(defaultRoutes[role])
}
</script>

<style scoped>
.pn-bar {
  position: sticky;
  top: 0;
  z-index: 200;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #E2E8F0;
}

/* Logo */
.pn-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-right: 4px;
}

.pn-logo-name {
  font-family: 'Barlow Semi Condensed', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #08122B;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

/* Pills */
.pn-pills {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.pn-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 40px;
  border: none;
  background: transparent;
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  transition: background 0.14s, color 0.14s;
  white-space: nowrap;
}

.pn-pill:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.pn-pill--active {
  background: #08122B;
  color: #ffffff;
}

.pn-pill--active:hover {
  background: #0D1A38;
  color: #ffffff;
}

.pn-pill-icon {
  opacity: 0.8;
}

/* Role switcher – segmented control */
.pn-seg {
  display: flex;
  align-items: center;
  background: #F1F5F9;
  border-radius: 8px;
  padding: 3px;
  gap: 1px;
  flex-shrink: 0;
}

.pn-seg-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.14s, color 0.14s, box-shadow 0.14s;
  outline: none;
}

.pn-seg-btn:hover:not(.pn-seg-btn--active) {
  background: #E8EDF3;
  color: #334155;
}

.pn-seg-btn--active {
  background: #ffffff;
  color: #0F172A;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04);
}

.pn-seg-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity 0.14s;
}

.pn-seg-btn--active .pn-seg-dot {
  opacity: 1;
}

.pn-seg-icon {
  opacity: 0.6;
  transition: opacity 0.14s;
}

.pn-seg-btn--active .pn-seg-icon {
  opacity: 1;
}
</style>
