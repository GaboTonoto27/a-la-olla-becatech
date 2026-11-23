// Preguntas frecuentes del Asistente 24/7. Todo corre en el celular ($0, sin API): se busca por palabras clave.
export const HORARIO_SOPORTE = 'Lunes a sábado, de 6:00 a. m. a 4:00 p. m.'

export const PREGUNTAS = [
  {
    id: 'apartar',
    pregunta: '¿Cómo aparto gratis?',
    claves: ['apartar', 'aparto', 'reservar', 'guardar', 'gratis', 'codigo', 'olla-'],
    pasos: [
      'Entra a "Última hora" y busca el lote que te sirve.',
      'Toca "Apartar gratis" y elige cuántos kilos quieres.',
      'Te sale un código OLLA-###. No pagas nada todavía.',
      'Llega al puesto, dile el código y revisa la comida con tus ojos.',
      'Si te gusta, toca "Lo revisé y me lo llevo" y pagas en efectivo. Si no, rechazas sin pagar.',
    ],
  },
  {
    id: 'pago',
    pregunta: '¿Pago por adelantado?',
    claves: ['pago', 'pagar', 'adelantado', 'efectivo', 'nequi', 'plata', 'cobran', 'cobro'],
    pasos: [
      'No. Nadie paga por adelantado en A la Olla.',
      'Pagas en efectivo cuando ya revisaste la comida en el puesto.',
      'Los puestos formales pueden aceptar Nequi con comprobante, pero siempre es opcional.',
      'Si alguien te pide plata antes, no se la des y denúncialo desde el chat.',
    ],
  },
  {
    id: 'nivel',
    pregunta: "¿Qué es Pa' Cocina vs Pa' Cría?",
    claves: ['cocina', 'cria', 'pulpa', 'abono', 'cerdos', 'gallinas', 'nivel', 'etiqueta'],
    pasos: [
      "Pa' Cocina / Pulpa (100% sano): es comida buena, solo fea por fuera. Se come en guiso, jugo o sopa.",
      "Pa' Cría / Abono: es lo que ya no sirve pa' la mesa, pero sí pa' cerdos, gallinas o abono.",
      'Nunca se vende como comida de mesa algo podrido o vencido. El puesto lo marca claro antes de publicar.',
    ],
  },
  {
    id: 'sincelular',
    pregunta: 'Trabajo sin celular en el puesto',
    claves: ['celular', 'telefono', 'casa', 'inseguridad', 'extorsion', 'sin celular', 'robo'],
    pasos: [
      'Entra a la pantalla de inicio de vendedor y prende "Modo Sin Celular en Puesto".',
      'Contestas los encargos desde tu casa, en tu horario (por ejemplo 5 a 7 a. m. y 8 a 9 p. m.).',
      "Los compradores ven el aviso \"Este puesto contesta desde la casa\" y saben que no es pa' el momento.",
      'Tu dirección exacta se esconde hasta que alguien aparta. Así cuidas tu seguridad.',
    ],
  },
  {
    id: 'costo',
    pregunta: '¿Cuánto cuesta para vendedores?',
    claves: ['cuesta', 'cuota', 'plan', 'precio', 'cobra', 'suscripcion', 'comision', 'formal', 'popular', 'semana'],
    pasos: [
      'Plan Formal (puesto con nevera): $10.000 COP por semana.',
      'Plan Popular (puesto informal): entre $0 y $3.000 COP por semana, según lo que recuperes.',
      'La cuota solo corre desde tu primera entrega. Antes de eso no pagas nada.',
      'El Formal sube entre 5% y 10% solo si pasas de 100 ventas en la semana.',
      'Mira en "Mi cuenta" cuánto ganaste frente a la cuota.',
    ],
  },
  {
    id: 'publicar',
    pregunta: '¿Cómo publico en 3 toques?',
    claves: ['publicar', 'publico', 'sobrante', 'sobra', 'lote', 'vender', 'toques', 'vitrina'],
    pasos: [
      'Cambia a "Vendo" y entra a "Última hora".',
      'Toque 1: elige qué te sobró. Toque 2: cuántos kilos. Toque 3: el precio de rescate.',
      "Marca por qué está feo, pa' qué sirve y confirma que está apto pa' comer.",
      'El lote se retira solo a la hora de cierre. No necesitas fotos de la fruta.',
    ],
  },
  {
    id: 'feo',
    pregunta: '¿Y si llega feo o dañado?',
    claves: ['feo', 'danado', 'podrido', 'mal', 'rechazar', 'rechazo', 'engano', 'queja', 'denunciar', 'denuncia'],
    pasos: [
      'No pagues. Toca "Rechazar por calidad / Denunciar engaño" en tu apartado.',
      'Cuéntanos en pocas palabras qué pasó. Le llega en vivo a la coordinación.',
      'Escuchamos a las dos partes. Si hubo engaño, el puesto recibe una advertencia, suspensión o expulsión.',
    ],
  },
  {
    id: 'estandares',
    pregunta: '¿Qué son los sellos del puesto?',
    claves: ['sello', 'sellos', 'estandar', 'nevera', 'refrigeracion', 'frio', 'canastilla', 'techo'],
    pasos: [
      'Son lo que cada puesto dice que cumple: nevera o cuarto frío, canastilla tapada, bajo techo, separa maduros.',
      'El vendedor los prende o apaga en 1 toque cuando algo cambia (si se daña la nevera, por ejemplo).',
      'Tú los ves en cada puesto, puedes filtrar por ellos y, al calificar, contar si lo cumplió.',
    ],
  },
  {
    id: 'llegar',
    pregunta: '¿Cómo llego al puesto?',
    claves: ['llegar', 'ruta', 'direccion', 'mapa', 'waze', 'google', 'donde', 'ubicacion'],
    pasos: [
      'Por seguridad la dirección exacta de algunos puestos aparece al apartar.',
      'Con tu código activo, entra al puesto o al mapa y toca "Cómo llegar (Google Maps)" o "Abrir en Waze".',
      'Antes de apartar ves una zona aproximada en el mapa.',
    ],
  },
]

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Busca la pregunta que más se parece a lo que escribió la persona.
export function buscarRespuesta(texto) {
  const q = norm(texto).trim()
  if (q.length < 3) return null
  const palabras = q.split(/[^a-z0-9-]+/).filter((p) => p.length >= 3)
  let mejor = null
  let puntaje = 0
  for (const p of PREGUNTAS) {
    const n = p.claves.filter((c) => q.includes(c) || palabras.some((w) => w.length >= 4 && c.startsWith(w.slice(0, 5)))).length
    if (n > puntaje) {
      puntaje = n
      mejor = p
    }
  }
  return mejor
}

// Horario de soporte: lunes a sábado, 6:00 a. m. a 4:00 p. m.
export function enHorario(fecha = new Date()) {
  const d = fecha.getDay()
  const h = fecha.getHours() + fecha.getMinutes() / 60
  return d >= 1 && d <= 6 && h >= 6 && h < 16
}
