import type { NavProps } from '../types'
import { useReports, useStats } from '../hooks'
import { openReport } from '../draft'
import LeafletMap from './LeafletMap'
import SeverityBadge from './SeverityBadge'

const STATS = [
  { label: 'Reportes registrados', value: '1.240', color: 'bg-blue-50 text-blue-700', icon: '📋' },
  { label: 'Daños graves', value: '312', color: 'bg-red-50 text-red-700', icon: '🔴' },
  { label: 'Daños moderados', value: '489', color: 'bg-amber-50 text-amber-700', icon: '🟡' },
  { label: 'Daños leves', value: '439', color: 'bg-green-50 text-green-700', icon: '🟢' },
]

const SEV_COLOR: Record<string, string> = {
  leve: '#16a34a',
  moderado: '#d97706',
  grave: '#dc2626',
}

export default function InstitutionalDashboard({ navigate }: NavProps) {
  const { reports } = useReports()
  const st = useStats()
  const recent = reports.slice(0, 5)
  const statCards = STATS.map((s, i) => ({ ...s, value: ([st?.total, st?.grave, st?.moderado, st?.leve][i] ?? '—').toLocaleString('es-CO') }))
  const typeRows = (['Hueco', 'Grieta', 'Hundimiento', 'Andén roto'] as const).map(t => {
    const c = st?.byType?.[t] ?? 0
    return { type: t, count: c, pct: st && st.total ? Math.round((100 * c) / st.total) : 0 }
  })

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#0f2356]">Resumen general</h1>
        <p className="text-slate-500 text-sm mt-1">Panel de monitoreo de daños viales · Bogotá, D.C.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-slate-400 text-xs mb-2">{s.label}</p>
            <p className="font-display font-bold text-3xl text-[#0f2356]">{s.value}</p>
            <button
              onClick={() => navigate('inst-reports')}
              className="text-xs text-[#1d6fff] mt-3 hover:underline"
            >
              Ver reportes →
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Map panel */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-display font-semibold text-[#0f2356]">Mapa de reportes</h2>
            <button onClick={() => navigate('map')} className="text-xs text-[#1d6fff] font-medium hover:underline">
              Ver completo →
            </button>
          </div>
          <div className="relative h-72">
            <LeafletMap reports={reports} />
          </div>
        </div>

        {/* Quick stats */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="font-display font-semibold text-[#0f2356] mb-4">Distribución por tipo</h2>
            <div className="space-y-3">
              {typeRows.map(item => (
                <div key={item.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600 font-medium">{item.type}</span>
                    <span className="text-slate-400 text-xs">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1d6fff] rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="text-center">
              <p className="text-xs text-slate-400 mb-1">Reportes esta semana</p>
              <p className="font-display text-4xl font-bold text-[#0f2356]">{st?.thisWeek ?? '—'}</p>
              {st && <p className="text-slate-500 text-xs mt-1">Semana anterior: {st.prevWeek}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Recent reports table */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h2 className="font-display font-semibold text-[#0f2356]">Reportes recientes</h2>
          <button onClick={() => navigate('inst-reports')} className="text-xs text-[#1d6fff] font-medium hover:underline">
            Ver todos →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Código', 'Tipo', 'Severidad', 'Ubicación', 'Fecha', 'Acción'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{r.code}</td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{r.type}</td>
                  <td className="px-5 py-3.5">
                    <SeverityBadge severity={r.severity} size="sm" />
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-500 max-w-xs truncate">{r.address}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">
                    {new Date(r.date).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => { openReport(r, 'inst-dashboard'); navigate('inst-report-detail') }}
                      className="text-xs text-[#1d6fff] font-medium hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
