import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Report, Severity } from '../types'

const COLOR: Record<Severity, string> = { leve: '#16a34a', moderado: '#d97706', grave: '#dc2626' }
const BOGOTA: [number, number] = [4.6486, -74.0818]

interface Props {
  reports: Report[]
  selectedId?: string | null
  onSelect?: (r: Report) => void
  center?: [number, number]
  zoom?: number
  /** Ajusta el encuadre para que se vean todos los reportes. */
  fit?: boolean
  /** Marcador arrastrable (pantalla de ubicación). Se puede mover también haciendo clic en el mapa. */
  pin?: { lat: number; lng: number }
  onPinChange?: (lat: number, lng: number) => void
}

export default function LeafletMap({ reports, selectedId, onSelect, center, zoom = 12, fit = true, pin, onPinChange }: Props) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const pinMarker = useRef<L.Marker | null>(null)
  const onSelectRef = useRef(onSelect); onSelectRef.current = onSelect
  const onPinRef = useRef(onPinChange); onPinRef.current = onPinChange
  const sig = reports.map(r => r.id + r.severity).join(',')

  useEffect(() => {
    const m = L.map(el.current!, { center: center ?? BOGOTA, zoom })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    m.on('click', e => onPinRef.current?.(e.latlng.lat, e.latlng.lng))
    map.current = m
    return () => { m.remove(); map.current = null; pinMarker.current = null }
  }, [])

  useEffect(() => {
    const g = layer.current
    if (!g) return
    g.clearLayers()
    reports.forEach(r => {
      L.circleMarker([r.coordinates.lat, r.coordinates.lng], {
        radius: r.id === selectedId ? 12 : 8, color: '#ffffff', weight: 2, fillColor: COLOR[r.severity], fillOpacity: 0.95,
      }).on('click', () => onSelectRef.current?.(r)).addTo(g)
    })
  }, [sig, selectedId])

  useEffect(() => {
    const m = map.current
    if (!m || !fit || pin || reports.length === 0) return
    m.fitBounds(L.latLngBounds(reports.map(r => [r.coordinates.lat, r.coordinates.lng] as [number, number])), { padding: [40, 40], maxZoom: 15 })
  }, [sig])

  useEffect(() => {
    const m = map.current
    if (!m || !pin) return
    if (!pinMarker.current) {
      const icon = L.divIcon({
        className: '',
        html: '<div style="width:28px;height:28px;border-radius:50%;background:#1d6fff;border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.35)"></div>',
        iconSize: [28, 28], iconAnchor: [14, 14],
      })
      const mk = L.marker([pin.lat, pin.lng], { icon, draggable: !!onPinRef.current }).addTo(m)
      mk.on('dragend', () => { const p = mk.getLatLng(); onPinRef.current?.(p.lat, p.lng) })
      pinMarker.current = mk
      m.setView([pin.lat, pin.lng], Math.max(m.getZoom(), 16))
    } else {
      pinMarker.current.setLatLng([pin.lat, pin.lng])
      m.panTo([pin.lat, pin.lng])
    }
  }, [pin?.lat, pin?.lng])

  return <div ref={el} className="absolute inset-0 z-0" />
}
