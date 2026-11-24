// Respuestas automáticas del chat de demostración. $0: reglas locales, sin APIs ni librerías.
// contexto: { nombre, esPuesto, nevera, nequi, codigo, ultima } (ultima = último mensaje automático, pa' no repetirlo).

const norm = (t) => String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim()
const tiene = (t, re) => re.test(t)

const RE = {
  codigo: /\bolla[- ]?(\d{2,4})\b/,
  saludo: /^(hola|holi|buenas|buenos dias|buen dia|buenas tardes|buenas noches|que mas|quiubo|ey)\b/,
  apartado: /\bapartad[oa]\b|\btrae tu codigo\b|\blleva tu codigo\b/,
  espero: /\bte espero\b|\bte esperamos\b|\bte aguardo\b/,
  camino: /\b(saliendo|salgo|en camino|voy en camino|ya voy)\b/,
  recoger: /\brecog|\brecoj|\bpasar por\b|\bpaso por\b/,
  tiempo: /\b(espera|esperas|esperame|guard\w*|minutos?|min|saliendo|salgo|camino|llego|llegue|llegando|llegamos|tarde|ya voy)\b/,
  pago: /\b(pago|pagar|pagas|nequi|efectivo|transferencia|transferir|qr|plata|tarjeta|daviplata)\b/,
  calidad: /\b(fresco|fresca|frescos|maduro|madura|maduros|bueno|buena|buenos|danado|danada|podrido|podrida|estado|calidad|sano|sana|golpeado|machucado)\b/,
  precio: /\b(precio|precios|cuanto|cuesta|vale|rebaja|rebajas|descuento|barato|barata|kilo|kilos|kg|libra|remate)\b/,
  ubicacion: /\b(donde|direccion|ubicacion|ubicado|llegar|mapa|lejos|cerca|queda|como voy)\b/,
  gracias: /\b(gracias|mil gracias|listo|chao|chau|adios|hasta luego|vale|dale|ok|okay|perfecto|bacano|de una|hecho)\b/,
}

// Elige una variante que no sea la última enviada.
function elegir(opciones, ultima) {
  const libres = opciones.filter((o) => o !== ultima)
  const lista = libres.length ? libres : opciones
  return lista[Math.floor(Math.random() * lista.length)]
}

export function intencion(texto) {
  const t = norm(texto)
  if (tiene(t, RE.codigo)) return 'codigo'
  if (tiene(t, RE.saludo)) return 'saludo'
  if (tiene(t, RE.recoger)) return 'recoger'
  if (tiene(t, RE.apartado)) return 'apartado'
  if (tiene(t, RE.espero)) return 'espero'
  if (tiene(t, RE.camino)) return 'camino'
  if (tiene(t, RE.tiempo)) return 'tiempo'
  if (tiene(t, RE.pago)) return 'pago'
  if (tiene(t, RE.calidad)) return 'calidad'
  if (tiene(t, RE.precio)) return 'precio'
  if (tiene(t, RE.ubicacion)) return 'ubicacion'
  if (tiene(t, RE.gracias)) return 'gracias'
  return 'otro'
}

