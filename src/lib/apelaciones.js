// Avisos al vendedor (notificación push simulada) y tickets de apelación de tarifa. Todo son reglas puras sobre el estado.
import { listaPuestos } from '../data/puestos.js'
import { APROBACIONES } from './planPuesto.js'

export const MOTIVOS = [
  { id: 'ventas', etiqueta: 'Mis ventas no cubren esta cuota' },
  { id: 'infra', etiqueta: 'Mi infraestructura es menor a la evaluada' },
  { id: 'temporal', etiqueta: 'Situación temporal / solicito tramo solidario' },
  { id: 'otro', etiqueta: 'Otro' },
]

const plata = (n) => `$${new Intl.NumberFormat('es-CO').format(n)}`
export const avisosDe = (e) => e.avisosCuenta ?? []
export const apelacionesDe = (e) => e.apelaciones ?? []
const puestoDe = (e, id) => listaPuestos(e.puestosExtra, e.puestoOverrides).find((p) => p.id === id && p.tipo === 'puesto')
const conPuesto = (e, id, cambios) => ({ ...e, puestoOverrides: { ...e.puestoOverrides, [id]: { ...e.puestoOverrides[id], ...cambios } } })

// Deja un aviso pendiente para una cuenta: aparece arriba cuando entra.
export function agregarAviso(e, cuentaId, aviso, ahora = Date.now()) {
  const nuevo = { id: `av-${ahora}-${avisosDe(e).length}`, cuentaId, vista: false, creado: ahora, ...aviso }
  return { ...e, avisosCuenta: [nuevo, ...avisosDe(e)] }
}

export function marcarAvisoVisto(e, id) {
  return { estado: { ...e, avisosCuenta: avisosDe(e).map((a) => (a.id === id ? { ...a, vista: true } : a)) }, resultado: true }
}

// Avisos que dejó la verificación del Admin (aprobar o pedir ajuste).
export function avisoDeVerificacion(e, id, res, nota, ahora = Date.now()) {
  if (!res?.ok) return e
  const texto = String(nota ?? '').trim()
  return res.estado === 'ajuste'
    ? agregarAviso(e, id, { tipo: 'ajuste', titulo: 'Tu puesto necesita un ajuste', nota: texto }, ahora)
    : agregarAviso(e, id, { tipo: 'verificado', titulo: `Tu puesto fue verificado · Tarifa asignada: ${plata(res.op.tarifa)}/sem`, nota: texto }, ahora)
}

// El vendedor abre un ticket pa' que revisen su tarifa. Solo si ya tiene una asignada y no hay otro abierto.
export function abrirApelacion(e, d, ahora = Date.now()) {
  const p = puestoDe(e, d.puestoId)
  const texto = String(d.texto ?? '').trim().slice(0, 400)
  const motivo = MOTIVOS.find((m) => m.id === d.motivo)
  if (!p || typeof p.tarifa !== 'number') return { estado: e, resultado: { ok: false, error: 'Tu puesto aún no tiene una tarifa asignada.' } }
  if (p.apelacion?.estado === 'abierta') return { estado: e, resultado: { ok: false, error: 'Ya tienes un ticket de revisión abierto.' } }
  if (!motivo) return { estado: e, resultado: { ok: false, error: 'Elige el motivo.' } }
  if (texto.length < 5) return { estado: e, resultado: { ok: false, error: "Cuéntanos con tus palabras por qué (mínimo 5 letras)." } }
  const folio = `TK-${String(apelacionesDe(e).length + 1).padStart(3, '0')}`
  const t = {
    id: `ap-${ahora}`,
    folio,
    puestoId: p.id,
    puestoNombre: p.nombre,
    autorId: d.autorId,
    autorNombre: d.autorNombre,
    motivo: motivo.id,
    motivoTexto: motivo.etiqueta,
    texto,
    tarifaActual: p.tarifa,
    estado: 'abierta',
    leida: false,
    creado: ahora,
  }
  const estado = conPuesto({ ...e, apelaciones: [t, ...apelacionesDe(e)] }, p.id, { apelacion: { id: t.id, folio, estado: 'abierta' } })
  return { estado, resultado: { ok: true, ticket: t } }
}

// El Admin responde: mantiene la tarifa (decision 'mantener') o la cambia (id de APROBACIONES), siempre con nota.
export function resolverApelacion(e, id, decision, nota, ahora = Date.now()) {
  const t = apelacionesDe(e).find((x) => x.id === id)
  const limpia = String(nota ?? '').trim().slice(0, 300)
  if (!t || t.estado !== 'abierta') return { estado: e, resultado: { ok: false, error: 'Ese ticket ya no está abierto.' } }
  if (limpia.length < 3) return { estado: e, resultado: { ok: false, error: "Escribe una nota de resolución pa' el vendedor." } }
  const op = decision === 'mantener' ? null : APROBACIONES.find((a) => a.id === decision)
  if (decision !== 'mantener' && !op) return { estado: e, resultado: { ok: false, error: 'Opción no válida.' } }
  const tarifaNueva = op ? op.tarifa : t.tarifaActual
  const hecho = { ...t, estado: 'resuelta', leida: true, resueltoEn: ahora, resolucion: limpia, tarifaNueva, cambio: tarifaNueva !== t.tarifaActual }
  let estado = { ...e, apelaciones: apelacionesDe(e).map((x) => (x.id === id ? hecho : x)) }
  estado = conPuesto(estado, t.puestoId, { apelacion: { id, folio: t.folio, estado: 'resuelta' }, ...(op ? { plan: op.plan, tarifa: op.tarifa } : {}) })
  const titulo = hecho.cambio
    ? `Revisamos tu ticket ${t.folio} · Tu nueva tarifa: ${plata(tarifaNueva)}/sem`
    : `Revisamos tu ticket ${t.folio} · Se mantiene tu tarifa: ${plata(tarifaNueva)}/sem`
  estado = agregarAviso(estado, t.autorId, { tipo: 'apelacion', titulo, nota: limpia }, ahora)
  return { estado, resultado: { ok: true, ticket: hecho } }
}

export const apelacionesSinLeer = (e) => apelacionesDe(e).filter((a) => a.estado === 'abierta' && !a.leida).length
