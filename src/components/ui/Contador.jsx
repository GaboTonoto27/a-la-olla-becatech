import { Minus, Plus } from 'lucide-react'
import { unidadTexto } from '../../lib/unidades.js'

// Contador grande con + y − (cada botón de 48 px) pa' kilos y cantidades.
export default function Contador({ valor, onChange, min = 1, max = 999, paso = 1, unidad = 'kg', etiqueta }) {
  const baja = () => onChange(Math.max(min, +(valor - paso).toFixed(2)))
  const sube = () => onChange(Math.min(max, +(valor + paso).toFixed(2)))
  const boton =
    'flex h-12 w-12 items-center justify-center rounded-xl border border-olla bg-white text-olla disabled:opacity-40'
  return (
    <div className="flex items-center gap-3" role="group" aria-label={etiqueta}>
      <button type="button" className={boton} onClick={baja} disabled={valor <= min} aria-label="Quitar uno">
        <Minus size={22} aria-hidden="true" />
      </button>
      <span className="min-w-[5.5rem] text-center font-titulo text-3xl font-extrabold" aria-live="polite">
        {valor} <span className="text-base font-bold text-piedra">{unidadTexto(valor, unidad)}</span>
      </span>
      <button type="button" className={boton} onClick={sube} disabled={valor >= max} aria-label="Agregar uno">
        <Plus size={22} aria-hidden="true" />
      </button>
    </div>
  )
}
