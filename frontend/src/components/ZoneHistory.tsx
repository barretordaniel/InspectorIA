import { useState } from 'react'
import type { NavProps } from '../types'
import { useReports } from '../hooks'
import { openReport } from '../draft'
import LeafletMap from './LeafletMap'
import SeverityBadge from './SeverityBadge'

const ZONES = [
  'Chapinero', 'Usaquén', 'Suba', 'Engativá', 'Fontibón', 'Kennedy', 'Bosa', 'Puente Aranda', 'Teusaquillo'
]

const SEV_COLOR: Record<string, string> = {
  leve: '#16a34a',
  moderado: '#d97706',
  grave: '#dc2626',
}

export default function ZoneHistory({ navigate }: NavProps) {
  const [selectedZone, setSelectedZone] = useState('Chapinero')
  const [search, setSearch] = useState('')

  const { reports: zoneReports } = useReports({ q: selectedZone })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0f2356]">Historial por zona</h1>
        <p className="text-slate-500 text-sm mt-1">Consulta reportes agrupados por localidad o barrio.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Zone selector */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-50">
              <div className="relative">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M9 9l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar zona..."
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {ZONES.filter(z => z.toLowerCase().includes(search.toLowerCase())).map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium border-b border-slate-50 last:border-0 transition-all
                    ${selectedZone === zone ? 'bg-blue-50 text-[#1d6fff]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{zone}</span>
                    {selectedZone === zone && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 4" stroke="#1d6fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map + reports */}
        <div className="xl:col-span-3 space-y-5">
          {/* Mini map */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <p className="font-display font-semibold text-[#0f2356]">{selectedZone}</p>
                <p className="text-xs text-slate-400">{zoneReports.length} reportes en esta zona</p>
              </div>
              <button onClick={() => navigate('map')} className="text-xs text-[#1d6fff] font-medium hover:underline">
                Ver en mapa completo →
              </button>
            </div>
            <div className="relative h-48">
              <LeafletMap reports={zoneReports} />
            </div>
          </div>

          {/* Report list */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Listado cronológico</p>
            </div>
            <div className="divide-y divide-slate-50">
              {zoneReports.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={r.photoUrl} alt={r.type} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-slate-800">{r.type}</p>
                      <SeverityBadge severity={r.severity} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{r.address}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(r.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => { openReport(r, 'inst-zone-history'); navigate('inst-report-detail') }}
                    className="text-xs text-[#1d6fff] font-medium hover:underline flex-shrink-0"
                  >
                    Detalle
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
