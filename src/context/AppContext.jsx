import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { guardar, leer, resetDemo as limpiarStore } from '../data/store.js'
import { ciudadPorId } from '../data/ciudades.js'
import * as reglas from '../lib/acciones.js'
import * as social from '../lib/social.js'
import * as dev from '../lib/devoluciones.js'
import { listaPuestos } from '../data/puestos.js'
import { generarRespuestaContextual } from '../lib/respuestasChat.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [estado, setEstado] = useState(() => reglas.iniciar(leer()))
  const ref = useRef(estado)
  ref.current = estado

  useEffect(() => guardar(estado), [estado])

  // Cada minuto se retiran solos los lotes que ya vencieron.
  useEffect(() => {
    const id = setInterval(() => {
      setEstado((e) => {
        const lotes = reglas.podar(e.lotes, Date.now())
        return lotes.length === e.lotes.length ? e : { ...e, lotes }
      })
    }, 60000)
    return () => clearInterval(id)
  }, [])

  const cuentas = estado.cuentas
  const cuentaPorId = useCallback((id) => cuentas.find((c) => c.id === id) ?? null, [cuentas])

  // Quien está dentro. Si el Admin lo suspende o expulsa, la sesión se cierra sola.
  const usuario = useMemo(() => {
    const c = cuentas.find((x) => x.id === estado.usuarioId) ?? null
    return c && !social.bloqueada(c) ? c : null
  }, [cuentas, estado.usuarioId])

  const ciudad = ciudadPorId('bq')
  const pactoAceptado = Boolean(usuario && estado.pactos[usuario.id])
  const modo = usuario?.rol === 'comprador' ? 'comprador' : usuario?.rol === 'vendedor' ? 'vendedor' : estado.modo

  // Puestos visibles: los de fábrica + los que creó la gente, sin los de cuentas suspendidas o expulsadas.
  const puestos = useMemo(
    () =>
      listaPuestos(estado.puestosExtra, estado.puestoOverrides).filter((p) => !social.bloqueada(cuentas.find((c) => c.id === p.id))),
    [estado.puestosExtra, estado.puestoOverrides, cuentas],
  )
  const puestoPorId = useCallback((id) => puestos.find((p) => p.id === id) ?? null, [puestos])
  const puestosDe = useCallback((ciudadId) => puestos.filter((p) => p.ciudad === ciudadId && p.tipo === 'puesto'), [puestos])
  const compradoresDe = useCallback((ciudadId) => puestos.filter((p) => p.ciudad === ciudadId && p.tipo === 'comprador'), [puestos])
  const miPuesto = usuario ? puestos.find((p) => p.id === usuario.id && p.tipo === 'puesto') ?? null : null

  // Lotes en vitrina: no se ven los de cuentas suspendidas o expulsadas.
  const lotes = useMemo(
    () => estado.lotes.filter((l) => !social.bloqueada(cuentas.find((c) => c.id === l.vendedorId))),
    [estado.lotes, cuentas],
  )

  // Aviso del navegador pa' el Admin, solo si él mismo lo activó.
  const avisarAdmin = useCallback((titulo, cuerpo) => {
    try {
      if (ref.current.pushAdmin && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(titulo, { body: cuerpo })
      }
    } catch {
      /* el navegador no deja avisar: no pasa nada */
    }
  }, [])

  // Aplica una regla pura al estado actual y devuelve su resultado (ej. el apartado con su código).
  const aplicar = useCallback((fn, ...args) => {
    const { estado: nuevo, resultado } = fn(ref.current, ...args)
    ref.current = nuevo
    setEstado(nuevo)
    return resultado
  }, [])

  const entrarCon = useCallback((cuenta) => {
    setEstado((e) => ({ ...e, usuarioId: cuenta.id, modo: cuenta.modoInicial }))
  }, [])

  const iniciarSesion = useCallback(
    (ident, clave) => {
      const r = social.validarLogin(ref.current.cuentas, ident, clave)
      if (r.ok) entrarCon(r.cuenta)
      return r
    },
    [entrarCon],
  )

  const registrar = useCallback(
    (datos) => {
      const r = aplicar(social.crearCuenta, { proveedor: 'clave', ...datos })
      if (r.ok) entrarCon(r.cuenta)
      return r
    },
    [aplicar, entrarCon],
  )

  // Google y Facebook simulados: la persona confirma sus datos y entra con su propio perfil.
  const entrarSimulado = useCallback(
    ({ proveedor, nombre, correo, barrio, rol }) => {
      const existe = ref.current.cuentas.find((c) => social.normalizarCorreo(c.correo) === social.normalizarCorreo(correo))
      if (existe) {
        const r = social.estadoEntrada(existe)
        if (r.ok) entrarCon(existe)
        return r
      }
      const vendedor = rol === 'vendedor' || rol === 'ambos'
      const r = aplicar(social.crearCuenta, {
        proveedor, nombre, correo, barrio, rol, perfilComprador: 'hogar',
        puesto: vendedor ? { nombre: `Puesto de ${nombre.trim().split(' ')[0]}`, formal: false, plan: 'popular', zona: true, nequi: false, sinCelular: false } : null,
      })
      if (r.ok) entrarCon(r.cuenta)
      return r
    },
    [aplicar, entrarCon],
  )

  const salir = useCallback(() => setEstado((e) => ({ ...e, usuarioId: null, modo: null })), [])
  const aceptarPacto = useCallback(() => {
    setEstado((e) => (e.usuarioId ? { ...e, pactos: { ...e.pactos, [e.usuarioId]: true } } : e))
  }, [])
  const toggleModo = useCallback(() => {
    setEstado((e) => ({ ...e, modo: e.modo === 'vendedor' ? 'comprador' : 'vendedor' }))
  }, [])
  const reiniciarDemo = useCallback(() => setEstado(reglas.iniciar(limpiarStore())), [])

  const sinCelular = useCallback(
    (vendedorId) => estado.sinCelular[vendedorId] ?? cuentas.find((c) => c.id === vendedorId)?.sinCelular ?? false,
    [estado.sinCelular, cuentas],
  )
  const cambiarSinCelular = useCallback(
    (vendedorId, valor) => setEstado((e) => ({ ...e, sinCelular: { ...e.sinCelular, [vendedorId]: valor } })),
    [],
  )

  // Estándares de un puesto: lo que el vendedor prendió hoy manda sobre lo de fábrica.
  const estandaresDe = useCallback(
    (vendedorId) => {
      const base = puestos.find((p) => p.id === vendedorId)?.estandares ?? {}
      const mios = estado.estandares[vendedorId] ?? {}
      return { ...base, ...mios, texto: mios.texto ?? '', actualizado: mios.actualizado ?? null }
    },
    [estado.estandares, puestos],
  )
  const cambiarEstandar = useCallback(
    (vendedorId, id, valor) =>
      setEstado((e) => ({
        ...e,
        estandares: {
          ...e.estandares,
          [vendedorId]: { ...e.estandares[vendedorId], [id]: valor, ...(id === 'texto' ? {} : { actualizado: Date.now() }) },
        },
      })),
    [],
  )

  // ---- Chat ----
  const enviarMensaje = useCallback(
    (chatId, texto) => {
      const yo = ref.current.usuarioId
      const c = ref.current.cuentas.find((x) => x.id === yo)
      const r = aplicar(social.enviarMensaje, chatId, yo, social.nombreVisible(c), texto)
      if (r.ok) {
        const chat = ref.current.chats.find((x) => x.id === chatId)
        const otro = yo === chat.compradorId ? chat.vendedorId : chat.compradorId
        const cuentaOtro = ref.current.cuentas.find((x) => x.id === otro)
        if (!cuentaOtro || cuentaOtro.demo) {
          setTimeout(() => {
            const vivo = ref.current.chats.find((x) => x.id === chatId)
            if (!vivo || vivo.bloqueadoPor) return
            const puesto = puestos.find((p) => p.id === otro)
            const esPuesto = otro === vivo.vendedorId
            const ultima = [...vivo.mensajes].reverse().find((m) => m.auto && m.de === otro)?.texto ?? ''
            const est = estandaresDe(otro)
            const respuesta = generarRespuestaContextual(texto, {
              nombre: puesto?.nombre ?? puesto?.pedidoComo ?? social.nombreVisible(cuentaOtro) ?? 'el puesto',
              esPuesto,
              nevera: Boolean(est.frio),
              nequi: Boolean(est.nequi) || (puesto?.pagos ?? []).some((p) => /nequi/i.test(p)),
              codigo: (vivo.contexto ?? '').match(/OLLA-\d+/)?.[0] ?? null,
              ultima,
            })
            const msg = { id: `m-r${Date.now()}`, de: otro, texto: respuesta, t: Date.now(), auto: true }
            const nuevo = { ...ref.current, chats: ref.current.chats.map((x) => (x.id === chatId ? { ...x, mensajes: [...x.mensajes, msg] } : x)) }
            ref.current = nuevo
            setEstado(nuevo)
          }, 1800)
        }
      }
      return r
    },
    [aplicar, avisarAdmin, puestos, estandaresDe],
  )

  const denunciar = useCallback(
    (d) => {
      const den = aplicar(social.crearDenuncia, d)
      avisarAdmin('A la Olla · Denuncia nueva', `${den.asunto} (gravedad ${den.gravedad})`)
      return den
    },
    [aplicar, avisarAdmin],
  )

  const crearResena = useCallback(
    (d) => {
      const r = aplicar(social.crearResena, ref.current.cuentas.find((c) => c.id === ref.current.usuarioId), d)
      if (r?.marcada) avisarAdmin('A la Olla · Comentario marcado', 'Una reseña tiene lenguaje ofensivo.')
      return r
    },
    [aplicar, avisarAdmin],
  )

  const crearTicket = useCallback(
    (d) => {
      const t = aplicar(social.crearTicket, { autorId: ref.current.usuarioId, autorNombre: social.nombreVisible(cuentas.find((c) => c.id === ref.current.usuarioId)), ...d })
      avisarAdmin('A la Olla · Ticket de soporte', t.asunto)
      return t
    },
    [aplicar, avisarAdmin, cuentas],
  )

  const solicitarDevolucion = useCallback(
    (d) => {
      const yo = ref.current.cuentas.find((c) => c.id === ref.current.usuarioId)
      const r = aplicar(dev.solicitarDevolucion, { autorId: yo?.id, autorNombre: yo?.nombre, ...d })
      if (r) avisarAdmin('A la Olla · Devolución solicitada', `${r.producto} · ${r.autorNombre}`)
      return r
    },
    [aplicar, avisarAdmin],
  )

  // ---- Avisos (punto terracota) ----
  const avisos = useMemo(() => {
    if (!usuario || usuario.rol === 'admin') return { chat: 0, ultima: false, pedidos: false }
    const apartadosPorAtender = estado.apartados.some((a) => a.vendedorId === usuario.id && a.estado === 'apartado')
    const ofertasNuevas = estado.pedidos.some((p) => p.compradorId === usuario.id && p.estado === 'abierto' && p.ofertas.length > 0)
    const vende = modo === 'vendedor'
    return {
      chat: social.chatsSinLeer(estado, usuario.id),
      ultima: vende && apartadosPorAtender,
      pedidos: !vende && ofertasNuevas,
    }
  }, [estado, usuario, modo])

  const sinLeerAdmin = usuario?.rol === 'admin' ? social.sinLeerAdmin(estado) : 0

  const valor = {
    cuentas,
    cuentaPorId,
    estandaresDe,
    cambiarEstandar,
    usuario,
    miPuesto,
    modo,
    ciudad,
    pactoAceptado,
    lotes,
    apartados: estado.apartados,
    pedidos: estado.pedidos,
    chats: estado.chats,
    resenas: estado.resenas,
    denuncias: estado.denuncias,
    tickets: estado.tickets,
    marcados: estado.marcados,
    devoluciones: estado.devoluciones ?? [],
    solicitarDevolucion,
    resolverDevolucion: (id, decision, nota) => aplicar(dev.resolverDevolucion, id, decision, nota),
    alertasCorreo: estado.alertasCorreo,
    plazas: estado.plazas,
    adminCorreo: estado.adminCorreo,
    pushAdmin: estado.pushAdmin,
    avisos,
    sinLeerAdmin,
    puestos,
    puestoPorId,
    puestosDe,
    compradoresDe,
    iniciarSesion,
    registrar,
    entrarSimulado,
    salir,
    aceptarPacto,
    toggleModo,
    reiniciarDemo,
    sinCelular,
    cambiarSinCelular,
    editarPuesto: (id, cambios) => aplicar(social.editarPuesto, id, cambios),
    publicarLote: (d) => aplicar(reglas.publicarLote, usuario, ciudad, d, miPuesto),
    retirarLote: (id) => aplicar(reglas.retirarLote, id),
    ajustarPrecio: (id, nuevo) => aplicar(reglas.ajustarPrecio, id, nuevo),
    apartar: (loteId, cantidad) => aplicar(reglas.apartar, usuario, loteId, cantidad),
    actualizarApartado: (id, nuevo) => aplicar(reglas.actualizarApartado, id, nuevo),
    crearPedido: (d) => aplicar(reglas.crearPedido, usuario, ciudad.id, d),
    responderPedido: (id, precioKg, acepta) => aplicar(reglas.responderPedido, id, usuario, precioKg, acepta, miPuesto?.nombre),
    elegirOferta: (pedidoId, ofertaId) => aplicar(reglas.elegirOferta, pedidoId, ofertaId),
    cerrarPedido: (id) => aplicar(reglas.cerrarPedido, id),
    abrirChat: (d) => aplicar(social.abrirChat, d),
    enviarMensaje,
    marcarLeido: (chatId) => aplicar(social.marcarLeido, chatId, ref.current.usuarioId),
    silenciarChat: (chatId) => aplicar(social.silenciarChat, chatId, ref.current.usuarioId),
    bloquearChat: (chatId) => aplicar(social.bloquearChat, chatId, ref.current.usuarioId),
    denunciar,
    crearResena,
    crearTicket,
    // Panel del Admin
    aplicarMedida: (id, medida) => aplicar(social.aplicarMedida, id, medida),
    guardarNotas: (id, notas) => aplicar(social.guardarNotas, id, notas),
    reactivarCuenta: (id) => aplicar(social.reactivarCuenta, id),
    revisarMarcado: (id) => aplicar(social.revisarMarcado, id),
    atenderTicket: (id) => aplicar(social.atenderTicket, id),
    agregarPlaza: (d) => aplicar(social.agregarPlaza, d),
    marcarTodoLeido: () => aplicar(social.marcarTodoLeido),
    cambiarAdminCorreo: (correo) => setEstado((e) => ({ ...e, adminCorreo: correo })),
    activarPush: async () => {
      if (!('Notification' in window)) return 'no-disponible'
      const permiso = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
      setEstado((e) => ({ ...e, pushAdmin: permiso === 'granted' }))
      return permiso
    },
  }
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
