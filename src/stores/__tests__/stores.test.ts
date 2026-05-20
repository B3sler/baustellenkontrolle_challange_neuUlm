import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import { useBaustellenStore } from '../baustellenStore'
import { useMaengelStore } from '../maengelStore'
import { useRoleStore } from '../roleStore'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('roleStore', () => {
  it('defaults to sachbearbeiter', () => {
    const store = useRoleStore()
    expect(store.currentRole).toBe('sachbearbeiter')
  })

  it('switches role', () => {
    const store = useRoleStore()
    store.setRole('bauleiter')
    expect(store.currentRole).toBe('bauleiter')
  })
})

describe('baustellenStore', () => {
  it('loads mock data', () => {
    const store = useBaustellenStore()
    expect(store.baustellen.length).toBeGreaterThan(0)
  })

  it('updates baustellen status', () => {
    const store = useBaustellenStore()
    store.updateStatus('bs-1', 'abgeschlossen')
    expect(store.baustellen.find(b => b.id === 'bs-1')?.status).toBe('abgeschlossen')
  })

  it('adds a dokument', () => {
    const store = useBaustellenStore()
    const before = store.dokumente.length
    store.addDokument({
      id: 'test-dok',
      baustellenId: 'bs-1',
      titel: 'Test',
      typ: 'pdf',
      hochgeladenVon: 'bauleiter',
      hochgeladenAm: '2026-05-20',
    })
    expect(store.dokumente.length).toBe(before + 1)
  })
})

describe('maengelStore', () => {
  it('loads mock data', () => {
    const store = useMaengelStore()
    expect(store.maengel.length).toBeGreaterThan(0)
  })

  it('updates mangel status', () => {
    const store = useMaengelStore()
    store.updateStatus('mg-1', 'erledigt')
    expect(store.maengel.find(m => m.id === 'mg-1')?.status).toBe('erledigt')
  })

  it('filters by baustellenId', () => {
    const store = useMaengelStore()
    const result = store.getMaengelForBaustelle('bs-1')
    expect(result.every(m => m.baustellenId === 'bs-1')).toBe(true)
  })
})
