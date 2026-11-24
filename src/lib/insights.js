// Sugerencias automáticas pal vendedor, calculadas en el celular con sus propios datos ($0, sin API).
import { kilosDe } from './economia.js'

const horaTexto = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? 'a. m.' : 'p. m.'}`

// apartados: todos; vendedorId: quién es; lotes: sus lotes; resumen: resumenSemana(...); sinCelular: bool; plan: 'formal'|'popular'
export function sugerenciasVendedor({ apartados, vendedorId, lotes, resumen, sinCelular, plan }) {
  const mios = apartados.filter((a) => a.vendedorId === vendedorId && a.estado !== 'cancelado')
  const lista = []

  // 1) Hora pico: a qué hora le apartan más.
  const porHora = {}
  mios.forEach((a) => { const h = new Date(a.creado).getHours(); porHora[h] = (porHora[h] ?? 0) + 1 })
  const pico = Object.entries(porHora).sort((a, b) => b[1] - a[1])[0]
  if (pico && mios.length >= 2) {
    const h = Number(pico[0])
    lista.push({ id: 'hora', titulo: 'Tu hora pico de remates', texto: `Te apartan más hacia las ${horaTexto(h)}. Publica tus remates una hora antes pa' que ya estén en vitrina.` })
  } else {
    lista.push({ id: 'hora', titulo: 'Publica a tiempo', texto: "Todavía no hay datos de tu hora pico. Mientras tanto, publica tus remates temprano en la tarde: lo que sale antes de las 2:00 p. m. se aparta con calma." })
  }

  // 2) Pa' Cría / Abono vs. rechazos por calidad.
  const rechazos = mios.filter((a) => a.estado === 'rechazado').length
  const kgCria = [...mios.map((a) => [a.nivel, kilosDe(a.unidad, a.cantidad)]), ...lotes.map((l) => [l.nivel, kilosDe(l.unidad, l.cantidad)])]
    .filter(([n]) => n === 'cria').reduce((s, [, k]) => s + k, 0)
  if (rechazos > 0) {
    lista.push({ id: 'calidad', titulo: 'Cuida la calidad', texto: `Tuviste ${rechazos} rechazo${rechazos === 1 ? '' : 's'} por calidad. Revisa lo dudoso antes de publicar y separa lo que ya no sirve pa' la mesa como Pa' Cría / Abono.` })
  } else if (kgCria === 0) {
    lista.push({ id: 'cria', titulo: "Pa' Cría / Abono", texto: "Lo que ya no sirve pa' la mesa no se bota: publícalo como Pa' Cría / Abono pa' cerdos, gallinas o abono, y recupera algo más." })
  } else {
    lista.push({ id: 'cria', titulo: "Buen manejo de Pa' Cría", texto: `Ya separas ${String(Math.round(kgCria * 10) / 10).replace('.', ',')} kg pa' cría y abono. Sigue marcándolos claros pa' que nadie se confunda.` })
  }

  // 3) Modo Sin Celular o cuota.
  if (!sinCelular && plan !== 'formal') {
    lista.push({ id: 'celular', titulo: 'Modo Sin Celular', texto: 'Si no puedes sacar el celular en el puesto, prende el Modo Sin Celular en Inicio y contesta tus encargos desde la casa.' })
  } else if (plan === 'formal' && resumen.cuota > 0 && resumen.ingresos < resumen.cuota) {
    lista.push({ id: 'cuota', titulo: 'Tu cuota de la semana', texto: `Aún no cubres los $${new Intl.NumberFormat('es-CO').format(resumen.cuota)} de la cuota. Baja un poco el precio de lo que más se acumula y mira cómo sube lo recuperado.` })
  } else {
    lista.push({ id: 'ritmo', titulo: 'Vas bien', texto: 'Tus entregas de la semana ya cubren la cuota. Responde rápido en el chat: los compradores vuelven donde los atienden bien.' })
  }
  return lista.slice(0, 3)
}
