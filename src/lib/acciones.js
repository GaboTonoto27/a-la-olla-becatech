// Reglas de Última Hora y Pide pa' tu Olla. Todas son funciones puras: reciben el estado y devuelven el nuevo.
import { proximoCierre } from './tiempo.js'
import { PERFILES, PERFIL_NUEVO, barrioDe, semilla } from '../data/semilla.js'

const MIN = 60000
const FOTOS = { edwin: '/fotos/puesto-lmc.jpg', ana: '/fotos/puesto-metrocentro.jpg' }

// Un lote está en vitrina solo si no se retiró y no ha vencido (reloj de caducidad automática).
export function loteActivo(l, ahora = Date.now()) {
  return !l.retirado && l.vence > ahora
}

// Quita lotes vencidos o retirados. Los de demostración se quedan guardados pa' renovarse al abrir la app.
export function podar(lotes, ahora = Date.now()) {
  return lotes.filter((l) => l.demo || loteActivo(l, ahora))
}

export function iniciar(e, ahora = Date.now()) {
  if (!e.lotes || !e.apartados || !e.pedidos) {
    const s = semilla(ahora)
    return { ...e, ...s }
  }
  const lotes = e.lotes.map((l) =>
    l.demo && (l.vence <= ahora || l.retirado)
      ? { ...l, creado: ahora, vence: ahora + l.minutos * MIN, cantidad: l.cantidadInicial, retirado: false }
      : l,
  )
  return { ...e, lotes: podar(lotes, ahora) }
}

export function nombreComprador(u) {
  if (u.id === 'visitante') return 'Visitante (cuenta nueva)'
  return u.negocio && u.negocio !== 'Hogar' ? u.negocio : `${u.nombre} (Hogar)`
}

function codigoNuevo(apartados) {
  const usados = new Set(apartados.map((a) => a.codigo))
  for (let i = 0; i < 50; i++) {
    const c = `OLLA-${100 + Math.floor(Math.random() * 900)}`
    if (!usados.has(c)) return c
  }
  return `OLLA-${Date.now() % 10000}`
}

export function publicarLote(e, usuario, ciudad, d, ahora = Date.now()) {
  const formal = usuario.tipoPuesto === 'formal'
  const lote = {
    id: `l-${ahora}-${Math.floor(Math.random() * 1000)}`,
    ciudad: ciudad.id,
    vendedorId: usuario.id,
    puesto: usuario.negocio === 'Mi cuenta' ? 'Mi puesto' : usuario.negocio,
    barrio: barrioDe(usuario.id, ciudad),
    foto: ciudad.piloto ? (FOTOS[usuario.id] ?? null) : null,
    formal,
    frio: formal,
    demo: false,
    creado: ahora,
    vence: proximoCierre(ahora),
    cantidadInicial: d.cantidad,
    ...d,
  }
  return { estado: { ...e, lotes: [lote, ...e.lotes] }, resultado: lote }
}

export function retirarLote(e, id) {
  const lotes = e.lotes.flatMap((l) => (l.id !== id ? [l] : l.demo ? [{ ...l, retirado: true }] : []))
  return { estado: { ...e, lotes }, resultado: true }
}

export function apartar(e, usuario, loteId, cantidad, ahora = Date.now()) {
  const l = e.lotes.find((x) => x.id === loteId)
  if (!l || !loteActivo(l, ahora) || cantidad <= 0 || cantidad > l.cantidad) {
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
    comprador: { id: usuario.id, nombre: nombreComprador(usuario), ...(PERFILES[usuario.id] ?? PERFIL_NUEVO) },
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
export function responderPedido(e, pedidoId, usuario, precioKg, aceptaPresupuesto) {
  const pedidos = e.pedidos.map((p) => {
    if (p.id !== pedidoId || p.estado !== 'abierto' || p.ofertas.some((o) => o.vendedorId === usuario.id)) return p
    const oferta = {
      id: `o-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      vendedorId: usuario.id,
      puesto: usuario.negocio === 'Mi cuenta' ? 'Mi puesto' : usuario.negocio,
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
