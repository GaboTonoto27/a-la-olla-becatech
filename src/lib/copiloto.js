// Copiloto de moderación local ($0, sin API). Solo sugiere: la decisión final es siempre del Admin.
const norm = (t) => String(t ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const ALTA = [
  'extorsion', 'extorsionan', 'vacuna', 'estafa', 'estafador', 'amenaza', 'amenazo', 'robo', 'ladron',
  'podrido', 'podrida', 'descompuesto', 'vencido', 'intoxic', 'enferm', 'cobro adelantado', 'pago adelantado',
  'cobraron adelantado', 'me cobro antes',
]
const MEDIA = [
  'engano', 'enganar', 'mentira', 'mintio', 'falso', 'maltrato', 'grosero', 'irrespet', 'sucio', 'moho',
  'gusano', 'no cumplio', 'abuso', 'cobro de mas', 'no era lo que',
]
const OFENSIVAS = [
  'idiota', 'estupid', 'imbecil', 'hijueputa', 'hp', 'malparid', 'gonorrea', 'mierda', 'sinverguenza',
  'marica', 'carechimba',
]

const contiene = (t, lista) => lista.filter((w) => (w.length <= 2 ? new RegExp(`\\b${w}\\b`).test(t) : t.includes(w)))

export function esOfensivo(texto) {
  return contiene(norm(texto), OFENSIVAS).length > 0
}

// Gravedad según palabras clave. Un rechazo por calidad nunca baja de "media".
export function clasificar(texto, tipo) {
  const t = norm(texto)
  const alta = contiene(t, ALTA)
  const media = contiene(t, MEDIA)
  const ofensiva = contiene(t, OFENSIVAS)
  let nivel = 'baja'
  if (alta.length) nivel = 'alta'
  else if (media.length || ofensiva.length || tipo === 'rechazo') nivel = 'media'
  return { nivel, motivos: [...alta, ...media, ...ofensiva].slice(0, 4) }
}

export const ETIQUETA_NIVEL = { alta: 'Alta', media: 'Media', baja: 'Baja' }
const ESCALERA = ['desestimar', 'advertencia', 'suspender', 'expulsar']
export const ETIQUETA_MEDIDA = {
  desestimar: 'Desestimar',
  advertencia: 'Enviar advertencia oficial',
  suspender: 'Suspender 7 días',
  expulsar: 'Expulsar definitivamente',
}

// Sugiere la medida según gravedad y faltas previas (strikes). Alta sube un escalón, baja lo baja.
export function sugerirMedida(nivel, strikes = 0) {
  const base = Math.min(strikes, 2) + 1 // 1 advertencia, 2 suspender, 3 expulsar
  const idx = Math.max(0, Math.min(3, nivel === 'alta' ? base + 1 : nivel === 'baja' ? base - 1 : base))
  const medida = ESCALERA[idx]
  const faltas = strikes === 0 ? 'sin faltas previas' : `${strikes} ${strikes === 1 ? 'falta previa' : 'faltas previas'}`
  return { medida, razon: `Gravedad ${ETIQUETA_NIVEL[nivel].toLowerCase()} y ${faltas}.` }
}
