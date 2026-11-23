import { ciudadPorId } from '../data/ciudades.js'

const formatos = {}

// $6.400 en Colombia, $38 en México. Siempre sin decimales.
export function dinero(valor, ciudadId = 'bq') {
  const { locale } = ciudadPorId(ciudadId)
  formatos[locale] ??= new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  return '$' + formatos[locale].format(Math.round(valor))
}

// Precio de referencia de un producto en la moneda de la plaza.
export function precioReferencia(precioBase, ciudadId) {
  const { factor } = ciudadPorId(ciudadId)
  if (factor === 1) return precioBase
  return Math.max(1, Math.round(precioBase * factor))
}

export function descuento(normal, rescate) {
  return normal > 0 ? Math.round((1 - rescate / normal) * 100) : 0
}
