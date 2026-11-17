import type { NavProps } from '../types'
import SeverityBadge from './SeverityBadge'
import { formatDateTime } from '../data/mockData'
import { pdfHref } from '../api'
import { resetDraft, useDraft } from '../draft'

export default function ReportSuccess({ navigate }: NavProps) {
  const r = useDraft().created
  if (!r) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-slate-600 text-sm">No hay un reporte reciente.</p>
        <button onClick={() => navigate('report-start')} className="px-5 py-3 bg-[#1d6fff] text-white font-semibold rounded-xl">Reportar un daño</button>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          {/* Success icon */}
          <div className="relative mb-8 inline-flex">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M7 16l6 6 12-12" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#1d6fff] rounded-full flex items-center justify-center border-2 border-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-[#0f2356] mb-2">¡Reporte generado!</h1>
          <p className="text-slate-500 text-base mb-6">El daño vial fue registrado correctamente en InspectorIA.</p>

          {/* Report code */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Código de seguimiento</p>
            <p className="font-display font-bold text-2xl text-[#0f2356] tracking-wider font-mono">{r.code}</p>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-8 shadow-sm text-left">
            {[
              { label: 'Tipo de daño', value: r.type },
              { label: 'Severidad', badge: <SeverityBadge severity={r.severity} /> },
              { label: 'Ubicación', value: `${r.address}, Bogotá` },
              { label: 'Fecha', value: formatDateTime(r.date) },
            ].map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
                <span className="text-xs text-slate-400">{row.label}</span>
                {row.badge || <span className="text-sm font-medium text-slate-700">{row.value}</span>}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('report-pdf')}
              className="w-full py-3.5 bg-[#1d6fff] hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
            >
              Ver reporte
            </button>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={pdfHref(r.id)}
                download
                className="py-3 text-[#0f2356] text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v8M5 7l3 3 3-3" stroke="#0f2356" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="2" y="11" width="12" height="3" rx="1" stroke="#0f2356" strokeWidth="1.4"/>
                </svg>
                Descargar PDF
              </a>
              <button
                onClick={() => navigate('map')}
                className="py-3 text-[#0f2356] text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="7" r="3" stroke="#0f2356" strokeWidth="1.4"/>
                  <path d="M8 2C5.24 2 3 4.24 3 7c0 4 5 7 5 7s5-3 5-7c0-2.76-2.24-5-5-5z" stroke="#0f2356" strokeWidth="1.4"/>
                </svg>
                Ver en mapa
              </button>
            </div>
            <button
              onClick={() => { resetDraft(); navigate('report-start') }}
              className="w-full py-3 text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
            >
              Reportar otro daño
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
