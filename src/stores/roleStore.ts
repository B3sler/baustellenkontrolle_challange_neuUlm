import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Role = 'sachbearbeiter' | 'bauleiter' | 'passant'

export const useRoleStore = defineStore('role', () => {
  const currentRole = ref<Role>('sachbearbeiter')
  const currentBauleiterId = ref<string>('bl-1')

  function setRole(role: Role) {
    currentRole.value = role
  }

  return { currentRole, currentBauleiterId, setRole }
})
