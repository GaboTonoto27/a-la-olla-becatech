const formato = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })

export function pesos(valor) {
  return '$' + formato.format(valor)
}

// Precio normal tachado (pequeño) + precio de rescate grande en verde.
export default function Precio({ normal, rescate, unidad = 'kg' }) {
  return (
    <div className="flex items-baseline gap-2">
      {normal != null && (
        <span className="text-sm text-piedra line-through">{pesos(normal)}</span>
      )}
      <span className="font-titulo text-3xl font-extrabold text-olla">
        {pesos(rescate)}
        <span className="text-base font-bold">/{unidad}</span>
      </span>
    </div>
  )
}
