import { useState } from 'react'
import type { NavProps, Severity, DamageType } from '../types'
import { useReports } from '../hooks'
import { openReport } from '../draft'
import SeverityBadge from './SeverityBadge'

const TYPES: DamageType[] = ['Hueco', 'Grieta', 'Hundimiento', 'Andén roto']
const SEVERITIES: Severity[] = ['leve', 'moderado', 'grave']

export default function InstitutionalReports({ navigate }: NavProps) {
  const [filterType, setFilterType] = useState('')
  const [filterSev, setFilterSev] = useState('')
  const [search, setSearch] = useState('')
  const { reports } = useReports()

  const filtered = reports.filter(r => {
    if (filterType && r.type !== filterType) return false
    if (filterSev && r.severity !== filterSev) return false
    if (search && !r.address.toLowerCase().includes(search.toLowerCase()) && !r.code.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0f2356]">Reportes ciudadanos</h1>
        <p className="text-slate-500 text-sm mt-1">{filtered.length} de {reports.length} registros</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID o dirección..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Tipo de daño</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={filterSev}
          onChange={e => setFilterSev(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Severidad</option>
          {SEVERITIES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        {(filterType || filterSev || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterSev(''); setSearch('') }}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID', 'Fotografía', 'Tipo de daño', 'Severidad', 'Ubicación', 'Fecha', 'Acciones'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-slate-500">{r.code}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={r.photoUrl} alt={r.type} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-slate-800">{r.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <SeverityBadge severity={r.severity} size="sm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-600 max-w-xs">{r.address}</p>
                    <p className="text-xs text-slate-400">{r.neighborhood}</p>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-slate-500">
                      {new Date(r.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { openReport(r, 'inst-reports'); navigate('inst-report-detail') }}
                        className="text-xs px-3 py-1.5 bg-[#1d6fff] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Ver detalle
                      </button>
                      <button
                        onClick={() => { openReport(r, 'inst-reports'); navigate('report-pdf') }}
                        className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-sm">No se encontraron reportes con estos filtros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
