<template>
  <v-tabs
    v-model="activeTab"
    color="primary"
    bg-color="white"
    show-arrows
  >
    <v-tab
      v-for="tab in currentTabs"
      :key="tab.to"
      :value="tab.to"
      :prepend-icon="tab.icon"
      @click="router.push(tab.to)"
    >
      {{ tab.label }}
    </v-tab>
  </v-tabs>
  <v-divider />
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
    { to: '/sb/maengel', label: 'Mängel', icon: 'mdi-alert-circle' },
    { to: '/sb/karte', label: 'Karte', icon: 'mdi-map' },
  ],
  bauleiter: [
    { to: '/bl/projects', label: 'Meine Baustellen', icon: 'mdi-hard-hat' },
  ],
  passant: [
    { to: '/pa/report', label: 'Mängel melden', icon: 'mdi-plus-circle' },
    { to: '/pa/meldungen', label: 'Meldungen', icon: 'mdi-list-box' },
    { to: '/pa/karte', label: 'Karte', icon: 'mdi-map' },
  ],
}

const currentTabs = computed(() => tabsByRole[roleStore.currentRole])
const activeTab = ref(route.path)

watch(() => route.path, (path) => {
  activeTab.value = path
})
</script>
