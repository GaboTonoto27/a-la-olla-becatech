export const HORA_CIERRE = 16 // la plaza cierra a las 4:00 p.m.

export function proximoCierre(ahora = Date.now()) {
  const d = new Date(ahora)
  d.setHours(HORA_CIERRE, 0, 0, 0)
  if (d.getTime() - ahora < 15 * 60000) d.setDate(d.getDate() + 1)
  return d.getTime()
}

export function esSabado(ahora = Date.now()) {
  return new Date(ahora).getDay() === 6
}

export function minutosRestantes(vence, ahora = Date.now()) {
  return Math.max(0, Math.ceil((vence - ahora) / 60000))
}

export function textoRestante(vence, ahora = Date.now()) {
  const m = minutosRestantes(vence, ahora)
  if (m <= 0) return 'Se acabó el tiempo'
  const h = Math.floor(m / 60)
  const r = m % 60
  if (h >= 24) return `Quedan ${Math.floor(h / 24)} día${h >= 48 ? 's' : ''}`
  if (h > 0) return `Quedan ${h} h ${r} min`
  return `Quedan ${m} min`
}

// verde con tiempo, ámbar si falta poco, tomate si es casi ya.
export function tonoRestante(vence, ahora = Date.now()) {
  const m = minutosRestantes(vence, ahora)
  if (m <= 30) return 'tomate'
  if (m <= 120) return 'ambar'
  return 'olla'
}

export function horaCorta(ts) {
  return new Date(ts)
    .toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s?([ap])\.?\s?m\.?/i, (_, x) => ` ${x.toLowerCase()}. m.`)
}
