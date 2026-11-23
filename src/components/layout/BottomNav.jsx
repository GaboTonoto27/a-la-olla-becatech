import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { pestanasPara } from './navegacion.js'

export default function BottomNav() {
  const { modo } = useApp()
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-borde bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {pestanasPara(modo).map(({ to, etiqueta, icono: Icono, fin }) => (
        <NavLink
          key={to}
          to={to}
          end={fin}
          className={({ isActive }) =>
            `flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs font-bold ${
              isActive ? 'text-olla' : 'text-piedra'
            }`
          }
        >
          <Icono size={24} aria-hidden="true" />
          {etiqueta}
        </NavLink>
      ))}
    </nav>
  )
}
