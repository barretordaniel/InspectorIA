import { useEffect, useState } from 'react'
import { getStats, listReports, toReport, type Stats } from './api'
import type { Report } from './types'

interface Filters { type?: string; severity?: string; q?: string; ids?: number[] }

export function useReports(f: Filters = {}) {
  const key = JSON.stringify(f)
  const [state, setState] = useState<{ reports: Report[]; loading: boolean; error: string | null }>({ reports: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    if (f.ids && f.ids.length === 0) { setState({ reports: [], loading: false, error: null }); return }
    setState(s => ({ ...s, loading: true }))
    listReports(f)
      .then(r => { if (!cancelled) setState({ reports: r.map(toReport), loading: false, error: null }) })
      .catch(e => { if (!cancelled) setState({ reports: [], loading: false, error: e.message }) })
    return () => { cancelled = true }
  }, [key])

  return state
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => { getStats().then(setStats).catch(() => setStats(null)) }, [])
  return stats
}
