export type BaustellenStatus = 'offen' | 'in_pruefung' | 'abgeschlossen'
export type MaengelStatus = 'offen' | 'in_bearbeitung' | 'erledigt'
export type Prioritaet = 'hoch' | 'mittel' | 'niedrig'

export interface Baustelle {
  id: string
  name: string
  adresse: string
  status: BaustellenStatus
  prioritaet: Prioritaet
  lat: number
  lng: number
  bauleiterId: string
  startDatum: string
  endDatum: string
  offenerMaengelCount: number
}

export interface Mangel {
  id: string
  baustellenId: string
  kategorie: string
  beschreibung: string
  status: MaengelStatus
  lat: number
  lng: number
  erstelltAm: string
}

export interface Dokument {
  id: string
  baustellenId: string
  titel: string
  typ: 'antrag' | 'vra' | 'pdf' | 'bild' | 'protokoll' | 'sonstiges'
  hochgeladenVon: 'bauleiter' | 'sachbearbeiter'
  hochgeladenAm: string
}

export interface Bild {
  id: string
  baustellenId: string
  url: string
  beschreibung?: string
  hochgeladenVon: 'bauleiter' | 'sachbearbeiter'
  hochgeladenAm: string
}
