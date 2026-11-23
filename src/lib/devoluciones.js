// Devoluciones y reembolsos. Funciones puras: reciben el estado y devuelven el nuevo.
// clase 'compra': el comprador pide plata de vuelta o cambio de producto de un apartado ya entregado.
// clase 'cuota': el vendedor pide que le devuelvan (o le dejen a favor) parte de su cuota semanal.
const uid = () => `dv-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`

export const TIPOS_COMPRA = [
  { id: 'dinero', etiqueta: 'Reembolso de dinero', detalle: 'Te devuelven lo que pagaste.' },
  { id: 'cambio', etiqueta: 'Cambio de producto en el puesto', detalle: 'Te cambian el lote por otro bueno.' },
]
export const TIPOS_CUOTA = [
  { id: 'dinero', etiqueta: 'Reembolso de dinero', detalle: 'Te devuelven parte de la cuota.' },
  { id: 'saldo', etiqueta: 'Saldo a favor', detalle: 'Se descuenta de tu próxima cuota.' },
]
export const ESTADOS = {
  solicitado: { etiqueta: 'Solicitado', tono: 'ambar' },
  aprobado: { etiqueta: 'Aprobado / Reembolsado', tono: 'olla' },
  rechazado: { etiqueta: 'Rechazado', tono: 'tomate' },
}
export const etiquetaTipo = (d) => (d.clase === 'cuota' ? TIPOS_CUOTA : TIPOS_COMPRA).find((t) => t.id === d.tipo)?.etiqueta ?? d.tipo

export const lista = (e) => e.devoluciones ?? []

// Una compra solo admite una solicitud viva: si ya hay una pendiente o aprobada, no se repite.
export const devolucionDeCompra = (devs, apartadoId) =>
  devs.filter((d) => d.clase === 'compra' && d.apartadoId === apartadoId).sort((a, b) => b.creado - a.creado)[0] ?? null
export const puedeSolicitarCompra = (devs, apartadoId) => {
  const d = devolucionDeCompra(devs, apartadoId)
  return !d || d.estado === 'rechazado'
}

// d: { clase, tipo, motivo, autorId, autorNombre, apartado? (compra) | monto? (cuota), puestoNombre? }
export function solicitarDevolucion(e, d, ahora = Date.now()) {
  const motivo = String(d.motivo ?? '').trim().slice(0, 400)
  if (motivo.length < 5) return { estado: e, resultado: null }
  const a = d.apartado
  if (d.clase === 'compra' && (!a || !puedeSolicitarCompra(lista(e), a.id))) return { estado: e, resultado: null }
  const monto = d.clase === 'compra' ? a.total : Math.max(0, Math.round(d.monto || 0))
  if (d.clase === 'cuota' && monto <= 0) return { estado: e, resultado: null }
  const dev = {
    id: uid(),
    clase: d.clase,
    tipo: d.tipo,
    autorId: d.autorId,
    autorNombre: d.autorNombre,
    apartadoId: a?.id ?? null,
    codigo: a?.codigo ?? '',
    producto: a ? `${a.producto} · ${a.cantidad} ${a.unidad}` : 'Cuota semanal',
    vendedorId: a?.vendedorId ?? d.autorId,
    puesto: a?.puesto ?? d.puestoNombre ?? '',
    monto,
    motivo,
    estado: 'solicitado',
    nota: '',
    leida: false,
    creado: ahora,
    resueltoEn: null,
  }
  return { estado: { ...e, devoluciones: [dev, ...lista(e)] }, resultado: dev }
}

export function resolverDevolucion(e, id, decision, nota, ahora = Date.now()) {
  const t = String(nota ?? '').trim().slice(0, 300)
  if (!['aprobado', 'rechazado'].includes(decision) || (decision === 'rechazado' && t.length < 3)) return { estado: e, resultado: false }
  const devoluciones = lista(e).map((d) =>
    d.id === id && d.estado === 'solicitado'
      ? { ...d, estado: decision, nota: t || 'Aprobado por la coordinación.', leida: true, resueltoEn: ahora }
      : d,
  )
  return { estado: { ...e, devoluciones }, resultado: true }
}

const aprobadas = (devs) => devs.filter((d) => d.estado === 'aprobado')

// Plata que sale de los totales: reembolsos de dinero aprobados a compradores, y cuotas devueltas a vendedores.
export function totalesDevueltos(devs) {
  const ok = aprobadas(devs)
  const sum = (arr) => arr.reduce((s, d) => s + d.monto, 0)
  return {
    compras: sum(ok.filter((d) => d.clase === 'compra' && d.tipo === 'dinero')),
    cuotas: sum(ok.filter((d) => d.clase === 'cuota' && d.tipo === 'dinero')),
    saldos: sum(ok.filter((d) => d.clase === 'cuota' && d.tipo === 'saldo')),
    pendientes: devs.filter((d) => d.estado === 'solicitado').length,
  }
}
