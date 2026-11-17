import { useMemo, useState } from 'react'
import type { NavProps, Report, Severity, DamageType } from '../types'
import { useReports } from '../hooks'
import { openReport } from '../draft'
import LeafletMap from './LeafletMap'
import SeverityBadge from './SeverityBadge'

const SEV_COLOR: Record<Severity, string> = {
  leve: '#16a34a',
  moderado: '#d97706',
  grave: '#dc2626',
}

const TYPES: DamageType[] = ['Hueco', 'Grieta', 'Hundimiento', 'Andén roto']
const SEVERITIES: Severity[] = ['leve', 'moderado', 'grave']

export default function MapView({ navigate }: NavProps) {
  const [filterType, setFilterType] = useState<string>('todos')
  const [filterSev, setFilterSev] = useState<string>('todas')
  const [selected, setSelected] = useState<Report | null>(null)
  const [search, setSearch] = useState('')

  const { reports, loading, error } = useReports()
  const filtered = useMemo(() => reports.filter(r => {
    if (filterType !== 'todos' && r.type !== filterType) return false
    if (filterSev !== 'todas' && r.severity !== filterSev) return false
    if (search && !r.address.toLowerCase().includes(search.toLowerCase()) && !r.neighborhood.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [reports, filterType, filterSev, search])

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 flex-wrap">
        <button onClick={() => navigate('landing')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="font-display font-semibold text-[#0f2356] text-base mr-2">Mapa de reportes</h1>

        {/* Search */}
        <div className="flex-1 min-w-36 max-w-xs relative">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar barrio o dirección..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        {/* Filters */}
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="todos">Todos los tipos</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filterSev}
          onChange={e => setFilterSev(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="todas">Todas las severidades</option>
          {SEVERITIES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map area */}
        <div className="flex-1 relative">
          <LeafletMap reports={filtered} selectedId={selected?.id} onSelect={r => setSelected(selected?.id === r.id ? null : r)} />
          {loading && <div className="absolute top-4 left-4 z-10 bg-white/95 rounded-xl shadow px-3 py-2 text-xs text-slate-500">Cargando reportes…</div>}
          {error && <div className="absolute top-4 left-4 z-10 bg-red-50 border border-red-100 rounded-xl shadow px-3 py-2 text-xs text-red-700">No pudimos cargar los reportes. {error}</div>}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-xs">
            <p className="font-semibold text-slate-600 mb-2">Severidad</p>
            {[
              { s: 'leve' as Severity, label: 'Leve' },
              { s: 'moderado' as Severity, label: 'Moderado' },
              { s: 'grave' as Severity, label: 'Grave' },
            ].map(({ s, label }) => (
              <div key={s} className="flex items-center gap-2 mb-1 last:mb-0">
                <div className="w-3 h-3 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: SEV_COLOR[s] }} />
                <span className="text-slate-600">{label}</span>
              </div>
            ))}
          </div>

          {/* Count badge */}
          <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2 text-xs font-medium text-slate-600">
            {filtered.length} reportes visibles
          </div>

          {/* FAB report button */}
          <button
            onClick={() => navigate('report-start')}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-[#1d6fff] hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg shadow-blue-300/40 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Reportar daño
          </button>

          {/* Selected marker popover */}
          {selected && (
            <div
              className="absolute bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-64 z-20 left-4 top-16"
            >
              <div className="rounded-xl overflow-hidden h-28 bg-slate-100 mb-3">
                <img src={selected.photoUrl} alt={selected.type} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display font-semibold text-[#0f2356] text-sm">{selected.type}</p>
                  <p className="text-slate-400 text-xs">{selected.address}</p>
                </div>
                <SeverityBadge severity={selected.severity} size="sm" />
              </div>
              <p className="text-xs text-slate-400 mb-3">{new Date(selected.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { openReport(selected, 'map'); navigate('report-pdf') }}
                  className="flex-1 py-2 bg-[#1d6fff] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver reporte
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="py-2 px-3 bg-slate-100 text-slate-500 text-xs rounded-lg hover:bg-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
