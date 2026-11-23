const TONOS = {
  neutro: 'bg-white text-piedra border-borde',
  olla: 'bg-[#E7F1EA] text-olla border-[#BCD8C5]',
  frio: 'bg-[#E2F1F5] text-frio border-[#B5D9E3]',
  ambar: 'bg-[#FBEFDD] text-ambar border-[#EBCFA6]',
  tomate: 'bg-[#FBE9E3] text-[#A8391B] border-[#F0C4B6]',
}

export default function Pill({ tono = 'neutro', icono: Icono, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${TONOS[tono]} ${className}`}
    >
      {Icono && <Icono size={16} aria-hidden="true" />}
      {children}
    </span>
  )
}
