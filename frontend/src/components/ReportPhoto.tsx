import { useState } from 'react'
import type { NavProps } from '../types'
import StepIndicator from './StepIndicator'
import { updateDraft, useDraft } from '../draft'

export default function ReportPhoto({ navigate }: NavProps) {
  const d = useDraft()
  const [comment, setComment] = useState(d.comment)

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('report-start')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[#0f2356] text-base">Fotografía capturada</h1>
          </div>
          <StepIndicator currentStep={1} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <p className="font-display text-lg font-semibold text-[#0f2356] mb-4 text-center">¿Usamos esta fotografía?</p>

        {/* Photo preview */}
        <div className="rounded-2xl overflow-hidden bg-slate-200 aspect-[4/3] mb-5 shadow-md">
          <img
            src={d.previewUrl ?? ''}
            alt="Fotografía del daño vial"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Comentario <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Describe brevemente el problema... Ej: El hueco está ubicado en el carril derecho y dificulta el paso de vehículos."
            rows={3}
            className="w-full text-sm text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl px-3.5 py-2.5 resize-none outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => { updateDraft({ comment }); navigate('report-analyzing') }}
            disabled={!d.file}
            className="w-full py-3.5 bg-[#1d6fff] hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-200"
          >
            Analizar fotografía
          </button>
          <button
            onClick={() => navigate('report-start')}
            className="w-full py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Tomar otra
          </button>
        </div>
      </div>
    </div>
  )
}
