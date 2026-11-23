import { lazy, Suspense, useState } from 'react'
import { MessageCircleQuestion } from 'lucide-react'

const AyudantePanel = lazy(() => import('./AyudantePanel.jsx'))

// Botón flotante: en celular vive dentro de la barra inferior (así nunca tapa contenido); en escritorio flota abajo a la derecha.
export default function AyudanteFlotante() {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir el asistente de ayuda"
        className="fixed right-1 bottom-[calc(6px+env(safe-area-inset-bottom))] z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-olla text-white shadow-[0_1px_3px_rgba(28,31,29,0.25)] hover:bg-olla-oscuro md:bottom-6 md:right-6 2xl:w-auto 2xl:gap-2 2xl:px-5"
      >
        <MessageCircleQuestion size={24} aria-hidden="true" />
        <span className="hidden text-base font-bold 2xl:inline">¿Ayuda?</span>
      </button>
      {abierto && (
        <Suspense fallback={null}>
          <AyudantePanel onCerrar={() => setAbierto(false)} />
        </Suspense>
      )}
    </>
  )
}
