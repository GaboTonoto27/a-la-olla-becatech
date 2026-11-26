import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

// Botón discreto: borra lo guardado en este navegador y vuelve al estado de fábrica. Pide confirmación pa' evitar clics sin querer.
export default function RestaurarDemo({ className = '' }) {
  const { restaurarDemo } = useApp()
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold text-piedra underline ${className}`}
      >
        <RotateCcw size={16} aria-hidden="true" /> Restaurar datos demo
      </button>
      {abierto && (
        <Modal
          titulo="¿Restaurar datos demo?"
          cerrable
          onCerrar={() => setAbierto(false)}
          pie={
            <div className="grid grid-cols-2 gap-2">
              <Button variante="suave" onClick={() => setAbierto(false)}>Cancelar</Button>
              <Button
                onClick={() => {
                  setAbierto(false)
                  restaurarDemo()
                }}
              >
                Sí, restaurar
              </Button>
            </div>
          }
        >
          <p className="text-base">Se borra todo lo que creaste en este navegador (cuentas, puestos, fotos, chats y pedidos de prueba) y vuelven los datos de fábrica. No se puede deshacer.</p>
        </Modal>
      )}
    </>
  )
}
