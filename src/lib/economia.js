// Cifras reales del vendedor y del comprador, sacadas de las entregas confirmadas ("Lo revisé y me lo llevo").
export const CUOTA_FORMAL = 10000
export const CUOTA_POPULAR_MAX = 3000
export const PROMEDIO_POPULAR = 1500
const SEMANA = 7 * 24 * 60 * 60 * 1000
const SEMANAS_MES = 4.33

export const PLANES = {
  formal: { id: 'formal', nombre: 'Plan Formal', precio: '$10.000 COP/sem', detalle: 'Puesto con nevera. Cuota fija por semana.' },
  popular: { id: 'popular', nombre: 'Plan Popular', precio: '$0 a $3.000 COP/sem', detalle: 'Puesto informal. Pagas según lo que recuperas.' },
}

export function kilosDe(unidad, cantidad) {
  if (unidad === 'kg') return cantidad
  if (unidad === 'lb') return cantidad * 0.4536
  return 0
}

// Cuota de la semana: el plan Formal cuesta $10.000 y el Popular el 5% de lo recuperado (tope $3.000).
// En el prototipo la cuota solo corre desde la primera entrega confirmada.
export function cuotaSemana(plan, ingresos, entregas) {
  if (!entregas) return 0
  if (plan === 'formal') return CUOTA_FORMAL
  return Math.min(CUOTA_POPULAR_MAX, Math.round((ingresos * 0.05) / 100) * 100)
}

// devoluciones: las aprobadas descuentan la plata devuelta al comprador y suman la cuota devuelta al vendedor.
export function resumenSemana(apartados, usuarioId, comoVendedor, plan, ahora = Date.now(), devoluciones = []) {
  const desde = ahora - SEMANA
  const entregas = apartados
    .filter((a) => a.estado === 'entregado' && (comoVendedor ? a.vendedorId === usuarioId : a.comprador.id === usuarioId))
    .filter((a) => (a.actualizado ?? a.creado) >= desde)
    .sort((a, b) => (b.actualizado ?? b.creado) - (a.actualizado ?? a.creado))
  const ok = devoluciones.filter((d) => d.estado === 'aprobado')
  const reembolsadas = new Set(ok.filter((d) => d.clase === 'compra' && d.tipo === 'dinero').map((d) => d.apartadoId))
  const devueltoDe = entregas.filter((a) => reembolsadas.has(a.id))
  const devuelto = devueltoDe.reduce((s, a) => s + a.total, 0)
  const cuotaOk = comoVendedor ? ok.filter((d) => d.clase === 'cuota' && d.autorId === usuarioId && (d.resueltoEn ?? d.creado) >= desde) : []
  const cuotaDevuelta = cuotaOk.filter((d) => d.tipo === 'dinero').reduce((s, d) => s + d.monto, 0)
  const saldoFavor = cuotaOk.filter((d) => d.tipo === 'saldo').reduce((s, d) => s + d.monto, 0)

  const kilos = entregas.reduce((s, a) => s + kilosDe(a.unidad, a.cantidad), 0)
  const ingresos = entregas.reduce((s, a) => s + a.total, 0) - devuelto
  const ahorro = entregas
    .filter((a) => !reembolsadas.has(a.id))
    .reduce((s, a) => s + (a.normal ? Math.max(0, (a.normal - (a.rescate ?? a.normal)) * a.cantidad) : 0), 0)
  const cuota = comoVendedor ? cuotaSemana(plan, ingresos, entregas.length) : 0
  return {
    entregas,
    kilos: Math.round(kilos * 10) / 10,
    ingresos,
    ahorro,
    devuelto,
    cuota,
    cuotaDevuelta,
    saldoFavor,
    balance: ingresos - cuota + cuotaDevuelta,
    roi: cuota > 0 ? Math.round((ingresos / cuota) * 10) / 10 : null,
    desde,
    hasta: ahora,
  }
}

// Autosostenibilidad de la plataforma: lo que pagan los puestos activos menos los costos fijos mínimos.
export const COSTOS_MES = [
  { id: 'hosting', etiqueta: 'Hosting y base de datos', valor: 60000 },
  { id: 'dominio', etiqueta: 'Dominio (.co)', valor: 4200 },
  { id: 'soporte', etiqueta: 'Soporte básico (coordinador local, medio tiempo)', valor: 300000 },
]
export const COSTO_TOTAL_MES = COSTOS_MES.reduce((s, c) => s + c.valor, 0)
export const META_PUESTOS = 35

export function sostenibilidad(formales, populares) {
  const semana = formales * CUOTA_FORMAL + populares * PROMEDIO_POPULAR
  const mes = Math.round(semana * SEMANAS_MES)
  const porFormal = Math.round(CUOTA_FORMAL * SEMANAS_MES)
  return {
    semana,
    mes,
    neto: mes - COSTO_TOTAL_MES,
    equilibrio: Math.ceil(COSTO_TOTAL_MES / porFormal),
  }
}
