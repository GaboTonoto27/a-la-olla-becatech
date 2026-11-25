// Reglas de Última Hora y Pide pa' tu Olla. Todas son funciones puras: reciben el estado y devuelven el nuevo.
import { proximoCierre } from './tiempo.js'
import { proximoCierrePuesto } from './horarioPuesto.js'
import { PERFILES, semilla } from '../data/semilla.js'
import { PERFILES_COMPRADOR, USUARIOS_DEMO } from '../data/seed.js'
import { bloqueada, nombreVisible } from './social.js'

const MIN = 60000

// Un lote está en vitrina solo si no se retiró y no ha vencido (reloj de caducidad automática).
export function loteActivo(l, ahora = Date.now()) {
  return !l.retirado && l.vence > ahora
}

// Quita lotes vencidos o retirados. Los de demostración se quedan guardados pa' renovarse al abrir la app.
export function podar(lotes, ahora = Date.now()) {
  return lotes.filter((l) => l.demo || loteActivo(l, ahora))
}

export function iniciar(e, ahora = Date.now()) {
  // La app es local: siempre trabaja en Barranquilla. Las demás plazas viven en el panel del Admin.
  if (!e.lotes || !e.apartados || !e.pedidos || !e.cuentas || !e.chats) {
    return { ...e, ...semilla(ahora), ciudadId: 'bq' }
  }
  // Las cuentas demo guardadas de versiones anteriores recuperan su rol real (Edwin ya no es "ambos").
  const cuentasFijas = e.cuentas.map((c) => {
    const base = c.demo ? USUARIOS_DEMO.find((u) => u.id === c.id) : null
    return base && c.rol !== base.rol ? { ...c, rol: base.rol, modoInicial: base.modoInicial, etiqueta: base.etiqueta, detalle: base.detalle, perfilComprador: base.perfilComprador } : c
  })
  const modoFijo = cuentasFijas.find((c) => c.id === e.usuarioId && (c.rol === 'vendedor' || c.rol === 'comprador'))?.rol
  e = { ...e, cuentas: cuentasFijas, ...(modoFijo ? { modo: modoFijo } : {}) }
  const frenados = new Set(e.cuentas.filter((c) => bloqueada(c, ahora)).map((c) => c.id))
  const lotes = e.lotes.map((l) =>
    l.demo && (l.vence <= ahora || l.retirado) && !frenados.has(l.vendedorId)
      ? { ...l, creado: ahora, vence: ahora + l.minutos * MIN, cantidad: l.cantidadInicial, retirado: false }
      : l,
  )
  return { ...e, ciudadId: 'bq', lotes: podar(lotes, ahora) }
}

export const nombreComprador = nombreVisible

// Historial del comprador: lo de fábrica más lo que ha hecho en esta app.
function perfilDe(e, usuario) {
  const base = PERFILES[usuario.id]
  const mios = e.apartados.filter((a) => a.comprador.id === usuario.id)
  return {
    tipo: base?.tipo ?? PERFILES_COMPRADOR.find((p) => p.id === usuario.perfilComprador)?.etiqueta ?? 'Cuenta nueva',
    compras: (base?.compras ?? 0) + mios.filter((a) => a.estado === 'entregado').length,
    rechazos: (base?.rechazos ?? 0) + mios.filter((a) => a.estado === 'rechazado').length,
  }
}

function codigoNuevo(apartados) {
  const usados = new Set(apartados.map((a) => a.codigo))
  for (let i = 0; i < 50; i++) {
    const c = `OLLA-${100 + Math.floor(Math.random() * 900)}`
    if (!usados.has(c)) return c
  }
  return `OLLA-${Date.now() % 10000}`
}

export function publicarLote(e, usuario, ciudad, d, puesto, ahora = Date.now()) {
  const formal = Boolean(puesto?.formal)
  const lote = {
    id: `l-${ahora}-${Math.floor(Math.random() * 1000)}`,
    ciudad: ciudad.id,
    vendedorId: usuario.id,
    puesto: puesto?.nombre ?? usuario.negocio,
    barrio: puesto?.barrio ?? usuario.barrio ?? ciudad.plaza,
    foto: puesto?.fotos?.[0] ?? null,
    formal,
    frio: formal,
    demo: false,
    creado: ahora,
    vence: (puesto && proximoCierrePuesto(puesto, ahora)) || proximoCierre(ahora), // cierre real del puesto
    cantidadInicial: d.cantidad,
    ...d,
  }
  return { estado: { ...e, lotes: [lote, ...e.lotes] }, resultado: lote }
}

