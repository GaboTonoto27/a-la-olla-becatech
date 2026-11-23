import { BadgeCheck, Check, X } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Pill from '../ui/Pill.jsx'
import Estrellas from './Estrellas.jsx'

function fecha(t) {
  return new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

// Reseñas de un puesto. Todas son de compras verificadas con código.
export default function ListaResenas({ resenas }) {
  if (resenas.length === 0) {
    return <p className="text-base text-piedra">Aún no hay reseñas. Solo opinan quienes ya revisaron y compraron con su código.</p>
  }
  return (
    <ul className="space-y-3">
      {resenas.map((r) => (
        <li key={r.id}>
          <Card className="space-y-2 !p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-base font-bold">{r.autorNombre}</p>
              <span className="text-sm text-piedra">{fecha(r.creado)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Estrellas valor={r.promedio} />
              <Pill tono="olla" icono={BadgeCheck}>Compra verificada en el puesto</Pill>
            </div>
            <p className="text-sm text-piedra">
              Puntualidad {r.puntualidad} · Trato {r.trato} · Aptitud {r.aptitud}
            </p>
            {r.cumplio !== null && (
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                {r.cumplio ? <Check size={16} className="text-olla" aria-hidden="true" /> : <X size={16} className="text-[#A8391B]" aria-hidden="true" />}
                {r.cumplio ? 'Cumplió los sellos que declaró' : 'No cumplió los sellos que declaró'}
              </p>
            )}
            {r.comentario && <p className="text-base">“{r.comentario}”</p>}
          </Card>
        </li>
      ))}
    </ul>
  )
}
