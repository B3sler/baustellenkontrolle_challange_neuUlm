export type BaustellenStatus = 'offen' | 'in_pruefung' | 'abgeschlossen'
export type MaengelStatus = 'gemeldet' | 'in_bearbeitung' | 'ueberprueft' | 'abgemahnt' | 'abgeschlossen'
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
  // Auftragnehmer
  firma: string
  ansprechpartner: string
  telefon: string
  email: string
  // Verwaltung
  genehmigungsNr: string
  auftragswert: string
  beschreibung: string
}

export interface Kommentar {
  id: string
  text: string
  verfasserRolle: 'bauleiter' | 'sachbearbeiter'
  erstelltAm: string
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
  kommentare?: Kommentar[]
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
