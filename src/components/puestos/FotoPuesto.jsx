import { Store } from 'lucide-react'

// Foto del puesto limpio (nunca de la fruta fea). Sin foto: panel limpio con ícono.
export default function FotoPuesto({ puesto, indice = 0, className = 'h-40' }) {
  const foto = puesto.fotos?.[indice]
  if (foto) {
    return <img src={foto} alt={`Puesto ${puesto.nombre}`} loading="lazy" className={`w-full object-cover ${className}`} />
  }
  return (
    <div className={`flex w-full flex-col items-center justify-center gap-1 bg-[#E7F1EA] text-olla ${className}`}>
      <Store size={44} aria-hidden="true" />
      <span className="text-sm font-semibold text-piedra">{puesto.nombre}</span>
    </div>
  )
}
