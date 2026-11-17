import { useState } from 'react'
import type { NavProps } from '../types'
import Logo from './Logo'
import { login } from '../api'

export default function InstitutionalLogin({ navigate }: NavProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await login(email, password)
      navigate('inst-dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos iniciar sesión. Inténtalo de nuevo.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] bg-[#0a1a4a] p-12 flex-shrink-0">
        <Logo size="md" />

        <div>
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">Panel institucional</p>
          <h2 className="font-display text-3xl font-bold text-white leading-snug mb-4">
            Gestión inteligente de la infraestructura vial
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Accede a todos los reportes ciudadanos, filtra por zona y severidad, y descarga reportes técnicos en PDF.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📍', label: 'Mapas de calor por severidad' },
              { icon: '📋', label: 'Tabla de reportes filtrable' },
              { icon: '📄', label: 'Descarga de reportes PDF' },
              { icon: '🔍', label: 'Historial por zona o localidad' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-slate-300 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1693761935636-fe8aef447e62?w=500&h=300&fit=crop&auto=format"
            alt="Ciudad"
            className="rounded-xl opacity-30 w-full h-36 object-cover"
          />
          <p className="text-slate-600 text-xs mt-4">© 2026 InspectorIA · Plataforma colombiana de inspección vial</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-[#0f2356] mb-1">Acceso institucional</h1>
            <p className="text-slate-500 text-sm">Acceso para entidades públicas, contratistas y organizaciones autorizadas.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo institucional</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nombre@entidad.gov.co"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0f2356] hover:bg-[#1a3580] disabled:opacity-60 text-white font-semibold rounded-xl transition-all mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Demo:</strong> Ingresa cualquier correo y contraseña para acceder al panel institucional de prueba.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('landing')} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
