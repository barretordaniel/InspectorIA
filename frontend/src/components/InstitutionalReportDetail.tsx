import type { NavProps } from '../types'
import SeverityBadge from './SeverityBadge'
import { formatDateTime } from '../data/mockData'
import { updateDraft, useDraft } from '../draft'
import LeafletMap from './LeafletMap'

const SEV_COLOR: Record<string, string> = {
  leve: '#16a34a',
  moderado: '#d97706',
  grave: '#dc2626',
}

export default function InstitutionalReportDetail({ navigate }: NavProps) {
  const d = useDraft()
  const r = d.viewing
  if (!r) {
    return (
      <div className="p-8">
        <p className="text-slate-500 text-sm mb-4">Selecciona un reporte para ver su detalle.</p>
        <button onClick={() => navigate('inst-reports')} className="px-4 py-2 bg-[#1d6fff] text-white text-sm font-semibold rounded-lg">Ir a reportes</button>
      </div>
    )
  }
  const severity = r.severity
  const ns = r.coordinates.lat >= 0 ? 'N' : 'S'
  const ew = r.coordinates.lng >= 0 ? 'E' : 'O'
  const coords = `${Math.abs(r.coordinates.lat).toFixed(4)}° ${ns}, ${Math.abs(r.coordinates.lng).toFixed(4)}° ${ew}`

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(d.backTo.startsWith('inst-') ? d.backTo : 'inst-reports')} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <p className="text-xs text-slate-400 font-mono mb-0.5">{r.code}</p>
            <h1 className="font-display text-xl font-bold text-[#0f2356]">{r.type} · Severidad {r.severity}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('map')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M7 1.5C4.52 1.5 2.5 3.52 2.5 6c0 3.5 4.5 8 4.5 8S11.5 9.5 11.5 6C11.5 3.52 9.48 1.5 7 1.5z" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Ver en mapa
          </button>
          <button
            onClick={() => { updateDraft({ pdfBack: 'inst-report-detail' }); navigate('report-pdf') }}
            className="flex items-center gap-2 px-4 py-2 bg-[#1d6fff] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v6M4.5 6l2.5 2 2.5-2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="1" y="10" width="12" height="2" rx="0.8" stroke="white" strokeWidth="1.2"/>
            </svg>
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: photo + AI info */}
        <div className="xl:col-span-3 space-y-5">
          {/* Photo */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fotografía del daño</p>
            </div>
            <div className="aspect-[16/9] bg-slate-100">
              <img src={r.photoUrl} alt="Fotografía del daño" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Información generada por InspectorIA</p>
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">IA</span>
            </div>
            <div className="p-5 grid grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 mb-2">Tipo de daño</p>
                <p className="font-display font-bold text-[#0f2356] text-lg">{r.type}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 mb-2">Severidad</p>
                <SeverityBadge severity={severity} size="lg" />
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-400 mb-2">Confianza</p>
                <p className="font-display font-bold text-[#0f2356] text-lg">{r.confidence}%</p>
              </div>
            </div>
            <div className="px-5 pb-4">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.confidence}%`, backgroundColor: SEV_COLOR[severity] }} />
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mx-5 mb-5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
              <p className="text-xs text-amber-700 leading-relaxed">
                La clasificación y severidad corresponden a una estimación preliminar. Requiere validación por personal técnico competente.
              </p>
            </div>
          </div>

          {/* Citizen comment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Comentario del ciudadano</p>
            <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 rounded-xl p-4">
              {r.comment ? `"${r.comment}"` : 'Sin comentario'}
            </p>
          </div>
        </div>

        {/* Right: location + metadata */}
        <div className="xl:col-span-2 space-y-5">
          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Información del reporte</p>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: 'Código', value: r.code, mono: true },
                { label: 'Fecha y hora', value: formatDateTime(r.date) },
                { label: 'Dirección', value: r.address },
                { label: 'Barrio / Localidad', value: r.neighborhood || '—' },
                { label: 'Coordenadas', value: coords, mono: true },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                  <p className={`text-sm font-medium text-slate-700 ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-50 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ubicación</p>
              <button onClick={() => navigate('map')} className="text-xs text-[#1d6fff] hover:underline">Ampliar →</button>
            </div>
            <div className="relative h-48">
              <LeafletMap reports={[r]} center={[r.coordinates.lat, r.coordinates.lng]} zoom={16} fit={false} />
              <div className="absolute bottom-2 left-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] rounded px-2 py-1 font-mono">
                {coords}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
