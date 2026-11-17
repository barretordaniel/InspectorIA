import { useRef } from 'react'
import type { NavProps } from '../types'
import { compressImage } from '../api'
import { setPhoto } from '../draft'
import StepIndicator from './StepIndicator'

export default function ReportStart({ navigate }: NavProps) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setPhoto(await compressImage(f))
    navigate('report-photo')
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('landing')} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display font-semibold text-[#0f2356] text-base">Reportar un daño vial</h1>
          </div>
          <StepIndicator currentStep={1} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-bold text-[#0f2356] mb-2">Agrega una fotografía</h2>
          <p className="text-slate-500 text-sm">Solo necesitamos una fotografía para comenzar.</p>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPick} />
        <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

        {/* Upload zone */}
        <div
          className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group mb-6"
          onClick={() => galleryRef.current?.click()}
        >
          <div className="w-20 h-20 bg-slate-100 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center transition-colors">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="10" width="28" height="22" rx="4" stroke="#94a3b8" strokeWidth="2"/>
              <circle cx="20" cy="21" r="6" stroke="#94a3b8" strokeWidth="2"/>
              <circle cx="20" cy="21" r="3" fill="#e2e8f0"/>
              <path d="M16 10v-2a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#94a3b8" strokeWidth="1.8"/>
              <circle cx="30" cy="16" r="1.5" fill="#94a3b8"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-slate-700 group-hover:text-[#1d6fff] transition-colors">
              Selecciona o arrastra una imagen
            </p>
            <p className="text-slate-400 text-xs mt-1">JPG, PNG o HEIF · máx. 20 MB</p>
          </div>
        </div>

        {/* Two main options */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-[#0f2356] group-hover:bg-[#1d6fff] rounded-xl flex items-center justify-center transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="14" rx="3" stroke="white" strokeWidth="1.6"/>
                <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.6"/>
                <circle cx="12" cy="13" r="2" fill="white"/>
                <path d="M10 6V5a2 2 0 014 0v1" stroke="white" strokeWidth="1.4"/>
              </svg>
            </div>
            <span className="font-medium text-sm text-slate-700 group-hover:text-[#0f2356]">Tomar fotografía</span>
          </button>

          <button
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center gap-2 p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#475569" strokeWidth="1.6"/>
                <rect x="6" y="6" width="5" height="5" rx="1" fill="#cbd5e1"/>
                <rect x="13" y="6" width="5" height="5" rx="1" fill="#cbd5e1"/>
                <rect x="6" y="13" width="5" height="5" rx="1" fill="#cbd5e1"/>
                <rect x="13" y="13" width="5" height="5" rx="1" fill="#94a3b8"/>
              </svg>
            </div>
            <span className="font-medium text-sm text-slate-700 group-hover:text-[#0f2356]">Subir desde galería</span>
          </button>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Recomendaciones</p>
          <ul className="space-y-2.5">
            {[
              'Asegúrate de que el daño sea claramente visible en la imagen.',
              'Evita fotografías tomadas con poca luz o muy oscuras.',
              'Intenta capturar el daño completo dentro del encuadre.',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2.5">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                  <circle cx="8" cy="8" r="7" stroke="#1d6fff" strokeWidth="1.2"/>
                  <path d="M5 8l2 2 4-4" stroke="#1d6fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-slate-500 text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