export function generarRespuestaContextual(texto, contexto = {}) {
  const t = norm(texto)
  const { nombre = 'el puesto', esPuesto = true, nevera = false, nequi = false, codigo = null, ultima = '' } = contexto
  const tipo = intencion(t)
  const codigoMsg = (t.match(RE.codigo) ?? [])[1]
  const llego = /\bllegu?e\b|\bllegando\b|\bllegamos\b/.test(t)

  switch (tipo) {
    case 'codigo':
      return elegir(
        [`Ya anoté el OLLA-${codigoMsg}. Lo tengo listo para entregar.`, `Listo, vi tu OLLA-${codigoMsg}. Aquí lo tengo separado pa' que lo revises.`],
        ultima,
      )
    case 'saludo':
      return esPuesto
        ? elegir([`¡Buenas! Le habla ${nombre}. ¿En qué le puedo ayudar?`, `¡Hola, qué más! ${nombre} a la orden. ¿Qué necesita?`], ultima)
        : elegir([`¡Buenas! Por aquí ${nombre}. ¿Cómo va todo?`, `¡Hola! Quedo atento, ¿qué me cuentas?`], ultima)
    case 'apartado':
      return esPuesto
        ? elegir([`Sí, ya está apartado${codigo ? ` con tu código ${codigo}` : ''}. Pasa cuando quieras.`, 'Claro, aquí lo tengo apartado. Trae tu código y lo revisas.'], ultima)
        : elegir(['Perfecto, ya voy con mi código y efectivo.', '¡Listo! Voy con el código en la mano y la plata en efectivo.'], ultima)
    case 'espero':
      return esPuesto
        ? elegir(['Aquí te espero, con calma.', 'Dale, aquí estoy atento.'], ultima)
        : elegir(['Dale, ya voy saliendo. Gracias por esperarme.', '¡Gracias! Ya casi llego.'], ultima)
    case 'camino':
      return esPuesto
        ? elegir([`¡Listo! Aquí te lo tengo apartado${codigo ? ` con tu código ${codigo}` : ' con tu código'}.`, 'Dale, aquí te espero. Ya lo tengo separado.'], ultima)
        : elegir(['Perfecto, aquí te espero.', 'Dale, sin afán.'], ultima)
    case 'recoger':
      if (!esPuesto) return elegir(['¡Súper! Ya voy saliendo con mi código y efectivo.', '¡Qué bueno! Salgo ya con el código y la plata en efectivo.'], ultima)
      return elegir(["Perfecto, aquí lo tienes listo pa' revisar.", "Dale, ven cuando quieras que aquí lo tengo listo pa' que lo revises."], ultima)
    case 'tiempo':
      if (llego) return elegir(['Ya te atiendo, un momento.', '¡Ya te vi! Un momentico y te atiendo.'], ultima)
      if (!esPuesto) return elegir(['¡Gracias! Llego en menos de 15 minutos.', 'Dale, gracias por guardármelo. Ya llego.'], ultima)
      return codigo
        ? elegir([`Dale, te lo guardo un rato con el código ${codigo}. Pasa con él.`, `Listo, queda guardado con el ${codigo}. Muéstramelo cuando llegues.`], ultima)
        : elegir(['Dale, te lo guardo un rato. Pasa cuando puedas.', 'Listo, te lo dejo separado un momento.'], ultima)
    case 'pago':
      if (!esPuesto) return elegir(['Yo pago en efectivo cuando revise la comida.', 'Pago al recoger, después de revisar todo.'], ultima)
      return nequi
        ? elegir(['Aquí recibimos efectivo o Nequi con comprobante. Primero revisas, luego pagas.', 'Se puede en efectivo o por Nequi mostrando el comprobante. Eso sí: primero revisas la comida.'], ultima)
        : elegir(['Aquí es solo efectivo, contra inspección: primero revisas y después pagas.', 'Solo recibimos efectivo. Revisa la comida y ahí mismo pagas.'], ultima)
    case 'calidad':
      if (!esPuesto) return elegir(["Cuando la revise y esté sana, me la llevo.", "La miro bien en el puesto antes de pagar."], ultima)
      return elegir(
        [
          `Es comida Pa' Cocina: sana, solo de mal aspecto${nevera ? ' y la guardamos en nevera' : ''}. Primero la revisas con tus propios ojos y después pagas.`,
          `Está sana para cocinar, nada podrido. Aquí la revisas tú mismo antes de pagar${nevera ? '; estuvo en nevera' : ''}.`,
        ],
        ultima,
      )
    case 'precio':
      if (!esPuesto) return elegir(['Quedamos en el precio que sale en la app; lo confirmo en el puesto.', 'Me sirve el precio de rescate. Lo confirmamos allá.'], ultima)
      return elegir(
        ['Ya tiene precio de rescate (remate). Lo confirmamos en el puesto cuando vengas.', 'Ese es el precio de remate que ves en la app. En el puesto lo confirmamos.'],
        ultima,
      )
    case 'ubicacion':
      if (!esPuesto) return elegir(['Ando cerca, te aviso cuando esté llegando.', "Ya voy pa' allá, tranquilo."], ultima)
      return elegir(
        ['Mira el mapa de la app: ahí sale el puesto con el botón "Cómo llegar". Al apartar ves el punto exacto.', 'Te guías por el mapa. Cuando apartas te sale la ubicación exacta.'],
        ultima,
      )
    case 'gracias':
      return elegir(['¡Con mucho gusto! Por aquí a la orden.', '¡Listo, te esperamos!', '¡A ti, que Dios te bendiga! Quedamos pendientes.'], ultima)
    default:
      return elegir(
        [
          'Recibido. Te confirmo en un momento.',
          '¿Me repites eso? Quiero responderte bien.',
          'Cuéntame más y te ayudo de una. También puedes usar los mensajes rápidos de abajo.',
        ],
        ultima,
      )
  }
}
