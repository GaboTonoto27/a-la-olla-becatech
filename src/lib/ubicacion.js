// Privacidad por diseño: los puestos informales y los negocios sensibles solo muestran una zona aproximada.
// La ubicación exacta se desbloquea al apartar (puestos) o al confirmar el encargo (compradores).
const ACTIVOS = ['apartado', 'confirmado']

export function ubicacionExacta(ent, usuario, apartados, pedidos) {
  if (ent.privacidad === 'exacto') return true
  if (!usuario) return false
  if (usuario.id === ent.id) return true
  if (ent.tipo === 'puesto') {
    return apartados.some((a) => a.vendedorId === ent.id && a.comprador.id === usuario.id && ACTIVOS.includes(a.estado))
  }
  return pedidos.some(
    (p) =>
      p.estado === 'aceptado' &&
      p.ganador?.vendedorId === usuario.id &&
      (p.compradorId === ent.id || p.comprador === ent.pedidoComo),
  )
}

export const AVISO_ZONA =
  'Zona aproximada por seguridad; la ubicación exacta se desbloquea al apartar o confirmar el encargo.'
