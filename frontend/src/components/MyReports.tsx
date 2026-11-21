import { useState } from 'react'
import type { NavProps, Severity, DamageType } from '../types'
import { useReports } from '../hooks'
import { getMine } from '../mine'
import { openReport } from '../draft'
import SeverityBadge from './SeverityBadge'

const SEVERITIES: { value: string; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'leve', label: 'Leve' },
  { value: 'moderado', label: 'Moderado' },
  { value: 'grave', label: 'Grave' },
]

const TYPES: { value: string; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'Hueco', label: 'Hueco' },
  { value: 'Grieta', label: 'Grieta' },
  { value: 'Hundimiento', label: 'Hundimiento' },
  { value: 'Andén roto', label: 'Andén roto' },
]

export default function MyReports({ navigate }: NavProps) {
  const [filterSev, setFilterSev] = useState('todas')
  const [filterType, setFilterType] = useState('todos')
  const MINE = getMine()
  const { reports: myReports, loading } = useReports({ ids: MINE })

  const filtered = myReports.filter(r => {
    if (filterSev !== 'todas' && r.severity !== filterSev) return false
    if (filterType !== 'todos' && r.type !== filterType) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('landing')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <h1 className="font-display font-semibold text-[#0f2356]">Mis reportes</h1>
            <p className="text-slate-400 text-xs">{myReports.length} reportes registrados</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          <div className="flex gap-1.5 flex-shrink-0">
            {SEVERITIES.map(s => (
              <button
                key={s.value}
                onClick={() => setFilterSev(s.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex-shrink-0
                  ${filterSev === s.value ? 'bg-[#0f2356] text-white border-[#0f2356]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="w-px bg-slate-200 mx-1 flex-shrink-0" />
          <div className="flex gap-1.5 flex-shrink-0">
            {TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => setFilterType(t.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all flex-shrink-0
                  ${filterType === t.value ? 'bg-[#0f2356] text-white border-[#0f2356]' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <p className="text-slate-400 text-sm">{loading ? 'Cargando…' : MINE.length === 0 ? 'Aún no has generado reportes en este dispositivo.' : 'No se encontraron reportes con estos filtros.'}</p>
            </div>
          ) : (
            filtered.map(report => (
              <div key={report.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0">
                  {/* Photo */}
                  <div className="w-28 h-28 flex-shrink-0 bg-slate-100">
                    <img src={report.photoUrl} alt={report.type} className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <p className="font-display font-semibold text-[#0f2356] text-sm">{report.type}</p>
                        <p className="text-slate-400 text-xs font-mono">{report.code}</p>
                      </div>
                      <SeverityBadge severity={report.severity} size="sm" />
                    </div>
                    <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="5" cy="4.5" r="2" stroke="#94a3b8" strokeWidth="1.2"/>
                        <path d="M5 1.5C3.07 1.5 1.5 3.07 1.5 5c0 2.5 3.5 6 3.5 6S8.5 7.5 8.5 5c0-1.93-1.57-3.5-3.5-3.5z" stroke="#94a3b8" strokeWidth="1.2"/>
                      </svg>
                      {report.address}
                    </p>
                    <p className="text-slate-400 text-xs mb-3">
                      {new Date(report.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { openReport(report, 'my-reports'); navigate('report-pdf') }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1d6fff] text-white text-[11px] font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => navigate('map')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        Ver en mapa
                      </button>
                      <button
                        onClick={() => { openReport(report, 'my-reports'); navigate('report-pdf') }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate('report-start')}
          className="w-full mt-6 py-3.5 bg-[#1d6fff] hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
        >
          Reportar nuevo daño
        </button>
      </div>
    </div>
  )
}
