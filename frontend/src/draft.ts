import { useSyncExternalStore } from 'react'
import type { Analysis } from './api'
import type { Report, Screen } from './types'

/** Estado compartido del flujo: reporte en curso, reporte que se está viendo y a dónde volver. */
export interface Draft {
  file: File | null
  previewUrl: string | null
  comment: string
  analysis: Analysis | null
  lat: number
  lng: number
  address: string
  neighborhood: string
  created: Report | null
  viewing: Report | null
  backTo: Screen
  pdfBack: Screen
}

const BOGOTA = { lat: 4.6097, lng: -74.0817 }
const base = { file: null, previewUrl: null, comment: '', analysis: null, ...BOGOTA, address: '', neighborhood: '', created: null, viewing: null }
const empty: Draft = { ...base, backTo: 'landing', pdfBack: 'report-success' }

let state: Draft = empty
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())

export const getDraft = () => state
export function updateDraft(patch: Partial<Draft>) { state = { ...state, ...patch }; emit() }

export function setPhoto(file: File) {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl)
  state = { ...empty, file, previewUrl: URL.createObjectURL(file) }
  emit()
}

export function resetDraft() {
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl)
  state = empty
  emit()
}

/** Abre un reporte existente (detalle institucional o vista PDF) recordando de dónde viene. */
export function openReport(r: Report, from: Screen) { updateDraft({ viewing: r, backTo: from, pdfBack: from }) }

export function useDraft(): Draft {
  return useSyncExternalStore(
    cb => { listeners.add(cb); return () => { listeners.delete(cb) } },
    () => state,
  )
}
