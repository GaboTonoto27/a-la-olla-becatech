import { Home } from 'lucide-react'

// Aviso al comprador: este puesto contesta desde la casa.
export default function SinCelularAviso({ className = '' }) {
  return (
    <p className={`flex items-start gap-2 rounded-xl border border-[#EBCFA6] bg-[#FBEFDD] px-3 py-2 text-sm font-semibold text-ambar ${className}`}>
      <Home size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      Este puesto contesta desde la casa, no en el puesto.
    </p>
  )
}
