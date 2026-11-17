import type { NavProps } from '../types'
import Logo from './Logo'

const STEPS = [
  {
    n: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="3" stroke="#1d6fff" strokeWidth="1.8"/>
        <circle cx="14" cy="13" r="5" stroke="#1d6fff" strokeWidth="1.6"/>
        <circle cx="14" cy="13" r="2" fill="#1d6fff"/>
        <line x1="9" y1="7" x2="19" y2="7" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Toma una foto',
    desc: 'Captura el daño vial con la cámara de tu dispositivo o selecciona una imagen de tu galería.',
  },
  {
    n: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="#1d6fff" strokeWidth="1.8"/>
        <path d="M8 14h12M14 8v12" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="14" cy="14" r="3" stroke="#1d6fff" strokeWidth="1.6"/>
        <path d="M6 6l4 4M22 6l-4 4M6 22l4-4M22 22l-4-4" stroke="#93c5fd" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    title: 'La IA analiza el daño',
    desc: 'InspectorIA identifica el tipo de daño y estima su severidad usando visión artificial.',
  },
  {
    n: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="12" r="8" stroke="#1d6fff" strokeWidth="1.8"/>
        <circle cx="14" cy="12" r="3" fill="#1d6fff"/>
        <path d="M14 20 L14 26" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 24 L14 26 L18 24" stroke="#60a5fa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Confirmamos la ubicación',
    desc: 'El GPS detecta automáticamente la posición. Puedes ajustar el marcador en el mapa.',
  },
  {
    n: '04',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="24" rx="3" stroke="#1d6fff" strokeWidth="1.8"/>
        <path d="M9 12h10M9 16h7M9 20h5" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M14 4v4" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="14" cy="8" r="1.5" fill="#1d6fff"/>
      </svg>
    ),
    title: 'Generamos el reporte',
    desc: 'Se crea un reporte técnico estandarizado con código único, disponible para descarga en PDF.',
  },
]

export default function Landing({ navigate }: NavProps) {
  return (
    <div className="min-h-full bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a1a4a] pt-16 pb-20 md:pt-20 md:pb-28">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1693761935636-fe8aef447e62?w=1400&h=900&fit=crop&auto=format')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a4a]/80 via-[#0a1a4a]/60 to-[#0a1a4a]/90" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(96,165,250,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-200 text-xs font-medium tracking-wide">Plataforma de inspección vial inteligente · Colombia</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Reporta daños viales<br />
            <span className="text-[#60a5fa]">en segundos</span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            InspectorIA utiliza inteligencia artificial para identificar, clasificar y geolocalizar daños en la infraestructura vial.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('report-start')}
              className="px-7 py-3.5 bg-[#1d6fff] hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/40 text-base"
            >
              Reportar un daño
            </button>
            <button
              onClick={() => navigate('map')}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all text-base"
            >
              Ver mapa de reportes
            </button>
          </div>

          {/* Mini stats */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { v: '1.240', l: 'Reportes generados' },
              { v: '97%', l: 'Precisión del modelo' },
              { v: '3 min', l: 'Tiempo promedio' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#1d6fff] text-sm font-semibold uppercase tracking-widest mb-3">Proceso</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0f2356]">¿Cómo funciona?</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Un proceso de cuatro pasos diseñado para ser rápido, preciso y fácil de usar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-slate-100 z-0" style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }} />
                )}
                <div className="relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-100 hover:shadow-md transition-all group">
                  <div className="text-xs font-bold text-slate-300 font-display mb-4">{s.n}</div>
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit group-hover:bg-blue-100 transition-colors">
                    {s.icon}
                  </div>
                  <h3 className="font-display font-semibold text-[#0f2356] text-base mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer IA */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mt-0.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2l8 14H2L10 2z" stroke="#d97706" strokeWidth="1.6" strokeLinejoin="round"/>
                <line x1="10" y1="8" x2="10" y2="12" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="10" cy="15" r="0.8" fill="#d97706"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-slate-800 mb-1">Clasificación asistida por IA</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                La identificación y clasificación del daño vial realizada por InspectorIA es una <strong className="text-slate-700">estimación preliminar</strong> basada en inteligencia artificial. Esta información sirve como apoyo para la priorización y no reemplaza una inspección técnica realizada por personal competente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-[#0f2356]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">¿Encontraste un daño vial?</h2>
          <p className="text-slate-400 mb-8">Generar un reporte toma menos de 3 minutos. Tu reporte ayuda a mejorar la infraestructura de tu ciudad.</p>
          <button
            onClick={() => navigate('report-start')}
            className="px-8 py-4 bg-[#1d6fff] hover:bg-blue-600 text-white font-semibold rounded-xl text-base transition-all shadow-lg shadow-blue-900/30"
          >
            Reportar un daño ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080f29] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-slate-500 text-xs">© 2026 InspectorIA. Plataforma colombiana de inspección vial inteligente.</p>
          <button onClick={() => navigate('inst-login')} className="text-slate-400 text-xs hover:text-white transition-colors">
            Acceso institucional →
          </button>
        </div>
      </footer>
    </div>
  )
}
