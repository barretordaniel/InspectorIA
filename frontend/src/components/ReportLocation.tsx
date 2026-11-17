import { useEffect, useState } from 'react'
import type { NavProps } from '../types'
import StepIndicator from './StepIndicator'
import { updateDraft, useDraft } from '../draft'
import LeafletMap from './LeafletMap'

const MARKERS = [
  { x: 50, y: 45, active: true },
]

export default function ReportLocation({ navigate }: NavProps) {
  const d = useDraft()
  const [adjusted, setAdjusted] = useState(false)
  const [gpsMsg, setGpsMsg] = useState<string | null>(null)

  function locate() {
    if (!navigator.geolocation) { setGpsMsg('Tu navegador no permite obtener la ubicación. Escribe la dirección manualmente.'); return }
    navigator.geolocation.getCurrentPosition(
      p => { updateDraft({ lat: p.coords.latitude, lng: p.coords.longitude }); setGpsMsg(null) },
      () => setGpsMsg('No pudimos obtener tu ubicación. Activa el permiso de ubicación o escribe la dirección manualmente.'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }
  useEffect(locate, [])

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('report-result')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[#0f2356] text-base">Confirma la ubicación</h1>
          </div>
          <StepIndicator currentStep={3} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-sm text-slate-600">Detectamos automáticamente tu ubicación.</p>
        </div>

        {/* Map */}
        <div className="relative rounded-2xl overflow-hidden bg-[#e8f0f5] mb-5 shadow-sm" style={{ height: 280 }}>
          <LeafletMap
            reports={[]}
            pin={{ lat: d.lat, lng: d.lng }}
            onPinChange={(lat, lng) => { updateDraft({ lat, lng }); setAdjusted(true) }}
            zoom={16}
          />
          <div className="absolute bottom-3 right-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg px-2.5 py-1.5 font-mono">
            {d.lat.toFixed(4)}° {d.lat >= 0 ? 'N' : 'S'}, {Math.abs(d.lng).toFixed(4)}° {d.lng >= 0 ? 'E' : 'W'}
          </div>
        </div>
        <p className="text-xs text-slate-400 -mt-3 mb-5">Arrastra el marcador o toca el mapa para ajustar el punto exacto del daño.</p>

        {/* Address card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2C6.24 2 4 4.24 4 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z" stroke="#1d6fff" strokeWidth="1.6"/>
                <circle cx="9" cy="7" r="2.5" stroke="#1d6fff" strokeWidth="1.4"/>
              </svg>
            </div>
            <div className="flex-1">
              <input
                value={d.address}
                onChange={e => updateDraft({ address: e.target.value })}
                placeholder="Dirección (Ej: Carrera 15 # 93-75)"
                className="w-full font-display font-semibold text-[#0f2356] text-base border-b border-slate-200 focus:border-blue-400 outline-none pb-1 placeholder-slate-300"
              />
              <input
                value={d.neighborhood}
                onChange={e => updateDraft({ neighborhood: e.target.value })}
                placeholder="Barrio / localidad (opcional)"
                className="w-full text-slate-500 text-sm mt-2 border-b border-slate-100 focus:border-blue-400 outline-none pb-1 placeholder-slate-300"
              />
              <p className="text-slate-400 text-xs mt-2 font-mono">{d.lat.toFixed(6)}, {d.lng.toFixed(6)}</p>
              {gpsMsg && <p className="text-amber-700 text-xs mt-2">{gpsMsg}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={locate} className="flex items-center justify-center gap-2 py-3 bg-white text-sm font-medium text-[#0f2356] rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="3" stroke="#1d6fff" strokeWidth="1.4"/>
              <path d="M8 2C5.24 2 3 4.24 3 7c0 4 5 9 5 9s5-5 5-9c0-2.76-2.24-5-5-5z" stroke="#1d6fff" strokeWidth="1.4"/>
            </svg>
            Usar mi ubicación
          </button>
          <button
            onClick={() => setAdjusted(true)}
            className={`flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-xl border transition-all
              ${adjusted ? 'border-green-300 bg-green-50 text-green-700' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 14l4-4 8-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {adjusted ? 'Ajustado ✓' : 'Ajustar en mapa'}
          </button>
        </div>

        <button
          onClick={() => navigate('report-summary')}
          disabled={!d.address.trim()}
          className="w-full py-3.5 bg-[#1d6fff] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
        >
          Confirmar ubicación
        </button>
      </div>
    </div>
  )
}
