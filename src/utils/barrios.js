// Catálogo de barrios de Barranquilla y del área metropolitana (Soledad, Malambo, Puerto Colombia).
// Las coordenadas son de REFERENCIA (centro aproximado del barrio): sirven pa' validar con suavidad, no pa' navegar.
import { distanciaM } from '../lib/geo.js'

const B = (nombre, lat, lng, zona = 'Barranquilla') => ({ nombre, lat, lng, zona })

export const BARRIOS = [
  // Suroccidente (zona de la plaza piloto)
  B('Ciudadela 20 de Julio', 10.9285, -74.8045), B('7 de Abril', 10.9205, -74.7975), B('Conidec', 10.9270, -74.8095),
  B('Las Cayenas', 10.9255, -74.8040), B('Metropolitana', 10.9290, -74.8090), B('Los Girasoles', 10.9190, -74.8010),
  B('Carrizal', 10.9170, -74.8050), B('Santo Domingo', 10.9100, -74.8050), B('El Santuario', 10.9150, -74.7950),
  B('Buenos Aires', 10.9220, -74.8060), B('Villa Estadio', 10.9230, -74.7930), B('Las Moras', 10.9170, -74.7700),
  B('Cevillar', 10.9250, -74.7920), B('La Paz', 10.9410, -74.7830), B('Las Malvinas', 10.9300, -74.7880),
  B('Lipaya', 10.9280, -74.7870), B('Las Américas', 10.9370, -74.8040), B('San Luis', 10.9380, -74.8110),
  B('Santa María', 10.9530, -74.8160), B('Los Robles', 10.9480, -74.8190), B('Cordialidad', 10.9380, -74.8020),
  B('El Bosque', 10.9520, -74.8030), B('La Alboraya', 10.9340, -74.8020), B('La Victoria', 10.9400, -74.7950),
  B('Lucero', 10.9390, -74.8010), B('Silencio', 10.9550, -74.8100), B('Olaya', 10.9500, -74.8090),
  // Centro y sur-centro
  B('San José', 10.9570, -74.7870), B('Simón Bolívar', 10.9660, -74.7960), B('Las Nieves', 10.9550, -74.7790),
  B('Rebolo', 10.9560, -74.7760), B('Chiquinquirá', 10.9520, -74.7880), B('Montes', 10.9690, -74.7820),
  B('Abajo', 10.9780, -74.7830), B('Modelo', 10.9720, -74.8020), B('Recreo', 10.9740, -74.7940),
  B('Nueva Granada', 10.9890, -74.8000), B('Barrio Centro', 10.9640, -74.7810), B('Barlovento', 10.9610, -74.8030),
  // Norte
  B('El Prado', 10.9930, -74.7900), B('Alto Prado', 11.0040, -74.8020), B('Boston', 10.9870, -74.7870),
  B('Villa Carolina', 10.9930, -74.8000), B('Hipódromo', 10.9990, -74.7950), B('Riomar', 11.0130, -74.8240),
  B('Villa Santos', 11.0030, -74.8070), B('Miramar', 11.0080, -74.8200), B('Buenavista', 11.0020, -74.8150),
  B('Las Flores', 11.0285, -74.8130), B('Ciudad Jardín', 10.9990, -74.8000), B('Granadillo', 11.0050, -74.8180),
  B('El Golf', 11.0010, -74.8120), B('Los Nogales', 10.9980, -74.8080),
  // Área metropolitana
  B('Soledad 2000', 10.9100, -74.7640, 'Soledad'), B('Centro de Soledad', 10.9184, -74.7646, 'Soledad'),
  B('Ciudad Paraíso', 10.8990, -74.7700, 'Soledad'), B('Malambo Centro', 10.8590, -74.7740, 'Malambo'),
  B('Puerto Colombia Centro', 10.9880, -74.9540, 'Puerto Colombia'),
]

const SIN_PESO = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'barrio', 'urbanizacion', 'urb', 'sector'])

// "Ciudadela 20 de Julio" → "ciudadela 20 de julio" (sin tildes, sin signos, espacios simples).
export const normalizar = (t) =>
  String(t ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const tokens = (t) => normalizar(t).split(' ').filter((x) => x && !SIN_PESO.has(x))

// Distancia de edición (Levenshtein) con corte: palabras cortas, así que es muy barata.
function distancia(a, b, tope = 3) {
  if (a === b) return 0
  if (Math.abs(a.length - b.length) > tope) return tope + 1
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    prev = cur
  }
  return prev[b.length]
}

// Errores tolerados por palabra: ninguno si es corta o es número, 1 hasta 6 letras, 2 si es larga.
const tolerancia = (w) => (/^\d+$/.test(w) || w.length <= 3 ? 0 : w.length <= 6 ? 1 : 2)

// Qué tan bien una palabra escrita se parece a las del barrio. null = no coincide.
function mejorPalabra(q, palabrasBarrio, { prefijo }) {
  let mejor = null
  for (const e of palabrasBarrio) {
    let d = distancia(q, e, 3)
    if (d > tolerancia(q)) {
      if (prefijo && q.length >= 2 && !/^\d+$/.test(q) && e.startsWith(q)) d = 0.5 // lo que va escribiendo todavía no termina
      else continue
    }
    if (mejor === null || d < mejor) mejor = d
  }
  return mejor
}

function puntaje(escritas, barrio, opciones) {
  const palabras = tokens(barrio.nombre)
  let total = 0
  for (const q of escritas) {
    const d = mejorPalabra(q, palabras, opciones)
    if (d === null) return null
    total += d
  }
  return total + Math.max(0, palabras.length - escritas.length) * 0.1
}

// Lo mejor que se parece a lo escrito. Con prefijo=true sirve pa' las sugerencias mientras se escribe.
export function buscarBarrios(texto, { max = 5, prefijo = true } = {}) {
  const escritas = tokens(texto)
  if (escritas.length === 0) return []
  return BARRIOS.map((barrio) => ({ barrio, score: puntaje(escritas, barrio, { prefijo }) }))
    .filter((x) => x.score !== null)
    .sort((a, b) => a.score - b.score || a.barrio.nombre.localeCompare(b.barrio.nombre))
    .slice(0, max)
}

export const barrioExacto = (texto) => BARRIOS.find((b) => normalizar(b.nombre) === normalizar(texto)) ?? null

// estado: vacio | exacto (está en el catálogo) | sugerido (parece un error de escritura) | desconocido
export function evaluarBarrio(texto) {
  if (normalizar(texto).length === 0) return { estado: 'vacio', sugerencias: [] }
  const exacto = barrioExacto(texto)
  if (exacto) return { estado: 'exacto', barrio: exacto, sugerencias: [] }
  const sugerencias = buscarBarrios(texto, { max: 4 })
  const cercanas = buscarBarrios(texto, { max: 1, prefijo: false })
  if (cercanas.length) return { estado: 'sugerido', barrio: cercanas[0].barrio, sugerencias }
  return { estado: 'desconocido', sugerencias }
}

// Barrio del catálogo más cerca de un punto del mapa.
export function barrioMasCercano(coord) {
  if (!coord) return null
  let mejor = null
  for (const b of BARRIOS) {
    const m = distanciaM(coord, [b.lat, b.lng])
    if (!mejor || m < mejor.metros) mejor = { barrio: b, metros: m }
  }
  return mejor
}

export const distanciaABarrio = (coord, barrio) => (coord && barrio ? distanciaM(coord, [barrio.lat, barrio.lng]) : null)
