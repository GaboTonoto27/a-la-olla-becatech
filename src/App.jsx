import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/layout/AppShell.jsx'

const Login = lazy(() => import('./pages/Login.jsx'))
const Inicio = lazy(() => import('./pages/Inicio.jsx'))
const Cuenta = lazy(() => import('./pages/Cuenta.jsx'))
const Proximamente = lazy(() => import('./pages/Proximamente.jsx'))
const NoEncontrado = lazy(() => import('./pages/NoEncontrado.jsx'))
const AdminInicio = lazy(() => import('./pages/admin/AdminInicio.jsx'))

function Cargando() {
  return <p className="p-8 text-center text-lg font-semibold text-piedra">Cargando…</p>
}

function RequiereSesion() {
  const { usuario } = useApp()
  return usuario ? <Outlet /> : <Navigate to="/login" replace />
}

// Solo vendedores y compradores; el administrador tiene su propio panel.
function SoloUsuarios({ children }) {
  const { usuario } = useApp()
  return usuario?.rol === 'admin' ? <Navigate to="/admin" replace /> : children
}

function SoloAdmin({ children }) {
  const { usuario } = useApp()
  return usuario?.rol === 'admin' ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequiereSesion />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<SoloUsuarios><Inicio /></SoloUsuarios>} />
            <Route path="/pedidos" element={<SoloUsuarios><Proximamente titulo="Pide pa' tu olla" /></SoloUsuarios>} />
            <Route path="/ultima-hora" element={<SoloUsuarios><Proximamente titulo="Última hora" /></SoloUsuarios>} />
            <Route path="/mapa" element={<SoloUsuarios><Proximamente titulo="Mapa de puestos" /></SoloUsuarios>} />
            <Route path="/cuenta" element={<SoloUsuarios><Cuenta /></SoloUsuarios>} />
            <Route path="/admin/*" element={<SoloAdmin><AdminInicio /></SoloAdmin>} />
          </Route>
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </Suspense>
  )
}
