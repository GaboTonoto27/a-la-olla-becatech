import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { pestanasPara } from './navegacion.js'
import Punto from '../ui/Punto.jsx'

export default function BottomNav() {
  const { modo, avisos } = useApp()
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
          <span className="relative">
            <Icono size={24} aria-hidden="true" />
            {to === '/ultima-hora' && avisos.ultima && <Punto className="absolute -right-1.5 -top-0.5" texto="Tienes apartados por atender" />}
            {to === '/pedidos' && avisos.pedidos && <Punto className="absolute -right-1.5 -top-0.5" texto="Te respondieron un pedido" />}
          </span>
          {etiqueta}
        </NavLink>
      ))}
    </nav>
  )
}
