// Lógica de precios de "Pon pa' la olla". Funciones puras.
// Extra (+40%) y Regular (+20%) son calidad, NO rebaja. Solo hay rebaja cuando el precio final queda por debajo del normal.

export const FORMULAS = [
  { pct: 40, etiqueta: 'Extra +40%', calidad: 'extra' },
  { pct: 20, etiqueta: 'Regular +20%', calidad: 'regular' },
  { pct: -20, etiqueta: 'Remate −20%' },
  { pct: -30, etiqueta: 'Remate −30%' },
  { pct: -50, etiqueta: 'Remate −50%' },
]

export const ETIQUETA_CALIDAD = { extra: 'Calidad Extra', regular: 'Calidad Regular' }

// En pesos colombianos se redondea a múltiplos de $100; en otras monedas, al entero.
export function paso(ciudadId) {
  return ciudadId === 'bq' ? 100 : 1
}

export function conPct(base, pct, ciudadId = 'bq') {
  const s = paso(ciudadId)
  return Math.max(s, Math.round((base * (1 + pct / 100)) / s) * s)
}

export function calidadDeFormula(pct) {
  return FORMULAS.find((f) => f.pct === pct)?.calidad ?? null
}

// Fórmula que da exactamente este precio final (o null).
export function formulaQueCoincide(base, final, ciudadId = 'bq') {
  if (!(base > 0)) return null
  return FORMULAS.find((f) => conPct(base, f.pct, ciudadId) === final)?.pct ?? null
}

// Qué le mostramos al comprador: rebaja real (con %) o la etiqueta limpia de calidad.
export function infoPrecio(normal, final, calidad) {
  if (normal > 0 && final > 0 && final < normal) {
    return { rebaja: true, pct: Math.round((1 - final / normal) * 100), etiqueta: null }
  }
  return { rebaja: false, pct: 0, etiqueta: ETIQUETA_CALIDAD[calidad] ?? null }
}
