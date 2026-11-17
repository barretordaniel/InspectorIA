import type { NavProps } from '../types'
import Logo from './Logo'
import SeverityBadge from './SeverityBadge'
import { formatDateTime } from '../data/mockData'
import { pdfHref } from '../api'
import { useDraft } from '../draft'

export default function ReportPDF({ navigate }: NavProps) {
  const dd = useDraft()
  const r = dd.viewing ?? dd.created
  if (!r) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-slate-600 text-sm">No hay un reporte para mostrar.</p>
        <button onClick={() => navigate('report-start')} className="px-5 py-3 bg-[#1d6fff] text-white font-semibold rounded-xl">Reportar un daño</button>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(dd.viewing ? dd.pdfBack : 'report-success')} className="p-1.5 text-slate-400 hover:text-slate-700 flex items-center gap-2 text-sm">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <span className="font-display font-semibold text-slate-700 text-sm">Reporte oficial</span>
        <a href={pdfHref(r.id)} download className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1d6fff] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v6M4 6l3 2 3-2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="1" y="10" width="12" height="2.5" rx="0.8" stroke="white" strokeWidth="1.2"/>
          </svg>
          Descargar PDF
        </a>
      </div>

      {/* Document */}
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Document header */}
          <div className="bg-[#0f2356] px-8 py-6">
            <div className="flex items-start justify-between">
              <Logo size="md" />
              <div className="text-right">
                <p className="text-blue-300 text-xs font-mono">{r.code}</p>
                <p className="text-slate-400 text-xs mt-1">{formatDateTime(r.date)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/60 text-xs uppercase tracking-widest">Reporte de daño vial</p>
              <p className="text-white font-display font-semibold text-lg mt-0.5">{r.type} · Severidad {r.severity}</p>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Photo */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Fotografía del daño</p>
              <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-100">
                <img src={r.photoUrl} alt="Fotografía del daño" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* AI Classification */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Análisis mediante inteligencia artificial</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Tipo de daño</p>
                  <p className="font-display font-bold text-[#0f2356]">{r.type}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Severidad</p>
                  <SeverityBadge severity={r.severity} />
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Confianza</p>
                  <p className="font-display font-bold text-[#0f2356]">{r.confidence}%</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Ubicación</p>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Dirección aproximada</p>
                  <p className="text-sm font-medium text-slate-800">{r.address}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Barrio / Localidad</p>
                  <p className="text-sm font-medium text-slate-800">{r.neighborhood || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Coordenadas</p>
                  <p className="text-sm font-mono text-slate-600">{r.coordinates.lat.toFixed(4)}, {r.coordinates.lng.toFixed(4)}</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden h-36 bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1693761935636-fe8aef447e62?w=700&h=200&fit=crop&auto=format"
                  alt="Mapa"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-blue-900/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#1d6fff] rounded-full border-3 border-white shadow-lg" />
                </div>
              </div>
            </div>

            {/* Citizen comment */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Comentario del ciudadano</p>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  {r.comment ? `"${r.comment}"` : 'Sin comentario'}
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 mb-1">Aviso importante</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                La clasificación y severidad corresponden a una estimación preliminar generada mediante inteligencia artificial y no reemplazan una inspección técnica realizada por personal competente. El presente reporte sirve como insumo para la priorización y gestión de la infraestructura vial.
              </p>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">Generado por InspectorIA · Plataforma de inspección vial inteligente</p>
              <p className="text-xs text-slate-400 font-mono">{r.code}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
