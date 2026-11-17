import { useEffect, useState } from 'react'
import type { NavProps } from '../types'
import { classify } from '../api'
import { updateDraft, useDraft } from '../draft'

const PROCESS_STEPS = [
  { label: 'Imagen recibida', delay: 0 },
  { label: 'Identificando tipo de daño', delay: 800 },
  { label: 'Estimando severidad', delay: 1800 },
  { label: 'Obteniendo ubicación', delay: 2800 },
]

export default function ReportAnalyzing({ navigate }: NavProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([0])
  const d = useDraft()
  const [animDone, setAnimDone] = useState(false)
  const [apiDone, setApiDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = animDone && apiDone

  useEffect(() => {
    PROCESS_STEPS.slice(1).forEach((s, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i + 1])
      }, s.delay)
    })
    setTimeout(() => setAnimDone(true), 4000)
    if (!d.file) { setError('No hay una fotografía para analizar.'); return }
    classify(d.file)
      .then(a => { updateDraft({ analysis: a }); setApiDone(true) })
      .catch(e => setError(e.message || 'No pudimos procesar la fotografía.'))
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => navigate('report-result'), 700)
      return () => clearTimeout(t)
    }
  }, [done, navigate])

  return (
    <div className="min-h-screen bg-[#070e24] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header text */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium tracking-wide">InspectorIA · Visión artificial</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">Analizando el daño…</h2>
          <p className="text-slate-400 text-sm">Esto puede tardar unos segundos.</p>
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-400/30 rounded-xl p-4">
              <p className="text-red-200 text-sm mb-3">{error}</p>
              <button onClick={() => navigate('report-start')} className="px-4 py-2 bg-white text-[#0f2356] text-sm font-semibold rounded-lg">
                Tomar otra fotografía
              </button>
            </div>
          )}
        </div>

        {/* Photo with scan effect */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-800 mb-8 shadow-2xl shadow-blue-900/30">
          <img
            src={d.previewUrl ?? ''}
            alt="Imagen en análisis"
            className="w-full aspect-[4/3] object-cover opacity-80"
          />
          {/* Blue tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-900/40" />

          {/* Scan line */}
          {!done && <div className="scan-line" />}

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-blue-400 opacity-80" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-blue-400 opacity-80" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-blue-400 opacity-80" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-blue-400 opacity-80" />

          {/* Grid overlay — AI vision simulation */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(96,165,250,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.6) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {done && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900/40">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-10" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Processing steps */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          {PROCESS_STEPS.map((s, i) => {
            const completed = completedSteps.includes(i)
            const isActive = i === completedSteps.length && !done
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${completed ? 'bg-green-500' : isActive ? 'border-2 border-blue-400 animate-pulse' : 'border-2 border-slate-600'}`}
                >
                  {completed && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${completed ? 'text-slate-200' : isActive ? 'text-blue-300' : 'text-slate-500'}`}>
                  {s.label}
                </span>
                {isActive && (
                  <div className="flex gap-1 ml-auto">
                    {[0, 1, 2].map(d => (
                      <div key={d} className="w-1 h-1 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
