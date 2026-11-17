import type { NavProps } from '../types'
import StepIndicator from './StepIndicator'
import SeverityBadge from './SeverityBadge'
import { useState } from 'react'
import { formatDateTime } from '../data/mockData'
import { createReport, toReport } from '../api'
import { addMine } from '../mine'
import { updateDraft, useDraft } from '../draft'

export default function ReportSummary({ navigate }: NavProps) {
  const d = useDraft()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const a = d.analysis

  async function submit() {
    if (!d.file || !a) return
    setSending(true); setError(null)
    try {
      const created = await createReport({
        file: d.file, lat: d.lat, lng: d.lng, address: d.address,
        neighborhood: d.neighborhood || undefined, comment: d.comment || undefined,
      })
      updateDraft({ created: toReport(created), viewing: null })
      addMine(created.id)
      navigate('report-success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos generar el reporte. Inténtalo de nuevo.')
    } finally { setSending(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('report-location')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[#0f2356] text-base">Revisa tu reporte</h1>
          </div>
          <StepIndicator currentStep={4} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <p className="text-slate-500 text-sm mb-5">Verifica la información antes de generar el reporte oficial.</p>

        {/* Photo */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-200 aspect-[16/9] mb-4 shadow-sm">
          <img src={d.previewUrl ?? ''} alt="Fotografía del daño" className="w-full h-full object-cover" />
          <button
            onClick={() => navigate('report-start')}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg shadow transition-all"
          >
            Cambiar foto
          </button>
        </div>

        {/* Info cards */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4 shadow-sm">
          {[
            {
              label: 'Tipo de daño',
              value: a?.type ?? '—',
              valueClass: 'font-display font-bold text-[#0f2356]',
              action: null,
            },
            {
              label: 'Severidad estimada (IA)',
              value: null,
              badge: <SeverityBadge severity={a?.severity ?? 'leve'} />,
              action: null,
            },
            {
              label: 'Ubicación',
              value: d.address + (d.neighborhood ? `, ${d.neighborhood}` : ''),
              valueClass: 'text-slate-700',
              action: () => navigate('report-location'),
            },
            {
              label: 'Fecha y hora',
              value: formatDateTime(new Date().toISOString()),
              valueClass: 'text-slate-700',
              action: null,
            },
            {
              label: 'Comentario',
              value: d.comment || 'Sin comentario',
              valueClass: 'text-slate-600 italic',
              action: () => navigate('report-photo'),
            },
          ].map((row, i) => (
            <div key={i} className={`flex items-start justify-between gap-4 px-5 py-4 ${i > 0 ? 'border-t border-slate-50' : ''}`}>
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">{row.label}</p>
                {row.badge || <p className={`text-sm ${row.valueClass}`}>{row.value}</p>}
              </div>
              {row.action && (
                <button onClick={row.action} className="text-xs text-[#1d6fff] font-medium hover:underline flex-shrink-0 mt-1">
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Mini map */}
        <div className="rounded-xl overflow-hidden h-28 bg-slate-200 mb-6 shadow-sm relative">
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

        {/* AI disclaimer */}
        <div className="bg-slate-100 rounded-xl p-4 mb-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-600">Clasificación automática:</strong> El tipo de daño y la severidad han sido estimados por InspectorIA. Esta información es preliminar y será revisada por la entidad competente.
          </p>
        </div>

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        <button
          onClick={submit}
          disabled={sending || !a || !d.file}
          className="w-full py-4 disabled:opacity-60 bg-[#0f2356] hover:bg-[#1a3580] text-white font-semibold rounded-xl transition-all shadow-lg text-base"
        >
          {sending ? 'Generando…' : 'Generar reporte'}
        </button>
      </div>
    </div>
  )
}
