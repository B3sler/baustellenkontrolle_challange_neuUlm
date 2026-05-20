<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="tonal" color="white" prepend-icon="mdi-account-circle">
        {{ roleLabel }}
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item
        v-for="option in options"
        :key="option.value"
        :title="option.label"
        :prepend-icon="option.icon"
        :active="roleStore.currentRole === option.value"
        active-color="primary"
        @click="switchRole(option.value)"
      />
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
  { value: 'sachbearbeiter' as Role, label: 'Sachbearbeiter:in', icon: 'mdi-briefcase' },
  { value: 'bauleiter' as Role, label: 'Bauleiter:in', icon: 'mdi-hard-hat' },
  { value: 'passant' as Role, label: 'Passant:in', icon: 'mdi-walk' },
]

const roleLabel = computed(() => options.find(o => o.value === roleStore.currentRole)?.label ?? '')

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
