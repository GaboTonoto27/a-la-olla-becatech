import { useState } from 'react'
import { BellRing, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Button from '../ui/Button.jsx'

// Aviso tipo notificación push (simulada) arriba de la pantalla: verificación, ajuste o respuesta a un ticket.
export default function AvisosCuenta() {
  const { avisosCuenta, marcarAvisoVisto } = useApp()
  const [ocultos, setOcultos] = useState([])
  const lista = avisosCuenta.filter((a) => !ocultos.includes(a.id))
  if (lista.length === 0) return null
  return (
    <ul className="mb-5 space-y-3" aria-label="Avisos del equipo">
      {lista.map((a) => (
        <li key={a.id} role="status" data-testid="aviso-cuenta" className="flex items-start gap-3 rounded-2xl border-2 border-olla bg-[#E7F1EA] p-4">
          <BellRing size={24} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="break-words text-lg font-bold">{a.titulo}</p>
            {a.nota && <p className="break-words text-base"><b>Nota del equipo:</b> {a.nota}</p>}
            <Button variante="contorno" className="!min-h-[44px]" onClick={() => marcarAvisoVisto(a.id)}>Marcar como visto</Button>
          </div>
          <button type="button" onClick={() => setOcultos((o) => [...o, a.id])} aria-label="Cerrar aviso" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-carbon hover:bg-white">
            <X size={22} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  )
}
