const KEY = 'inspectoria_mis_reportes'

/** "Mis reportes" se guarda en este navegador (no hay cuentas ciudadanas en el MVP). */
export function getMine(): number[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
export function addMine(id: number) {
  try { localStorage.setItem(KEY, JSON.stringify([...new Set([id, ...getMine()])])) } catch { /* sin almacenamiento */ }
}
