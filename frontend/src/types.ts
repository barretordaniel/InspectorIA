export type Screen =
  | 'landing'
  | 'report-start'
  | 'report-photo'
  | 'report-analyzing'
  | 'report-result'
  | 'report-location'
  | 'report-summary'
  | 'report-success'
  | 'report-pdf'
  | 'map'
  | 'my-reports'
  | 'inst-login'
  | 'inst-dashboard'
  | 'inst-reports'
  | 'inst-report-detail'
  | 'inst-zone-history'

export type DamageType = 'Hueco' | 'Grieta' | 'Hundimiento' | 'Andén roto'
export type Severity = 'leve' | 'moderado' | 'grave'

export interface Report {
  id: string
  code: string
  type: DamageType
  severity: Severity
  confidence: number
  address: string
  neighborhood: string
  coordinates: { lat: number; lng: number }
  date: string
  comment?: string
  photoUrl: string
  mapX: number
  mapY: number
}

export interface NavProps {
  navigate: (screen: Screen) => void
}
