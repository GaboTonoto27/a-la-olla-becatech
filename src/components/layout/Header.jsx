import { Link, NavLink } from 'react-router-dom'
import { ChefHat, Store } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Toggle from '../ui/Toggle.jsx'
import ZonaBar from './ZonaBar.jsx'
import Punto from '../ui/Punto.jsx'
import { pestanasPara } from './navegacion.js'

export default function Header() {
  const { usuario, modo, toggleModo, avisos } = useApp()
  const esAdmin = usuario?.rol === 'admin'
  const esVendedor = modo === 'vendedor'

  return (
    <header className="sticky top-0 z-30 border-b border-borde bg-marfil/95 backdrop-blur">
      <div className="mx-auto flex min-h-[64px] max-w-5xl items-center gap-3 px-4">
        <Link to={esAdmin ? '/admin' : '/'} className="inline-flex min-h-[48px] items-center font-titulo text-2xl font-extrabold text-olla">
          A la Olla
        </Link>

        {!esAdmin && (
          <nav aria-label="Escritorio" className="ml-6 hidden items-center gap-1 md:flex">
            {pestanasPara(modo, true).map(({ to, etiqueta, fin }) => (
              <NavLink
                key={to}
                to={to}
                end={fin}
                className={({ isActive }) =>
                  `inline-flex min-h-[48px] items-center rounded-full px-4 text-base font-bold ${
                    isActive ? 'bg-[#E7F1EA] text-olla' : 'text-piedra hover:bg-white hover:text-carbon'
                  }`
                }
              >
                {etiqueta}
                {to === '/ultima-hora' && avisos.ultima && <Punto className="ml-1.5" texto="Tienes apartados por atender" />}
                {to === '/chat' && avisos.chat > 0 && <Punto className="ml-1.5" texto={`${avisos.chat} ${avisos.chat === 1 ? "mensaje sin leer" : "mensajes sin leer"}`} />}
                {to === '/pedidos' && avisos.pedidos && <Punto className="ml-1.5" texto="Te respondieron un pedido" />}
              </NavLink>
            ))}
          </nav>
        )}

        {usuario?.rol === 'ambos' && (
          <div className="ml-auto flex items-center gap-2 rounded-full border border-borde bg-white py-1 pl-3 pr-2">
            <span
              className={`flex items-center gap-1 text-sm font-bold ${
                !esVendedor ? 'text-olla' : 'text-piedra'
              }`}
            >
              <ChefHat size={18} aria-hidden="true" /> Compro
            </span>
            <Toggle activo={esVendedor} onChange={toggleModo} etiqueta="Cambiar entre comprar y vender" />
            <span
              className={`flex items-center gap-1 text-sm font-bold ${
                esVendedor ? 'text-olla' : 'text-piedra'
              }`}
            >
              <Store size={18} aria-hidden="true" /> Vendo
            </span>
          </div>
        )}
      </div>
      {!esAdmin && <ZonaBar />}
    </header>
  )
}
