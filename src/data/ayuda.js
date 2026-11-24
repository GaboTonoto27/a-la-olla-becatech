// Preguntas frecuentes del Asistente 24/7. Todo corre en el celular ($0, sin API): se busca por palabras clave.
export const HORARIO_SOPORTE = 'Lunes a sábado, de 6:00 a. m. a 4:00 p. m.'

export const PREGUNTAS = [
  {
    id: 'apartar',
    perfil: 'comprador',
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
    perfil: 'comprador',
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
    perfil: 'todos',
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
    perfil: 'vendedor',
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
    perfil: 'vendedor',
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
    perfil: 'vendedor',
    pregunta: "¿Cómo uso 'Pon pa' la olla'?",
    claves: ['publicar', 'publico', 'sobrante', 'sobra', 'lote', 'vender', 'toques', 'vitrina', 'pon', 'remate'],
    pasos: [
      "Entra a \"Pon pa' la olla\" (si compras y vendes, primero cambia a \"Vendo\" arriba).",
      'Toque 1: elige qué te sobró. Toque 2: cuántos kilos. Toque 3: el precio de rescate.',
      "Marca por qué está feo, pa' qué sirve y confirma que está apto pa' comer.",
      'El lote se retira solo a la hora de cierre. No necesitas fotos de la fruta.',
    ],
  },
  {
    id: 'feo',
    perfil: 'comprador',
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
    perfil: 'todos',
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
    perfil: 'comprador',
    pregunta: '¿Cómo llego al puesto?',
    claves: ['llegar', 'ruta', 'direccion', 'mapa', 'waze', 'google', 'donde', 'ubicacion'],
    pasos: [
      'Por seguridad la dirección exacta de algunos puestos aparece al apartar.',
      'Con tu código activo, entra al puesto o al mapa y toca "Cómo llegar (Google Maps)" o "Abrir en Waze".',
      'Antes de apartar ves una zona aproximada en el mapa.',
    ],
  },
  {
    id: 'privacidad',
    perfil: 'todos',
    pregunta: '¿Quién ve mi número y mi ubicación?',
    claves: ['privacidad', 'seguridad', 'numero', 'telefono', 'whatsapp', 'ubicacion', 'datos', 'seguro', 'quien ve'],
    pasos: [
      'Nadie ve tu número ni tu WhatsApp: el chat es dentro de la app y si alguien intenta pasarlo, se bloquea el mensaje.',
      'La ubicación exacta de un puesto solo aparece cuando alguien aparta. Antes se ve una zona aproximada.',
      'Si algo no te gusta, puedes silenciar, bloquear o denunciar el chat desde el menú de la conversación.',
    ],
  },
  {
    id: 'horario',
    perfil: 'todos',
    pregunta: '¿Cuál es el horario de la plaza?',
    claves: ['horario', 'hora', 'abre', 'abren', 'cierra', 'cierran', 'plaza', 'cerrada', 'demostracion'],
    pasos: [
      'La plaza atiende de 5:00 a. m. a 4:00 p. m.',
      'Cada lote tiene su reloj y se retira solo cuando se acaba el tiempo.',
      "Si abres la app fuera de ese horario, verás los remates en modo demostración pa' probar el prototipo.",
    ],
  },
  {
    id: 'resenas',
    perfil: 'comprador',
    pregunta: '¿Cómo dejo una reseña verificada?',
    claves: ['resena', 'resenas', 'calificar', 'calificacion', 'estrellas', 'opinion', 'verificada', 'comentario'],
    pasos: [
      'Solo puedes calificar un puesto después de llevarte un lote con tu código OLLA-###. Por eso son verificadas.',
      "Dale de 1 a 5 estrellas a puntualidad, trato y aptitud pa' cocinar.",
      'Cuéntanos si el puesto cumplió los sellos que declaró. Los comentarios ofensivos se revisan.',
    ],
  },
  {
    id: 'pdf',
    perfil: 'vendedor',
    pregunta: '¿Cómo bajo mi reporte semanal en PDF?',
    claves: ['pdf', 'reporte', 'semanal', 'descargar', 'ganancias', 'ganancia', 'cuanto gane', 'insights', 'consejos'],
    pasos: [
      'Entra a "Ganancias" (o a Mi cuenta) y baja hasta "Tu semana de ventas".',
      'Toca "Descargar reporte semanal (PDF)": trae tus kilos, lo que recuperaste y tu cuota.',
      "Más abajo en 'Ganancias' ves consejos pa' tu puesto según tus propios números.",
    ],
  },
  {
    id: 'validar',
    perfil: 'vendedor',
    pregunta: '¿Cómo valido el código OLLA-###?',
    claves: ['validar', 'codigo', 'olla-', 'entregar', 'entrega', 'comprador llego', 'confirmar', 'apartado'],
    pasos: [
      "Cuando alguien aparta, te sale en 'Pon pa' la olla', sección 'Apartados por atender', con su código OLLA-###.",
      'Cuando llegue, pídele el código y confírmalo. Que revise la comida con sus ojos.',
      'Si le gusta, él toca "Lo revisé y me lo llevo" y te paga en efectivo. Si no, rechaza sin pagar.',
    ],
  },
]

const norm = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Busca la pregunta que más se parece a lo que escribió la persona.
export function buscarRespuesta(texto, lista = PREGUNTAS) {
  const q = norm(texto).trim()
  if (q.length < 3) return null
  const palabras = q.split(/[^a-z0-9-]+/).filter((p) => p.length >= 3)
  let mejor = null
  let puntaje = 0
  for (const p of lista) {
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

// Generales siempre; las de comprador o vendedor según la vista activa. Sin vista (sin sesión) se muestran todas.
export function preguntasPara(modo) {
  if (modo !== 'comprador' && modo !== 'vendedor') return PREGUNTAS
  return PREGUNTAS.filter((p) => p.perfil === 'todos' || p.perfil === modo)
}

// Las que se muestran primero en cada perfil.
export const DESTACADAS = {
  comprador: ['apartar', 'pago', 'nivel', 'feo', 'privacidad'],
  vendedor: ['publicar', 'sincelular', 'costo', 'pdf', 'validar'],
}
