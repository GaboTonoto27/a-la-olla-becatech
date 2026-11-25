// Reglas de cuentas, chat, reseñas, denuncias y soporte. Funciones puras: reciben el estado y devuelven el nuevo.
import { clasificar, esOfensivo, ETIQUETA_NIVEL } from './copiloto.js'
import { PERFILES_COMPRADOR } from '../data/seed.js'
import { correoValido } from './verificacion.js'
import { listaPuestos } from '../data/puestos.js'
import { RESPUESTAS_VACIAS, sugerirPlan, APROBACIONES } from './planPuesto.js'

const MIN = 60000
const DIA = 24 * 60 * MIN
const uid = (p) => `${p}-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
const CENTRO_BQ = [10.929, -74.8045]
const PAGO_EFECTIVO = 'Efectivo contra inspección (primero revisas, luego pagas)'

export const nombreVisible = (c) => (c?.negocio && c.negocio !== 'Hogar' ? c.negocio : `${c?.nombre ?? 'Alguien'} (Hogar)`)
export const vende = (c) => c?.rol === 'vendedor' || c?.rol === 'ambos'

// Una cuenta expulsada, o suspendida con días por cumplir, no puede entrar ni mostrar lotes.
export function bloqueada(c, ahora = Date.now()) {
  if (!c) return false
  if (c.estado === 'expulsado') return true
  return c.estado === 'suspendido' && (c.suspendidoHasta ?? 0) > ahora
}

export const normalizarCorreo = (t) => String(t ?? '').trim().toLowerCase()

// ---------- Cuentas ----------
export function validarLogin(cuentas, ident, clave, ahora = Date.now()) {
  const q = normalizarCorreo(ident)
  if (!q || !clave) return { ok: false, error: 'Escribe tu correo o usuario y tu contraseña.' }
  const c = cuentas.find((x) => normalizarCorreo(x.correo) === q || normalizarCorreo(x.nombre) === q)
  if (!c) return { ok: false, error: 'No encontramos esa cuenta. Revisa el correo o crea una cuenta nueva.' }
  if (c.proveedor !== 'clave' || c.clave == null) {
    return { ok: false, error: `Esta cuenta entra con ${c.proveedor === 'facebook' ? 'Facebook' : 'Google'}. Usa ese botón.` }
  }
  if (c.clave !== clave) return { ok: false, error: 'La contraseña no es correcta. Inténtalo otra vez.' }
  return estadoEntrada(c, ahora)
}

export function estadoEntrada(c, ahora = Date.now()) {
  if (c.estado === 'expulsado') {
    return { ok: false, error: 'Esta cuenta fue expulsada de A la Olla. Si crees que es un error, escribe a soporte.' }
  }
  if (bloqueada(c, ahora)) {
    const hasta = new Date(c.suspendidoHasta).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
    return { ok: false, error: `Esta cuenta está suspendida hasta el ${hasta}.` }
  }
  return { ok: true, cuenta: c }
}

// d: { nombre, correo, clave, barrio, rol, perfilComprador, proveedor, puesto? }
export function crearCuenta(e, d) {
  const correo = normalizarCorreo(d.correo)
  const nombre = String(d.nombre ?? '').trim()
  if (nombre.length < 2) return { estado: e, resultado: { ok: false, error: 'Escribe tu nombre.' } }
  if (!correoValido(correo)) return { estado: e, resultado: { ok: false, error: 'Escribe un correo válido, por ejemplo nombre@correo.com.' } }
  if (d.proveedor === 'clave' && String(d.clave ?? '').length < 6) {
    return { estado: e, resultado: { ok: false, error: 'La contraseña debe tener mínimo 6 letras o números.' } }
  }
  if (e.cuentas.some((c) => normalizarCorreo(c.correo) === correo)) {
    return { estado: e, resultado: { ok: false, error: 'Ese correo ya tiene cuenta. Entra desde "Iniciar sesión".' } }
  }
  const id = uid('u')
  const rol = d.rol
  const compra = rol === 'comprador' || rol === 'ambos'
  const perfil = compra ? (d.perfilComprador ?? 'hogar') : undefined
  const etiquetaPerfil = PERFILES_COMPRADOR.find((p) => p.id === perfil)?.etiqueta
  const p = vende({ rol }) ? d.puesto : null
  const cuenta = {
    id,
    nombre,
    correo,
    clave: d.proveedor === 'clave' ? d.clave : null,
    proveedor: d.proveedor ?? 'clave',
    rol,
    perfilComprador: perfil,
    barrio: d.barrio?.trim() || 'Ciudadela 20 de Julio',
    negocio: p ? p.nombre.trim() : perfil === 'hogar' ? 'Hogar' : `${nombre} · ${etiquetaPerfil ?? 'Comprador'}`,
    etiqueta: rol === 'vendedor' ? 'Vendedor' : rol === 'ambos' ? 'Compra y vende' : etiquetaPerfil ?? 'Comprador',
    detalle: '',
    modoInicial: rol === 'vendedor' ? 'vendedor' : 'comprador',
    plan: p?.plan,
    sinCelular: Boolean(p?.sinCelular),
    estado: 'activo',
    strikes: 0,
    suspendidoHasta: null,
    creado: Date.now(),
  }
  let puestosExtra = e.puestosExtra
  if (p) {
    const respuestas = p.respuestas ?? RESPUESTAS_VACIAS
    const formal = respuestas.refri === 'frio'
    puestosExtra = [
      ...puestosExtra,
      {
        id,
        ciudad: 'bq',
        tipo: 'puesto',
        nombre: p.nombre.trim(),
        barrio: cuenta.barrio,
        direccion: p.direccion?.trim() || 'Ubicación marcada en el mapa',
        descripcion: p.descripcion?.trim() || '',
        coord: p.coord ?? CENTRO_BQ,
        privacidad: p.zona ? 'zona' : 'exacto',
        formal,
        plan: sugerirPlan(respuestas).plan,
        fotos: p.fotos ?? [],
        horario: p.horario?.trim() || 'Lun a Sáb · 6:00 a. m. – 4:00 p. m.',
        dias: p.dias ?? [0, 1, 2, 3, 4, 5],
        horaAbre: p.horaAbre ?? 360,
        horaCierra: p.horaCierra ?? 960,
        pagos: p.nequi ? [PAGO_EFECTIVO, 'Nequi (opcional)'] : [PAGO_EFECTIVO],
        estandares: { frio: formal, tapada: false, techo: false, separa: false, domicilio: false, nequi: Boolean(p.nequi) },
        propio: true,
        respuestas,
        sugerido: sugerirPlan(respuestas),
        verificacion: { estado: 'prueba', nota: '', creado: Date.now() },
      },
    ]
  }
  return { estado: { ...e, cuentas: [...e.cuentas, cuenta], puestosExtra }, resultado: { ok: true, cuenta } }
}

// Datos propios de la cuenta (igual para demos, Google, Facebook y correo).
export function editarCuenta(e, id, cambios) {
  const c = e.cuentas.find((x) => x.id === id)
  if (!c) return { estado: e, resultado: false }
  const nuevo = { ...c, ...cambios }
  if (cambios.perfilComprador !== undefined && nuevo.rol !== 'vendedor' && nuevo.rol !== 'ambos') {
    const et = PERFILES_COMPRADOR.find((p) => p.id === nuevo.perfilComprador)?.etiqueta
    nuevo.negocio = nuevo.perfilComprador === 'hogar' ? 'Hogar' : `${nuevo.nombre} · ${et ?? 'Comprador'}`
    nuevo.etiqueta = et ?? 'Comprador'
  }
  return { estado: { ...e, cuentas: e.cuentas.map((x) => (x.id === id ? nuevo : x)) }, resultado: true }
}

// Puestos que el vendedor ya mandó a revisar y esperan al equipo.
export const pendientesVerificacion = (e) =>
  listaPuestos(e.puestosExtra, e.puestoOverrides).filter((p) => p.tipo === 'puesto' && p.verificacion?.estado === 'enviado')

const conVerificacion = (e, id, v, extra = {}) => ({
  ...e,
  puestoOverrides: { ...e.puestoOverrides, [id]: { ...e.puestoOverrides[id], ...extra, verificacion: v } },
})
const puestoDe = (e, id) => listaPuestos(e.puestosExtra, e.puestoOverrides).find((p) => p.id === id && p.tipo === 'puesto')

// El vendedor manda su puesto a revisión: pasa a la cola del Admin.
export function enviarVerificacion(e, id, ahora = Date.now()) {
  const p = puestoDe(e, id)
  if (!p) return { estado: e, resultado: false }
  const v = { ...(p.verificacion ?? {}), estado: 'enviado', enviadoEn: ahora, leida: false }
  return { estado: conVerificacion(e, id, v), resultado: true }
}

// El Admin aprueba con una tarifa definitiva (opId de APROBACIONES) o pide un ajuste con nota obligatoria.
export function resolverVerificacion(e, id, decision, nota = '', ahora = Date.now()) {
  const p = puestoDe(e, id)
  const limpia = String(nota ?? '').trim().slice(0, 300)
  if (!p) return { estado: e, resultado: { ok: false, error: 'No encontramos ese puesto.' } }
  const base = { ...(p.verificacion ?? {}), leida: true, resueltoEn: ahora, nota: limpia }
  if (decision === 'ajuste') {
    if (limpia.length < 3) return { estado: e, resultado: { ok: false, error: "Escribe una nota pa' que el vendedor sepa qué ajustar." } }
    return { estado: conVerificacion(e, id, { ...base, estado: 'ajuste' }), resultado: { ok: true, estado: 'ajuste' } }
  }
  const op = APROBACIONES.find((a) => a.id === decision)
  if (!op) return { estado: e, resultado: { ok: false, error: 'Opción no válida.' } }
  return {
    estado: conVerificacion(e, id, { ...base, estado: 'verificado', aprobado: op.id }, { plan: op.plan, tarifa: op.tarifa }),
    resultado: { ok: true, estado: 'verificado', op },
  }
}

export function editarPuesto(e, id, cambios) {
  return { estado: { ...e, puestoOverrides: { ...e.puestoOverrides, [id]: { ...e.puestoOverrides[id], ...cambios } } }, resultado: true }
}

// ---------- Chat ----------
export const llaveChat = (compradorId, vendedorId) => `${compradorId}__${vendedorId}`
const TELEFONO = /(?:\d[\s.\-()]*){7,}/

export function abrirChat(e, { compradorId, vendedorId, contexto }, ahora = Date.now()) {
  const id = llaveChat(compradorId, vendedorId)
  const hay = e.chats.find((c) => c.id === id)
  if (hay) {
    return { estado: contexto ? { ...e, chats: e.chats.map((c) => (c.id === id ? { ...c, contexto } : c)) } : e, resultado: id }
  }
  const chat = { id, compradorId, vendedorId, contexto: contexto ?? '', mensajes: [], silenciado: {}, bloqueadoPor: null, leido: {}, creado: ahora }
  return { estado: { ...e, chats: [chat, ...e.chats] }, resultado: id }
}

// motivo: 'bloqueado' | 'telefono' | 'vacio' | null (enviado)
export function enviarMensaje(e, chatId, de, deNombre, texto, ahora = Date.now()) {
  const t = String(texto ?? '').trim()
  const chat = e.chats.find((c) => c.id === chatId)
  if (!chat || !t) return { estado: e, resultado: { ok: false, motivo: 'vacio' } }
  if (chat.bloqueadoPor) return { estado: e, resultado: { ok: false, motivo: 'bloqueado' } }
  if (TELEFONO.test(t)) return { estado: e, resultado: { ok: false, motivo: 'telefono' } }
  const msg = { id: uid('m'), de, texto: t.slice(0, 400), t: ahora }
  let estado = {
    ...e,
    chats: e.chats.map((c) => (c.id === chatId ? { ...c, mensajes: [...c.mensajes, msg], leido: { ...c.leido, [de]: ahora } } : c)),
  }
  if (esOfensivo(t)) {
    const otro = de === chat.compradorId ? chat.vendedorId : chat.compradorId
    estado = marcarComentario(estado, {
      origen: 'chat', autorId: de, autorNombre: deNombre, objetivoId: otro, objetivoNombre: nombreDe(estado, otro), texto: t,
    }, ahora).estado
  }
  return { estado, resultado: { ok: true, msg } }
}

const nombreDe = (e, id) => {
  const c = e.cuentas.find((x) => x.id === id)
  return c ? nombreVisible(c) : id
}

export function marcarLeido(e, chatId, uidUsuario, ahora = Date.now()) {
  const chat = e.chats.find((c) => c.id === chatId)
  if (!chat || (chat.leido[uidUsuario] ?? 0) >= (chat.mensajes.at(-1)?.t ?? 0)) return { estado: e, resultado: false }
  return { estado: { ...e, chats: e.chats.map((c) => (c.id === chatId ? { ...c, leido: { ...c.leido, [uidUsuario]: ahora } } : c)) }, resultado: true }
}

export function silenciarChat(e, chatId, uidUsuario) {
  return {
    estado: { ...e, chats: e.chats.map((c) => (c.id === chatId ? { ...c, silenciado: { ...c.silenciado, [uidUsuario]: !c.silenciado[uidUsuario] } } : c)) },
    resultado: true,
  }
}

export function bloquearChat(e, chatId, uidUsuario) {
  return {
    estado: {
      ...e,
      chats: e.chats.map((c) => {
        if (c.id !== chatId) return c
        if (c.bloqueadoPor && c.bloqueadoPor !== uidUsuario) return c
        return { ...c, bloqueadoPor: c.bloqueadoPor ? null : uidUsuario }
      }),
    },
    resultado: true,
  }
}

// Mensajes sin leer pa' un usuario (no cuenta los chats silenciados).
export function chatsSinLeer(e, uidUsuario) {
  return e.chats.filter((c) => {
    if (c.silenciado[uidUsuario] || (c.compradorId !== uidUsuario && c.vendedorId !== uidUsuario)) return false
    const visto = c.leido[uidUsuario] ?? 0
    return c.mensajes.some((m) => m.de !== uidUsuario && m.t > visto)
  }).length
}

// ---------- Alertas pa' el Admin ----------
function alertaCorreo(e, { denunciaId, asunto, infractor, gravedad, evidencia }, ahora) {
  const alerta = {
    id: uid('al'),
    denunciaId,
    para: e.adminCorreo,
    asunto: `URGENTE · Gravedad ${ETIQUETA_NIVEL[gravedad].toLowerCase()} · ${asunto}`,
    infractor,
    gravedad,
    evidencia: String(evidencia).slice(0, 400),
    creado: ahora,
  }
  return { ...e, alertasCorreo: [alerta, ...e.alertasCorreo] }
}

// Alerta de prueba pa' comprobar que el correo del Admin está bien (no es una denuncia real).
export function alertaPrueba(e, ahora = Date.now()) {
  if (!e.adminCorreo) return { estado: e, resultado: null }
  const alerta = {
    id: uid('al'),
    denunciaId: null,
    prueba: true,
    para: e.adminCorreo,
    asunto: 'PRUEBA · Alerta de prueba de A la Olla',
    infractor: 'Sin infractor (es solo una prueba)',
    gravedad: 'baja',
    evidencia: 'Si recibes esto, el correo de alertas quedó bien configurado.',
    creado: ahora,
  }
  return { estado: { ...e, alertasCorreo: [alerta, ...e.alertasCorreo] }, resultado: alerta }
}

// tipo: sitio | chat | rechazo | engano
export function crearDenuncia(e, d, ahora = Date.now()) {
  const { nivel, motivos } = clasificar(`${d.asunto} ${d.detalle}`, d.tipo)
  const den = {
    id: uid('d'),
    tipo: d.tipo,
    autorId: d.autorId,
    autorNombre: d.autorNombre,
    objetivoId: d.objetivoId,
    objetivoNombre: d.objetivoNombre,
    asunto: d.asunto.trim(),
    detalle: d.detalle.trim(),
    ref: d.ref ?? '',
    gravedad: nivel,
    motivos,
    estado: 'nueva',
    notaComprador: '',
    notaVendedor: '',
    resolucion: null,
    leida: false,
    creado: ahora,
  }
  let estado = { ...e, denuncias: [den, ...e.denuncias] }
  estado = alertaCorreo(estado, { denunciaId: den.id, asunto: den.asunto, infractor: den.objetivoNombre, gravedad: nivel, evidencia: den.detalle }, ahora)
  return { estado, resultado: den }
}

// Comentario o mensaje que el filtro de lenguaje ofensivo marcó pa' revisión.
export function marcarComentario(e, d, ahora = Date.now()) {
  const { nivel } = clasificar(d.texto, 'comentario')
  const gravedad = nivel === 'baja' ? 'media' : nivel
  const m = {
    id: uid('mk'),
    origen: d.origen,
    autorId: d.autorId,
    autorNombre: d.autorNombre,
    objetivoId: d.objetivoId,
    objetivoNombre: d.objetivoNombre,
    texto: d.texto.slice(0, 300),
    gravedad,
    revisado: false,
    leida: false,
    creado: ahora,
  }
  let estado = { ...e, marcados: [m, ...e.marcados] }
  estado = alertaCorreo(estado, { asunto: `Comentario marcado (${d.origen === 'chat' ? 'chat' : 'reseña'})`, infractor: d.autorNombre, gravedad, evidencia: d.texto }, ahora)
  return { estado, resultado: m }
}

export function guardarNotas(e, id, notas) {
  return { estado: { ...e, denuncias: e.denuncias.map((d) => (d.id === id ? { ...d, ...notas } : d)) }, resultado: true }
}

export function aplicarMedida(e, denunciaId, medida, ahora = Date.now()) {
  const den = e.denuncias.find((d) => d.id === denunciaId)
  if (!den) return { estado: e, resultado: false }
  let cuentas = e.cuentas
  let lotes = e.lotes
  const castiga = medida !== 'desestimar'
  if (castiga) {
    cuentas = cuentas.map((c) => {
      if (c.id !== den.objetivoId || c.rol === 'admin') return c
      const strikes = (c.strikes ?? 0) + 1
      if (medida === 'advertencia') return { ...c, strikes, estado: c.estado === 'activo' ? 'advertido' : c.estado }
      if (medida === 'suspender') return { ...c, strikes, estado: 'suspendido', suspendidoHasta: ahora + 7 * DIA }
      return { ...c, strikes, estado: 'expulsado', suspendidoHasta: null }
    })
  }
  if (medida === 'suspender' || medida === 'expulsar') {
    lotes = lotes.map((l) => (l.vendedorId === den.objetivoId ? { ...l, retirado: true } : l))
  }
  const denuncias = e.denuncias.map((d) => (d.id === denunciaId ? { ...d, estado: 'resuelta', resolucion: medida, resueltoEn: ahora, leida: true } : d))
  return { estado: { ...e, cuentas, lotes, denuncias }, resultado: true }
}

// El Admin devuelve la cuenta a "Activo". Los lotes de demostración vuelven a la vitrina.
export function reactivarCuenta(e, id, ahora = Date.now()) {
  return {
    estado: {
      ...e,
      cuentas: e.cuentas.map((c) => (c.id === id ? { ...c, estado: 'activo', suspendidoHasta: null } : c)),
      lotes: e.lotes.map((l) =>
        l.vendedorId === id && l.demo
          ? { ...l, retirado: false, creado: ahora, vence: ahora + l.minutos * MIN, cantidad: l.cantidadInicial }
          : l,
      ),
    },
    resultado: true,
  }
}

export function revisarMarcado(e, id) {
  return { estado: { ...e, marcados: e.marcados.map((m) => (m.id === id ? { ...m, revisado: true, leida: true } : m)) }, resultado: true }
}

export function marcarTodoLeido(e) {
  return {
    estado: {
      ...e,
      denuncias: e.denuncias.map((d) => ({ ...d, leida: true })),
      tickets: e.tickets.map((t) => ({ ...t, leida: true })),
      marcados: e.marcados.map((m) => ({ ...m, leida: true })),
      devoluciones: (e.devoluciones ?? []).map((d) => ({ ...d, leida: true })),
      puestoOverrides: Object.fromEntries(
        Object.entries(e.puestoOverrides).map(([k, o]) => [k, o.verificacion ? { ...o, verificacion: { ...o.verificacion, leida: true } } : o]),
      ),
      puestosExtra: e.puestosExtra.map((p) => (p.verificacion ? { ...p, verificacion: { ...p.verificacion, leida: true } } : p)),
    },
    resultado: true,
  }
}

export const sinLeerAdmin = (e) =>
  e.denuncias.filter((d) => !d.leida).length +
  e.tickets.filter((t) => !t.leida).length +
  e.marcados.filter((m) => !m.leida).length +
  (e.devoluciones ?? []).filter((d) => !d.leida).length +
  pendientesVerificacion(e).filter((p) => !p.verificacion.leida).length

// ---------- Soporte ----------
export function crearTicket(e, d, ahora = Date.now()) {
  const t = {
    id: uid('t'),
    autorId: d.autorId,
    autorNombre: d.autorNombre,
    correo: d.correo ?? '',
    asunto: (d.asunto?.trim() || 'Necesito ayuda').slice(0, 90),
    mensaje: d.mensaje.trim(),
    estado: 'abierto',
    leida: false,
    creado: ahora,
  }
  return { estado: { ...e, tickets: [t, ...e.tickets] }, resultado: t }
}

export function atenderTicket(e, id) {
  return { estado: { ...e, tickets: e.tickets.map((t) => (t.id === id ? { ...t, estado: 'atendido', leida: true } : t)) }, resultado: true }
}

// ---------- Reseñas verificadas ----------
// Solo se puede calificar una compra ya revisada y llevada ("Lo revisé y me lo llevo") y una sola vez por código.
export function puedeResenar(e, apartado, usuarioId) {
  return apartado.estado === 'entregado' && apartado.comprador.id === usuarioId && !e.resenas.some((r) => r.apartadoId === apartado.id)
}

export function crearResena(e, usuario, d, ahora = Date.now()) {
  const a = e.apartados.find((x) => x.id === d.apartadoId)
  if (!a || !puedeResenar(e, a, usuario.id)) return { estado: e, resultado: null }
  const nota = (n) => Math.max(1, Math.min(5, Math.round(n || 5)))
  const p = nota(d.puntualidad)
  const t = nota(d.trato)
  const ap = nota(d.aptitud)
  const comentario = String(d.comentario ?? '').trim().slice(0, 300)
  const r = {
    id: uid('r'),
    puestoId: a.vendedorId,
    puesto: a.puesto,
    apartadoId: a.id,
    codigo: a.codigo,
    autorId: usuario.id,
    autorNombre: a.comprador.nombre,
    puntualidad: p,
    trato: t,
    aptitud: ap,
    promedio: Math.round(((p + t + ap) / 3) * 10) / 10,
    comentario,
    cumplio: d.cumplio ?? null,
    marcada: Boolean(comentario) && esOfensivo(comentario),
    creado: ahora,
  }
  let estado = { ...e, resenas: [r, ...e.resenas] }
  if (r.marcada) {
    estado = marcarComentario(estado, {
      origen: 'resena', autorId: usuario.id, autorNombre: a.comprador.nombre, objetivoId: a.vendedorId, objetivoNombre: a.puesto, texto: comentario,
    }, ahora).estado
  }
  return { estado, resultado: r }
}

export function promedioPuesto(resenas, puestoId) {
  const lista = resenas.filter((r) => r.puestoId === puestoId)
  if (!lista.length) return null
  return { promedio: Math.round((lista.reduce((s, r) => s + r.promedio, 0) / lista.length) * 10) / 10, total: lista.length }
}
