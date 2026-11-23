import { MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { CIUDADES } from '../../data/ciudades.js'

// Cambia la plaza: Barranquilla es el piloto real, las demás muestran que A la Olla se replica.
export default function SelectorCiudad() {
  const { ciudad, cambiarCiudad } = useApp()
  return (
    <div className="border-t border-borde bg-white">
      <label className="mx-auto flex min-h-[48px] max-w-5xl items-center gap-2 px-4">
        <MapPin size={20} className="shrink-0 text-olla" aria-hidden="true" />
        <span className="sr-only">Ciudad y plaza</span>
        <select
          value={ciudad.id}
          onChange={(e) => cambiarCiudad(e.target.value)}
          className="min-h-[44px] w-full cursor-pointer bg-transparent text-base font-bold text-carbon"
        >
          {CIUDADES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.piloto ? `${c.nombre} · ${c.estado}` : `${c.nombre} · ${c.plaza}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
