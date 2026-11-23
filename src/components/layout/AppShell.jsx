import { Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import BannerPrototipo from './BannerPrototipo.jsx'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'
import PactoCalidad from '../PactoCalidad.jsx'

export default function AppShell() {
  const { usuario, pactoAceptado } = useApp()
  const esAdmin = usuario?.rol === 'admin'

  return (
    <div className="min-h-dvh">
      <BannerPrototipo />
      <Header />
      <main className={`mx-auto max-w-5xl px-4 py-6 ${esAdmin ? '' : 'pb-28 md:pb-10'}`}>
        <Outlet />
      </main>
      {!esAdmin && <BottomNav />}
      {!pactoAceptado && <PactoCalidad />}
    </div>
  )
}
