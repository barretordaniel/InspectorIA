import type { NavProps } from '../types'
import StepIndicator from './StepIndicator'
import SeverityBadge from './SeverityBadge'
import { useDraft } from '../draft'

export default function ReportResult({ navigate }: NavProps) {
  const d = useDraft()
  const a = d.analysis
  if (!a) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-4">
        <p className="text-slate-600 text-sm">No hay un análisis disponible.</p>
        <button onClick={() => navigate('report-start')} className="px-5 py-3 bg-[#1d6fff] text-white font-semibold rounded-xl">Empezar un reporte</button>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('report-photo')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[#0f2356] text-base">Resultado del análisis</h1>
          </div>
          <StepIndicator currentStep={2} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Success header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5 6.5-7" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-display font-semibold text-slate-800">Análisis completado</span>
        </div>

        {/* Photo */}
        <div className="rounded-2xl overflow-hidden bg-slate-200 aspect-[16/9] mb-5 shadow-sm">
          <img src={d.previewUrl ?? ''} alt="Fotografía analizada" className="w-full h-full object-cover" />
        </div>

        {/* Result card */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4 shadow-sm">
          <div className="p-5 border-b border-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Clasificación IA</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Tipo de daño</p>
                <p className="font-display font-bold text-[#0f2356] text-xl">{a.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Severidad estimada</p>
                <SeverityBadge severity={a.severity} size="lg" />
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-slate-500">Confianza del modelo</p>
              <p className="font-display font-bold text-[#0f2356]">{a.confidence}%</p>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${a.confidence}%`, transition: 'width 0.8s ease' }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">Baja confianza</span>
              <span className="text-[10px] text-slate-400">Alta confianza</span>
            </div>
          </div>
        </div>

        {/* AI disclaimer */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 flex gap-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M9 2l7 13H2L9 2z" stroke="#d97706" strokeWidth="1.4" strokeLinejoin="round"/>
            <line x1="9" y1="7.5" x2="9" y2="11" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="9" cy="13.5" r="0.7" fill="#d97706"/>
          </svg>
          <p className="text-amber-800 text-xs leading-relaxed">
            Esta clasificación es una <strong>estimación preliminar</strong> realizada mediante inteligencia artificial y debe ser validada por personal técnico competente.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('report-location')}
            className="w-full py-3.5 bg-[#1d6fff] hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
          >
            Continuar con ubicación
          </button>
          <button
            onClick={() => navigate('report-analyzing')}
            className="w-full py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Volver a analizar
          </button>
        </div>
      </div>
    </div>
  )
}