export function retirarLote(e, id) {
  const lotes = e.lotes.flatMap((l) => (l.id !== id ? [l] : l.demo ? [{ ...l, retirado: true }] : []))
  return { estado: { ...e, lotes }, resultado: true }
}

// Rebaja o ajusta el precio de un lote en vitrina. El precio normal (referencia) no se toca: solo hay rebaja si queda por debajo.
export function ajustarPrecio(e, loteId, nuevo) {
  const precio = Math.round(nuevo)
  if (!(precio >= 1)) return { estado: e, resultado: false }
  const lotes = e.lotes.map((l) => (l.id === loteId ? { ...l, rescate: precio } : l))
  return { estado: { ...e, lotes }, resultado: true }
}

export function apartar(e, usuario, loteId, cantidad, ahora = Date.now()) {
  const l = e.lotes.find((x) => x.id === loteId)
  if (!l || l.vendedorId === usuario.id || !loteActivo(l, ahora) || cantidad <= 0 || cantidad > l.cantidad) {
    return { estado: e, resultado: null }
  }
  const apartado = {
    id: `a-${ahora}-${Math.floor(Math.random() * 1000)}`,
    codigo: codigoNuevo(e.apartados),
    loteId,
    ciudad: l.ciudad,
    vendedorId: l.vendedorId,
    puesto: l.puesto,
    barrio: l.barrio,
    producto: l.producto,
    unidad: l.unidad,
    nivel: l.nivel,
    cantidad,
    total: cantidad * l.rescate,
    normal: l.normal,
    rescate: l.rescate,
    comprador: { id: usuario.id, nombre: nombreComprador(usuario), ...perfilDe(e, usuario) },
    estado: 'apartado',
    creado: ahora,
  }
  return {
    estado: {
      ...e,
      lotes: e.lotes.map((x) => (x.id === loteId ? { ...x, cantidad: x.cantidad - cantidad } : x)),
      apartados: [apartado, ...e.apartados],
    },
    resultado: apartado,
  }
}

// nuevo: confirmado (vendedor) · cancelado (vuelve al stock) · entregado (lo revisé y me lo llevo) · rechazado (calidad)
export function actualizarApartado(e, id, nuevo) {
  const a = e.apartados.find((x) => x.id === id)
  if (!a) return { estado: e, resultado: null }
  const devuelve = nuevo === 'cancelado' && (a.estado === 'apartado' || a.estado === 'confirmado')
  return {
    estado: {
      ...e,
      apartados: e.apartados.map((x) => (x.id === id ? { ...x, estado: nuevo, actualizado: Date.now() } : x)),
      lotes: devuelve
        ? e.lotes.map((l) => (l.id === a.loteId ? { ...l, cantidad: l.cantidad + a.cantidad } : l))
        : e.lotes,
    },
    resultado: true,
  }
}

export function crearPedido(e, usuario, ciudadId, d, ahora = Date.now()) {
  const pedido = {
    id: `p-${ahora}`,
    ciudad: ciudadId,
    compradorId: usuario.id,
    comprador: nombreComprador(usuario),
    estado: 'abierto',
    ofertas: [],
    creado: ahora,
    ...d,
  }
  return { estado: { ...e, pedidos: [pedido, ...e.pedidos] }, resultado: pedido }
}

// El vendedor responde en 2 toques: "Responder" y luego aceptar el precio o mandar el suyo.
export function responderPedido(e, pedidoId, usuario, precioKg, aceptaPresupuesto, nombrePuesto) {
  const pedidos = e.pedidos.map((p) => {
    if (p.id !== pedidoId || p.estado !== 'abierto' || p.ofertas.some((o) => o.vendedorId === usuario.id)) return p
    const oferta = {
      id: `o-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      vendedorId: usuario.id,
      puesto: nombrePuesto ?? usuario.negocio,
      precioKg,
    }
    return {
      ...p,
      ofertas: [...p.ofertas, oferta],
      ...(aceptaPresupuesto ? { estado: 'aceptado', ganador: oferta } : {}),
    }
  })
  return { estado: { ...e, pedidos }, resultado: true }
}

export function elegirOferta(e, pedidoId, ofertaId) {
  const pedidos = e.pedidos.map((p) => {
    const o = p.ofertas.find((x) => x.id === ofertaId)
    return p.id === pedidoId && o ? { ...p, estado: 'aceptado', ganador: o } : p
  })
  return { estado: { ...e, pedidos }, resultado: true }
}

export function cerrarPedido(e, id) {
  const pedidos = e.pedidos.map((p) => (p.id === id ? { ...p, estado: 'cerrado' } : p))
  return { estado: { ...e, pedidos }, resultado: true }
}
