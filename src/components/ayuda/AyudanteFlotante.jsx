import { lazy, Suspense, useState } from 'react'
import { MessageCircleQuestion } from 'lucide-react'

const AyudantePanel = lazy(() => import('./AyudantePanel.jsx'))

// Botón flotante discreto: queda arriba de la barra inferior del celular y no tapa botones principales.
export default function AyudanteFlotante() {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir el asistente de ayuda"
        className="fixed right-3 bottom-[calc(72px+env(safe-area-inset-bottom))] z-40 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-olla text-white shadow-[0_1px_3px_rgba(28,31,29,0.25)] hover:bg-olla-oscuro md:bottom-6 md:right-6 md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3"
      >
        <MessageCircleQuestion size={24} aria-hidden="true" />
        <span className="hidden text-base font-bold md:inline">¿Ayuda?</span>
      </button>
      {abierto && (
        <Suspense fallback={null}>
          <AyudantePanel onCerrar={() => setAbierto(false)} />
        </Suspense>
      )}
    </>
  )
}
