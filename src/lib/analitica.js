// Analítica local ($0, sin librerías ni APIs). Todo se calcula en el navegador con lo que hay en localStorage.
import { COSTO_TOTAL_MES, CUOTA_FORMAL, PROMEDIO_POPULAR, kilosDe, sostenibilidad } from './economia.js'

// Referencia FAO (2013), "Food Wastage Footprint": ~2,5 kg CO2e por kg de alimento desperdiciado. Es un promedio global.
export const FACTOR_CO2E = 2.5
const SEMANAS_ANIO = 52
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : null)

export function kpis(apartados) {
  const vivos = apartados.filter((a) => a.estado !== 'cancelado')
  const entregados = apartados.filter((a) => a.estado === 'entregado')
  const rechazados = apartados.filter((a) => a.estado === 'rechazado')
  const conPrecio = vivos.filter((a) => a.normal > 0 && a.rescate > 0)
  const normal = conPrecio.reduce((s, a) => s + a.normal * a.cantidad, 0)
  // Extra y Regular (precio >= normal) no cuentan como descuento.
  const rescate = conPrecio.reduce((s, a) => s + Math.min(a.rescate, a.normal) * a.cantidad, 0)
  const ventas = entregados.reduce((s, a) => s + a.total, 0)
  return {
    conversion: pct(entregados.length, apartados.length),
    rechazo: pct(rechazados.length, entregados.length + rechazados.length),
    descuento: normal > 0 ? Math.round((1 - rescate / normal) * 100) : null,
    ticket: entregados.length ? Math.round(ventas / entregados.length) : null,
    apartados: apartados.length,
    entregas: entregados.length,
  }
}

// Kilos que van a la cocina (100% sano) vs. a cría/abono. Cuenta lo apartado (sin cancelados ni rechazados) y lo que sigue en vitrina.
export function economiaCircular(apartados, lotes, ahora = Date.now()) {
  const suma = { cocina: 0, cria: 0 }
  const poner = (nivel, kg) => { suma[nivel === 'cria' ? 'cria' : 'cocina'] += kg }
  apartados.filter((a) => a.estado !== 'cancelado' && a.estado !== 'rechazado').forEach((a) => poner(a.nivel, kilosDe(a.unidad, a.cantidad)))
  lotes.filter((l) => !l.retirado && l.vence > ahora && l.cantidad > 0).forEach((l) => poner(l.nivel, kilosDe(l.unidad, l.cantidad)))
  const total = suma.cocina + suma.cria
  return { ...suma, total, pctCocina: total > 0 ? Math.round((suma.cocina / total) * 100) : 0 }
}

function horaDeTexto(t) {
  const m = /(\d{1,2})(?::\d{2})?\s*([ap])/i.exec(String(t ?? '').replace(/\./g, ''))
  if (!m) return null
  let h = Number(m[1]) % 12
  if (m[2].toLowerCase() === 'p') h += 12
  return h
}

export const FRANJAS_TEMPRANAS = [5, 6, 7, 8]
export const FRANJAS_TARDE = [13, 14, 15, 16]

// Encargos tempranos = pedidos según su hora de recogida. Rescates de última hora = lotes y apartados según la hora en que se crearon.
export function actividadPorHora(pedidos, lotes, apartados) {
  const temprano = Object.fromEntries(FRANJAS_TEMPRANAS.map((h) => [h, 0]))
  const tarde = Object.fromEntries(FRANJAS_TARDE.map((h) => [h, 0]))
  pedidos.forEach((p) => { const h = horaDeTexto(p.hora); if (h in temprano) temprano[h] += 1 })
  ;[...lotes, ...apartados].forEach((x) => { const h = new Date(x.creado).getHours(); if (h in tarde) tarde[h] += 1 })
  return { temprano, tarde }
}

// Simulador What-If: mismas cuotas y costos que el Resumen, con kilos por puesto a la semana.
export function escenario({ formales, populares, kgPuesto }) {
  const s = sostenibilidad(formales, populares)
  const puestos = formales + populares
  const kgAnio = puestos * kgPuesto * SEMANAS_ANIO
  const porFormal = Math.round(CUOTA_FORMAL * 4.33)
  const faltaMes = Math.max(0, COSTO_TOTAL_MES - Math.round(populares * PROMEDIO_POPULAR * 4.33))
  return {
    ingresosMes: s.mes,
    costosMes: COSTO_TOTAL_MES,
    margenMes: s.neto,
    equilibrioFormales: Math.ceil(faltaMes / porFormal),
    toneladasAnio: Math.round((kgAnio / 1000) * 10) / 10,
    co2eToneladas: Math.round(((kgAnio * FACTOR_CO2E) / 1000) * 10) / 10,
  }
}

// Score de riesgo explicable (0–100): suma de tres pesos visibles. Heurística local, lista para cambiarse por ML con historial real.
export const PESOS_RIESGO = { severidad: 50, strikes: 30, rechazos: 20 }
const BASE_SEVERIDAD = { alta: 40, media: 25, baja: 8 }

export function scoreRiesgo({ gravedad, motivos = [], strikes = 0, rechazos = 0 }) {
  const extra = Math.min(10, Math.max(0, motivos.length - 1) * 5)
  const severidad = Math.min(PESOS_RIESGO.severidad, (BASE_SEVERIDAD[gravedad] ?? 8) + extra)
  const sk = Math.min(PESOS_RIESGO.strikes, strikes * 10)
  const rc = Math.min(PESOS_RIESGO.rechazos, rechazos * 10)
  const total = severidad + sk + rc
  return {
    total,
    nivel: total >= 70 ? 'alto' : total >= 40 ? 'medio' : 'bajo',
    partes: [
      { id: 'severidad', etiqueta: 'Palabras clave', valor: severidad, max: PESOS_RIESGO.severidad, nota: motivos.length ? `${motivos.length} detectada${motivos.length === 1 ? '' : 's'}` : 'ninguna detectada' },
      { id: 'strikes', etiqueta: 'Faltas previas', valor: sk, max: PESOS_RIESGO.strikes, nota: `${strikes} falta${strikes === 1 ? '' : 's'} × 10` },
      { id: 'rechazos', etiqueta: 'Rechazos por calidad', valor: rc, max: PESOS_RIESGO.rechazos, nota: `${rechazos} rechazo${rechazos === 1 ? '' : 's'} × 10` },
    ],
  }
}
