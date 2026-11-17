import type { Severity } from '../types'

const config: Record<Severity, { label: string; bg: string; text: string; dot: string }> = {
  leve:     { label: 'Leve',     bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500'  },
  moderado: { label: 'Moderado', bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
  grave:    { label: 'Grave',    bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500'    },
}

export default function SeverityBadge({
  severity,
  size = 'md',
}: {
  severity: Severity
  size?: 'sm' | 'md' | 'lg'
}) {
  const c = config[severity]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}
