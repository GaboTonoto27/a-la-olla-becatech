// Cifras reales del vendedor y del comprador, sacadas de las entregas confirmadas ("Lo revisé y me lo llevo").
export const CUOTA_FORMAL = 10000
export const CUOTA_POPULAR_MAX = 3000
export const PROMEDIO_POPULAR = 1500
const SEMANA = 7 * 24 * 60 * 60 * 1000
const SEMANAS_MES = 4.33

export const PLANES = {
  formal: { id: 'formal', nombre: 'Plan Formal', precio: '$10.000 COP/sem', detalle: 'Puesto con nevera. Cuota fija por semana.' },
  popular: { id: 'popular', nombre: 'Plan Popular', precio: '$0 a $3.000 COP/sem', detalle: 'Puesto informal. Pagas el tramo que asigna el equipo.' },
}

// Lo que se vende por bolsa no se pesa: se cuenta aparte pa' no mostrar "0 kg" con plata recuperada.
export const bolsasDe = (unidad, cantidad) => (unidad === 'bolsa' ? cantidad : 0)
export const textoRescate = (kilos, bolsas) => {
  const kg = `${String(kilos).replace('.', ',')} kg`
  return bolsas > 0 ? (kilos > 0 ? `${kg} y ${bolsas} ${bolsas === 1 ? 'bolsa' : 'bolsas'}` : `${bolsas} ${bolsas === 1 ? 'bolsa' : 'bolsas'}`) : kg
}

export function kilosDe(unidad, cantidad) {
  if (unidad === 'kg') return cantidad
  if (unidad === 'lb') return cantidad * 0.4536
  return 0
}

// Cuota de la semana: la tarifa que asigna el equipo ($10.000 Formal; $0, $1.500 o $3.000 Popular).
// Mientras el equipo no confirma, se usa la sugerida del plan. En el prototipo la cuota solo corre desde la primera entrega confirmada.
export function cuotaSemana(plan, ingresos, entregas, tarifa) {
  if (!entregas) return 0
  if (typeof tarifa === 'number') return tarifa // tarifa definitiva confirmada por el equipo
  if (plan === 'formal') return CUOTA_FORMAL
  return PROMEDIO_POPULAR
}

// devoluciones: las aprobadas descuentan la plata devuelta al comprador y suman la cuota devuelta al vendedor.
export function resumenSemana(apartados, usuarioId, comoVendedor, plan, ahora = Date.now(), devoluciones = [], tarifa) {
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
  const bolsas = entregas.reduce((s, a) => s + bolsasDe(a.unidad, a.cantidad), 0)
  const ingresos = entregas.reduce((s, a) => s + a.total, 0) - devuelto
  const ahorro = entregas
    .filter((a) => !reembolsadas.has(a.id))
    .reduce((s, a) => s + (a.normal ? Math.max(0, (a.normal - (a.rescate ?? a.normal)) * a.cantidad) : 0), 0)
  const cuota = comoVendedor ? cuotaSemana(plan, ingresos, entregas.length, tarifa) : 0
  return {
    entregas,
    kilos: Math.round(kilos * 10) / 10,
    bolsas,
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

// semanaReal: suma de las tarifas ya asignadas por el equipo (si no se pasa, se usa el promedio de cada plan).
export function sostenibilidad(formales, populares, semanaReal) {
  const semana = semanaReal ?? formales * CUOTA_FORMAL + populares * PROMEDIO_POPULAR
  const mes = Math.round(semana * SEMANAS_MES)
  const porFormal = Math.round(CUOTA_FORMAL * SEMANAS_MES)
  return {
    semana,
    mes,
    neto: mes - COSTO_TOTAL_MES,
    equilibrio: Math.ceil(COSTO_TOTAL_MES / porFormal),
  }
}
