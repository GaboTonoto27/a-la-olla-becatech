import { useState } from 'react'
import { ChefHat, HelpCircle, Snowflake, Sprout, Banknote, Thermometer } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

function Fila({ icono: Icono, titulo, children, color = 'text-olla' }) {
  return (
    <li className="flex gap-3">
      <Icono size={24} className={`mt-0.5 shrink-0 ${color}`} aria-hidden="true" />
      <div>
        <p className="text-lg font-bold">{titulo}</p>
        <p className="text-base text-piedra">{children}</p>
      </div>
    </li>
  )
}

// Botón + ventana sencilla: Formal vs Informal, Cocina vs Cría y cómo se paga.
export default function ComoFuncionanEstandares({ className = '' }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <Button variante="suave" icono={HelpCircle} className={className} onClick={() => setAbierto(true)}>
        ¿Cómo funcionan los estándares?
      </Button>
      {abierto && (
        <Modal
          titulo="¿Cómo funcionan los estándares?"
          cerrable
          onCerrar={() => setAbierto(false)}
          pie={<Button className="w-full" onClick={() => setAbierto(false)}>Entendido</Button>}
        >
          <ul className="space-y-4 pb-3">
            <Fila icono={Snowflake} titulo="Puesto formal: con nevera" color="text-frio">
              Tiene nevera o cuarto frío y el vendedor lo marca en su perfil. Si se le daña, lo apaga en 1 toque.
            </Fila>
            <Fila icono={Thermometer} titulo="Puesto informal: al ambiente" color="text-piedra">
              No tiene nevera y lo dice sin pena. Su comida es pa' consumir hoy mismo, el mismo día.
            </Fila>
            <Fila icono={ChefHat} titulo="Pa' Cocina / Pulpa (100% sano)">
              Maduro, golpeado o torcido, pero sano pa' comer. Va pa' guiso, jugo o sopa.
            </Fila>
            <Fila icono={Sprout} titulo="Pa' Cría / Abono" color="text-ambar">
              Ya no es pa' la mesa: sirve pa' cerdos, gallinas o abono. Siempre dice claro que no es pa' comer.
            </Fila>
            <Fila icono={Banknote} titulo="Revisas primero, pagas después">
              Apartas sin pago adelantado, llegas, miras la comida y solo si te gusta pagas (efectivo o transferencia, según el local). Si no, la rechazas sin costo.
            </Fila>
          </ul>
        </Modal>
      )}
    </>
  )
}
