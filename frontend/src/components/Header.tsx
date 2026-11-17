import { useState } from 'react'
import Logo from './Logo'
import type { NavProps } from '../types'

export default function Header({ navigate }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('landing')} className="flex-shrink-0">
          <Logo />
        </button>

        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => navigate('landing')} className="text-sm text-slate-600 hover:text-[#0f2356] font-medium transition-colors">
            Inicio
          </button>
          <button onClick={() => navigate('map')} className="text-sm text-slate-600 hover:text-[#0f2356] font-medium transition-colors">
            Mapa de reportes
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('como-funciona')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
              else navigate('landing')
            }}
            className="text-sm text-slate-600 hover:text-[#0f2356] font-medium transition-colors"
          >
            ¿Cómo funciona?
          </button>
          <button onClick={() => navigate('my-reports')} className="text-sm text-slate-600 hover:text-[#0f2356] font-medium transition-colors">
            Mis reportes
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('report-start')}
            className="px-4 py-2 bg-[#1d6fff] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reportar daño
          </button>
          <button
            onClick={() => navigate('inst-login')}
            className="px-4 py-2 text-[#0f2356] text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Acceso institucional
          </button>
        </div>

        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {mobileOpen ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3">
          <button onClick={() => { navigate('landing'); setMobileOpen(false) }} className="text-sm text-slate-700 py-2 text-left font-medium">Inicio</button>
          <button onClick={() => { navigate('map'); setMobileOpen(false) }} className="text-sm text-slate-700 py-2 text-left font-medium">Mapa de reportes</button>
          <button onClick={() => { navigate('my-reports'); setMobileOpen(false) }} className="text-sm text-slate-700 py-2 text-left font-medium">Mis reportes</button>
          <button
            onClick={() => { navigate('report-start'); setMobileOpen(false) }}
            className="w-full py-2.5 bg-[#1d6fff] text-white text-sm font-semibold rounded-lg mt-1"
          >
            Reportar daño
          </button>
          <button
            onClick={() => { navigate('inst-login'); setMobileOpen(false) }}
            className="w-full py-2.5 text-[#0f2356] text-sm font-medium border border-slate-200 rounded-lg"
          >
            Acceso institucional
          </button>
        </div>
      )}
    </header>
  )
}
