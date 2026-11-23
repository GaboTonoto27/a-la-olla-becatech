import { dinero } from '../../lib/dinero.js'
import { ciudadPorId } from '../../data/ciudades.js'

// Se mantiene por compatibilidad: formato en pesos colombianos.
export function pesos(valor) {
  return dinero(valor, 'bq')
}

// Precio normal tachado (pequeño) + precio de rescate grande en verde.
export default function Precio({ normal, rescate, unidad = 'kg', ciudad = 'bq' }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      {normal != null && normal > rescate && (
        <span className="text-sm text-piedra line-through">
          <span className="sr-only">Precio normal </span>
          {dinero(normal, ciudad)}
        </span>
      )}
      <span className="font-titulo text-3xl font-extrabold text-olla">
        {dinero(rescate, ciudad)}
        <span className="text-base font-bold">/{unidad}</span>
        <span className="ml-1 text-xs font-semibold text-piedra">{ciudadPorId(ciudad).codigo}</span>
      </span>
    </div>
  )
}
