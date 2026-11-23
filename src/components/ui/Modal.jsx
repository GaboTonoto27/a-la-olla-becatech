import { useEffect } from 'react'

// Modal accesible. Si `cerrable` es false, no se puede cerrar sin responder (ej. el Pacto).
export default function Modal({ titulo, cerrable = false, onCerrar, children, pie }) {
  useEffect(() => {
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [])

  useEffect(() => {
    if (!cerrable) return
    const alTeclear = (e) => e.key === 'Escape' && onCerrar?.()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [cerrable, onCerrar])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-carbon/60 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-borde bg-marfil sm:rounded-3xl"
      >
        <div className="overflow-y-auto px-5 pb-2 pt-6">
          <h2 className="mb-4 text-2xl text-olla">{titulo}</h2>
          {children}
        </div>
        {pie && <div className="border-t border-borde bg-white px-5 py-4 sm:rounded-b-3xl">{pie}</div>}
      </div>
    </div>
  )
}
