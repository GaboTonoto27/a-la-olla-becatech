import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { guardar, leer, resetDemo as limpiarStore } from '../data/store.js'
import { buscarUsuario } from '../data/seed.js'
import { ciudadPorId } from '../data/ciudades.js'
import * as reglas from '../lib/acciones.js'

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

  const usuario = useMemo(() => buscarUsuario(estado.usuarioId), [estado.usuarioId])
  const ciudad = ciudadPorId(estado.ciudadId)
  const pactoAceptado = Boolean(usuario && estado.pactos[usuario.id])

  const entrar = useCallback((id) => {
    const u = buscarUsuario(id)
    if (u) setEstado((e) => ({ ...e, usuarioId: u.id, modo: u.modoInicial }))
  }, [])

  const salir = useCallback(() => setEstado((e) => ({ ...e, usuarioId: null, modo: null })), [])

  const aceptarPacto = useCallback(() => {
    setEstado((e) => (e.usuarioId ? { ...e, pactos: { ...e.pactos, [e.usuarioId]: true } } : e))
  }, [])

  const toggleModo = useCallback(() => {
    setEstado((e) => ({ ...e, modo: e.modo === 'vendedor' ? 'comprador' : 'vendedor' }))
  }, [])

  const reiniciarDemo = useCallback(() => setEstado(reglas.iniciar(limpiarStore())), [])

  const cambiarCiudad = useCallback((ciudadId) => setEstado((e) => ({ ...e, ciudadId })), [])

  // Aplica una regla pura al estado actual y devuelve su resultado (ej. el apartado con su código).
  const aplicar = useCallback((fn, ...args) => {
    const { estado: nuevo, resultado } = fn(ref.current, ...args)
    ref.current = nuevo
    setEstado(nuevo)
    return resultado
  }, [])

  const sinCelular = useCallback(
    (vendedorId) => estado.sinCelular[vendedorId] ?? buscarUsuario(vendedorId)?.sinCelular ?? false,
    [estado.sinCelular],
  )
  const cambiarSinCelular = useCallback(
    (vendedorId, valor) => setEstado((e) => ({ ...e, sinCelular: { ...e.sinCelular, [vendedorId]: valor } })),
    [],
  )

  const valor = {
    usuario,
    modo: estado.modo,
    ciudad,
    pactoAceptado,
    lotes: estado.lotes,
    apartados: estado.apartados,
    pedidos: estado.pedidos,
    entrar,
    salir,
    aceptarPacto,
    toggleModo,
    reiniciarDemo,
    cambiarCiudad,
    sinCelular,
    cambiarSinCelular,
    publicarLote: (d) => aplicar(reglas.publicarLote, usuario, ciudad, d),
    retirarLote: (id) => aplicar(reglas.retirarLote, id),
    apartar: (loteId, cantidad) => aplicar(reglas.apartar, usuario, loteId, cantidad),
    actualizarApartado: (id, nuevo) => aplicar(reglas.actualizarApartado, id, nuevo),
    crearPedido: (d) => aplicar(reglas.crearPedido, usuario, ciudad.id, d),
    responderPedido: (id, precioKg, acepta) => aplicar(reglas.responderPedido, id, usuario, precioKg, acepta),
    elegirOferta: (pedidoId, ofertaId) => aplicar(reglas.elegirOferta, pedidoId, ofertaId),
    cerrarPedido: (id) => aplicar(reglas.cerrarPedido, id),
  }
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
