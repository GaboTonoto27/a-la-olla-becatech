import { textoRestante } from './tiempo.js'

// Horario real de la plaza: 5:00 a. m. a 4:00 p. m. (hora del navegador).
export const HORA_APERTURA = 5
export const HORA_CIERRE_PLAZA = 16
export const HORARIO_TEXTO = '5:00 a. m. – 4:00 p. m.'

export function plazaAbierta(ahora = Date.now()) {
  const h = new Date(ahora).getHours()
  return h >= HORA_APERTURA && h < HORA_CIERRE_PLAZA
}

export const AVISO_PLAZA_CERRADA = `Plaza cerrada ahora (horario real: ${HORARIO_TEXTO}) · Mostrando remates en modo demostración para probar el prototipo.`

// "Quedan 45 min" con la plaza abierta; "Simulación de cierre · Quedan 45 min" cuando está cerrada.
export function textoRestanteLote(vence, ahora = Date.now()) {
  const t = textoRestante(vence, ahora)
  return plazaAbierta(ahora) || vence <= ahora ? t : `Simulación de cierre · ${t}`
}
