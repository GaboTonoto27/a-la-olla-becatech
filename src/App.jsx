import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/layout/AppShell.jsx'

const Login = lazy(() => import('./pages/Login.jsx'))
const Inicio = lazy(() => import('./pages/Inicio.jsx'))
const Cuenta = lazy(() => import('./pages/Cuenta.jsx'))
const UltimaHora = lazy(() => import('./pages/UltimaHora.jsx'))
const PidePaTuOlla = lazy(() => import('./pages/PidePaTuOlla.jsx'))
const Puestos = lazy(() => import('./pages/Puestos.jsx'))
const PerfilPuesto = lazy(() => import('./pages/PerfilPuesto.jsx'))
const Mapa = lazy(() => import('./pages/Mapa.jsx'))
const NoEncontrado = lazy(() => import('./pages/NoEncontrado.jsx'))
const Chats = lazy(() => import('./pages/Chats.jsx'))
const Chat = lazy(() => import('./pages/Chat.jsx'))
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
  return usuario?.rol === 'admin' ? children : <Navigate to="/" replace state={{ restringido: true }} />
}

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequiereSesion />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<SoloUsuarios><Inicio /></SoloUsuarios>} />
            <Route path="/pedidos" element={<SoloUsuarios><PidePaTuOlla /></SoloUsuarios>} />
            <Route path="/ultima-hora" element={<SoloUsuarios><UltimaHora /></SoloUsuarios>} />
            <Route path="/puestos" element={<SoloUsuarios><Puestos /></SoloUsuarios>} />
            <Route path="/puesto/:id" element={<SoloUsuarios><PerfilPuesto /></SoloUsuarios>} />
            <Route path="/mapa" element={<SoloUsuarios><Mapa /></SoloUsuarios>} />
            <Route path="/chat" element={<SoloUsuarios><Chats /></SoloUsuarios>} />
            <Route path="/chat/:id" element={<SoloUsuarios><Chat /></SoloUsuarios>} />
            <Route path="/cuenta" element={<SoloUsuarios><Cuenta /></SoloUsuarios>} />
            <Route path="/admin/*" element={<SoloAdmin><AdminInicio /></SoloAdmin>} />
          </Route>
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </Suspense>
  )
}
