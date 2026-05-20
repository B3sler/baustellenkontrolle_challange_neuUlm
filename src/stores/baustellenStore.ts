import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Baustelle, Dokument, Bild, BaustellenStatus } from '../types/types'
import { mockBaustellen, mockDokumente, mockBilder } from '../data/mockData'

export const useBaustellenStore = defineStore('baustellen', () => {
  const baustellen = ref<Baustelle[]>([...mockBaustellen])
  const dokumente = ref<Dokument[]>([...mockDokumente])
  const bilder = ref<Bild[]>([...mockBilder])

  function updateStatus(id: string, status: BaustellenStatus) {
    const b = baustellen.value.find(x => x.id === id)
    if (b) b.status = status
  }

  function addDokument(dok: Dokument) {
    dokumente.value.push(dok)
  }

  function addBild(bild: Bild) {
    bilder.value.push(bild)
  }

  function getDokumenteForBaustelle(baustellenId: string) {
    return dokumente.value.filter(d => d.baustellenId === baustellenId)
  }

  function getBilderForBaustelle(baustellenId: string) {
    return bilder.value.filter(b => b.baustellenId === baustellenId)
  }

  return {
    baustellen,
    dokumente,
    bilder,
    updateStatus,
    addDokument,
    addBild,
    getDokumenteForBaustelle,
    getBilderForBaustelle,
  }
})
