<template>
  <div class="bp-tabbar">
    <v-tabs
      v-model="activeTab"
      class="bp-nav-tabs"
      :bg-color="'transparent'"
      height="44"
      show-arrows
    >
      <v-tab
        v-for="tab in currentTabs"
        :key="tab.to"
        :value="tab.to"
        class="bp-tab"
        @click="router.push(tab.to)"
      >
        <v-icon size="15" class="bp-tab-icon">{{ tab.icon }}</v-icon>
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <div class="bp-tabbar-line" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '../stores/roleStore'

const roleStore = useRoleStore()
const route = useRoute()
const router = useRouter()

const tabsByRole = {
  sachbearbeiter: [
    { to: '/sb/baustellen', label: 'Baustellen', icon: 'mdi-road-variant' },
    { to: '/sb/maengel', label: 'Mängel', icon: 'mdi-alert-circle-outline' },
    { to: '/sb/karte', label: 'Karte', icon: 'mdi-map-outline' },
  ],
  bauleiter: [
    { to: '/bl/projects', label: 'Meine Baustellen', icon: 'mdi-hard-hat' },
  ],
  passant: [
    { to: '/pa/report', label: 'Mängel melden', icon: 'mdi-plus-circle-outline' },
    { to: '/pa/meldungen', label: 'Meldungen', icon: 'mdi-format-list-bulleted' },
    { to: '/pa/karte', label: 'Karte', icon: 'mdi-map-outline' },
  ],
}

const currentTabs = computed(() => tabsByRole[roleStore.currentRole])
const activeTab = ref(route.path)

watch(() => route.path, (path) => {
  activeTab.value = path
})
</script>

<style scoped>
.bp-tabbar {
  background: #0D1A38;
}

.bp-tabbar-line {
  height: 1px;
  background: rgba(99, 179, 237, 0.12);
}

.bp-tab {
  font-family: 'DM Sans', sans-serif !important;
  font-size: 12.5px !important;
  font-weight: 500 !important;
  text-transform: none !important;
  letter-spacing: 0.01em !important;
  color: rgba(255, 255, 255, 0.4) !important;
  gap: 5px;
  min-width: unset !important;
  padding: 0 18px !important;
  transition: color 0.15s !important;
}

.bp-tab-icon {
  margin-right: 2px;
  opacity: 0.7;
}
</style>
