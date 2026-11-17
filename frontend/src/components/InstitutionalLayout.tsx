import { clearToken } from '../api'
import type { Screen, NavProps } from '../types'
import Logo from './Logo'

const NAV_ITEMS: { screen: Screen; label: string; icon: React.ReactNode }[] = [
  {
    screen: 'inst-dashboard',
    label: 'Resumen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    screen: 'map',
    label: 'Mapa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2C6.24 2 4 4.24 4 7c0 4.5 5 10 5 10s5-5.5 5-10c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    screen: 'inst-reports',
    label: 'Reportes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    screen: 'inst-zone-history',
    label: 'Historial',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

interface Props extends NavProps {
  currentScreen: Screen
  children: React.ReactNode
}

export default function InstitutionalLayout({ navigate, currentScreen, children }: Props) {
  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0a1a4a] flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo size="sm" />
          <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-2 font-medium">Panel institucional</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = currentScreen === item.screen
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${active
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/8'
                  }`}
              >
                <span className={active ? 'text-blue-300' : 'text-slate-500'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <button
            onClick={() => { clearToken(); navigate('inst-login') }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 9H4M7 6l-3 3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 3h4a2 2 0 012 2v8a2 2 0 01-2 2H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  )
}
