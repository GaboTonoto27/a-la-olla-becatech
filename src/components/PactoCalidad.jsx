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
        <div className="space-y-1">
          <label className="flex min-h-[48px] cursor-pointer items-center gap-3 text-base font-semibold">
            <input
              type="checkbox"
              checked={acepto}
              onChange={(e) => setAcepto(e.target.checked)}
              className="h-6 w-6 shrink-0 accent-[#1B5E3A]"
            />
            Leí el pacto y lo cumplo.
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
      <p className="mb-3 text-base text-piedra">
        Solo se compra y se vende comida buena pa' comer. Así cuidamos a todos y al inspector le va bien.
      </p>

      <div className="mb-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] px-3 py-2">
        <p className="flex items-center gap-2 font-bold text-olla">
          <Check size={20} aria-hidden="true" /> Sí se puede
        </p>
        <p className="text-base leading-snug">{SI.join(' · ')}</p>
      </div>

      <div className="mb-3 rounded-xl border border-[#F0C4B6] bg-[#FBE9E3] px-3 py-2">
        <p className="flex items-center gap-2 font-bold text-[#A8391B]">
          <X size={20} aria-hidden="true" /> Jamás
        </p>
        <p className="text-base leading-snug">{NO.join(' · ')}</p>
      </div>

      <ul className="space-y-2 pb-1 text-base leading-snug">
        <li className="flex gap-2">
          <Sprout size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <span>Limpio y tapado, fuera de la vitrina. Lo pasado va aparte con etiqueta <b>Cría / Abono</b>.</span>
        </li>
        <li className="flex gap-2">
          <Banknote size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <span>Pago en efectivo, después de revisar con tus ojos.</span>
        </li>
      </ul>
    </Modal>
  )
}
