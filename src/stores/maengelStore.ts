import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Mangel, MaengelStatus } from '../types/types'
import { mockMaengel } from '../data/mockData'

export const useMaengelStore = defineStore('maengel', () => {
  const maengel = ref<Mangel[]>([...mockMaengel])

  function updateStatus(id: string, status: MaengelStatus) {
    const m = maengel.value.find(x => x.id === id)
    if (m) m.status = status
  }

  function addMangel(mangel: Mangel) {
    maengel.value.push(mangel)
  }

  function getMaengelForBaustelle(baustellenId: string) {
    return maengel.value.filter(m => m.baustellenId === baustellenId)
  }

  return { maengel, updateStatus, addMangel, getMaengelForBaustelle }
})
