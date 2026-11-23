// Singular y plural de las unidades: 1 bolsa, 6 bolsas · 1 unidad, 10 unidades · kg y lb no cambian.
const PLURAL = { bolsa: 'bolsas', unidad: 'unidades', lote: 'lotes' }

export function unidadTexto(n, unidad) {
  return n === 1 ? unidad : (PLURAL[unidad] ?? unidad)
}

export function cant(n, unidad) {
  return `${n} ${unidadTexto(n, unidad)}`
}
