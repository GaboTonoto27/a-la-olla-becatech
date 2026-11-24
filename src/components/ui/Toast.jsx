import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const ESTILOS = {
  exito: { caja: 'border-olla-oscuro bg-olla text-white', icono: CheckCircle2 },
  info: { caja: 'border-carbon bg-carbon text-white', icono: Info },
  error: { caja: 'border-[#7F2A14] bg-[#A8391B] text-white', icono: AlertCircle },
}

// Aviso flotante (arriba en celular, abajo al centro en escritorio): confirma una acción, se va solo a los 3 segundos y se puede cerrar. No tapa la barra de abajo ni el botón de ayuda.
export default function Toast() {
  const { toast, cerrarToast } = useApp()
  if (!toast) return null
  const { caja, icono: Icono } = ESTILOS[toast.tipo] ?? ESTILOS.exito
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-[70] md:bottom-6 md:top-auto flex justify-center px-3" aria-live="polite">
      <div
        key={toast.id}
        role={toast.tipo === 'error' ? 'alert' : 'status'}
        className={`pointer-events-auto flex min-h-[48px] w-full max-w-md items-center gap-2 rounded-2xl border py-1 pl-4 pr-1 shadow-[0_1px_3px_rgba(28,31,29,0.25)] ${caja}`}
        data-toast={toast.tipo}
      >
        <Icono size={22} className="shrink-0" aria-hidden="true" />
        <p className="min-w-0 flex-1 break-words text-base font-semibold leading-snug">{toast.mensaje}</p>
        <button
          type="button"
          onClick={cerrarToast}
          aria-label="Cerrar aviso"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl hover:bg-white/15"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
