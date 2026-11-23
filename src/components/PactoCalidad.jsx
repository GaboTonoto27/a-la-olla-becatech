import { useState } from 'react'
import { Check, X, Sprout, Banknote } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

const SI = ['Maduro', 'Golpeado', 'Torcido', 'Con la hoja maltratada']
const NO = ['Podrido', 'Vencido', 'Con moho o mal olor']

export default function PactoCalidad() {
  const { aceptarPacto, salir } = useApp()
  const [acepto, setAcepto] = useState(false)

  return (
    <Modal
      titulo="Pacto de Alimentos Aptos"
      pie={
        <div className="space-y-3">
          <label className="flex min-h-[48px] cursor-pointer items-start gap-3 text-base font-semibold">
            <input
              type="checkbox"
              checked={acepto}
              onChange={(e) => setAcepto(e.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-[#1B5E3A]"
            />
            Leí el pacto y me comprometo a cumplirlo.
          </label>
          <Button className="w-full" disabled={!acepto} onClick={aceptarPacto}>
            Acepto el Pacto
          </Button>
          <button
            type="button"
            onClick={salir}
            className="min-h-[48px] w-full text-base font-semibold text-piedra underline"
          >
            No acepto, salir
          </button>
        </div>
      }
    >
      <p className="mb-4 text-base text-piedra">
        En A la Olla solo se compra y se vende comida buena para comer. Así cuidamos a todos y
        mantenemos contento al inspector.
      </p>

      <div className="mb-3 rounded-2xl border border-[#BCD8C5] bg-[#E7F1EA] p-4">
        <p className="mb-2 flex items-center gap-2 font-bold text-olla">
          <Check size={20} aria-hidden="true" /> Sí se puede
        </p>
        <p className="text-base">{SI.join(' · ')}</p>
      </div>

      <div className="mb-3 rounded-2xl border border-[#F0C4B6] bg-[#FBE9E3] p-4">
        <p className="mb-2 flex items-center gap-2 font-bold text-[#A8391B]">
          <X size={20} aria-hidden="true" /> Jamás
        </p>
        <p className="text-base">{NO.join(' · ')}</p>
      </div>

      <ul className="mb-2 space-y-3 text-base">
        <li className="flex gap-3">
          <Sprout size={22} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <span>Lo guardo limpio y tapado, fuera de la vitrina.</span>
        </li>
        <li className="flex gap-3">
          <Banknote size={22} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <span>Se paga en efectivo, después de revisar la comida con tus propios ojos.</span>
        </li>
      </ul>
    </Modal>
  )
}
