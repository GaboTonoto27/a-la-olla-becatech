import { Link } from 'react-router-dom'
import { Map, MapPin, MessageCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Punto from '../ui/Punto.jsx'

// La app es local: se opera en una sola zona. Aquí queda a la vista y el atajo al chat seguro.
export default function ZonaBar() {
  const { ciudad, avisos } = useApp()
  return (
    <div className="border-t border-borde bg-white">
      <div className="mx-auto flex min-h-[48px] max-w-5xl items-center gap-2 px-4">
        <MapPin size={20} className="shrink-0 text-olla" aria-hidden="true" />
        <p className="min-w-0 flex-1 truncate text-base font-bold text-carbon">
          {ciudad.nombre} · {ciudad.plaza} y alrededores
        </p>
        <Link to="/mapa" className="flex min-h-[48px] shrink-0 items-center gap-1.5 rounded-xl px-2 text-base font-bold text-olla hover:bg-marfil md:hidden">
          <Map size={22} aria-hidden="true" />
          Mapa
        </Link>
        <Link
          to="/chat"
          className="relative flex min-h-[48px] shrink-0 items-center gap-1.5 rounded-xl px-2 text-base font-bold text-olla hover:bg-marfil md:hidden"
        >
          <MessageCircle size={22} aria-hidden="true" />
          Chat
          {avisos.chat > 0 && <Punto className="absolute right-0 top-2" texto={`${avisos.chat} ${avisos.chat === 1 ? "mensaje sin leer" : "mensajes sin leer"}`} />}
        </Link>
      </div>
    </div>
  )
}
