import { Building2, Coins, UserRoundCheck } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

const PUNTOS = [
  { icono: Building2, titulo: 'Una plaza, una operación', texto: 'Cada plaza de mercado funciona sola: sus propios puestos, sus compradores y su propio mapa.' },
  { icono: UserRoundCheck, titulo: 'Coordinador de la zona', texto: 'Una persona local atiende soporte y revisa denuncias, en su horario. No hace falta depender de nadie de afuera.' },
  { icono: Coins, titulo: 'Plata de la región', texto: 'Cada plaza usa su moneda y sus cuotas, y se paga con lo que cobran los mismos puestos. Sin donaciones ni subsidios.' },
]

export default function LlevarCiudadModal({ onCerrar }) {
  return (
    <Modal titulo="Llevar A la Olla a tu ciudad" cerrable onCerrar={onCerrar} pie={<Button className="w-full" onClick={onCerrar}>Entendido</Button>}>
      <p className="mb-4 text-base text-piedra">
        A la Olla nació en la Ciudadela 20 de Julio, en Barranquilla. El modelo se puede repetir en otra plaza de mercado sin cambiar nada de fondo.
      </p>
      <ul className="space-y-4">
        {PUNTOS.map(({ icono: Icono, titulo, texto }) => (
          <li key={titulo} className="flex gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E7F1EA] text-olla"><Icono size={22} aria-hidden="true" /></span>
            <span>
              <b className="block text-base">{titulo}</b>
              <span className="text-base text-piedra">{texto}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-base">
        ¿Tienes una plaza en mente? Cuéntanos desde el botón de ayuda ("Crear ticket de soporte") y la coordinación te escribe.
      </p>
    </Modal>
  )
}
