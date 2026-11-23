import { nombreVisible } from '../../lib/social.js'

// Cómo se llama la otra persona del chat: el puesto si vende, el negocio u hogar si compra.
export function nombreOtro(chat, yoId, cuentaPorId, puestoPorId) {
  const otroId = yoId === chat.compradorId ? chat.vendedorId : chat.compradorId
  const eraVendedor = otroId === chat.vendedorId
  const puesto = eraVendedor ? puestoPorId(otroId) : null
  const cuenta = cuentaPorId(otroId)
  return { id: otroId, nombre: puesto?.nombre ?? (cuenta ? nombreVisible(cuenta) : puestoPorId(otroId)?.pedidoComo ?? 'Alguien') }
}
