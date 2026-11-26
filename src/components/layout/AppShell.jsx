import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import BannerPrototipo from './BannerPrototipo.jsx'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'
import PactoCalidad from '../PactoCalidad.jsx'
import AyudanteFlotante from '../ayuda/AyudanteFlotante.jsx'
import Toast from '../ui/Toast.jsx'
import AvisosCuenta from '../cuenta/AvisosCuenta.jsx'

export default function AppShell() {
  const { usuario, pactoAceptado } = useApp()
  const { state } = useLocation()
  const esAdmin = usuario?.rol === 'admin'

  return (
    <div className={`min-h-dvh ${esAdmin ? '' : 'fondo-navidad'}`}>
      <BannerPrototipo />
      <Header />
      <main className={`mx-auto max-w-5xl px-4 py-6 ${esAdmin ? '' : 'pb-28 md:pb-10'}`}>
        {state?.restringido && (
          <p role="alert" className="mb-5 flex items-start gap-2 rounded-2xl border border-[#EBCFA6] bg-[#FBEFDD] p-4 text-base font-bold">
            <Lock size={22} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
            Acceso restringido: esa pantalla es solo pa' la coordinación de A la Olla.
          </p>
        )}
        {!esAdmin && <AvisosCuenta />}
        {/* Suspense aquí: si la página tarda en cargar, el Pacto y el menú no se desmontan (no se pierden las casillas marcadas). */}
        <Suspense fallback={<p className="p-8 text-center text-lg font-semibold text-piedra">Cargando…</p>}>
          <Outlet />
        </Suspense>
      </main>
      {!esAdmin && <BottomNav />}
      {!esAdmin && <AyudanteFlotante />}
      {!pactoAceptado && <PactoCalidad />}
      <Toast />
    </div>
  )
}
