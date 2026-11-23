import { Star } from 'lucide-react'

// Solo lectura (valor) o editable (onChange). Estrellas llenas en ámbar; vacías en piedra.
export default function Estrellas({ valor, onChange, etiqueta, tam = 20 }) {
  if (!onChange) {
    return (
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${valor} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={tam} aria-hidden="true" className={n <= Math.round(valor) ? 'fill-ambar text-ambar' : 'text-stone-300'} />
        ))}
      </span>
    )
  }
  return (
    <div className="flex" role="radiogroup" aria-label={etiqueta}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
          onClick={() => onChange(n)}
          className="flex h-12 w-12 items-center justify-center"
        >
          <Star size={30} aria-hidden="true" className={n <= valor ? 'fill-ambar text-ambar' : 'text-stone-300'} />
        </button>
      ))}
    </div>
  )
}
