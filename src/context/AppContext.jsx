import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { guardar, leer, resetDemo as limpiarStore } from '../data/store.js'
import { buscarUsuario } from '../data/seed.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [estado, setEstado] = useState(leer)

  useEffect(() => guardar(estado), [estado])

  const usuario = useMemo(() => buscarUsuario(estado.usuarioId), [estado.usuarioId])
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

  const reiniciarDemo = useCallback(() => setEstado(limpiarStore()), [])

  const valor = {
    usuario,
    modo: estado.modo,
    pactoAceptado,
    entrar,
    salir,
    aceptarPacto,
    toggleModo,
    reiniciarDemo,
  }
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider')
  return ctx
}
