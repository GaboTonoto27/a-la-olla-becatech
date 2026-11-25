// Geocodificación gratuita con Nominatim (OpenStreetMap), restringida a Barranquilla, Atlántico, Colombia.
const URL_BUSQUEDA = 'https://nominatim.openstreetmap.org/search'
const VIEWBOX = '-74.98,11.12,-74.68,10.82' // caja que rodea a Barranquilla y su área metropolitana
const SUFIJO = 'Barranquilla, Atlántico, Colombia'
const ESPERA_ENTRE_BUSQUEDAS_MS = 1000 // la política de Nominatim pide máximo 1 consulta por segundo

const ABREVIATURAS = [
  [/\b(?:cra|cr|kra|kr|carr)\b\.?/gi, 'Carrera'],
  [/\b(?:cll|cl|cal)\b\.?/gi, 'Calle'],
  [/\b(?:av|avda)\b\.?/gi, 'Avenida'],
  [/\bdiag\b\.?/gi, 'Diagonal'],
  [/\b(?:tv|trans|transv)\b\.?/gi, 'Transversal'],
]

// "Cra 6 B Sur # 47 D - 37" → { via: "Carrera 6B Sur", num: "47D-37" }
export function normalizarDireccion(texto) {
  let t = String(texto ?? '').replace(/\s+/g, ' ').trim()
  for (const [re, r] of ABREVIATURAS) t = t.replace(re, r)
  t = t.replace(/(\d+)\s+([A-Za-z])(?=\s|$|-)/g, '$1$2') // "6 B" → "6B"
  const partido = t.match(/^(.+?)\s*(?:#|n[oº°]\.?)\s*(.+)$/i) ?? t.match(/^(.+?\d+[A-Za-z]?(?:\s+(?:Sur|Norte|Este|Oeste))?)\s+(\d.*)$/i)
  const via = (partido ? partido[1] : t).trim()
  const num = partido ? partido[2].replace(/\s*-\s*/g, '-').replace(/(\d)\s+([A-Za-z])\b/g, '$1$2').trim() : ''
  return { via, num }
}

// Dos intentos: 1) dirección exacta, 2) solo la vía + barrio. Devuelve { ok, punto, nombre, aprox } o { ok: false, error }.
export function consultasDe(texto, barrio = '') {
  const { via, num } = normalizarDireccion(texto)
  const exacta = num ? `${via} # ${num}, ${SUFIJO}` : `${via}, ${SUFIJO}`
  const simple = `${via}${barrio.trim() ? `, ${barrio.trim()}` : ''}, Barranquilla, Colombia`
  return { exacta, simple }
}

async function consultar(q, fetcher, senal) {
  const url = `${URL_BUSQUEDA}?${new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'co', viewbox: VIEWBOX, bounded: '1', 'accept-language': 'es', q })}`
  const r = await fetcher(url, { signal: senal, headers: { Accept: 'application/json' } })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const lista = await r.json()
  const p = lista?.[0]
  return p ? { punto: [Number(p.lat), Number(p.lon)], nombre: String(p.display_name ?? '').split(',').slice(0, 3).join(',').trim() } : null
}

export async function buscarDireccion(texto, barrio = '', fetcher = (...a) => fetch(...a)) {
  if (String(texto ?? '').trim().length < 4) return { ok: false, error: 'Escribe la dirección completa, por ejemplo: Carrera 6 B Sur # 47 D - 37.' }
  const { exacta, simple } = consultasDe(texto, barrio)
  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), 12000)
  try {
    const a = await consultar(exacta, fetcher, control.signal)
    if (a) return { ok: true, ...a, aprox: false }
    await new Promise((r) => setTimeout(r, ESPERA_ENTRE_BUSQUEDAS_MS))
    const b = await consultar(simple, fetcher, control.signal)
    if (b) return { ok: true, ...b, aprox: true }
    return { ok: false, error: 'No encontramos esa dirección. Revisa cómo la escribiste o marca el punto tú mismo en el mapa.' }
  } catch {
    return { ok: false, error: 'No pudimos buscar la dirección (revisa tu internet). Puedes marcar el punto tú mismo en el mapa.' }
  } finally {
    clearTimeout(corte)
  }
}
