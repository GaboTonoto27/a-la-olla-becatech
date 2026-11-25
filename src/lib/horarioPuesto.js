// Horario estructurado de un puesto: días (0 = Lun … 6 = Dom) + hora de apertura y cierre en minutos desde medianoche.
// Compatible con los puestos de fábrica, que solo traen un texto como "Lun–Sáb 5:00 a. m. – 4:00 p. m.".
export const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
export const ATAJOS = [
  { id: 'lunsab', etiqueta: 'Lun a Sáb', dias: [0, 1, 2, 3, 4, 5] },
  { id: 'todos', etiqueta: 'Todos los días', dias: [0, 1, 2, 3, 4, 5, 6] },
  { id: 'finde', etiqueta: 'Solo fines de semana', dias: [5, 6] },
]
// De 4:00 a. m. a 9:00 p. m., cada 30 minutos.
export const HORAS = Array.from({ length: (21 - 4) * 2 + 1 }, (_, i) => 240 + i * 30)
export const POR_DEFECTO = { dias: [0, 1, 2, 3, 4, 5], horaAbre: 360, horaCierra: 960 }
const VENTANA_ULTIMA_HORA = 120 // las 2 horas antes del cierre

export function formatoHora(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'p. m.' : 'a. m.'}`
}

export function textoDias(dias) {
  const d = [...new Set(dias)].sort((a, b) => a - b)
  if (d.length === 0) return 'Sin días'
  const corridas = []
  for (const x of d) {
    const ultima = corridas[corridas.length - 1]
    if (ultima && x === ultima[1] + 1) ultima[1] = x
    else corridas.push([x, x])
  }
  if (corridas.length === 1 && corridas[0][1] - corridas[0][0] >= 2) return `${DIAS[corridas[0][0]]} a ${DIAS[corridas[0][1]]}`
  const n = d.map((x) => DIAS[x])
  return n.length === 1 ? n[0] : `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}`
}

export const textoHorario = (dias, abre, cierra) => `${textoDias(dias)} · ${formatoHora(abre)} – ${formatoHora(cierra)}`
export const horarioValido = (v) => Array.isArray(v?.dias) && v.dias.length > 0 && v.horaCierra > v.horaAbre

const aMinutos = (h, m, ap) => (Number(h) % 12 + (ap.toLowerCase() === 'p' ? 12 : 0)) * 60 + Number(m)

// Devuelve { dias, horaAbre, horaCierra, texto } de cualquier puesto, nuevo o de fábrica.
export function horarioDe(p) {
  if (Array.isArray(p?.dias) && p.dias.length && p.horaAbre != null && p.horaCierra != null) {
    return { dias: p.dias, horaAbre: p.horaAbre, horaCierra: p.horaCierra, texto: textoHorario(p.dias, p.horaAbre, p.horaCierra) }
  }
  const t = String(p?.horario ?? '')
  const horas = [...t.matchAll(/(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?/gi)]
  const rango = t.match(/(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)\s*[–-]\s*(Lun|Mar|Mié|Jue|Vie|Sáb|Dom)/)
  const dias = rango
    ? (() => {
        const a = DIAS.indexOf(rango[1])
        const b = DIAS.indexOf(rango[2])
        return Array.from({ length: ((b - a + 7) % 7) + 1 }, (_, i) => (a + i) % 7)
      })()
    : POR_DEFECTO.dias
  const horaAbre = horas[0] ? aMinutos(horas[0][1], horas[0][2], horas[0][3]) : POR_DEFECTO.horaAbre
  const horaCierra = horas[1] ? aMinutos(horas[1][1], horas[1][2], horas[1][3]) : POR_DEFECTO.horaCierra
  return { dias, horaAbre, horaCierra, texto: textoHorario(dias, horaAbre, horaCierra) } // los puestos de fábrica se muestran con el mismo formato
}

const diaIdx = (d) => (d.getDay() + 6) % 7
const minutosDe = (d) => d.getHours() * 60 + d.getMinutes()

// "Abierto ahora" / "Cerrado" con la hora real del navegador.
export function estadoPuesto(p, ahora = Date.now()) {
  const h = horarioDe(p)
  const d = new Date(ahora)
  const hoy = diaIdx(d)
  const min = minutosDe(d)
  const abierto = h.dias.includes(hoy) && min >= h.horaAbre && min < h.horaCierra
  let proxima = ''
  if (!abierto) {
    for (let i = 0; i < 8; i++) {
      const dia = (hoy + i) % 7
      if (!h.dias.includes(dia)) continue
      if (i === 0 && min >= h.horaAbre) continue
      proxima = `Abre ${i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DIAS[dia]}`} a las ${formatoHora(h.horaAbre)}`
      break
    }
  }
  return { abierto, texto: abierto ? 'Abierto ahora' : 'Cerrado', proxima, cierra: formatoHora(h.horaCierra) }
}

// Ventana de Última hora: las 2 horas antes del cierre de ese puesto.
export function ventanaUltimaHora(p, ahora = Date.now()) {
  const h = horarioDe(p)
  const d = new Date(ahora)
  const min = minutosDe(d)
  const inicio = Math.max(h.horaAbre, h.horaCierra - VENTANA_ULTIMA_HORA)
  const diaAbierto = h.dias.includes(diaIdx(d))
  return {
    inicio,
    cierra: h.horaCierra,
    texto: `${formatoHora(inicio)} – ${formatoHora(h.horaCierra)}`,
    activa: diaAbierto && min >= inicio && min < h.horaCierra,
  }
}

// Marca de tiempo del próximo cierre del puesto (a ese momento se retiran solos sus lotes de Última hora).
export function proximoCierrePuesto(p, ahora = Date.now()) {
  const h = horarioDe(p)
  const hoy = diaIdx(new Date(ahora))
  for (let i = 0; i < 8; i++) {
    if (!h.dias.includes((hoy + i) % 7)) continue
    const c = new Date(ahora)
    c.setDate(c.getDate() + i)
    c.setHours(Math.floor(h.horaCierra / 60), h.horaCierra % 60, 0, 0)
    if (c.getTime() - ahora >= 15 * 60000) return c.getTime()
  }
  return null
}
