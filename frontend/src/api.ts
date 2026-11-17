import type { DamageType, Report, Severity } from './types'

export interface Analysis { type: DamageType; severity: Severity; confidence: number }

export interface ApiReport {
  id: number; code: string; type: DamageType; severity: Severity; confidence: number
  address: string; neighborhood: string | null; lat: number; lng: number
  date: string; comment: string | null; photoUrl: string
}

const BASE = import.meta.env.VITE_API_URL ?? ''

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

/** Reduce la foto a 1600px JPEG antes de subirla (el backend limita a 10 MB). Si el navegador no la decodifica, se envía tal cual. */
export async function compressImage(file: File, maxSide = 1600): Promise<File> {
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.85))
    return blob ? new File([blob], 'foto.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

export async function classify(file: File): Promise<Analysis> {
  const fd = new FormData()
  fd.append('photo', file)
  return parse<Analysis>(await fetch(`${BASE}/api/classify`, { method: 'POST', body: fd }))
}

export async function createReport(p: {
  file: File; lat: number; lng: number; address: string; neighborhood?: string; comment?: string
}): Promise<ApiReport> {
  const fd = new FormData()
  fd.append('photo', p.file)
  fd.append('lat', String(p.lat))
  fd.append('lng', String(p.lng))
  fd.append('address', p.address)
  if (p.neighborhood) fd.append('neighborhood', p.neighborhood)
  if (p.comment) fd.append('comment', p.comment)
  return parse<ApiReport>(await fetch(`${BASE}/api/reports`, { method: 'POST', body: fd }))
}

export async function listReports(f: { type?: string; severity?: string; q?: string; ids?: number[] } = {}): Promise<ApiReport[]> {
  const q = new URLSearchParams()
  if (f.type) q.set('type', f.type)
  if (f.severity) q.set('severity', f.severity)
  if (f.q) q.set('q', f.q)
  if (f.ids?.length) q.set('ids', f.ids.join(','))
  return parse<ApiReport[]>(await fetch(`${BASE}/api/reports?${q}`))
}

export const photoSrc = (r: ApiReport) => `${BASE}${r.photoUrl}`
export const pdfHref = (id: string | number) => `${BASE}/api/reports/${id}/pdf`

/** Adapta la respuesta del backend al tipo que usan las pantallas. */
export const toReport = (r: ApiReport): Report => ({
  id: String(r.id), code: r.code, type: r.type, severity: r.severity, confidence: r.confidence,
  address: r.address, neighborhood: r.neighborhood ?? '', coordinates: { lat: r.lat, lng: r.lng },
  date: r.date, comment: r.comment ?? undefined, photoUrl: photoSrc(r), mapX: 0, mapY: 0,
})

// ---- Acceso institucional
const TOKEN_KEY = 'inspectoria_token'
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } }
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY) } catch { /* noop */ } }

export async function login(email: string, password: string): Promise<{ token: string; name: string }> {
  const data = await parse<{ token: string; name: string }>(await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  }))
  try { localStorage.setItem(TOKEN_KEY, data.token) } catch { /* noop */ }
  return data
}

export interface Stats {
  total: number; leve: number; moderado: number; grave: number
  byType: Record<string, number>; thisWeek: number; prevWeek: number
}

export async function getStats(): Promise<Stats> {
  const res = await fetch(`${BASE}/api/inst/stats`, { headers: { Authorization: `Bearer ${getToken()}` } })
  if (res.status === 401 || res.status === 403) {
    clearToken()
    window.dispatchEvent(new Event('inspectoria:logout'))
    throw new Error('Sesión expirada')
  }
  return parse<Stats>(res)
}
