// Autodeclaración objetiva del puesto → plan sugerido. El equipo confirma la tarifa definitiva.
export const TARIFAS = { formal: 10000, concurrido: 3000, estandar: 1500, solidario: 0 }

export const RESPUESTAS_VACIAS = { espacio: 'caseta', refri: 'ambiente', operacion: 'familiar', concurrido: false }

export const PREGUNTAS = [
  {
    id: 'espacio',
    titulo: '1. ¿Qué tipo de espacio tienes?',
    opciones: [
      { id: 'fijo', titulo: 'Local fijo bajo techo', detalle: 'Con paredes o techo propio.' },
      { id: 'caseta', titulo: 'Caseta, andén o puesto popular', detalle: 'En la calle o en la plaza.' },
    ],
  },
  {
    id: 'refri',
    titulo: '2. ¿Cómo guardas la comida?',
    opciones: [
      { id: 'frio', titulo: 'Cuarto frío o neveras comerciales', detalle: 'Tienes refrigeración de negocio.' },
      { id: 'ambiente', titulo: 'Sin refrigeración, al ambiente', detalle: 'Todo se vende el mismo día.' },
    ],
  },
  {
    id: 'operacion',
    titulo: '3. ¿Cómo trabajas?',
    opciones: [
      { id: 'formal', titulo: 'Local formal con caja y personal', detalle: 'Hay empleados y caja registradora.' },
      { id: 'familiar', titulo: 'Puesto familiar o individual', detalle: 'Atiende la familia o una sola persona.' },
    ],
  },
]

// Local fijo + refrigeración comercial → Formal. Todo lo demás → Popular ($3.000 si es muy concurrido, $1.500 si es pequeño).
export function sugerirPlan(r = RESPUESTAS_VACIAS) {
  if (r.espacio === 'fijo' && r.refri === 'frio') {
    return { plan: 'formal', tarifa: TARIFAS.formal, etiqueta: 'Plan Formal', precio: '$10.000 COP/sem', motivo: 'Local fijo con refrigeración comercial.' }
  }
  if (r.concurrido) {
    return { plan: 'popular', tarifa: TARIFAS.concurrido, etiqueta: 'Plan Popular', precio: '$3.000 COP/sem', motivo: 'Puesto popular, muy concurrido o conocido.' }
  }
  return { plan: 'popular', tarifa: TARIFAS.estandar, etiqueta: 'Plan Popular', precio: '$1.500 COP/sem', motivo: 'Puesto pequeño, familiar o al ambiente.' }
}

// Respuestas de un puesto que todavía no las tiene (los de fábrica): se deducen de si es formal o no.
export const respuestasDe = (p) => p?.respuestas ?? (p?.formal ? { espacio: 'fijo', refri: 'frio', operacion: 'formal', concurrido: false } : RESPUESTAS_VACIAS)

export const tarifaDe = (p) => p?.tarifa ?? (p?.plan === 'formal' ? TARIFAS.formal : TARIFAS.estandar)

export const ESTADOS = {
  prueba: { texto: 'Pendiente de verificación (en prueba)', tono: 'ambar' },
  enviado: { texto: 'En revisión del equipo', tono: 'frio' },
  verificado: { texto: 'Puesto verificado', tono: 'olla' },
  ajuste: { texto: 'Ajuste solicitado', tono: 'tomate' },
}

export const APROBACIONES = [
  { id: 'formal', plan: 'formal', tarifa: TARIFAS.formal, etiqueta: 'Aprobar · Plan Formal ($10.000/sem)', nombre: 'Plan Formal' },
  { id: 'concurrido', plan: 'popular', tarifa: TARIFAS.concurrido, etiqueta: 'Aprobar · Plan Popular concurrido ($3.000/sem)', nombre: 'Plan Popular concurrido' },
  { id: 'estandar', plan: 'popular', tarifa: TARIFAS.estandar, etiqueta: 'Aprobar · Plan Popular estándar ($1.500/sem)', nombre: 'Plan Popular estándar' },
  { id: 'solidario', plan: 'popular', tarifa: TARIFAS.solidario, etiqueta: 'Aprobar · Plan Popular solidario ($0/sem)', nombre: 'Plan Popular solidario' },
]

export const METODO = { google: 'Google', facebook: 'Facebook', clave: 'Correo y contraseña' }
export const metodoDe = (c) => (c?.demo ? 'Demo' : METODO[c?.proveedor] ?? 'Correo y contraseña')
