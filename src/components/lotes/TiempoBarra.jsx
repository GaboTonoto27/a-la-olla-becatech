import { Clock } from 'lucide-react'
import { textoRestante, tonoRestante } from '../../lib/tiempo.js'

const COLORES = { olla: 'bg-olla', ambar: 'bg-ambar', tomate: 'bg-tomate' }
const TEXTO = { olla: 'text-olla', ambar: 'text-ambar', tomate: 'text-[#A8391B]' }

// Reloj de caducidad: barra que se vacía y texto con el tiempo que queda.
export default function TiempoBarra({ lote, ahora }) {
  const tono = tonoRestante(lote.vence, ahora)
  const total = Math.max(1, lote.vence - lote.creado)
  const pct = Math.max(4, Math.min(100, ((lote.vence - ahora) / total) * 100))
  return (
    <div>
      <p className={`mb-1 flex items-center gap-1.5 text-sm font-bold ${TEXTO[tono]}`}>
        <Clock size={16} aria-hidden="true" /> {textoRestante(lote.vence, ahora)}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-stone-200" aria-hidden="true">
        <div className={`h-full rounded-full ${COLORES[tono]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
