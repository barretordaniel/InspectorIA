import type { Report } from '../types'

export const PHOTO_URLS = {
  hueco: 'https://images.unsplash.com/photo-1779179015285-120aaa822b1b?w=600&h=400&fit=crop&auto=format',
  grieta: 'https://images.unsplash.com/photo-1706660143732-c1d14701114e?w=600&h=400&fit=crop&auto=format',
  asfalto: 'https://images.unsplash.com/photo-1741996951192-f4762170f3cb?w=600&h=400&fit=crop&auto=format',
  city: 'https://images.unsplash.com/photo-1693761935636-fe8aef447e62?w=1400&h=900&fit=crop&auto=format',
}

export const CURRENT_REPORT: Omit<Report, 'id' | 'code' | 'mapX' | 'mapY'> = {
  type: 'Hueco',
  severity: 'grave',
  confidence: 92,
  address: 'Carrera 15 # 93-75',
  neighborhood: 'Chicó Norte',
  coordinates: { lat: 4.6789, lng: -74.0521 },
  date: '2026-09-08T10:32:00',
  comment: 'El hueco está ubicado en el carril derecho y dificulta el paso de vehículos.',
  photoUrl: PHOTO_URLS.hueco,
}

export const mockReports: Report[] = [
  {
    id: '1', code: 'INS-2026-00428', type: 'Hueco', severity: 'grave', confidence: 92,
    address: 'Carrera 15 # 93-75', neighborhood: 'Chicó Norte',
    coordinates: { lat: 4.6789, lng: -74.0521 }, date: '2026-09-08T10:32:00',
    comment: 'El hueco está ubicado en el carril derecho y dificulta el paso de vehículos.',
    photoUrl: PHOTO_URLS.hueco, mapX: 58, mapY: 32,
  },
  {
    id: '2', code: 'INS-2026-00427', type: 'Grieta', severity: 'moderado', confidence: 87,
    address: 'Calle 72 # 10-34', neighborhood: 'La Castellana',
    coordinates: { lat: 4.6712, lng: -74.0598 }, date: '2026-09-07T14:15:00',
    photoUrl: PHOTO_URLS.grieta, mapX: 44, mapY: 46,
  },
  {
    id: '3', code: 'INS-2026-00426', type: 'Hundimiento', severity: 'grave', confidence: 78,
    address: 'Av. El Dorado # 69-76', neighborhood: 'Fontibón',
    coordinates: { lat: 4.6571, lng: -74.1023 }, date: '2026-09-07T09:44:00',
    photoUrl: PHOTO_URLS.asfalto, mapX: 26, mapY: 63,
  },
  {
    id: '4', code: 'INS-2026-00425', type: 'Andén roto', severity: 'leve', confidence: 94,
    address: 'Calle 100 # 19-52', neighborhood: 'Usaquén',
    coordinates: { lat: 4.6912, lng: -74.0487 }, date: '2026-09-06T16:20:00',
    photoUrl: PHOTO_URLS.hueco, mapX: 62, mapY: 20,
  },
  {
    id: '5', code: 'INS-2026-00424', type: 'Hueco', severity: 'moderado', confidence: 85,
    address: 'Carrera 7 # 45-23', neighborhood: 'Chapinero',
    coordinates: { lat: 4.6634, lng: -74.0558 }, date: '2026-09-06T11:05:00',
    photoUrl: PHOTO_URLS.grieta, mapX: 54, mapY: 44,
  },
  {
    id: '6', code: 'INS-2026-00423', type: 'Grieta', severity: 'leve', confidence: 91,
    address: 'Calle 26 # 92-32', neighborhood: 'Álamos',
    coordinates: { lat: 4.6481, lng: -74.0963 }, date: '2026-09-05T13:30:00',
    photoUrl: PHOTO_URLS.asfalto, mapX: 34, mapY: 57,
  },
  {
    id: '7', code: 'INS-2026-00422', type: 'Hueco', severity: 'grave', confidence: 89,
    address: 'Transversal 39 # 119-20', neighborhood: 'Suba',
    coordinates: { lat: 4.7101, lng: -74.0799 }, date: '2026-09-05T08:12:00',
    photoUrl: PHOTO_URLS.hueco, mapX: 40, mapY: 18,
  },
  {
    id: '8', code: 'INS-2026-00421', type: 'Andén roto', severity: 'moderado', confidence: 83,
    address: 'Calle 80 # 68-40', neighborhood: 'Engativá',
    coordinates: { lat: 4.6823, lng: -74.0936 }, date: '2026-09-04T15:45:00',
    photoUrl: PHOTO_URLS.grieta, mapX: 30, mapY: 38,
  },
]

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleString('es-CO', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
