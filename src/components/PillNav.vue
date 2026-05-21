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
    <div class="pn-role-wrap">
      <v-menu :close-on-content-click="true">
        <template #activator="{ props }">
          <button v-bind="props" class="pn-role-btn">
            <div class="pn-role-avatar">{{ roleInitials }}</div>
            <span class="pn-role-label">{{ roleLabel }}</span>
            <v-icon size="13" color="#94A3B8">mdi-chevron-down</v-icon>
          </button>
        </template>
        <v-list class="pn-role-menu" density="compact" :elevation="8">
          <div class="pn-menu-header">Rolle wechseln</div>
          <v-list-item
            v-for="option in roleOptions"
            :key="option.value"
            :active="roleStore.currentRole === option.value"
            active-color="primary"
            rounded="lg"
            @click="switchRole(option.value)"
          >
            <template #prepend>
              <div class="pn-menu-icon">
                <v-icon size="15">{{ option.icon }}</v-icon>
              </div>
            </template>
            <v-list-item-title class="pn-menu-item-title">{{ option.label }}</v-list-item-title>
            <v-list-item-subtitle class="pn-menu-item-sub">{{ option.desc }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-menu>
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
  { value: 'sachbearbeiter' as Role, label: 'Sachbearbeiter:in', icon: 'mdi-briefcase-outline', desc: 'Stadt · Vollzugriff' },
  { value: 'bauleiter' as Role, label: 'Bauleiter:in', icon: 'mdi-hard-hat', desc: 'Bauleitung · Eigene Baustellen' },
  { value: 'passant' as Role, label: 'Passant:in', icon: 'mdi-walk', desc: 'Bürger:in · Meldungen' },
]

const roleLabel = computed(() => roleOptions.find(o => o.value === roleStore.currentRole)?.label ?? '')
const roleInitials = computed(() => {
  const map: Record<Role, string> = { sachbearbeiter: 'SB', bauleiter: 'BL', passant: 'PA' }
  return map[roleStore.currentRole]
})

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

/* Role switcher */
.pn-role-wrap {
  flex-shrink: 0;
  margin-left: 4px;
}

.pn-role-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 40px;
  padding: 4px 12px 4px 4px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  outline: none;
}
.pn-role-btn:hover {
  border-color: #93C5FD;
  background: #EFF6FF;
}

.pn-role-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #08122B, #2563EB);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.5px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.pn-role-label {
  font-family: 'Barlow', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
}

/* Role dropdown menu */
.pn-role-menu {
  border-radius: 12px !important;
  border: 1px solid #E2E8F0 !important;
  padding: 6px !important;
  min-width: 220px;
}

.pn-menu-header {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94A3B8;
  padding: 4px 12px 8px;
}

.pn-menu-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.pn-menu-item-title {
  font-family: 'Barlow', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #0F172A !important;
}

.pn-menu-item-sub {
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 9.5px !important;
  color: #94A3B8 !important;
  letter-spacing: 0.02em !important;
}
</style>
