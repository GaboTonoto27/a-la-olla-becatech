// Etiquetas rápidas del lote. Son opcionales y cambian según lo que el vendedor ya eligió.
export const OTROS = 'Otros'

export const ETIQUETAS_BUENA = ['Recién llegado', 'Fresco de hoy', 'Selección extra', 'Sano y firme']
export const ETIQUETAS_REMATE = ["Maduro pa' hoy", 'Con manchitas, sano por dentro', "Ideal pa' jugo o salsa", 'Tamaño irregular']
export const ETIQUETAS_CRIA = ['Muy pasado', 'Solo para animales', 'Para abono / compost']

// cria: destino Pa' Cría / Abono. rebaja: el precio final quedó por debajo del normal.
export function etiquetasPara({ cria, rebaja }) {
  if (cria) return { clave: 'cria', lista: ETIQUETAS_CRIA }
  if (rebaja) return { clave: 'remate', lista: ETIQUETAS_REMATE }
  return { clave: 'buena', lista: ETIQUETAS_BUENA }
}
