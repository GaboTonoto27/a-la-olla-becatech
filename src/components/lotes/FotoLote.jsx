import { Apple, Carrot, Leaf, Store } from 'lucide-react'

const ICONOS = { fruta: Apple, verdura: Carrot, hoja: Leaf }
const FONDOS = { fruta: 'bg-[#FBEFDD] text-ambar', verdura: 'bg-[#E7F1EA] text-olla', hoja: 'bg-[#E2EFE0] text-olla' }

// Foto del puesto limpio (nunca de la fruta fea). Sin foto: panel con ícono, igual en todas las plazas.
export default function FotoLote({ lote, className = 'h-36' }) {
  if (lote.foto) {
    return (
      <img
        src={lote.foto}
        alt={`Puesto ${lote.puesto}`}
        loading="lazy"
        className={`w-full rounded-t-2xl object-cover ${className}`}
      />
    )
  }
  const Icono = ICONOS[lote.cat] ?? Store
  return (
    <div className={`flex w-full flex-col items-center justify-center gap-1 rounded-t-2xl ${FONDOS[lote.cat] ?? FONDOS.fruta} ${className}`}>
      <Icono size={44} aria-hidden="true" />
      <span className="flex items-center gap-1 text-sm font-semibold text-piedra">
        <Store size={14} aria-hidden="true" /> {lote.puesto}
      </span>
    </div>
  )
}
