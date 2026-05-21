<template>
  <v-menu :close-on-content-click="true">
    <template #activator="{ props }">
      <button v-bind="props" class="bp-role-pill">
        <div class="bp-role-avatar">{{ roleInitials }}</div>
        <div class="bp-role-info">
          <span class="bp-role-label">{{ roleLabel }}</span>
          <span class="bp-role-hint">Rolle wechseln</span>
        </div>
        <v-icon size="14" color="rgba(255,255,255,0.4)">mdi-chevron-down</v-icon>
      </button>
    </template>
    <v-list class="bp-role-menu" density="compact" :elevation="8">
      <div class="bp-menu-header">Rolle wechseln</div>
      <v-list-item
        v-for="option in options"
        :key="option.value"
        :active="roleStore.currentRole === option.value"
        active-color="primary"
        rounded="lg"
        @click="switchRole(option.value)"
      >
        <template #prepend>
          <div class="bp-menu-icon">
            <v-icon size="16">{{ option.icon }}</v-icon>
          </div>
        </template>
        <v-list-item-title class="bp-menu-item-title">{{ option.label }}</v-list-item-title>
        <v-list-item-subtitle class="bp-menu-item-sub">{{ option.desc }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoleStore, type Role } from '../stores/roleStore'

const roleStore = useRoleStore()
const router = useRouter()

const options = [
  { value: 'sachbearbeiter' as Role, label: 'Sachbearbeiter:in', icon: 'mdi-briefcase-outline', desc: 'Stadt · Vollzugriff' },
  { value: 'bauleiter' as Role, label: 'Bauleiter:in', icon: 'mdi-hard-hat', desc: 'Bauleitung · Eigene Baustellen' },
  { value: 'passant' as Role, label: 'Passant:in', icon: 'mdi-walk', desc: 'Bürger:in · Meldungen' },
]

const roleLabel = computed(() => options.find(o => o.value === roleStore.currentRole)?.label ?? '')
const roleInitials = computed(() => {
  const map: Record<Role, string> = { sachbearbeiter: 'SB', bauleiter: 'BL', passant: 'PA' }
  return map[roleStore.currentRole]
})

const defaultRoutes: Record<Role, string> = {
  sachbearbeiter: '/sb/baustellen',
  bauleiter: '/bl/projects',
  passant: '/pa/report',
}

function switchRole(role: Role) {
  roleStore.setRole(role)
  router.push(defaultRoutes[role])
}
</script>

<style scoped>
.bp-role-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(99, 179, 237, 0.2);
  border-radius: 40px;
  padding: 5px 12px 5px 5px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  margin-right: 12px;
  outline: none;
}
.bp-role-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(99, 179, 237, 0.4);
}

.bp-role-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563EB, #63B3ED);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.bp-role-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
}

.bp-role-label {
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1;
  white-space: nowrap;
}

.bp-role-hint {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 8.5px;
  color: rgba(99, 179, 237, 0.6);
  letter-spacing: 0.05em;
  line-height: 1;
}

/* Menu */
.bp-role-menu {
  border-radius: 12px !important;
  border: 1px solid #E2E8F0 !important;
  padding: 6px !important;
  min-width: 220px;
}

.bp-menu-header {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94A3B8;
  padding: 4px 12px 8px;
}

.bp-menu-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.bp-menu-item-title {
  font-family: 'Barlow', sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #0F172A !important;
}

.bp-menu-item-sub {
  font-family: 'IBM Plex Mono', monospace !important;
  font-size: 9.5px !important;
  color: #94A3B8 !important;
  letter-spacing: 0.02em !important;
}
</style>
